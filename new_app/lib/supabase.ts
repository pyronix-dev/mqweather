// Developed by Omar Rafik (OMX) - omx001@proton.me
import { createClient } from '@supabase/supabase-js'



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


export interface User {
    id: string
    reference_code: string
    email: string | null
    phone: string | null
    created_at: string
    notifications_enabled?: boolean
    stripe_customer_id?: string
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

export interface Invoice {
    id: string
    user_id: string
    stripe_invoice_id: string
    amount: number
    status: string
    invoice_pdf: string
    invoice_number: string
    created_at: string
}

export interface OtpCode {
    id: string
    user_id: string
    code_hash: string
    expires_at: string
    used: boolean
}



export function generateReferenceCode(sessionId?: string): string {
    const prefix = "MQ"
    if (sessionId) {

        const hash = sessionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

        const number = (hash % 900000) + 100000
        return `${prefix}${number}`
    }

    const random = Math.floor(100000 + Math.random() * 900000).toString()
    return `${prefix}${random}`
}