// Developed by Omar Rafik (OMX) - omx001@proton.me
import { createSupabaseAdmin } from './supabase'

export interface RateLimitResult {
    blocked: boolean
    remainingTime?: number 
    error?: string
}

export async function checkRateLimit(ip: string, actionType: 'register' | 'otp_request'): Promise<RateLimitResult> {
    const supabase = createSupabaseAdmin()
    const MAX_ATTEMPTS = 5 
    const BASE_BLOCK_DURATION = 10 * 60 * 1000 

    
    const { data: record, error } = await supabase
        .from('ip_limit_tracking')
        .select('*')
        .eq('ip_address', ip)
        .single()

    const now = new Date()

    if (!record) {
        
        await supabase.from('ip_limit_tracking').insert({
            ip_address: ip,
            attempt_count: 1,
            updated_at: now.toISOString()
        })
        return { blocked: false }
    }

    
    if (record.blocked_until && new Date(record.blocked_until) > now) {
        const remaining = Math.ceil((new Date(record.blocked_until).getTime() - now.getTime()) / 1000)
        return { blocked: true, remainingTime: remaining }
    }

    
    const lastUpdate = new Date(record.updated_at)
    
    if ((now.getTime() - lastUpdate.getTime()) > 60 * 60 * 1000 && (!record.blocked_until || new Date(record.blocked_until) < now)) {
        await supabase.from('ip_limit_tracking').update({
            attempt_count: 1,
            blocked_until: null,
            updated_at: now.toISOString()
        }).eq('ip_address', ip)
        return { blocked: false }
    }

    
    const newCount = (record.attempt_count || 0) + 1
    let updates: any = {
        attempt_count: newCount,
        updated_at: now.toISOString()
    }

    
    if (newCount > MAX_ATTEMPTS) {
        
        const suspicionMultiplier = Math.max(1, (record.suspicion_level || 0) + 1)
        const blockDuration = BASE_BLOCK_DURATION * suspicionMultiplier
        const blockExpires = new Date(now.getTime() + blockDuration)

        updates = {
            ...updates,
            blocked_until: blockExpires.toISOString(),
            suspicion_level: suspicionMultiplier, 
            attempt_count: 0 
        }

        await supabase.from('ip_limit_tracking').update(updates).eq('ip_address', ip)

        return { blocked: true, remainingTime: blockDuration / 1000 }
    }

    
    await supabase.from('ip_limit_tracking').update(updates).eq('ip_address', ip)
    return { blocked: false }
}