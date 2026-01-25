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

        // Check for cooldown (1 minute)
        const ONE_MINUTE_AGO = new Date(Date.now() - 60 * 1000).toISOString()

        const { data: recentCode } = await supabase
            .from('verification_codes')
            .select('created_at')
            .eq('phone', phone)
            .gt('created_at', ONE_MINUTE_AGO)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (recentCode) {
            return NextResponse.json({
                error: 'Veuillez patienter 1 minute avant de demander un nouveau code.'
            }, { status: 429 })
        }




        const { error: dbError } = await supabase
            .from('verification_codes')
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