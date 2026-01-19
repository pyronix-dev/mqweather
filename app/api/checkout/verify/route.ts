import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createSupabaseAdmin, generateReferenceCode } from '@/lib/supabase'
import { sendSMSConfirmation, sendEmailConfirmation } from '@/lib/brevo'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-04-30.basil',
})

// Price map in cents
const PLAN_PRICES: Record<string, number> = {
    'sms-monthly': 499,
    'sms-annual': 4990,
    'email-annual': 1000
}

export async function POST(request: NextRequest) {
    try {
        const { session_id } = await request.json()

        if (!session_id) {
            return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
        }

        // 1. Retrieve Stripe Session
        const session = await stripe.checkout.sessions.retrieve(session_id, {
            expand: ['line_items', 'customer_details'] // line_items might be useful, removing invalid payment_method_details expansion
        })

        if (!session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 })
        }

        if (session.payment_status !== 'paid') {
            return NextResponse.json({
                status: 'pending',
                message: 'Payment not successful yet'
            })
        }

        // Data extraction
        const plan = session.metadata?.plan || ''
        const phone = session.metadata?.phone || ''
        // Important: Checking customer_email first as it's more reliable for email plans, 
        // but for SMS plans, we might have passed email in metadata if not collected by Stripe as customer_email
        let email = session.customer_email || session.metadata?.email || ''

        console.log('Verification extracted data:', {
            sessionId: session.id,
            plan,
            phone,
            emailFromCustomer: session.customer_email,
            emailFromMeta: session.metadata?.email,
            finalEmail: email
        })

        const fullName = session.customer_details?.name || ''
        const country = session.customer_details?.address?.country || 'MQ'

        const paymentDetails = session.payment_method_details?.card
        const cardBrand = paymentDetails?.brand || ''
        const cardLast4 = paymentDetails?.last4 || ''

        const supabase = createSupabaseAdmin()

        // 2. Check/Create User
        let userId: string
        let referenceCode: string = ''

        const { data: existingUser } = await supabase
            .from('users')
            .select('id, reference_code')
            .or(`email.eq.${email},phone.eq.${phone}`)
            .single()

        if (existingUser) {
            userId = existingUser.id
            referenceCode = existingUser.reference_code

            // Update details
            await supabase.from('users').update({
                full_name: fullName,
                country: country
            }).eq('id', userId)

        } else {
            // Create New User
            referenceCode = generateReferenceCode(session.id)

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

            if (userError) throw userError
            userId = newUser.id
        }

        // 3. Check/Create Subscription
        const { data: existingSub } = await supabase
            .from('subscriptions')
            .select('id')
            .eq('stripe_session_id', session.id)
            .single()

        if (!existingSub) {
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

            if (subError) console.error('Sub creation error:', subError)
            else {
                // Send notifications (Critical for local dev/immediate feedback)
                console.log('📧 [Verify] Sending immediate notifications...')

                if (plan.includes('sms')) {
                    if (phone) {
                        await sendSMSConfirmation(phone, plan, referenceCode)
                    }
                    if (email) {
                        await sendEmailConfirmation(email, plan, referenceCode)
                    }
                } else if (plan.includes('email') && email) {
                    await sendEmailConfirmation(email, plan, referenceCode)
                }
            }
        }

        const response = NextResponse.json({
            success: true,
            user: {
                id: userId,
                reference_code: referenceCode,
                full_name: fullName || existingUser?.full_name
            }
        })

        // Auto-login: Set Auth Cookie with user data (valid for 7 days)
        response.cookies.set('auth_session', JSON.stringify({
            userId: userId,
            referenceCode: referenceCode,
            email: email || existingUser?.email
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60
        })

        return response

    } catch (error: any) {
        console.error('Verify checkout error:', error)
        // Ensure error is serializable and descriptive
        const errorMessage = error.message || 'Unknown error occurred'
        const errorStack = process.env.NODE_ENV === 'development' ? error.stack : undefined
        return NextResponse.json({
            success: false,
            error: errorMessage,
            details: error, // This might be empty if error is not enumerable
            stack: errorStack
        }, { status: 500 })
    }
}
