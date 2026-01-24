// Developed by Omar Rafik (OMX) - omx001@proton.me
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-04-30.basil',
})


const PRICES = {
    'sms-monthly': {
        amount: 499, 
        name: 'SMS Standard - Mensuel',
        description: 'Alertes météo SMS - Abonnement mensuel',
        mode: 'subscription' as const,
        interval: 'month' as const,
    },
    'sms-annual': {
        amount: 4990, 
        name: 'SMS Standard - Annuel',
        description: 'Alertes météo SMS - Abonnement annuel (2 mois offerts)',
        mode: 'subscription' as const,
        interval: 'year' as const,
    },
    'email-annual': {
        amount: 1000, 
        name: 'Alertes Email - Annuel',
        description: 'Alertes météo Email - Abonnement annuel',
        mode: 'subscription' as const,
        interval: 'year' as const,
    },
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { plan, phone, email, profile } = body
        console.log('Checkout request body:', { plan, phone, email, profile })

        if (!plan || !PRICES[plan as keyof typeof PRICES]) {
            return NextResponse.json(
                { error: 'Plan invalide' },
                { status: 400 }
            )
        }

        const priceConfig = PRICES[plan as keyof typeof PRICES]
        const origin = request.headers.get('origin') || 'http://localhost:3000'

        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            ui_mode: 'embedded',
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: priceConfig.name,
                            description: priceConfig.description,
                        },
                        unit_amount: priceConfig.amount,
                        recurring: {
                            interval: priceConfig.interval,
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: priceConfig.mode,
            return_url: `${origin}/alertes/return?session_id={CHECKOUT_SESSION_ID}`,
            metadata: {
                plan,
                phone: phone || '',
                email: email || '',
                profile: profile || '',
            },
            customer_email: email || undefined,
        })

        return NextResponse.json({ clientSecret: session.client_secret })
    } catch (error) {
        console.error('Stripe checkout error:', error)
        return NextResponse.json(
            { error: 'Erreur lors de la création de la session de paiement' },
            { status: 500 }
        )
    }
}