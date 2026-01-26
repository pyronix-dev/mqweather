// Developed by Omar Rafik (OMX) - omx001@proton.me
import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
    try {
        const { phone, code } = await request.json()

        if (!phone || !code) {
            return NextResponse.json({ error: 'Phone and code required' }, { status: 400 })
        }

        const trimmedCode = code.toString().trim()

        const supabase = createSupabaseAdmin()



        const { data: record, error } = await supabase
            .from('verification_codes')
            .select('*')
            .eq('phone', phone)
            .eq('verified', false)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (error || !record) {
            console.log("No OTP record found for:", phone)
            return NextResponse.json({ error: 'Code introuvable' }, { status: 400 })
        }

        // JS Expiration Check
        if (new Date() > new Date(record.expires_at)) {
            return NextResponse.json({ error: 'Code expiré' }, { status: 400 })
        }


        const attempts = record.attempts || 0
        const lastAttempt = new Date(record.last_attempt_at || record.created_at).getTime()
        const now = Date.now()
        const minutesSinceLastAttempt = (now - lastAttempt) / 1000 / 60


        if (attempts >= 15) {

            return NextResponse.json({ error: 'Trop de tentatives échouées. Ce code est expiré. Veuillez en générer un nouveau.' }, { status: 400 })
        }



        if (attempts > 0 && attempts % 3 === 0) {
            if (minutesSinceLastAttempt < 5) {
                const waitTime = Math.ceil(5 - minutesSinceLastAttempt)
                return NextResponse.json({ error: `Trop d'erreurs. Veuillez patienter ${waitTime} minute(s) avant de réessayer.` }, { status: 429 })
            }
        }


        if (record.code !== trimmedCode) {

            await supabase
                .from('verification_codes')
                .update({
                    attempts: attempts + 1,
                    last_attempt_at: new Date().toISOString()
                })
                .eq('id', record.id)


            const currentAttempts = attempts + 1
            const attemptsBeforeBlock = 3 - (currentAttempts % 3)

            if (currentAttempts % 3 === 0) {
                return NextResponse.json({ error: `Code incorrect. Trop d'erreurs. Veuillez patienter 5 minutes.` }, { status: 429 })
            }

            return NextResponse.json({ error: `Code incorrect.` }, { status: 400 })
        }


        // 3. Mark Code as Verified
        await supabase
            .from('verification_codes')
            .update({ verified: true })
            .eq('id', record.id)


        // 4. Create User (if not exists)
        let { data: user } = await supabase
            .from('users')
            .select('id, reference_code, full_name, role, phone')
            .eq('phone', phone)
            .single()

        if (!user) {
            // New User Creation from Metadata
            const metadata = record.metadata || {}
            const { generateReferenceCode } = await import('@/lib/supabase')
            const referenceCode = generateReferenceCode()

            const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert({
                    phone: phone,
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
            if (!user.is_verified) {
                await supabase.from('users').update({ is_verified: true }).eq('id', user.id)
            }
        }

        // 5. Log Login
        if (user) {
            const { logUserLogin } = await import('@/lib/login-logger')
            await logUserLogin(user.id, request)
        }

        const response = NextResponse.json({ success: true, redirect: '/dashboard' })

        response.cookies.set('auth_session', JSON.stringify({
            userId: user.id,
            referenceCode: user.reference_code,
            phone: user.phone,
            fullName: user.full_name,
            role: user.role
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7
        })

        return response

    } catch (error) {
        console.error('Verify OTP error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}