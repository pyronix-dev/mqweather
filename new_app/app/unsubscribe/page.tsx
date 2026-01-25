// Developed by Omar Rafik (OMX) - omx001@proton.me

import { getUserFromSession } from '@/lib/auth-server'
import UnsubscribeClient from '@/components/unsubscribe-client'

export const dynamic = 'force-dynamic'

export default async function UnsubscribePage() {
    const user = await getUserFromSession()
    return <UnsubscribeClient initialUser={user} />
}