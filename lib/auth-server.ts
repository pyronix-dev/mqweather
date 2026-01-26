// Developed by Omar Rafik (OMX) - omx001@proton.me
import { cookies } from 'next/headers'

export async function getUserSession() {
    try {
        const cookieStore = await cookies()
        const authSession = cookieStore.get('auth_session')?.value
        console.log('🔍 Server Auth: Cookie found?', !!authSession)

        if (!authSession) return null

        try {
            const session = JSON.parse(authSession)
            console.log('🔍 Server Auth: Parsed session', session)
            if (!session.userId) return null
            return session
        } catch (e) {
            console.error('🔍 Server Auth: JSON Parse Error', e)
            return null
        }
    } catch (e) {
        console.error('🔍 Server Auth: Cookie Store Error', e)
        return null
    }
}

export async function getUserFromSession() {
    const session = await getUserSession()
    if (!session?.userId) return null


    try {
        const { createSupabaseAdmin } = await import('@/lib/supabase')
        const supabase = createSupabaseAdmin()

        const { data: user, error } = await supabase
            .from('users')
            .select('full_name, email, phone, reference_code, role, notifications_enabled, notif_sms, notif_email')
            .eq('id', session.userId)
            .single()

        if (error || !user) {
            console.warn('⚠️ Server Auth: DB User not found or error, falling back to cookie data', error)

            return {
                name: session.fullName ? session.fullName.split(' ')[0] : (session.email ? session.email.split('@')[0] : 'Utilisateur'),
                reference: session.referenceCode,
                email: session.email || '',
                role: 'user'
            }
        }


        let displayName = 'Utilisateur'
        if (user.full_name) {
            displayName = user.full_name.split(' ')[0]
        } else if (user.email) {
            displayName = user.email.split('@')[0]
        }


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

        // Fetch active subscription
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('plan, status, expires_at, amount')
            .eq('user_id', session.userId)
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

        return {
            name: displayName,
            reference: user.reference_code,
            email: user.email || '',
            phone: user.phone || null,
            notifications_enabled: user.notifications_enabled ?? true,
            notifications_sms: user.notif_sms ?? true,
            notifications_email: user.notif_email ?? true,
            role: user.role,
            subscription: subscriptionData
        }
    } catch (e) {
        console.error('Error fetching user server-side:', e)

        return {
            name: session.fullName ? session.fullName.split(' ')[0] : (session.email ? session.email.split('@')[0] : 'Utilisateur'),
            reference: session.referenceCode,
            email: session.email || '',
            role: 'user'
        }
    }
}

export async function getAuthUser() {
    const session = await getUserSession()
    if (!session?.userId) return null
    return session
}