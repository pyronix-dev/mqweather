// Developed by Omar Rafik (OMX) - omx001@proton.me
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function PATCH(request: Request) {
    try {
        const cookieStore = await cookies()
        const authSession = cookieStore.get('auth_session')?.value

        if (!authSession) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        let userId
        try {
            userId = JSON.parse(authSession).userId
        } catch {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
        }

        const body = await request.json()
        const { full_name, email, phone } = body

        
        if (!email && !phone) {
            return NextResponse.json({ error: 'Email or Phone is required' }, { status: 400 })
        }

        const supabase = createSupabaseAdmin()

        const updateData: any = { full_name }
        if (email) updateData.email = email
        if (phone) updateData.phone = phone

        const { data, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', userId)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)

    } catch (error) {
        console.error('Update profile error:', error)
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }
}