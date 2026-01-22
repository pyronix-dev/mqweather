import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSupabaseAdmin } from '@/lib/supabase'

// Helper: Check auth
async function getAuthenticatedUser() {
    const cookieStore = await cookies()
    const authSession = cookieStore.get('auth_session')?.value
    if (!authSession) return null
    try {
        const session = JSON.parse(authSession)
        return session.userId
    } catch {
        return null
    }
}

export async function GET() {
    try {
        const supabase = createSupabaseAdmin()

        // Calculate 24 hours ago
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

        const { data, error } = await supabase
            .from('observations')
            .select('*')
            .gte('created_at', twentyFourHoursAgo)
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching observations:', error)
        return NextResponse.json({ error: 'Failed to fetch observations' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const userId = await getAuthenticatedUser()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { type, x, y, temp, details } = body

        if (!type || x === undefined || y === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const supabase = createSupabaseAdmin()
        const { data, error } = await supabase
            .from('observations')
            .insert({
                user_id: userId,
                type,
                x,
                y,
                temp,
                details
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)

    } catch (error) {
        console.error('Error creating observation:', error)
        return NextResponse.json({ error: 'Failed to create observation' }, { status: 500 })
    }
}
