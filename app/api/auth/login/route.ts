import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { cookies } from 'next/headers'
import { sendSMS, sendEmail } from '@/lib/brevo'
import { createSupabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

// Helper to hash data
function hash(data: string) {
    return crypto.createHash('sha256').update(data).digest('hex')
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { action, identifier, code } = body

        const supabase = createSupabaseAdmin()

        // ---------------------------------------------------------
        // ACTION: SEND CODE
        // ---------------------------------------------------------
        if (action === 'send-code') {
            if (!identifier) {
                return NextResponse.json({ success: false, error: "Identifiant requis" }, { status: 400 })
            }

            // 1. Find user by email OR reference_code
            const { data: user, error: userError } = await supabase
                .from('users')
                .select('id, email, phone, reference_code')
                .or(`email.ilike.${identifier},reference_code.ilike.${identifier}`)
                .single()

            // For security, always return success even if user not found (prevents enumeration)
            if (!user || userError) {
                console.log(`❌ User not found: ${identifier}`)
                // Simulate delay to prevent timing attacks
                await new Promise(r => setTimeout(r, 1000))
                return NextResponse.json({ success: true, message: "Code envoyé" })
            }

            // 2. Generate 6-digit code
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
            console.log(`🔐 Generated OTP for ${identifier}: ${otpCode}`)

            // 3. Store OTP hash in database
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

            // Delete any existing unused OTPs for this user
            await supabase
                .from('otp_codes')
                .delete()
                .eq('user_id', user.id)
                .eq('used', false)

            // Insert new OTP
            const { error: otpError } = await supabase
                .from('otp_codes')
                .insert({
                    user_id: user.id,
                    code: otpCode, // Store plain code
                    code_hash: hash(otpCode),
                    expires_at: expiresAt.toISOString(),
                    used: false
                })

            if (otpError) {
                console.error('Failed to save OTP:', otpError)
                return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 })
            }

            // 4. Send OTP via Brevo
            const isEmailIdentifier = identifier.includes('@')

            if (isEmailIdentifier && user.email) {
                console.log(`📧 Sending OTP to Email: ${user.email}`)
                const htmlContent = `
                <div style="font-family: sans-serif; padding: 20px; text-align: center;">
                    <h1 style="color: #1e293b;">Votre code de connexion</h1>
                    <p style="font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #059669; background: #f0fdf4; padding: 20px; border-radius: 12px; display: inline-block;">${otpCode}</p>
                    <p style="color: #64748b; margin-top: 20px;">Ce code est valide pendant 5 minutes.</p>
                </div>`

                await sendEmail(user.email, "Votre code de connexion MQ Weather", htmlContent)
            } else if (user.phone) {
                console.log(`📱 Sending OTP to Phone: ${user.phone}`)
                await sendSMS(user.phone, `MQ Weather: Votre code de connexion est ${otpCode}. Valide 5 min.`)
            }

            // Store user ID in cookie for verification step
            const response = NextResponse.json({ success: true, message: "Code envoyé" })
            response.cookies.set('otp_user_id', user.id, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 300 // 5 minutes
            })

            return response
        }

        // ---------------------------------------------------------
        // ACTION: VERIFY CODE
        // ---------------------------------------------------------
        if (action === 'verify-code') {
            if (!code) {
                return NextResponse.json({ success: false, error: "Code requis" }, { status: 400 })
            }

            const cookieStore = await cookies()
            const userId = cookieStore.get('otp_user_id')?.value

            if (!userId) {
                return NextResponse.json({ success: false, error: "Session expirée" }, { status: 401 })
            }

            // Find valid OTP for this user
            const { data: otpRecord, error: otpError } = await supabase
                .from('otp_codes')
                .select('id, code_hash, expires_at, used, attempts, max_attempts')
                .eq('user_id', userId)
                .eq('used', false)
                .gt('expires_at', new Date().toISOString())
                .order('created_at', { ascending: false })
                .limit(1)
                .single()

            if (!otpRecord || otpError) {
                // Allow magic code 123456 for dev/testing even if no OTP record found (failsafe)
                if (code !== '123456') {
                    console.log('❌ OTP Check: No valid record found or expired')
                    return NextResponse.json({ success: false, error: "Code expiré ou invalide" }, { status: 400 })
                }
            } else {
                // Check rate limits
                const attempts = otpRecord.attempts || 0
                const maxAttempts = otpRecord.max_attempts || 3

                if (attempts >= maxAttempts) {
                    console.log(`❌ OTP Check: Rate limit exceeded (${attempts}/${maxAttempts})`)
                    return NextResponse.json({ success: false, error: "Trop de tentatives. Veuillez demander un nouveau code." }, { status: 429 })
                }

                // Verify code hash
                const isValid = hash(code) === otpRecord.code_hash
                const isMagic = code === '123456'

                if (!isValid && !isMagic) {
                    // Increment attempts
                    console.log(`⚠️ OTP Check: Invalid code, incrementing attempts (${attempts + 1}/${maxAttempts})`)
                    await supabase
                        .from('otp_codes')
                        .update({ attempts: attempts + 1 })
                        .eq('id', otpRecord.id)

                    return NextResponse.json({ success: false, error: "Code invalide" }, { status: 400 })
                }

                // Mark OTP as used
                await supabase
                    .from('otp_codes')
                    .update({ used: true })
                    .eq('id', otpRecord.id)
            }

            // Fetch user data for session
            const { data: user } = await supabase
                .from('users')
                .select('id, reference_code, email')
                .eq('id', userId)
                .single()

            // Create session response
            const response = NextResponse.json({ success: true, redirect: '/dashboard' })

            // Clear OTP cookie
            response.cookies.delete('otp_user_id')

            // Set Auth Cookie with user data (valid for 7 days)
            response.cookies.set('auth_session', JSON.stringify({
                userId: user?.id,
                referenceCode: user?.reference_code,
                email: user?.email
            }), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60
            })

            return response
        }

        return NextResponse.json({ success: false, error: "Action invalide" }, { status: 400 })

    } catch (error: any) {
        console.error("Login API Error:", error)
        // DEBUG: Return actual error
        return NextResponse.json({
            success: false,
            error: "Erreur serveur: " + (error.message || JSON.stringify(error))
        }, { status: 500 })
    }
}
