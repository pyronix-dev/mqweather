import { createSupabaseAdmin } from './supabase'

export interface RateLimitResult {
    blocked: boolean
    remainingTime?: number // Seconds
    error?: string
}

export async function checkRateLimit(ip: string, actionType: 'register' | 'otp_request'): Promise<RateLimitResult> {
    const supabase = createSupabaseAdmin()
    const MAX_ATTEMPTS = 5 // Per window
    const BASE_BLOCK_DURATION = 10 * 60 * 1000 // 10 minutes

    // 1. Get current IP status
    const { data: record, error } = await supabase
        .from('ip_limit_tracking')
        .select('*')
        .eq('ip_address', ip)
        .single()

    const now = new Date()

    if (!record) {
        // First time seeing this IP
        await supabase.from('ip_limit_tracking').insert({
            ip_address: ip,
            attempt_count: 1,
            updated_at: now.toISOString()
        })
        return { blocked: false }
    }

    // 2. Check if currently blocked
    if (record.blocked_until && new Date(record.blocked_until) > now) {
        const remaining = Math.ceil((new Date(record.blocked_until).getTime() - now.getTime()) / 1000)
        return { blocked: true, remainingTime: remaining }
    }

    // 3. Reset bucket if enough time passed since last update (e.g., 1 hour) -- SIMPLE WINDOW
    const lastUpdate = new Date(record.updated_at)
    // If > 1 hour has passed since last activity and NOT blocked, reset attempts
    if ((now.getTime() - lastUpdate.getTime()) > 60 * 60 * 1000 && (!record.blocked_until || new Date(record.blocked_until) < now)) {
        await supabase.from('ip_limit_tracking').update({
            attempt_count: 1,
            blocked_until: null,
            updated_at: now.toISOString()
        }).eq('ip_address', ip)
        return { blocked: false }
    }

    // 4. Increment Attempts
    const newCount = (record.attempt_count || 0) + 1
    let updates: any = {
        attempt_count: newCount,
        updated_at: now.toISOString()
    }

    // 5. Check Threshold
    if (newCount > MAX_ATTEMPTS) {
        // BLOCK USER
        const suspicionMultiplier = Math.max(1, (record.suspicion_level || 0) + 1)
        const blockDuration = BASE_BLOCK_DURATION * suspicionMultiplier
        const blockExpires = new Date(now.getTime() + blockDuration)

        updates = {
            ...updates,
            blocked_until: blockExpires.toISOString(),
            suspicion_level: suspicionMultiplier, // Increase suspicion
            attempt_count: 0 // Reset counts after block? Or keep? Let's reset so they get a fresh start after block
        }

        await supabase.from('ip_limit_tracking').update(updates).eq('ip_address', ip)

        return { blocked: true, remainingTime: blockDuration / 1000 }
    }

    // Just update count
    await supabase.from('ip_limit_tracking').update(updates).eq('ip_address', ip)
    return { blocked: false }
}
