import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const supabase = createSupabaseAdmin()

        // Fetch observations from the last 24 hours
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

        const { data: observations, error } = await supabase
            .from('observations')
            .select('*')
            .gt('created_at', twentyFourHoursAgo)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching observations:', error)
            return NextResponse.json({ error: 'Failed to fetch observations' }, { status: 500 })
        }

        // Map database columns to frontend expected format
        const formattedObservations = observations.map((obs) => ({
            id: obs.id,
            type: obs.type,
            x: Number(obs.x),
            y: Number(obs.y),
            user_id: obs.user_id,
            details: obs.details,
            temp: obs.temp,
            created_at: obs.created_at
        }))

        return NextResponse.json(formattedObservations)
    } catch (e) {
        console.error('Server error:', e)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { type, x, y, user_id, details, temp } = body

        if (!type || x === undefined || y === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const supabase = createSupabaseAdmin()

        // Use x and y columns directly
        const insertData = {
            type,
            x: Number(x),
            y: Number(y),
            user_id: user_id || null,
            details: details || '',
            temp: temp || null
        }

        console.log('Attempting to insert observation:', JSON.stringify(insertData))

        const { data, error } = await supabase
            .from('observations')
            .insert(insertData)
            .select()
            .single()

        if (error) {
            console.error('SUPABASE INSERT ERROR:', JSON.stringify(error, null, 2))
            return NextResponse.json({ error: 'Failed to save observation', details: error.message }, { status: 500 })
        }

        // Return in frontend format
        const newObservation = {
            id: data.id,
            type: data.type,
            x: Number(data.x),
            y: Number(data.y),
            user_id: data.user_id,
            details: data.details,
            temp: data.temp,
            created_at: data.created_at
        }

        return NextResponse.json(newObservation)
    } catch (e) {
        console.error('Server error:', e)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
