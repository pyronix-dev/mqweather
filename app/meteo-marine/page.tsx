// Developed by Omar Rafik (OMX) - omx001@proton.me

import { getUserFromSession } from '@/lib/auth-server'
import MarinePage from '@/components/marine-client'

export const dynamic = 'force-dynamic'

export default async function MeteoMarinePage() {
    const user = await getUserFromSession()
    return <MarinePage initialUser={user} />
}