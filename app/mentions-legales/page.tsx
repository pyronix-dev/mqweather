
import { getUserFromSession } from '@/lib/auth-server'
import MentionsLegalesClient from '@/components/mentions-legales-client'

export const dynamic = 'force-dynamic'

export default async function MentionsLegalesPage() {
    const user = await getUserFromSession()
    return <MentionsLegalesClient initialUser={user} />
}
