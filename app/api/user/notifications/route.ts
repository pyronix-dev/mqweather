// Developed by Omar Rafik (OMX) - omx001@proton.me
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function PATCH(request: Request) {
    try {
        const body = await request.json()

        const { sms, email, enabled } = body

        const cookieStore = await cookies()
        const authSession = cookieStore.get('auth_session')?.value

        if (!authSession) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const session = JSON.parse(authSession)
        const userId = session.userId

        if (!userId) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
        }

        const supabase = createSupabaseAdmin()

        // 1. Fetch current user state
        const { data: currentUser, error: fetchError } = await supabase
            .from('users')
            .select('notif_sms, notif_email')
            .eq('id', userId)
            .single()

        if (fetchError || !currentUser) {
            console.error('Fetch user for notification update error:', fetchError)
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // 2. Determine new values
        // If the body contains specific updates, use them, otherwise keep current
        let newSms = typeof sms === 'boolean' ? sms : currentUser.notif_sms
        let newEmail = typeof email === 'boolean' ? email : currentUser.notif_email
        let newEnabled = false

        // 3. Apply logic
        if (typeof enabled === 'boolean') {
            // CASE A: Master Toggle Used
            newEnabled = enabled
            // If Master is turned OFF, turn everything OFF
            if (!enabled) {
                newSms = false
                newEmail = false
            }
            // If Master is turned ON, turn everything ON (or restore previous? User said "turn them on" -> likely means Enable All)
            if (enabled) {
                newSms = true
                newEmail = true
            }
        } else {
            // CASE B: Sub-toggles Used (or mixed)
            // Re-calculate Master Switch based on the state of children
            // If ANY notification method is on, the master switch is ON
            if (newSms || newEmail) {
                newEnabled = true
            } else {
                newEnabled = false
            }
        }

        const updates = {
            notif_sms: newSms,
            notif_email: newEmail,
            notifications_enabled: newEnabled
        }

        const { error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)

        if (error) {
            console.error('Toggle notification error:', error)
            return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
        }

        return NextResponse.json({ success: true, ...updates })

    } catch (error) {
        console.error('Toggle notification error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}