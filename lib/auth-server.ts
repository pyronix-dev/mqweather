import { cookies } from 'next/headers'

export async function getUserSession() {
    try {
        const cookieStore = await cookies()
        const authSession = cookieStore.get('auth_session')?.value
        console.log('🔍 Server Auth: Cookie found?', !!authSession)

        if (!authSession) return null

        try {
            const session = JSON.parse(authSession)
            console.log('🔍 Server Auth: Parsed session', session)
            if (!session.userId) return null
            return session
        } catch (e) {
            console.error('🔍 Server Auth: JSON Parse Error', e)
            return null
        }
    } catch (e) {
        console.error('🔍 Server Auth: Cookie Store Error', e)
        return null
    }
}

export async function getUserFromSession() {
    const session = await getUserSession()
    if (!session?.userId) return null

    // We utilize the admin client to fetch user details server-side safely
    try {
        const { createSupabaseAdmin } = await import('@/lib/supabase')
        const supabase = createSupabaseAdmin()

        const { data: user, error } = await supabase
            .from('users')
            .select('full_name, email, reference_code, role')
            .eq('id', session.userId)
            .single()

        if (error || !user) {
            console.warn('⚠️ Server Auth: DB User not found or error, falling back to cookie data', error)
            // Fallback to cookie data to avoid flicker
            return {
                name: session.referenceCode || 'Utilisateur',
                email: session.email || '',
                role: 'user' // Default to user if DB fails
            }
        }

        // Format name logic similar to /api/auth/me
        let displayName = user.reference_code
        if (user.full_name) {
            displayName = user.full_name.split(' ')[0]
        }

        return {
            name: displayName,
            reference: user.reference_code,
            email: user.email || '',
            role: user.role
        }
    } catch (e) {
        console.error('Error fetching user server-side:', e)
        // Fallback to cookie data
        return {
            name: session.referenceCode || 'Utilisateur',
            reference: session.referenceCode,
            email: session.email || '',
            role: 'user'
        }
    }
}
