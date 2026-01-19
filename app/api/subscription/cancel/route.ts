import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSupabaseAdmin } from '@/lib/supabase'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-04-30.basil',
})

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies()
        const authSession = cookieStore.get('auth_session')?.value

        if (!authSession) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const session = JSON.parse(authSession)
        const userId = session.userId

        const supabase = createSupabaseAdmin()

        // 1. Get active subscription
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('id, stripe_subscription_id')
            .eq('user_id', userId)
            .eq('status', 'active')
            .single()

        if (!subscription) {
            return NextResponse.json({ error: 'Aucun abonnement actif trouvé.' }, { status: 404 })
        }

        // 2. Cancel in Stripe (if applicable)
        // Note: For one-time payments (like the annual plans manually handled or via Checkout), 
        // there might not be a 'stripe_subscription_id' if strictly one-off. 
        // But if it's a recurring subscription in Stripe, we should cancel it.
        // Based on previous code, we store 'stripe_session_id', but maybe not 'stripe_subscription_id' for one-offs.
        // However, if we move to recurring, we should handle it.
        // For now, we mainly update the local DB status to prevent access/alerts.

        // If we had a stripe_subscription_id, we would do:
        // if (subscription.stripe_subscription_id) {
        //     await stripe.subscriptions.cancel(subscription.stripe_subscription_id)
        // }

        // 3. Update Supabase
        const { error: updateError } = await supabase
            .from('subscriptions')
            .update({ status: 'cancelled' })
            .eq('id', subscription.id)

        if (updateError) throw updateError

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Cancel subscription error:', error)
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
    }
}
