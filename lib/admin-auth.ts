// Developed by Omar Rafik (OMX) - omx001@proton.me
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSupabaseAdmin } from '@/lib/supabase'

export interface AdminUser {
    id: string
    email: string
    full_name: string
    role: 'admin' | 'super_admin'
}


export async function requireAdmin(): Promise<AdminUser | NextResponse> {
    try {
        const cookieStore = await cookies()
        const authSession = cookieStore.get('auth_session')?.value

        if (!authSession) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        let session
        try {
            session = JSON.parse(authSession)
        } catch {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
        }

        const userId = session.userId
        if (!userId) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
        }

        const supabase = createSupabaseAdmin()

        const { data: user, error } = await supabase
            .from('users')
            .select('id, email, full_name, role')
            .eq('id', userId)
            .single()

        if (error || !user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        if (user.role !== 'admin' && user.role !== 'super_admin') {
            return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
        }

        return user as AdminUser
    } catch (e) {
        console.error('Admin auth error:', e)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


export async function logAdminAction(
    adminId: string,
    action: string,
    targetType?: string,
    targetId?: string,
    details?: Record<string, any>,
    ipAddress?: string
) {
    try {
        const supabase = createSupabaseAdmin()
        await supabase.from('admin_audit_log').insert({
            admin_id: adminId,
            action,
            target_type: targetType,
            target_id: targetId,
            details,
            ip_address: ipAddress
        })
    } catch (e) {
        console.error('Failed to log admin action:', e)
    }
}


export function getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for')
    if (forwarded) {
        return forwarded.split(',')[0].trim()
    }
    return request.headers.get('x-real-ip') || 'unknown'
}