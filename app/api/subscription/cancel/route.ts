// Developed by Omar Rafik (OMX) - omx001@proton.me
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

        
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('id, stripe_subscription_id')
            .eq('user_id', userId)
            .eq('status', 'active')
            .single()

        if (!subscription) {
            return NextResponse.json({ error: 'Aucun abonnement actif trouvé.' }, { status: 404 })
        }

        
        
        
        
        
        
        

        
        
        
        

        
        
        
        

        const { error: updateError } = await supabase
            .from('subscriptions')
            .update({ status: 'cancelled' })
            .eq('id', subscription.id)

        if (updateError) throw updateError

        
        console.log('📧 Preparing cancellation email for user:', userId)

        
        const { data: user } = await supabase
            .from('users')
            .select('email')
            .eq('id', userId)
            .single()

        if (user?.email) {
            console.log('📧 Found user email:', user.email)
            const { sendCancellationEmail } = await import('@/lib/brevo')

            
            const { data: subDetails } = await supabase
                .from('subscriptions')
                .select('plan, expires_at')
                .eq('id', subscription.id)
                .single()

            if (subDetails) {
                console.log('📧 Found subscription details:', subDetails)
                
                const endDate = subDetails.expires_at
                    ? new Date(subDetails.expires_at).toLocaleDateString('fr-FR')
                    : new Date().toLocaleDateString('fr-FR')

                await sendCancellationEmail(user.email, subDetails.plan, endDate)
                console.log('✅ Cancellation email sent')
            } else {
                console.warn('⚠️ Could not fetch subscription details for email')
            }
        } else {
            console.warn('⚠️ No email found for user, skipping cancellation email')
        }

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Cancel subscription error:', error)
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
    }
}