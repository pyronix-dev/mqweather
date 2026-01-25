// Developed by Omar Rafik (OMX) - omx001@proton.me

import { getUserFromSession, getUserSession } from '@/lib/auth-server'
import { redirect } from 'next/navigation'
import SettingsClient from '@/components/dashboard-settings-client'
import { createSupabaseAdmin } from '@/lib/supabase'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-04-30.basil',
})

async function getPaymentMethods(userId: string) {
    try {
        const supabase = createSupabaseAdmin()
        const { data: user } = await supabase
            .from('users')
            .select('stripe_customer_id')
            .eq('id', userId)
            .single()

        if (!user?.stripe_customer_id) return []

        const paymentMethods = await stripe.paymentMethods.list({
            customer: user.stripe_customer_id,
            type: 'card',
        })

        return paymentMethods.data.map(pm => ({
            id: pm.id,
            brand: pm.card?.brand,
            last4: pm.card?.last4,
            exp_month: pm.card?.exp_month,
            exp_year: pm.card?.exp_year,
        }))
    } catch (error) {
        console.error('Error fetching payment methods:', error)
        return []
    }
}

export default async function SettingsPage() {
    const user = await getUserFromSession()
    const session = await getUserSession()

    if (!user || !session?.userId) {
        redirect('/login')
    }

    const paymentMethods = await getPaymentMethods(session.userId)

    return <SettingsClient initialUser={user} initialPaymentMethods={paymentMethods} />
}