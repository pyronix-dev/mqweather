// Developed by Omar Rafik (OMX) - omx001@proton.me
import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
    try {
        const { ref, id } = await request.json()

        if (!ref && !id) {
            return NextResponse.json({ error: 'Missing reference or ID' }, { status: 400 })
        }

        const supabase = createSupabaseAdmin()

        
        let query = supabase.from('users').select('id, email, phone').single()

        if (id) {
            query = supabase.from('users').select('id, email, phone').eq('id', id).single()
        } else if (ref) {
            query = supabase.from('users').select('id, email, phone').eq('reference_code', ref).single()
        }

        const { data: user, error: userError } = await query

        if (userError || !user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        
        const { error: subError } = await supabase
            .from('subscriptions')
            .update({ status: 'cancelled' })
            .eq('user_id', user.id)
            .eq('status', 'active')

        if (subError) {
            return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 })
        }

        
        await supabase
            .from('users')
            .update({ notifications_enabled: false })
            .eq('id', user.id)

        return NextResponse.json({ success: true, message: 'Unsubscribed successfully' })

    } catch (error) {
        console.error('Unsubscribe error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}