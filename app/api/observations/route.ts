import { NextResponse } from 'next/server'

// Mock in-memory database for observations
// This allows the feature to work immediately for the demo without Supabase setup
let OBSERVATIONS: any[] = [
    {
        id: '1',
        type: 'rain',
        lat: 14.6161,
        lon: -61.0588,
        user_id: 'system',
        timestamp: new Date().toISOString(),
        details: 'Pluie modérée'
    }
]

export async function GET() {
    return NextResponse.json(OBSERVATIONS)
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        // Allow simplified marker creation for free users
        const { type, lat, lon, user_id, details } = body

        if (!type || !lat || !lon) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const newObservation = {
            id: Math.random().toString(36).substring(7),
            type,
            lat,
            lon,
            user_id: user_id || 'anonymous',
            details,
            timestamp: new Date().toISOString()
        }

        OBSERVATIONS.push(newObservation)

        // Keep only last 100 to prevent memory leak in demo
        if (OBSERVATIONS.length > 100) {
            OBSERVATIONS = OBSERVATIONS.slice(-100)
        }

        return NextResponse.json(newObservation)
    } catch (e) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
