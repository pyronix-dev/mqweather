// Developed by Omar Rafik (OMX) - omx001@proton.me
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin, generateReferenceCode } from '@/lib/supabase'
import { sendEmail, sendSMS } from '@/lib/brevo'
import { getMagicLinkEmailHtml } from '@/lib/email-templates'
import bcrypt from 'bcrypt'
import { headers } from 'next/headers'
import { checkRateLimit } from '@/lib/rate-limit'


function getIp(request: NextRequest) {
    return request.ip || request.headers.get('x-forwarded-for') || '127.0.0.1'
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        let { email, phone, password, firstName, lastName } = body
        const supabase = createSupabaseAdmin()

        // Normalize inputs
        if (email) email = email.toLowerCase().trim()
        if (phone) phone = phone.replace(/\s/g, '')

        if (!email && !phone) {
            return NextResponse.json({ success: false, error: "Email ou téléphone requis" }, { status: 400 })
        }


        const ip = getIp(request)
        const rateLimit = await checkRateLimit(ip, 'register')

        if (rateLimit.blocked) {
            const minutes = Math.ceil((rateLimit.remainingTime || 0) / 60)
            return NextResponse.json({
                success: false,
                error: `Trop de tentatives. Veuillez réessayer dans ${minutes} minutes.`
            }, { status: 429 })
        }


        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .or(`email.eq.${email},phone.eq.${phone}`)
            .maybeSingle()

        if (existingUser) {
            return NextResponse.json({ success: false, error: "Un compte existe déjà avec cet email" }, { status: 409 })
        }


        const fullName = `${firstName} ${lastName}`.trim()

        // HASH PASSWORD
        const passwordHash = password ? await bcrypt.hash(password, 10) : null

        // GENERATE OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

        // STORE PENDING REGISTRATION IN VERIFICATION_CODES
        const { error: otpError } = await supabase.from('verification_codes').insert({
            email: email || null,
            phone: phone || null,
            code: otpCode,
            expires_at: expiresAt.toISOString(),
            verified: false,
            attempts: 0,
            metadata: {
                full_name: fullName,
                password_hash: passwordHash
            }
        })

        if (otpError) {
            console.error("Failed to save verification code:", otpError)
            return NextResponse.json({ success: false, error: "Erreur lors de la génération du code" }, { status: 500 })
        }

        // SEND CODE
        let magicLink = `${request.nextUrl.origin}/auth/verify?code=${otpCode}`
        if (email) magicLink += `&email=${encodeURIComponent(email)}`

        if (email) {
            console.log(`Sending new account OTP to ${email}`)
            const htmlContent = getMagicLinkEmailHtml(magicLink, otpCode)
            await sendEmail(email, "Confirmez votre inscription Météo Martinique", htmlContent)
        } else if (phone) {
            await sendSMS(phone, `Météo Martinique: Votre code de validation est ${otpCode}`)
        }


        const response = NextResponse.json({
            success: true,
            message: "Code envoyé"
        })

        // We cannot set a session cookie yet because the user doesn't exist.
        // OTP verification step will create the user and set the cookie.

        return response

    } catch (error) {
        console.error("Register API Error:", error)
        return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 })
    }
}