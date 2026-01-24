// Developed by Omar Rafik (OMX) - omx001@proton.me

import { getUserFromSession } from '@/lib/auth-server'
import { DashboardClient } from '@/components/dashboard-client'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const user = await getUserFromSession()
    return <DashboardClient initialUser={user} />
}