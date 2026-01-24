// Developed by Omar Rafik (OMX) - omx001@proton.me

import { getUserFromSession } from '@/lib/auth-server'
import WindClient from '@/components/prevision-vent-client'

export const dynamic = 'force-dynamic'

export default async function WindPage() {
    const user = await getUserFromSession()
    return <WindClient initialUser={user} />
}