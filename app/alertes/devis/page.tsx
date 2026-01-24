// Developed by Omar Rafik (OMX) - omx001@proton.me

import { getUserFromSession } from '@/lib/auth-server'
import AlertesDevisClient from '@/components/alertes-devis-client'

export const dynamic = 'force-dynamic'

export default async function DevisPage() {
    const user = await getUserFromSession()
    return <AlertesDevisClient initialUser={user} />
}