// Developed by Omar Rafik (OMX) - omx001@proton.me
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { cookies } from 'next/headers'
import { createSupabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-04-30.basil',
})

export async function GET() {
    try {
        const cookieStore = await cookies()
        const authSession = cookieStore.get('auth_session')?.value

        if (!authSession) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        let session
        try {
            session = JSON.parse(authSession)
        } catch (e) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
        }

        const userId = session.userId
        if (!userId) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
        }

        const supabase = createSupabaseAdmin()
        const { data: user } = await supabase
            .from('users')
            .select('stripe_customer_id')
            .eq('id', userId)
            .single()

        if (!user || !user.stripe_customer_id) {
            return NextResponse.json({ paymentMethods: [] })
        }

        const paymentMethods = await stripe.paymentMethods.list({
            customer: user.stripe_customer_id,
            type: 'card',
        })

        const formattedMethods = paymentMethods.data.map(pm => ({
            id: pm.id,
            brand: pm.card?.brand,
            last4: pm.card?.last4,
            exp_month: pm.card?.exp_month,
            exp_year: pm.card?.exp_year,
        }))

        return NextResponse.json({ paymentMethods: formattedMethods })

    } catch (error) {
        console.error('Error fetching payment methods:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
