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
    const offset = (page - 1) * limit

    const supabase = createSupabaseAdmin()

    const { data: observations, error, count } = await supabase
        .from('observations')
        .select('*, users(email, full_name)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

    if (error) {
        console.error('Error fetching observations:', error)
        return NextResponse.json({ error: 'Failed to fetch observations' }, { status: 500 })
    }

    return NextResponse.json({
        observations,
        pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit)
        }
    })
}


export async function DELETE(request: Request) {
    const admin = await requireAdmin()
    if (admin instanceof NextResponse) return admin

    const body = await request.json()
    const { id } = body

    if (!id) {
        return NextResponse.json({ error: 'Observation ID required' }, { status: 400 })
    }

    const supabase = createSupabaseAdmin()

    const { error } = await supabase
        .from('observations')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting observation:', error)
        return NextResponse.json({ error: 'Failed to delete observation' }, { status: 500 })
    }

    await logAdminAction(admin.id, 'delete_observation', 'observation', id, {}, getClientIP(request))

    return NextResponse.json({ success: true })
}