// Developed by Omar Rafik (OMX) - omx001@proton.me

import { getUserFromSession } from '@/lib/auth-server'
import { redirect } from 'next/navigation'
import LoginClient from '@/components/login-client'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
    const user = await getUserFromSession()

    if (user) {
        redirect('/dashboard')
    }

    return <LoginClient initialUser={user} />
}