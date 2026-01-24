// Developed by Omar Rafik (OMX) - omx001@proton.me
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createSupabaseAdmin, generateReferenceCode } from '@/lib/supabase'
import { sendSMSConfirmation, sendEmailConfirmation } from '@/lib/brevo'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-04-30.basil',
})


const PLAN_PRICES: Record<string, number> = {
    'sms-monthly': 499,
    'sms-annual': 4990,
    'email-annual': 1000
}


async function verifySession(sessionId: string) {
    if (!sessionId) {
        throw new Error('Session ID required')
    }

    
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items', 'customer_details']
    })

    if (!session) {
        throw new Error('Session not found')
    }

    if (session.status === 'open') {
        return { status: 'open' }
    }

    if (session.payment_status !== 'paid') {
        return { status: 'pending', message: 'Payment not successful yet' }
    }

    
    const plan = session.metadata?.plan || ''
    const phone = session.metadata?.phone || ''
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

        
        await supabase.from('users').update({
            full_name: fullName,
            country: country
        }).eq('id', userId)

    } else {
        
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

    
    return {
        success: true,
        status: 'complete',
        customer_email: email,
        user: {
            id: userId,
            reference_code: referenceCode,
            full_name: fullName || existingUser?.full_name,
            email: email || existingUser?.email 
        }
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const session_id = searchParams.get('session_id')

        if (!session_id) {
            return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
        }

        const result = await verifySession(session_id)

        if (result.status === 'open' || result.status === 'pending') {
            return NextResponse.json(result)
        }

        const response = NextResponse.json(result)

        
        if (result.success && result.user) {
            response.cookies.set('auth_session', JSON.stringify({
                userId: result.user.id,
                referenceCode: result.user.reference_code,
                email: result.user.email
            }), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60
            })
        }

        return response
    } catch (error: any) {
        console.error('Verify checkout GET error:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const { session_id } = await request.json()
        if (!session_id) {
            return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
        }

        const result = await verifySession(session_id)
        const response = NextResponse.json(result)

        
        if (result.success && result.user) {
            response.cookies.set('auth_session', JSON.stringify({
                userId: result.user.id,
                referenceCode: result.user.reference_code,
                email: result.user.email
            }), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60
            })
        }
        return response

    } catch (error: any) {
        console.error('Verify checkout POST error:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}