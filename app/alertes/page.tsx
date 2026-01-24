// Developed by Omar Rafik (OMX) - omx001@proton.me

import { getUserFromSession } from '@/lib/auth-server'
import AlertesPage from '@/components/alertes-client'

export const dynamic = 'force-dynamic'

export default async function AlertPage() {
    const user = await getUserFromSession()
    return <AlertesPage initialUser={user} />
}