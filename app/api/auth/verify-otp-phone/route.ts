import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
    try {
        const { phone, code } = await request.json()

        if (!phone || !code) {
            return NextResponse.json({ error: 'Phone and code required' }, { status: 400 })
        }

        const supabase = createSupabaseAdmin()

        // Check for valid code
        const { data: record, error } = await supabase
            .from('phone_verification_codes')
            .select('*')
            .eq('phone', phone)
            .eq('code', code)
            .gt('expires_at', new Date().toISOString())
            .eq('verified', false) // Use a fresh code
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (error || !record) {
            return NextResponse.json({ error: 'Code invalide ou expiré' }, { status: 400 })
        }

        // Mark as verified
        await supabase
            .from('phone_verification_codes')
            .update({ verified: true })
            .eq('id', record.id)

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Verify OTP error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
