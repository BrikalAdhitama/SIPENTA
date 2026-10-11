-- ============================================================================
-- SIPENTA — Trigger notifikasi in-app (NT-1..NT-3)
-- 0004_triggers_notif.sql
-- Setiap penerima dapat baris notification. Email (RESEND_API_KEY) di luar
-- skop MVP.
-- ponytail: tambah antrean email (kolom notification.sent_at + worker Edge
-- notify) saat prodi minta email aktif; in-app tetap sumber kebenaran.
-- ============================================================================

-- ── NT-1 + NT-2: approval insert (slot ditetapkan) / update ke tolak ─────────
create or replace function notifikasi_approval()
returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_user uuid;
  v_tgl date;
  v_jam time;
  v_mhs text;
begin
  if tg_op = 'INSERT' and new.status = 'menunggu' then
    select p.id into v_user from profiles p where p.dosen_id = new.dosen_id limit 1;
    if v_user is null then return new; end if;

    select sl.tanggal, sl.jam_mulai, m.nama into v_tgl, v_jam, v_mhs
    from schedule_slot sl
    join seminar s on s.id = sl.seminar_id
    join mahasiswa m on m.id = s.mahasiswa_id
    where sl.id = new.slot_id;

    insert into notification (user_id, judul, pesan, tipe, ref_run_id)
    values (
      v_user, 'Slot seminar menanti konfirmasi',
      coalesce('Seminar ' || v_mhs || ' pada ' || v_tgl || ' pukul ' || v_jam
        || ' menanti konfirmasi anda.', 'Ada slot baru menanti konfirmasi anda.'),
      'slot_ditetapkan', new.schedule_run_id
    );
    return new;
  end if;

  if tg_op = 'UPDATE'
    and new.status = 'tolak'
    and (old.status is distinct from new.status) then
    insert into notification (user_id, judul, pesan, tipe, ref_run_id)
    select p.id, 'Slot ditolak dosen',
      coalesce('Slot ' || new.slot_id || ' ditolak'
        || case when new.alasan is not null then ': ' || new.alasan else '.' end,
        'Ada slot yang ditolak dosen.'),
      'slot_ditolak', new.schedule_run_id
    from profiles p where p.role = 'admin';
    return new;
  end if;

  return new;
end $$;

drop trigger if exists trg_approval_notifikasi on approval;
create trigger trg_approval_notifikasi
after insert or update on approval
for each row execute function notifikasi_approval();

-- ── NT-3: run final / batal dari final → dosen + mhs terkait ─────────────────
create or replace function notifikasi_run()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'UPDATE'
    and new.status = 'final'
    and (old.status is distinct from new.status) then
    insert into notification (user_id, judul, pesan, tipe, ref_run_id)
    select distinct p.id, 'Jadwal final',
      'Jadwal seminar telah difinalisasi. Cek tanggal, jam, dan ruangan anda.',
      'jadwal_final', new.id
    from profiles p
    where p.dosen_id in (select a.dosen_id from approval a where a.schedule_run_id = new.id)
       or p.mahasiswa_id in (
            select s.mahasiswa_id from schedule_slot sl
            join seminar s on s.id = sl.seminar_id
            where sl.schedule_run_id = new.id
          );
    return new;
  end if;

  if tg_op = 'UPDATE'
    and new.status = 'dibatalkan'
    and old.status = 'final' then
    insert into notification (user_id, judul, pesan, tipe, ref_run_id)
    select distinct p.id, 'Jadwal dibatalkan',
      coalesce('Jadwal dibatalkan'
        || case when new.pembatalan_alasan is not null then ': ' || new.pembatalan_alasan else '.' end,
        'Jadwal dibatalkan.'),
      'jadwal_dibatalkan', new.id
    from profiles p
    where p.dosen_id in (select a.dosen_id from approval a where a.schedule_run_id = new.id)
       or p.mahasiswa_id in (
            select s.mahasiswa_id from schedule_slot sl
            join seminar s on s.id = sl.seminar_id
            where sl.schedule_run_id = new.id
          );
    return new;
  end if;

  return new;
end $$;

drop trigger if exists trg_run_notifikasi on schedule_run;
create trigger trg_run_notifikasi
after update on schedule_run
for each row execute function notifikasi_run();
