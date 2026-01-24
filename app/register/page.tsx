// Developed by Omar Rafik (OMX) - omx001@proton.me

import { getUserFromSession } from '@/lib/auth-server'
import { redirect } from 'next/navigation'
import RegisterClient from '@/components/register-client'

export const dynamic = 'force-dynamic'

export default async function RegisterPage() {
    const user = await getUserFromSession()

    if (user) {
        redirect('/dashboard')
    }

    return <RegisterClient initialUser={user} />
}