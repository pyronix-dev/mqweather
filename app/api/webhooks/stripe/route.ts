import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import {
    sendSMSConfirmation,
    sendEmailConfirmation,
} from '@/lib/brevo'
import { createSupabaseAdmin, generateReferenceCode } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-04-30.basil',
})

// Webhook secret for verifying Stripe signatures
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

// Price map in cents
const PLAN_PRICES: Record<string, number> = {
    'sms-monthly': 499,
    'sms-annual': 4990,
    'email-annual': 1000
}

export async function POST(request: NextRequest) {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    // Debug logging
    console.log('📥 Received Stripe Webhook')

    if (!signature) {
        console.error('❌ Missing stripe-signature header')
        return NextResponse.json(
            { error: 'Missing stripe-signature header' },
            { status: 400 }
        )
    }

    let event: Stripe.Event

    try {
        // If webhook secret is configured, verify the signature
        if (webhookSecret) {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
            console.log('✅ Signature verified')
        } else {
            // For development without webhook secret, parse the event directly
            event = JSON.parse(body) as Stripe.Event
            console.warn('⚠️ Webhook signature verification skipped (no STRIPE_WEBHOOK_SECRET)')
        }
    } catch (err) {
        console.error('❌ Webhook signature verification failed:', err)
        console.log('Expected Secret:', webhookSecret ? `${webhookSecret.substring(0, 10)}...` : 'None')
        return NextResponse.json(
            { error: 'Webhook signature verification failed' },
            { status: 400 }
        )
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session
            console.log('✅ Payment successful!')
            console.log('Session ID:', session.id)
            console.log('Customer email:', session.customer_email)
            console.log('Metadata:', session.metadata)

            // Extract data from metadata and session
            const plan = session.metadata?.plan || ''
            const phone = session.metadata?.phone || ''
            const email = session.customer_email || session.metadata?.email || ''

            // New user details
            const fullName = session.customer_details?.name || ''
            const country = session.customer_details?.address?.country || 'MQ' // Default to Martinique if not found

            // Payment details (approximate if not expanded, but usually in session.payment_method_details if available)
            // Note: In some API versions or flows this might be nested differently or require expansion.
            // We'll try to get it if available on the session object (requires API 2022-11-15+)
            // For now, we'll extract what we can or leave null
            const paymentDetails = session.payment_method_details?.card
            const cardBrand = paymentDetails?.brand || ''
            const cardLast4 = paymentDetails?.last4 || ''

            // ===== SAVE TO SUPABASE =====
            let referenceCode = ''

            try {
                const supabase = createSupabaseAdmin()

                // 1. Create or find user
                let userId: string

                // Check if user exists by email or phone
                const { data: existingUser } = await supabase
                    .from('users')
                    .select('id, reference_code')
                    .or(`email.eq.${email},phone.eq.${phone}`)
                    .single()

                if (existingUser) {
                    userId = existingUser.id
                    referenceCode = existingUser.reference_code // Reuse existing reference
                    console.log('📦 Found existing user:', userId, 'Ref:', referenceCode)

                    // Update user details if they are missing or to keep fresh
                    await supabase.from('users').update({
                        full_name: fullName,
                        country: country
                    }).eq('id', userId)

                } else {
                    // Create new user with NEW reference
                    // Use session ID for deterministic code (matches Success Page)
                    referenceCode = generateReferenceCode(session.id)
                    console.log('Generating new reference:', referenceCode)

                    const { data: newUser, error: userError } = await supabase
                        .from('users')
                        .insert({
                            reference_code: referenceCode,
                            email: email || null,
                            phone: phone || null,
                            full_name: fullName,
                            country: country
                        })
                        .select('id')
                        .single()

                    if (userError) {
                        console.error('❌ Failed to create user:', userError)
                        throw userError
                    }

                    userId = newUser.id
                    console.log('👤 Created new user:', userId)
                }

                // 2. Create subscription
                const { error: subError } = await supabase
                    .from('subscriptions')
                    .insert({
                        user_id: userId,
                        plan: plan,
                        status: 'active',
                        stripe_session_id: session.id,
                        amount: PLAN_PRICES[plan] || 0,
                        card_brand: cardBrand,
                        card_last4: cardLast4,
                        expires_at: plan.includes('annual')
                            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
                            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                    })

                if (subError) {
                    console.error('❌ Failed to create subscription:', subError)
                } else {
                    console.log('✅ Subscription saved to database')
                }

            } catch (dbError) {
                console.error('❌ Database error:', dbError)
                // Continue with notifications even if DB fails
            }

            // ===== SEND NOTIFICATIONS =====
            // For SMS plans: always send SMS, also send email if provided
            // For Email plans: send email only

            if (plan.includes('sms')) {
                // Send SMS confirmation
                if (phone) {
                    console.log(`📱 Sending SMS confirmation to ${phone}...`)
                    const smsResult = await sendSMSConfirmation(phone, plan, referenceCode)
                    if (smsResult.success) {
                        console.log('✅ SMS confirmation sent successfully')
                    } else {
                        console.error('❌ SMS confirmation failed:', smsResult.error)
                    }
                }

                // Also send email confirmation if user provided email
                if (email) {
                    console.log(`📧 Sending Email confirmation to ${email}...`)
                    const emailResult = await sendEmailConfirmation(email, plan, referenceCode)
                    if (emailResult.success) {
                        console.log('✅ Email confirmation sent successfully')
                    } else {
                        console.error('❌ Email confirmation failed:', emailResult.error)
                    }
                }
            }

            if (plan.includes('email') && email) {
                console.log(`📧 Sending Email confirmation to ${email}...`)
                const emailResult = await sendEmailConfirmation(email, plan, referenceCode)
                if (emailResult.success) {
                    console.log('✅ Email confirmation sent successfully')
                } else {
                    console.error('❌ Email confirmation failed:', emailResult.error)
                }
            }

            break
        }

        case 'customer.subscription.updated': {
            const subscription = event.data.object as Stripe.Subscription
            console.log('📝 Subscription updated:', subscription.id)
            console.log('Status:', subscription.status)

            // Update subscription status in Supabase
            try {
                const supabase = createSupabaseAdmin()
                await supabase
                    .from('subscriptions')
                    .update({ status: subscription.status === 'active' ? 'active' : 'cancelled' })
                    .eq('stripe_subscription_id', subscription.id)

                // Detect Plan Change
                // Check if items changed in previous_attributes
                // @ts-ignore
                const previousAttributes = event.data.previous_attributes
                const itemsChanged = previousAttributes && previousAttributes.items

                if (itemsChanged && subscription.status === 'active') {
                    console.log('🔄 Plan change detected')
                    const newPrice = subscription.items.data[0].price.unit_amount

                    if (newPrice) {
                        // Helper to find plan key from price
                        const getPlanFromAmount = (amount: number) => {
                            for (const [key, val] of Object.entries(PLAN_PRICES)) {
                                if (val === amount) return key
                            }
                            return null
                        }

                        const newPlan = getPlanFromAmount(newPrice)

                        if (newPlan) {
                            // Fetch user email
                            const { data: subData } = await supabase
                                .from('subscriptions')
                                .select('user_id')
                                .eq('stripe_subscription_id', subscription.id)
                                .single()

                            if (subData?.user_id) {
                                const { data: userData } = await supabase
                                    .from('users')
                                    .select('email')
                                    .eq('id', subData.user_id)
                                    .single()

                                if (userData?.email) {
                                    console.log(`📧 Sending plan change email to ${userData.email}`)
                                    const { sendPlanChangeEmail } = await import('@/lib/brevo')
                                    await sendPlanChangeEmail(userData.email, newPlan)
                                }
                            }
                        }
                    }
                }

            } catch (error) {
                console.error('Failed to update subscription in DB:', error)
            }
            break
        }

        case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription
            console.log('❌ Subscription cancelled:', subscription.id)

            // Mark subscription as cancelled in Supabase
            try {
                const supabase = createSupabaseAdmin()
                await supabase
                    .from('subscriptions')
                    .update({ status: 'cancelled' })
                    .eq('stripe_subscription_id', subscription.id)
            } catch (error) {
                console.error('Failed to cancel subscription in DB:', error)
            }
            break
        }

        case 'invoice.payment_failed': {
            const invoice = event.data.object as Stripe.Invoice
            console.log('⚠️ Payment failed for invoice:', invoice.id)
            // TODO: Send payment failure notification via Brevo
            break
        }

        default:
            console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
}
