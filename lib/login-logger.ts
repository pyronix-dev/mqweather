// Developed by Omar Rafik (OMX) - omx001@proton.me

import { createSupabaseAdmin } from '@/lib/supabase'

export async function logUserLogin(userId: string, request: Request) {
    
    
    
    

    try {
        const ip = getClientIP(request)
        const userAgent = request.headers.get('user-agent') || 'unknown'

        
        let locationData: any = {}
        if (ip && ip !== 'unknown' && ip !== '::1' && ip !== '127.0.0.1') {
            try {
                
                
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

        
        const supabase = createSupabaseAdmin()
        await supabase.from('login_history').insert({
            user_id: userId,
            ip_address: ip,
            user_agent: userAgent,
            location_country: locationData.country || null,
            location_city: locationData.city || null,
            isp: locationData.isp || null
        })

        
        

    } catch (error) {
        console.error('Failed to log user login:', error)
    }
}


function getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for')
    if (forwarded) {
        return forwarded.split(',')[0].trim()
    }
    return request.headers.get('x-real-ip') || 'unknown'
}