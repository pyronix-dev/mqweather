// Developed by Omar Rafik (OMX) - omx001@proton.me
import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import { sendSMS } from '@/lib/brevo'

export async function POST(request: Request) {
    try {
        const { phone } = await request.json()

        if (!phone) {
            return NextResponse.json({ error: 'Numéro de téléphone requis' }, { status: 400 })
        }

        
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000) 

        console.log('------------------------------------------------')
        console.log(`📱 Generated OTP for ${phone}: ${code}`)
        console.log('------------------------------------------------')

        const supabase = createSupabaseAdmin()

        
        
        
        const { error: dbError } = await supabase
            .from('phone_verification_codes')
            .insert({
                phone,
                code,
                expires_at: expiresAt.toISOString(),
                verified: false
            })

        if (dbError) {
            console.error('DB Error:', dbError)
            return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 })
        }

        
        const { success, error: smsError } = await sendSMS(phone, `Votre code de vérification MQ Weather est: ${code}`)

        if (!success) {
            console.error('SMS Error:', smsError)
            return NextResponse.json({ error: `Erreur SMS: ${smsError}` }, { status: 500 })
        }

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Send OTP error:', error)
        return NextResponse.json({ error: 'Serveur error' }, { status: 500 })
    }
}