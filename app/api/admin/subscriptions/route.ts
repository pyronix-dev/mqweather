// Developed by Omar Rafik (OMX) - omx001@proton.me

import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import { requireAdmin, logAdminAction, getClientIP } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'


export async function POST(request: Request) {
    const admin = await requireAdmin()
    if (admin instanceof NextResponse) return admin

    const body = await request.json()
    const { userId, action, durationDays, planId } = body
    const supabase = createSupabaseAdmin()
    const clientIP = getClientIP(request)

    if (!userId || !action) {
        return NextResponse.json({ error: 'Missing userId or action' }, { status: 400 })
    }

    
    const { data: currentSub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single()

    try {
        if (action === 'grant') {
            
            if (currentSub) {
                return NextResponse.json({ error: 'User already has an active subscription' }, { status: 400 })
            }

            const startDate = new Date()
            const endDate = new Date()
            endDate.setDate(startDate.getDate() + (durationDays || 30))

            const { data, error } = await supabase
                .from('subscriptions')
                .insert({
                    user_id: userId,
                    plan: planId || 'sms-monthly',
                    status: 'active',
                    expires_at: endDate.toISOString(),
                    amount: 0
                })
                .select()
                .single()

            if (error) throw error

            await logAdminAction(admin.id, 'grant_subscription', 'subscription', data.id, { userId, durationDays }, clientIP)
            return NextResponse.json({ success: true, subscription: data })

        } else if (action === 'extend') {
            
            if (!currentSub) {
                return NextResponse.json({ error: 'No active subscription to extend' }, { status: 400 })
            }

            
            const baseDate = currentSub.expires_at ? new Date(currentSub.expires_at) : new Date()
            const currentEndDate = isNaN(baseDate.getTime()) ? new Date() : baseDate

            const newEndDate = new Date(currentEndDate)
            newEndDate.setDate(newEndDate.getDate() + (durationDays || 30))

            const { data, error } = await supabase
                .from('subscriptions')
                .update({ expires_at: newEndDate.toISOString() })
                .eq('id', currentSub.id)
                .select()
                .single()

            if (error) throw error

            await logAdminAction(admin.id, 'extend_subscription', 'subscription', currentSub.id, { originalEnd: currentEndDate, newEnd: newEndDate }, clientIP)
            return NextResponse.json({ success: true, subscription: data })

        } else if (action === 'cancel') {
            
            if (!currentSub) {
                return NextResponse.json({ error: 'No active subscription to cancel' }, { status: 400 })
            }

            const { data, error } = await supabase
                .from('subscriptions')
                .update({ status: 'cancelled', expires_at: new Date().toISOString() })
                .eq('id', currentSub.id)
                .select()
                .single()

            if (error) throw error

            await logAdminAction(admin.id, 'cancel_subscription', 'subscription', currentSub.id, { reason: 'Admin manual cancellation' }, clientIP)
            return NextResponse.json({ success: true, subscription: data })
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

    } catch (error: any) {
        console.error('Subscription management error:', error)
        return NextResponse.json({ error: error.message || 'Failed to process subscription action' }, { status: 500 })
    }
}