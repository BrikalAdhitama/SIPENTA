import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";

export async function requireRole(event: any, allowedRoles: ('admin' | 'dosen' | 'mahasiswa')[]) {
    const user = await serverSupabaseUser(event);
    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized: Silakan login terlebih dahulu'
        })
    }

    const client = await serverSupabaseClient(event)
    const {data: profile, error} = await client.from('profiles').select('role, dosen_id, mahasiswa_id').eq('id', user.id).single()
    if (error || !profile || !allowedRoles.includes(profile.role)) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden: Anda tidak memiliki akses ke endpoint ini'
        })
    }

    return { user, profile }
}