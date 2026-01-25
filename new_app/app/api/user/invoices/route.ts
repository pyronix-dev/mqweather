import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSupabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const cookieStore = await cookies()
        const authSession = cookieStore.get('auth_session')?.value
        if (!authSession) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const session = JSON.parse(authSession)
        const userId = session.userId

        const supabase = createSupabaseAdmin()

        const { data: invoices, error } = await supabase
            .from('invoices')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json(invoices)
    } catch (error) {
        console.error('Error fetching invoices:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
