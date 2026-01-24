// Developed by Omar Rafik (OMX) - omx001@proton.me
import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import { requireAdmin, logAdminAction, getClientIP } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'


export async function GET(request: Request) {
    const admin = await requireAdmin()
    if (admin instanceof NextResponse) return admin

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const offset = (page - 1) * limit

    const supabase = createSupabaseAdmin()

    let query = supabase
        .from('users')
        .select('id, reference_code, email, phone, full_name, created_at, role, is_banned, is_verified', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

    if (search) {
        query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%,phone.ilike.%${search}%,reference_code.ilike.%${search}%`)
    }

    const { data: users, error, count } = await query

    if (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    return NextResponse.json({
        users,
        pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit)
        }
    })
}