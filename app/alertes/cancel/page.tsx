
import { getUserFromSession } from '@/lib/auth-server'
import AlertesCancelClient from '@/components/alertes-cancel-client'

export const dynamic = 'force-dynamic'

export default async function CancelPage() {
    const user = await getUserFromSession()
    return <AlertesCancelClient initialUser={user} />
}
