import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/logs - Get admin audit logs
 */
export async function GET(request: Request) {
    const admin = await requireAdmin()
    if (admin instanceof NextResponse) return admin

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    const supabase = createSupabaseAdmin()

    const { data: logs, error, count } = await supabase
        .from('admin_audit_log')
        .select('*, users!admin_audit_log_admin_id_fkey(email, full_name)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

    if (error) {
        console.error('Error fetching audit logs:', error)
        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
    }

    return NextResponse.json({
        logs,
        pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit)
        }
    })
}

/**
 * DELETE /api/admin/logs - Clear logs (Super Admin only)
 */
export async function DELETE() {
    const admin = await requireAdmin()
    if (admin instanceof NextResponse) return admin

    if (admin.role !== 'super_admin') {
        return NextResponse.json({ error: 'Seul le super administrateur peut supprimer les logs' }, { status: 403 })
    }

    const supabase = createSupabaseAdmin()

    // Delete logs older than 7 days? Or all? User said "delete logs". Let's delete ALL but keep recent maybe?
    // "also admin can delete logs" -> usually means clear history.
    // Let's implement full clear for now.

    const { error } = await supabase
        .from('admin_audit_log')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Efficient "delete all"

    if (error) {
        return NextResponse.json({ error: 'Failed to clear logs' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
