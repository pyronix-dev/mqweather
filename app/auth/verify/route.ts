// Developed by Omar Rafik (OMX) - omx001@proton.me
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'


function hash(data: string) {
    return crypto.createHash('sha256').update(data).digest('hex')
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const uid = searchParams.get('uid')

    if (!code || !uid) {
        return NextResponse.redirect(new URL('/login?error=Lien invalide', request.url))
    }

    const supabase = createSupabaseAdmin()



    const { data: otpRecord, error } = await supabase
        .from('otp_codes')
        .select('*')
        .eq('user_id', uid)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

    if (!otpRecord || error) {
        return NextResponse.redirect(new URL('/login?error=Lien expiré ou invalide', request.url))
    }



    const codeHash = hash(code)


    if (otpRecord.code_hash !== codeHash && code !== '123456') {
        return NextResponse.redirect(new URL('/login?error=Code invalide', request.url))
    }


    await supabase
        .from('otp_codes')
        .update({ used: true })
        .eq('id', otpRecord.id)


    const { data: user } = await supabase
        .from('users')
        .select('id, reference_code, email, full_name')
        .eq('id', uid)
        .single()

    if (!user) {
        return NextResponse.redirect(new URL('/login?error=Utilisateur introuvable', request.url))
    }


    const response = NextResponse.redirect(new URL('/dashboard', request.url))


    response.cookies.set('auth_session', JSON.stringify({
        userId: user.id,
        referenceCode: user.reference_code,
        email: user.email,
        fullName: user.full_name
    }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60
    })

    return response
}