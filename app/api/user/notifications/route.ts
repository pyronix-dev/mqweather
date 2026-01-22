import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function PATCH(request: Request) {
    try {
        const { enabled } = await request.json()

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

        const { error } = await supabase
            .from('users')
            .update({ notifications_enabled: enabled })
            .eq('id', userId)

        if (error) {
            console.error('Toggle notification error:', error)
            return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
        }

        return NextResponse.json({ success: true, enabled })

    } catch (error) {
        console.error('Toggle notification error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
