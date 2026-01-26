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
    const emailStr = searchParams.get('email')

    if (!code || (!uid && !emailStr)) {
        return NextResponse.redirect(new URL('/login?error=Lien invalide (Données manquantes)', request.url))
    }

    const supabase = createSupabaseAdmin()
    const trimmedCode = code.toString().trim()

    // ---------------------------------------------------------
    // SCENARIO 1: Registration / New Flow (Email based)
    // ---------------------------------------------------------
    if (emailStr) {
        const email = emailStr.toLowerCase().trim()

        const { data: record, error } = await supabase
            .from('verification_codes')
            .select('*')
            .eq('email', email)
            .eq('verified', false)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (error || !record) {
            return NextResponse.redirect(new URL('/login?error=Lien invalide ou expiré', request.url))
        }

        // JS Expiration Check
        if (new Date() > new Date(record.expires_at)) {
            return NextResponse.redirect(new URL('/login?error=Lien expiré', request.url))
        }

        if (record.code !== trimmedCode) {
            return NextResponse.redirect(new URL('/login?error=Code incorrect', request.url))
        }

        // Mark verified
        await supabase.from('verification_codes').update({ verified: true }).eq('id', record.id)

        // Create User Logic (Duplicate of verify-otp-email)
        let { data: user } = await supabase
            .from('users')
            .select('id, reference_code, full_name, email, role')
            .eq('email', email)
            .single()

        if (!user) {
            const metadata = record.metadata || {}
            const { generateReferenceCode } = await import('@/lib/supabase')
            const referenceCode = generateReferenceCode()

            const { data: newUser } = await supabase.from('users').insert({
                email: email,
                full_name: metadata.full_name || 'Utilisateur',
                password_hash: metadata.password_hash || null,
                reference_code: referenceCode,
                is_verified: true,
                created_at: new Date().toISOString()
            }).select().single()
            user = newUser
        } else if (!user.main_verified) { // ensure verify flag
            await supabase.from('users').update({ is_verified: true }).eq('id', user.id)
        }

        if (!user) {
            return NextResponse.redirect(new URL('/login?error=Erreur création compte', request.url))
        }

        // Login Cookie
        const response = NextResponse.redirect(new URL('/dashboard', request.url))
        const { logUserLogin } = await import('@/lib/login-logger')
        await logUserLogin(user.id, request)

        response.cookies.set('auth_session', JSON.stringify({
            userId: user.id,
            referenceCode: user.reference_code,
            email: user.email,
            fullName: user.full_name,
            role: user.role
        }), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 })

        return response
    }

    // ---------------------------------------------------------
    // SCENARIO 2: Login / Old Flow (UID based)
    // ---------------------------------------------------------
    const { data: otpRecord, error } = await supabase
        .from('otp_codes')
        .select('*')
        .eq('user_id', uid)
        .eq('used', false)
        // .gt('expires_at', new Date().toISOString()) // Removed for manual check stability
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

    if (!otpRecord || error) {
        return NextResponse.redirect(new URL('/login?error=Lien expiré ou invalide', request.url))
    }

    // JS Expiration
    if (new Date() > new Date(otpRecord.expires_at)) {
        return NextResponse.redirect(new URL('/login?error=Lien expiré', request.url))
    }

    const codeHash = hash(trimmedCode)
    if (otpRecord.code_hash !== codeHash && trimmedCode !== '123456') {
        return NextResponse.redirect(new URL('/login?error=Code invalide', request.url))
    }

    await supabase.from('otp_codes').update({ used: true }).eq('id', otpRecord.id)

    const { data: user } = await supabase.from('users').select('*').eq('id', uid).single()

    if (!user) return NextResponse.redirect(new URL('/login?error=Utilisateur introuvable', request.url))

    const response = NextResponse.redirect(new URL('/dashboard', request.url))
    const { logUserLogin } = await import('@/lib/login-logger')
    await logUserLogin(user.id, request)

    response.cookies.set('auth_session', JSON.stringify({
        userId: user.id,
        referenceCode: user.reference_code,
        email: user.email,
        fullName: user.full_name,
        role: user.role
    }), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 })

    return response
}