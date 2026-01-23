
import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import { requireAdmin, logAdminAction, getClientIP } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/bulk-actions - Perform actions on multiple users
 * Body: { userIds: string[], action: 'ban' | 'unban' | 'delete' | 'email', reason?: string }
 */
export async function POST(request: Request) {
    const admin = await requireAdmin()
    if (admin instanceof NextResponse) return admin

    const body = await request.json()
    const { userIds, action, reason } = body
    const supabase = createSupabaseAdmin()
    const clientIP = getClientIP(request)

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0 || !action) {
        return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 })
    }

    // Protection: Validate no self-targeting
    if (userIds.includes(admin.id)) {
        return NextResponse.json({ error: 'You cannot perform bulk actions on yourself' }, { status: 403 })
    }

    const results = {
        success: 0,
        failed: 0,
        errors: [] as string[]
    }

    try {
        if (action === 'ban' || action === 'unban') {
            const isBanned = action === 'ban'
            const { error } = await supabase
                .from('users')
                .update({ is_banned: isBanned, banned_reason: isBanned ? reason : null })
                .in('id', userIds)

            if (error) throw error
            results.success = userIds.length

            // Log batch action
            await logAdminAction(admin.id, 'bulk_ban_update', 'users', 'batch', { count: userIds.length, action }, clientIP)

        } else if (action === 'delete') {
            // Only super admins can bulk delete
            if (admin.role !== 'super_admin') {
                return NextResponse.json({ error: 'Only super admins can bulk delete' }, { status: 403 })
            }

            // 1. Copy to deleted_users (This is harder in bulk with SQL, so we might iterate or use a stored procedure if available. 
            // For now, let's just do a direct loop significantly for safety, or just soft delete if we trust the loop)
            // But to be efficient, we can fetch all first.
            const { data: usersToDelete } = await supabase.from('users').select('*').in('id', userIds)

            if (usersToDelete) {
                const deletedUsersData = usersToDelete.map(u => ({
                    id: u.id,
                    reference_code: u.reference_code,
                    email: u.email,
                    phone: u.phone,
                    full_name: u.full_name,
                    original_created_at: u.created_at
                }))

                await supabase.from('deleted_users').insert(deletedUsersData)
            }

            const { error, count } = await supabase
                .from('users')
                .delete()
                .in('id', userIds)

            if (error) throw error
            results.success = count || 0
            await logAdminAction(admin.id, 'bulk_delete', 'users', 'batch', { count: results.success }, clientIP)

        } else if (action === 'email') {
            // Placeholder for email logic
            return NextResponse.json({ error: 'Email broadcast not implemented yet' }, { status: 501 })
        }

        return NextResponse.json({ success: true, results })

    } catch (error: any) {
        console.error('Bulk action error:', error)
        return NextResponse.json({ error: 'Failed to process bulk action' }, { status: 500 })
    }
}
