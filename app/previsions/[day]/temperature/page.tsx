
import { getUserFromSession } from '@/lib/auth-server'
import TemperatureClient from '@/components/prevision-temperature-client'

export const dynamic = 'force-dynamic'

export default async function TemperaturePage() {
    const user = await getUserFromSession()
    return <TemperatureClient initialUser={user} />
}
