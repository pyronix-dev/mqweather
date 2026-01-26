// Developed by Omar Rafik (OMX) - omx001@proton.me
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const key = searchParams.get('key')

        const supabase = createSupabaseAdmin()

        // 1. Fetch Valid Secret from DB
        const { data: setting, error: settingError } = await supabase
            .from('system_settings')
            .select('value')
            .eq('key', 'admin_access_token')
            .single()

        if (settingError || !setting) {
            console.error('Persistent access: Secret not configured in DB')
            return NextResponse.json({ error: 'Configuration Error' }, { status: 500 })
        }

        const validKey = setting.value

        if (!key || !validKey || key !== validKey) {

            await new Promise(r => setTimeout(r, 2000))
            return NextResponse.json({ error: 'Access Denied' }, { status: 403 })
        }

        // 2. Find Super Admin User
        const { data: adminUser, error } = await supabase
            .from('users')
            .select('id, email, full_name, role, reference_code')
            .or('role.eq.super_admin,role.eq.admin')
            .order('role', { ascending: false }) // Prioritize super_admin
            .limit(1)
            .single()

        if (error || !adminUser) {
            return NextResponse.json({ error: 'No admin user found' }, { status: 404 })
        }

        // 3. Create Session
        const sessionPayload = {
            userId: adminUser.id,
            referenceCode: adminUser.reference_code,
            email: adminUser.email,
            fullName: adminUser.full_name,
            role: adminUser.role,
            isPersistent: true
        }

        // 4. Set Cookie & Redirect
        const response = NextResponse.redirect(new URL('/dashboard', request.url))

        response.cookies.set('auth_session', JSON.stringify(sessionPayload), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
        })

        return response

    } catch (error) {
        console.error('Persistent access error:', error)
        return NextResponse.json({ error: 'Server Error' }, { status: 500 })
    }
}
