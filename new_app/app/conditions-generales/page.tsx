// Developed by Omar Rafik (OMX) - omx001@proton.me

import { getUserFromSession } from '@/lib/auth-server'
import ConditionsGeneralesClient from '@/components/conditions-generales-client'

export const dynamic = 'force-dynamic'

export default async function ConditionsGeneralesPage() {
    const user = await getUserFromSession()
    return <ConditionsGeneralesClient initialUser={user} />
}