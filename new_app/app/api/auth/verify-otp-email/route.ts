// Developed by Omar Rafik (OMX) - omx001@proton.me

import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
    try {
        const { email, code } = await request.json()

        if (!email || !code) {
            return NextResponse.json({ error: 'Email et code requis' }, { status: 400 })
        }

        const supabase = createSupabaseAdmin()

        
        const { data: record, error } = await supabase
            .from('verification_codes')
            .select('*')
            .eq('email', email)
            .eq('verified', false)
            .gt('expires_at', new Date().toISOString()) 
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (error || !record) {
            return NextResponse.json({ error: 'Code invalide ou expiré' }, { status: 400 })
        }

        
        const attempts = record.attempts || 0
        if (attempts >= 5) {
            return NextResponse.json({ error: 'Trop de tentatives échouées. Veuillez demander un nouveau code.' }, { status: 400 })
        }

        
        if (record.code !== code) {
            
            await supabase
                .from('verification_codes')
                .update({ attempts: attempts + 1 })
                .eq('id', record.id)

            return NextResponse.json({ error: 'Code incorrect' }, { status: 400 })
        }

        
        await supabase
            .from('verification_codes')
            .update({ verified: true })
            .eq('id', record.id)

        
        const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single()

        if (user) {
            const { logUserLogin } = await import('@/lib/login-logger')
            await logUserLogin(user.id, request)
        }

        return NextResponse.json({ success: true, message: 'Email vérifié' })

    } catch (error: any) {
        console.error('Server Error:', error)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}