// Developed by Omar Rafik (OMX) - omx001@proton.me
import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import { requireAdmin, logAdminAction, getClientIP } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

interface RouteParams {
    params: Promise<{ id: string }>
}


export async function GET(request: Request, { params }: RouteParams) {
    const admin = await requireAdmin()
    if (admin instanceof NextResponse) return admin

    const { id } = await params
    const supabase = createSupabaseAdmin()

    
    const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

    if (userError || !user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    
    const { data: loginHistory } = await supabase
        .from('login_history')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false })
        .limit(20)

    
    const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false })

    
    delete user.password_hash

    return NextResponse.json({
        user,
        loginHistory: loginHistory || [],
        subscriptions: subscriptions || []
    })
}


export async function PATCH(request: Request, { params }: RouteParams) {
    const admin = await requireAdmin()
    if (admin instanceof NextResponse) return admin

    const { id } = await params
    const body = await request.json()
    const supabase = createSupabaseAdmin()

    
    const allowedFields = ['full_name', 'email', 'phone', 'notifications_enabled', 'notif_sms', 'notif_email', 'is_banned', 'banned_reason', 'role']
    const updates: Record<string, any> = {}

    for (const field of allowedFields) {
        if (body[field] !== undefined) {
            updates[field] = body[field]
        }
    }

    
    if (updates.role && admin.role !== 'super_admin') {
        return NextResponse.json({ error: 'Only super admins can change user roles' }, { status: 403 })
    }

    
    if (id === admin.id && (updates.is_banned || updates.role)) {
        return NextResponse.json({ error: 'You cannot ban yourself or change your own role' }, { status: 403 })
    }

    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating user:', error)
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }

    
    await logAdminAction(admin.id, 'update_user', 'user', id, updates, getClientIP(request))

    return NextResponse.json({ user: data })
}


export async function DELETE(request: Request, { params }: RouteParams) {
    const admin = await requireAdmin()
    if (admin instanceof NextResponse) return admin

    const { id } = await params
    const supabase = createSupabaseAdmin()

    
    const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

    if (fetchError || !user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    
    if ((user.role === 'admin' || user.role === 'super_admin') && admin.role !== 'super_admin') {
        return NextResponse.json({ error: 'Only super admins can delete admin accounts' }, { status: 403 })
    }

    
    if (id === admin.id) {
        return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 403 })
    }

    
    await supabase.from('deleted_users').insert({
        id: user.id,
        reference_code: user.reference_code,
        email: user.email,
        phone: user.phone,
        full_name: user.full_name,
        original_created_at: user.created_at
    })

    
    const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', id)

    if (deleteError) {
        console.error('Error deleting user:', deleteError)
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
    }

    
    await logAdminAction(admin.id, 'delete_user', 'user', id, { email: user.email }, getClientIP(request))

    return NextResponse.json({ success: true })
}