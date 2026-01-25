// Developed by Omar Rafik (OMX) - omx001@proton.me
import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
    try {
        const { phone, code } = await request.json()

        if (!phone || !code) {
            return NextResponse.json({ error: 'Phone and code required' }, { status: 400 })
        }

        const supabase = createSupabaseAdmin()



        const { data: record, error } = await supabase
            .from('verification_codes')
            .select('*')
            .eq('phone', phone)
            .eq('verified', false)
            .gt('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (error || !record) {
            return NextResponse.json({ error: 'Code expiré ou introuvable. Veuillez renvoyer un nouveau code.' }, { status: 400 })
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


        if (record.code !== code) {

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


        await supabase
            .from('verification_codes')
            .update({ verified: true })
            .eq('id', record.id)


        const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('phone', phone)
            .single()

        if (user) {
            const { logUserLogin } = await import('@/lib/login-logger')
            await logUserLogin(user.id, request)
        }

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Verify OTP error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}