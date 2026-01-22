import { createClient } from '@supabase/supabase-js'

// Server-side client with service role key (full access)
// Only use this in API routes, never expose to client
export function createSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Missing Supabase environment variables')
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}

// Database types
export interface User {
    id: string
    reference_code: string
    email: string | null
    phone: string | null
    created_at: string
    notifications_enabled?: boolean // Optional initially until DB migration is confirmed
}

export interface Subscription {
    id: string
    user_id: string
    plan: string
    status: 'active' | 'cancelled' | 'expired'
    stripe_session_id: string | null
    amount: number
    created_at: string
    expires_at: string | null
}

export interface OtpCode {
    id: string
    user_id: string
    code_hash: string
    expires_at: string
    used: boolean
}

// Helper function to generate reference code
// Helper function to generate reference code
export function generateReferenceCode(sessionId?: string): string {
    const prefix = "MQ"
    if (sessionId) {
        // Deterministic generation matching frontend logic
        const hash = sessionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        // Ensure even empty or short IDs don't break logic, but session IDs are long strings
        const number = (hash % 900000) + 100000
        return `${prefix}${number}`
    }
    // Fallback random
    const random = Math.floor(100000 + Math.random() * 900000).toString()
    return `${prefix}${random}`
}
