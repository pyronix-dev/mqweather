// Developed by Omar Rafik (OMX) - omx001@proton.me

import { getUserFromSession } from '@/lib/auth-server'
import AlertesSuccessClient from '@/components/alertes-success-client'

export const dynamic = 'force-dynamic'

export default async function SuccessPage() {
    const user = await getUserFromSession()
    return <AlertesSuccessClient initialUser={user} />
}