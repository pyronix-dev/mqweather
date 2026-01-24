// Developed by Omar Rafik (OMX) - omx001@proton.me
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { cookies } from 'next/headers'
import { createSupabaseAdmin } from '@/lib/supabase'


const PLAN_NAMES: Record<string, string> = {
    'sms-monthly': 'SMS Standard - Mensuel',
    'sms-annual': 'SMS Standard - Annuel',
    'email-annual': 'Alertes Email - Annuel'
}


const PLAN_PRICES: Record<string, string> = {
    'sms-monthly': '4,99€',
    'sms-annual': '49,90€',
    'email-annual': '10€'
}

export async function GET() {
    try {
        const cookieStore = await cookies()
        const authSession = cookieStore.get('auth_session')?.value

        if (!authSession) {
            console.log('❌ Auth/Me: No auth_session cookie found')
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        let session
        try {
            session = JSON.parse(authSession)
        } catch (e) {
            console.log('❌ Auth/Me: Failed to parse auth_session cookie')
            return NextResponse.json({ error: 'Invalid session format' }, { status: 401 })
        }

        const userId = session.userId

        if (!userId) {
            console.log('❌ Auth/Me: No userId in session', session)
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
        }

        console.log('✅ Auth/Me: Checking user', userId)

        const supabase = createSupabaseAdmin()

        
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id, reference_code, email, phone, full_name, notifications_enabled, notif_sms, notif_email, role')
            .eq('id', userId)
            .single()

        if (!user || userError) {
            console.log('❌ Auth/Me: User not found in DB', userError)
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('plan, status, expires_at, amount')
            .eq('user_id', userId)
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        
        let subscriptionData = null
        if (subscription) {
            const expiresAt = subscription.expires_at ? new Date(subscription.expires_at) : null
            subscriptionData = {
                plan: PLAN_NAMES[subscription.plan] || subscription.plan,
                price: PLAN_PRICES[subscription.plan] || `${(subscription.amount / 100).toFixed(2)}€`,
                status: subscription.status === 'active' ? 'Actif' : 'Inactif',
                nextBilling: expiresAt ? expiresAt.toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                }) : 'Non défini'
            }
        }

        
        const firstName = user.full_name ? user.full_name.split(' ')[0] : ''

        return NextResponse.json({
            name: user.full_name, 
            first_name: firstName,
            full_name: user.full_name,
            reference: user.reference_code,
            email: user.email,
            phone: user.phone,
            notifications: {
                enabled: user.notifications_enabled, 
                sms: user.notif_sms,
                email: user.notif_email
            },
            notifications_enabled: user.notifications_enabled, 
            role: user.role,
            subscription: subscriptionData
        })

    } catch (error) {
        console.error('Auth me error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}