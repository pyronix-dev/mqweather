
import { getUserFromSession } from '@/lib/auth-server'
import AlertesReturnClient from '@/components/alertes-return-client'

export const dynamic = 'force-dynamic'

export default async function ReturnPage() {
    const user = await getUserFromSession()
    return <AlertesReturnClient initialUser={user} />
}
