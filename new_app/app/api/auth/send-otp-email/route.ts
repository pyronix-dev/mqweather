// Developed by Omar Rafik (OMX) - omx001@proton.me

import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { createSupabaseAdmin } from '@/lib/supabase'
import { sendEmail } from '@/lib/brevo'
import { getVerifyEmailHtml } from '@/lib/email-templates'

export async function POST(request: NextRequest) {
    console.log("🚀 [API] send-otp-email called")
    try {
        const body = await request.json()
        console.log("📦 [API] Request body:", body)
        const { email } = body

        if (!email) {
            console.error("❌ [API] Email missing")
            return NextResponse.json({ error: 'Email requis' }, { status: 400 })
        }

        
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000) 

        console.log("🔢 [API] Generated code for", email)

        const supabase = createSupabaseAdmin()

        
        const { error: dbError } = await supabase
            .from('verification_codes')
            .insert({
                email,
                code,
                expires_at: expiresAt.toISOString(),
                verified: false
            })

        if (dbError) {
            console.error('❌ [API] Database Error:', dbError)
            return NextResponse.json({ error: 'Erreur lors de la génération du code' }, { status: 500 })
        }

        
        console.log("📧 [API] Sending email via lib/brevo...")
        const htmlContent = getVerifyEmailHtml(code)
        const result = await sendEmail(email, "Vérification de votre email - Météo Martinique", htmlContent)

        console.log("📨 [API] Send result:", result)

        if (!result.success) {
            return NextResponse.json({ error: 'Echec de l\'envoi de l\'email: ' + result.error }, { status: 500 })
        }

        return NextResponse.json({ success: true, message: 'Code envoyé par email' })

    } catch (error: any) {
        console.error('❌ [API] Server Error:', error)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}