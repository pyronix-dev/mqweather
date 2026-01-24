// Developed by Omar Rafik (OMX) - omx001@proton.me

import { getUserFromSession } from '@/lib/auth-server'
import RainClient from '@/components/prevision-pluie-client'

export const dynamic = 'force-dynamic'

export default async function RainPage() {
    const user = await getUserFromSession()
    return <RainClient initialUser={user} />
}