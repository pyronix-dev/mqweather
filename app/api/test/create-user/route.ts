import { NextResponse } from 'next/server'
import { createSupabaseAdmin, generateReferenceCode } from '@/lib/supabase'

// TEST ENDPOINT - Remove in production
// This simulates what happens when a Stripe payment completes

export async function POST() {
    try {
        const supabase = createSupabaseAdmin()
        const referenceCode = generateReferenceCode()

        // Create test user
        const { data: user, error: userError } = await supabase
            .from('users')
            .insert({
                reference_code: referenceCode,
                email: 'test@mqweather.fr',
                phone: '+33612345678'
            })
            .select('id')
            .single()

        if (userError) {
            console.error('User creation failed:', userError)
            return NextResponse.json({ error: userError.message }, { status: 500 })
        }

        // Create test subscription
        const { error: subError } = await supabase
            .from('subscriptions')
            .insert({
                user_id: user.id,
                plan: 'sms-annual',
                status: 'active',
                stripe_session_id: 'test_session_' + Date.now(),
                amount: 4990,
                expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            })

        if (subError) {
            console.error('Subscription creation failed:', subError)
            return NextResponse.json({ error: subError.message }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: 'Test user created!',
            referenceCode,
            email: 'test@mqweather.fr'
        })

    } catch (error) {
        console.error('Test endpoint error:', error)
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}
