import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST() {
    const response = NextResponse.json({ success: true })

    // Clear auth session cookie
    response.cookies.delete('auth_session')
    response.cookies.delete('otp_user_id')

    return response
}
