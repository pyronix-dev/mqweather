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

        const updates: any = {}
        if (typeof sms === 'boolean') updates.notif_sms = sms
        if (typeof email === 'boolean') updates.notif_email = email

        
        if (typeof enabled === 'boolean') {
            updates.notifications_enabled = enabled
            
            
            
            if (enabled === false && sms === undefined && email === undefined) {
                updates.notif_sms = false
                updates.notif_email = false
            }
            if (enabled === true && sms === undefined && email === undefined) {
                updates.notif_sms = true
                updates.notif_email = true
            }
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

// Developed by Omar Rafik (OMX) - omx001@proton.me