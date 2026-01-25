// Developed by Omar Rafik (OMX) - omx001@proton.me
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import { generateReferenceCode } from '@/lib/supabase'
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
        const { email, phone, password, firstName, lastName } = body
        const supabase = createSupabaseAdmin()

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
        const referenceCode = generateReferenceCode()

        
        const passwordHash = password ? await bcrypt.hash(password, 10) : null

        const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
                email: email || null,
                phone: phone || null,
                full_name: fullName,
                reference_code: referenceCode,
                password_hash: passwordHash,
                is_verified: false,
                created_at: new Date().toISOString()
            })
            .select()
            .single()

        if (createError || !newUser) {
            console.error("Create User Error:", createError)
            return NextResponse.json({ success: false, error: "Erreur lors de la création du compte" }, { status: 500 })
        }

        
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000) 

        
        await supabase.from('otp_codes').insert({
            user_id: newUser.id,
            code: otpCode,
            code: otpCode,
            code_hash: await bcrypt.hash(otpCode, 10), 
            expires_at: expiresAt.toISOString(),
            used: false
        })

        
        
        const magicLink = `${request.nextUrl.origin}/auth/verify?code=${otpCode}&uid=${newUser.id}`

        if (email) {
            console.log(`Sending new account OTP to ${email}`)
            const htmlContent = getMagicLinkEmailHtml(magicLink, otpCode)
            
            await sendEmail(email, "Confirmez votre inscription Météo Martinique", htmlContent)
        } else if (phone) {
            await sendSMS(phone, `Météo Martinique: Votre code de validation est ${otpCode}`)
        }

        
        const response = NextResponse.json({ success: true, message: "Compte créé, veuillez vérifier votre email" })

        
        
        response.cookies.set('otp_user_id', newUser.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 600 
        })

        return response

    } catch (error) {
        console.error("Register API Error:", error)
        return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 })
    }
}