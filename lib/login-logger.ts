
import { createSupabaseAdmin } from '@/lib/supabase'

export async function logUserLogin(userId: string, request: Request) {
    // Run asynchronously without blocking the response
    // In Vercel serverless, we should ideally use waitUntil if available, 
    // but standard async invocation usually works for quick DB inserts if the runtime doesn't freeze immediately.
    // For critical logging, we might want to await. Given this helps the admin dashboard, we will await it but handle errors gracefully.

    try {
        const ip = getClientIP(request)
        const userAgent = request.headers.get('user-agent') || 'unknown'

        // 1. Get Geo Location
        let locationData: any = {}
        if (ip && ip !== 'unknown' && ip !== '::1' && ip !== '127.0.0.1') {
            try {
                // Using ip-api.com (free for non-commercial, but check limits)
                // In production, consider a paid service or hosting a geoip db.
                const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,isp`, { signal: AbortSignal.timeout(3000) })
                if (geoRes.ok) {
                    const data = await geoRes.json()
                    if (data.status === 'success') {
                        locationData = {
                            country: data.country,
                            city: data.city,
                            isp: data.isp
                        }
                    }
                }
            } catch (e) {
                console.warn('GeoIP lookup failed:', e)
            }
        }

        // 2. Insert into login_history
        const supabase = createSupabaseAdmin()
        await supabase.from('login_history').insert({
            user_id: userId,
            ip_address: ip,
            user_agent: userAgent,
            location_country: locationData.country || null,
            location_city: locationData.city || null,
            isp: locationData.isp || null
        })

        // 3. Check for suspicious IP tracking (simple increment)
        // This is optional based on the schema `ip_limit_tracking` but we'll stick to login_history for now.

    } catch (error) {
        console.error('Failed to log user login:', error)
    }
}

/**
 * Get IP address from request headers.
 */
function getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for')
    if (forwarded) {
        return forwarded.split(',')[0].trim()
    }
    return request.headers.get('x-real-ip') || 'unknown'
}
