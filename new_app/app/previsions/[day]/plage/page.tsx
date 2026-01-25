// Developed by Omar Rafik (OMX) - omx001@proton.me

import { getUserFromSession } from '@/lib/auth-server'
import BeachClient from '@/components/prevision-plage-client'

export const dynamic = 'force-dynamic'

export default async function BeachPage() {
    const user = await getUserFromSession()
    return <BeachClient initialUser={user} />
}