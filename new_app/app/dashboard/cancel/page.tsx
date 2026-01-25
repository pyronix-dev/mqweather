// Developed by Omar Rafik (OMX) - omx001@proton.me

import { getUserFromSession } from '@/lib/auth-server'
import { redirect } from 'next/navigation'
import CancelClient from '@/components/dashboard-cancel-client'

export const dynamic = 'force-dynamic'

export default async function CancelPage() {
    const user = await getUserFromSession()

    if (!user) {
        redirect('/login')
    }

    return <CancelClient initialUser={user} />
}