// Developed by Omar Rafik (OMX) - omx001@proton.me

import { getUserFromSession } from '@/lib/auth-server'
import { VigilanceClient } from '@/components/vigilance-client'

export const dynamic = 'force-dynamic'

export default async function VigilancePage() {
    const user = await getUserFromSession()
    return <VigilanceClient initialUser={user} />
}