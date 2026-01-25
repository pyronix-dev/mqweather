// Developed by Omar Rafik (OMX) - omx001@proton.me
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { cookies } from 'next/headers'
import { sendSMS, sendEmail } from '@/lib/brevo'
import { createSupabaseAdmin } from '@/lib/supabase'
import { getOtpEmailHtml } from '@/lib/email-templates'
import bcrypt from 'bcrypt'
import crypto from 'crypto'


function hash(data: string) {
    return crypto.createHash('sha256').update(data).digest('hex')
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { action, identifier, code } = body

        const supabase = createSupabaseAdmin()




        if (action === 'send-code') {
            if (!identifier) {
                return NextResponse.json({ success: false, error: "Identifiant requis" }, { status: 400 })
            }


            const { data: user, error: userError } = await supabase
                .from('users')
                .select('id, email, phone, reference_code')
                .or(`email.ilike.${identifier},reference_code.ilike.${identifier}`)
                .single()


            if (!user || userError) {
                console.log(`❌ User not found: ${identifier}`)

                await new Promise(r => setTimeout(r, 1000))
                return NextResponse.json({ success: true, message: "Code envoyé" })
            }


            const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
            const magicToken = crypto.randomBytes(32).toString('hex')
            const magicTokenHash = hash(magicToken)
            console.log(`🔐 Generated OTP for ${identifier}: ${otpCode}`)


            const expiresAt = new Date(Date.now() + 10 * 60 * 1000)


            await supabase
                .from('otp_codes')
                .delete()
                .eq('user_id', user.id)
                .eq('used', false)


































            const magicLink = `${request.nextUrl.origin}/auth/verify?code=${otpCode}&uid=${user.id}`

            const { error: otpError } = await supabase
                .from('otp_codes')
                .insert({
                    user_id: user.id,
                    code: otpCode,
                    code_hash: hash(otpCode),
                    expires_at: expiresAt.toISOString(),
                    used: false
                })

            if (otpError) {
                console.error('Failed to save OTP:', otpError)
                return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 })
            }


            if (user.email) {
                console.log(`📧 Sending OTP & Magic Link to Email: ${user.email}`)
                const { getMagicLinkEmailHtml } = await import('@/lib/email-templates')
                const htmlContent = getMagicLinkEmailHtml(magicLink, otpCode)
                await sendEmail(user.email, "Votre connexion Météo Martinique", htmlContent)
            }

            else if (user.phone) {
                console.log(`📱 Sending OTP to Phone: ${user.phone}`)
                await sendSMS(user.phone, `Météo Martinique: Votre code est ${otpCode}. Lien: ${magicLink}`)
            }


            const response = NextResponse.json({ success: true, message: "Code envoyé" })
            response.cookies.set('otp_user_id', user.id, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 600
            })

            return response
        }




        if (action === 'verify-code') {
            if (!code) {
                return NextResponse.json({ success: false, error: "Code requis" }, { status: 400 })
            }

            const cookieStore = await cookies()
            const userId = cookieStore.get('otp_user_id')?.value

            if (!userId) {
                return NextResponse.json({ success: false, error: "Session expirée" }, { status: 401 })
            }


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
                console.log('❌ OTP Check: No valid record found or expired')
                return NextResponse.json({ success: false, error: "Code expiré ou invalide" }, { status: 400 })
            } else {

                const attempts = otpRecord.attempts || 0
                const maxAttempts = otpRecord.max_attempts || 3

                if (attempts >= maxAttempts) {
                    console.log(`❌ OTP Check: Rate limit exceeded (${attempts}/${maxAttempts})`)
                    return NextResponse.json({ success: false, error: "Trop de tentatives. Veuillez demander un nouveau code." }, { status: 429 })
                }



                const inputHash = hash(code)

                const isValid = inputHash === otpRecord.code_hash

                if (!isValid) {

                    console.log(`⚠️ OTP Check: Invalid code, incrementing attempts (${attempts + 1}/${maxAttempts})`)
                    await supabase
                        .from('otp_codes')
                        .update({ attempts: attempts + 1 })
                        .eq('id', otpRecord.id)

                    return NextResponse.json({ success: false, error: "Code invalide" }, { status: 400 })
                }


                try {
                    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'
                    const userAgent = request.headers.get('user-agent') || 'Unknown'
                    let location = { city: 'Inconnue', country: 'Inconnu', isp: 'Inconnu' }

                    if (ip && ip !== '127.0.0.1' && ip !== '::1') {
                        try {

                            const geoRes = await fetch(`http://ip-api.com/json/${ip}`, { signal: AbortSignal.timeout(3000) })
                            if (geoRes.ok) {
                                const geo = await geoRes.json()
                                if (geo.status === 'success') {
                                    location = {
                                        city: geo.city || 'Inconnue',
                                        country: geo.country || 'Inconnu',
                                        isp: geo.isp || 'Inconnu'
                                    }
                                }
                            }
                        } catch (e) {
                            console.log('Geo lookup failed (timeout or error):', e)
                        }
                    }

                    await supabase.from('login_history').insert({
                        user_id: userId,
                        ip_address: ip,
                        user_agent: userAgent,
                        location_city: location.city,
                        location_country: location.country,
                        isp: location.isp
                    })
                } catch (logError) {
                    console.error('Failed to log login history:', logError)

                }



                await supabase
                    .from('otp_codes')
                    .update({ used: true })
                    .eq('id', otpRecord.id)
            }


            const { data: user } = await supabase
                .from('users')
                .select('id, reference_code, email, full_name')
                .eq('id', userId)
                .single()


            const response = NextResponse.json({ success: true, redirect: '/dashboard' })


            response.cookies.delete('otp_user_id')


            response.cookies.set('auth_session', JSON.stringify({
                userId: user?.id,
                referenceCode: user?.reference_code,
                email: user?.email,
                fullName: user?.full_name
            }), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60
            })

            return response
        }

        return NextResponse.json({ success: false, error: "Action invalide" }, { status: 400 })

    } catch (error: any) {
        console.error("Login API Error:", error)

        return NextResponse.json({
            success: false,
            error: "Erreur serveur: " + (error.message || JSON.stringify(error))
        }, { status: 500 })
    }
}