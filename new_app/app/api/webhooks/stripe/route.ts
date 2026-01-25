// Developed by Omar Rafik (OMX) - omx001@proton.me
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


const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET


const PLAN_PRICES: Record<string, number> = {
    'sms-monthly': 499,
    'sms-annual': 4990,
    'email-annual': 1000
}

export async function POST(request: NextRequest) {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')


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

        if (webhookSecret) {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
            console.log('✅ Signature verified')
        } else {

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


    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session
            console.log('✅ Payment successful!')
            console.log('Session ID:', session.id)
            console.log('Customer email:', session.customer_email)
            console.log('Metadata:', session.metadata)


            const plan = session.metadata?.plan || ''
            const phone = session.metadata?.phone || ''
            const email = session.customer_email || session.metadata?.email || ''


            const fullName = session.customer_details?.name || ''
            const country = session.customer_details?.address?.country || 'MQ'





            const paymentDetails = session.payment_method_details?.card
            const cardBrand = paymentDetails?.brand || ''
            const cardLast4 = paymentDetails?.last4 || ''


            let referenceCode = ''

            try {
                const supabase = createSupabaseAdmin()


                let userId: string


                const { data: existingUser } = await supabase
                    .from('users')
                    .select('id, reference_code')
                    .or(`email.eq.${email},phone.eq.${phone}`)
                    .single()

                if (existingUser) {
                    userId = existingUser.id
                    referenceCode = existingUser.reference_code
                    console.log('📦 Found existing user:', userId, 'Ref:', referenceCode)


                    await supabase.from('users').update({
                        full_name: fullName,
                        country: country,
                        stripe_customer_id: session.customer as string
                    }).eq('id', userId)

                } else {


                    referenceCode = generateReferenceCode(session.id)
                    console.log('Generating new reference:', referenceCode)

                    const { data: newUser, error: userError } = await supabase
                        .from('users')
                        .insert({
                            reference_code: referenceCode,
                            email: email || null,
                            phone: phone || null,
                            full_name: fullName,
                            country: country,
                            stripe_customer_id: session.customer as string
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

            }





            let invoicePdfUrl: string | undefined

            if (session.invoice) {
                try {
                    const invoiceId = typeof session.invoice === 'string' ? session.invoice : session.invoice.id
                    const invoice = await stripe.invoices.retrieve(invoiceId)
                    invoicePdfUrl = invoice.invoice_pdf || undefined
                } catch (err) {
                    console.error('Failed to retrieve invoice for session:', err)
                }
            }


            if (plan.includes('sms')) {

                if (phone) {
                    console.log(`📱 Sending SMS confirmation to ${phone}...`)
                    const smsResult = await sendSMSConfirmation(phone, plan, referenceCode)
                    if (smsResult.success) {
                        console.log('✅ SMS confirmation sent successfully')
                    } else {
                        console.error('❌ SMS confirmation failed:', smsResult.error)
                    }
                }


                if (email) {
                    console.log(`📧 Sending Email confirmation to ${email}...`)
                    const emailResult = await sendEmailConfirmation(email, plan, referenceCode, invoicePdfUrl)
                    if (emailResult.success) {
                        console.log('✅ Email confirmation sent successfully')
                    } else {
                        console.error('❌ Email confirmation failed:', emailResult.error)
                    }
                }
            }

            if (plan.includes('email') && email) {
                console.log(`📧 Sending Email confirmation to ${email}...`)
                const emailResult = await sendEmailConfirmation(email, plan, referenceCode, invoicePdfUrl)
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


            try {
                const supabase = createSupabaseAdmin()
                await supabase
                    .from('subscriptions')
                    .update({ status: subscription.status === 'active' ? 'active' : 'cancelled' })
                    .eq('stripe_subscription_id', subscription.id)




                const previousAttributes = event.data.previous_attributes
                const itemsChanged = previousAttributes && previousAttributes.items

                if (itemsChanged && subscription.status === 'active') {
                    console.log('🔄 Plan change detected')
                    const newPrice = subscription.items.data[0].price.unit_amount

                    if (newPrice) {

                        const getPlanFromAmount = (amount: number) => {
                            for (const [key, val] of Object.entries(PLAN_PRICES)) {
                                if (val === amount) return key
                            }
                            return null
                        }

                        const newPlan = getPlanFromAmount(newPrice)

                        if (newPlan) {

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

            break
        }

        case 'invoice.payment_succeeded': {
            const invoice = event.data.object as Stripe.Invoice
            console.log('💰 Invoice payment succeeded:', invoice.id)

            // Allow 0 amount invoices (e.g. trials or full discount)
            if (invoice.invoice_pdf && invoice.customer_email) {
                try {
                    const supabase = createSupabaseAdmin()

                    // Try to find user by stripe_customer_id or email
                    const { data: userData } = await supabase
                        .from('users')
                        .select('id')
                        .or(`stripe_customer_id.eq.${invoice.customer},email.eq.${invoice.customer_email}`)
                        .single()

                    if (userData) {
                        // Store invoice
                        await supabase.from('invoices').insert({
                            user_id: userData.id,
                            stripe_invoice_id: invoice.id,
                            amount: invoice.amount_paid,
                            status: 'paid',
                            invoice_pdf: invoice.invoice_pdf,
                            invoice_number: invoice.number,
                            created_at: new Date(invoice.created * 1000).toISOString()
                        })

                        // Only send separate invoice email if it's NOT the initial subscription creation (handled by checkout.session.completed)
                        if (invoice.billing_reason !== 'subscription_create') {
                            // Send email
                            const { sendInvoiceEmail } = await import('@/lib/brevo')
                            await sendInvoiceEmail(
                                invoice.customer_email,
                                `${(invoice.amount_paid / 100).toFixed(2)}€`,
                                invoice.invoice_pdf,
                                invoice.number || invoice.id
                            )
                            console.log('✅ Invoice email sent')
                        } else {
                            console.log('⏭️ Skipped invoice email (handled by checkout session)')
                        }
                    }
                } catch (error) {
                    console.error('Failed to process invoice:', error)
                }
            }
            break
        }

        case 'payment_method.attached': {
            const paymentMethod = event.data.object as Stripe.PaymentMethod
            console.log('💳 Payment method attached:', paymentMethod.id)
            break
        }

        case 'payment_method.detached': {
            const paymentMethod = event.data.object as Stripe.PaymentMethod
            console.log('🗑️ Payment method detached:', paymentMethod.id)
            break
        }

        default:
            console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
}