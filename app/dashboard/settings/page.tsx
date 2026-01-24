
import { getUserFromSession } from '@/lib/auth-server'
import { redirect } from 'next/navigation'
import SettingsClient from '@/components/dashboard-settings-client'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
    const user = await getUserFromSession()

    if (!user) {
        redirect('/login')
    }

    return <SettingsClient initialUser={user} />
}

// Developed by Omar Rafik (OMX) - omx001@proton.me