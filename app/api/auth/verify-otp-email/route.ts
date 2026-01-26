// Developed by Omar Rafik (OMX) - omx001@proton.me

import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
    try {
        let { email, code } = await request.json()

        if (!email || !code) {
            return NextResponse.json({ error: 'Email et code requis' }, { status: 400 })
        }

        if (email) email = email.toLowerCase().trim()

        const trimmedCode = code.toString().trim()

        const supabase = createSupabaseAdmin()


        const { data: record, error } = await supabase
            .from('verification_codes')
            .select('*')
            .eq('email', email)
            .eq('verified', false)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (error || !record) {
            console.log("No OTP record found for:", email)
            return NextResponse.json({ error: 'Aucun code trouvé' }, { status: 400 })
        }

        // JS Expiration Check (Safe against DB timezone mismatches)
        const now = new Date()
        const expires = new Date(record.expires_at)

        console.log(`Checking Expiration: Now=${now.toISOString()}, Expires=${expires.toISOString()}`)

        if (now > expires) {
            return NextResponse.json({ error: 'Code expiré' }, { status: 400 })
        }


        const attempts = record.attempts || 0
        if (attempts >= 5) {
            return NextResponse.json({ error: 'Trop de tentatives échouées. Veuillez demander un nouveau code.' }, { status: 400 })
        }


        if (record.code !== trimmedCode) {

            await supabase
                .from('verification_codes')
                .update({ attempts: attempts + 1 })
                .eq('id', record.id)

            return NextResponse.json({ error: 'Code incorrect' }, { status: 400 })
        }


        // 3. Mark Code as Verified
        await supabase
            .from('verification_codes')
            .update({ verified: true })
            .eq('id', record.id)


        // 4. Create User (if not exists)
        // Check if user already exists (maybe they verified before or concurrent request)
        let { data: user } = await supabase
            .from('users')
            .select('id, reference_code, full_name, email, role')
            .eq('email', email)
            .single()

        if (!user) {
            // New User Creation from Metadata
            const metadata = record.metadata || {}
            const { generateReferenceCode } = await import('@/lib/supabase')
            const referenceCode = generateReferenceCode()

            const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert({
                    email: email,
                    full_name: metadata.full_name || 'Utilisateur',
                    password_hash: metadata.password_hash || null,
                    reference_code: referenceCode,
                    is_verified: true,
                    created_at: new Date().toISOString()
                })
                .select()
                .single()

            if (createError) {
                console.error("Failed to create user after verification:", createError)
                return NextResponse.json({ error: "Erreur crétion compte" }, { status: 500 })
            }
            user = newUser
        } else {
            // If user exists but wasn't verified, update status
            if (!user.is_verified) {
                await supabase.from('users').update({ is_verified: true }).eq('id', user.id)
            }
        }

        // 5. Log Login
        if (user) {
            const { logUserLogin } = await import('@/lib/login-logger')
            await logUserLogin(user.id, request)
        }

        // 6. Set Session Cookie
        const response = NextResponse.json({ success: true, message: 'Email vérifié' })

        response.cookies.set('auth_session', JSON.stringify({
            userId: user.id,
            referenceCode: user.reference_code,
            email: user.email,
            fullName: user.full_name,
            role: user.role
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        })

        return response

    } catch (error: any) {
        console.error('Server Error:', error)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}