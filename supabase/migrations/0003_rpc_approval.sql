-- ============================================================================
-- SIPENTA — RPC approval & finalisasi (transaksional, SECURITY DEFINER)
-- 0003_rpc_approval.sql
-- Kontrak: docs/api-contract.md §C (AP-2..AP-4, AP-6, AP-7).
-- Nilai status ikut enum DB: menunggu | konfirmasi | tolak (0001).
-- Error dilempar sebagai 'KODE: pesan' (errcode P0001); client petakan
-- awalan KODE → error.code kontrak (UNAUTHENTICATED, FORBIDDEN, NOT_FOUND,
-- VALIDATION_FAILED, CONFLICT_STATE).
-- ============================================================================

-- ── AP-2/AP-3/AP-4 submit_approval ───────────────────────────────────────────
create or replace function submit_approval(p_approval_id bigint, p_decision text, p_reason text default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_role role_pengguna;
  v_my_dosen bigint;
  v_appr approval%rowtype;
  v_run_status status_run;
  v_n_konfirmasi int := 0;
  v_n_tolak int := 0;
  v_n_menunggu int := 0;
begin
  if v_uid is null then
    raise exception 'UNAUTHENTICATED: sesi tidak valid' using errcode = 'P0001';
  end if;

  select role, dosen_id into v_role, v_my_dosen from profiles where id = v_uid;
  if v_role is null then
    raise exception 'FORBIDDEN: profil tidak ditemukan' using errcode = 'P0001';
  end if;

  select * into v_appr from approval where id = p_approval_id;
  if not found then
    raise exception 'NOT_FOUND: approval % tidak ditemukan', p_approval_id using errcode = 'P0001';
  end if;

  if v_role <> 'dosen' or v_my_dosen is null or v_appr.dosen_id <> v_my_dosen then
    raise exception 'FORBIDDEN: bukan approval milik anda' using errcode = 'P0001';
  end if;

  if p_decision not in ('konfirmasi', 'tolak', 'menunggu') then
    raise exception 'VALIDATION_FAILED: p_decision harus konfirmasi|tolak|menunggu' using errcode = 'P0001';
  end if;

  if p_decision = 'tolak' and (p_reason is null or btrim(p_reason) = '') then
    raise exception 'VALIDATION_FAILED: p_reason wajib bila menolak' using errcode = 'P0001';
  end if;

  select status into v_run_status from schedule_run where id = v_appr.schedule_run_id;
  if v_run_status = 'final' then
    raise exception 'CONFLICT_STATE: run sudah final, approval dikunci' using errcode = 'P0001';
  end if;

  update approval
  set status = p_decision::status_approval,
      alasan = case when p_decision = 'tolak' then btrim(p_reason) else null end,
      updated_at = now()
  where id = p_approval_id;

  select
    count(*) filter (where status = 'konfirmasi'),
    count(*) filter (where status = 'tolak'),
    count(*) filter (where status = 'menunggu')
  into v_n_konfirmasi, v_n_tolak, v_n_menunggu
  from approval where slot_id = v_appr.slot_id;

  return jsonb_build_object(
    'approval_id', p_approval_id,
    'status', p_decision,
    'slot_id', v_appr.slot_id,
    'slot_progress', jsonb_build_object(
      'konfirmasi', v_n_konfirmasi, 'tolak', v_n_tolak, 'menunggu', v_n_menunggu
    )
  );
end $$;

revoke all on function submit_approval(bigint, text, text) from public;
grant execute on function submit_approval(bigint, text, text) to authenticated;

-- ── AP-6 finalisasi_jadwal (admin; gate: semua slot 4/4 konfirmasi) ──────────
create or replace function finalisasi_jadwal(p_run_id bigint)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_role role_pengguna;
  v_run schedule_run%rowtype;
  v_bad bigint[] := '{}';
  v_n_slot int := 0;
  v_n_acc int := 0;
begin
  if v_uid is null then
    raise exception 'UNAUTHENTICATED: sesi tidak valid' using errcode = 'P0001';
  end if;

  select role into v_role from profiles where id = v_uid;
  if v_role <> 'admin' then
    raise exception 'FORBIDDEN: hanya admin' using errcode = 'P0001';
  end if;

  select * into v_run from schedule_run where id = p_run_id;
  if not found then
    raise exception 'NOT_FOUND: run % tidak ditemukan', p_run_id using errcode = 'P0001';
  end if;

  if v_run.status <> 'tersimpan' then
    raise exception 'CONFLICT_STATE: run berstatus %, harus tersimpan dulu', v_run.status using errcode = 'P0001';
  end if;

  select coalesce(array_agg(s.id order by s.id), '{}') into v_bad
  from schedule_slot s
  where s.schedule_run_id = p_run_id
    and (select count(*) from approval a where a.slot_id = s.id and a.status = 'konfirmasi') < 4;

  if coalesce(array_length(v_bad, 1), 0) > 0 then
    raise exception 'CONFLICT_STATE: slot belum 4/4 ACC: %', v_bad using errcode = 'P0001';
  end if;

  update schedule_run
  set status = 'final', finalized_at = now(), finalized_by = v_uid
  where id = p_run_id;

  update schedule_run
  set status = 'dibatalkan',
      pembatalan_alasan = coalesce(pembatalan_alasan, 'digantikan run ' || p_run_id)
  where gelombang_id = v_run.gelombang_id
    and id <> p_run_id
    and status <> 'dibatalkan';

  select count(*) into v_n_slot from schedule_slot where schedule_run_id = p_run_id;
  select count(*) into v_n_acc from approval where schedule_run_id = p_run_id and status = 'konfirmasi';

  return jsonb_build_object(
    'run_id', p_run_id, 'status', 'final',
    'ringkasan', jsonb_build_object('slot', v_n_slot, 'konfirmasi', v_n_acc)
  );
end $$;

revoke all on function finalisasi_jadwal(bigint) from public;
grant execute on function finalisasi_jadwal(bigint) to authenticated;

-- ── AP-7 batalkan_jadwal (admin; p_alasan wajib) ─────────────────────────────
create or replace function batalkan_jadwal(p_run_id bigint, p_alasan text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_role role_pengguna;
  v_exists boolean := false;
begin
  if v_uid is null then
    raise exception 'UNAUTHENTICATED: sesi tidak valid' using errcode = 'P0001';
  end if;

  select role into v_role from profiles where id = v_uid;
  if v_role <> 'admin' then
    raise exception 'FORBIDDEN: hanya admin' using errcode = 'P0001';
  end if;

  if p_alasan is null or btrim(p_alasan) = '' then
    raise exception 'VALIDATION_FAILED: p_alasan wajib diisi' using errcode = 'P0001';
  end if;

  select true into v_exists from schedule_run where id = p_run_id;
  if not found then
    raise exception 'NOT_FOUND: run % tidak ditemukan', p_run_id using errcode = 'P0001';
  end if;

  update schedule_run
  set status = 'dibatalkan', pembatalan_alasan = btrim(p_alasan)
  where id = p_run_id;

  return jsonb_build_object('run_id', p_run_id, 'status', 'dibatalkan');
end $$;

revoke all on function batalkan_jadwal(bigint, text) from public;
grant execute on function batalkan_jadwal(bigint, text) to authenticated;
