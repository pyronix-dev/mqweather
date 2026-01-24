
import { getUserFromSession } from '@/lib/auth-server'
import RainMapPage from '@/components/maps/pluie-client'
import { MARTINIQUE_CITIES } from '@/lib/constants'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function PluiePage(props: { params: Promise<{ city?: string[] }>, searchParams: Promise<{ ville?: string }> }) {
    const params = await props.params
    const searchParams = await props.searchParams
    const user = await getUserFromSession()

    // Validate City if present
    const citySlug = params.city?.[0] ? decodeURIComponent(params.city[0]) : null
    const cityParam = citySlug || searchParams.ville

    if (cityParam) {
        // Case insensitive match
        const isValid = MARTINIQUE_CITIES.some(c => c.name.toLowerCase() === cityParam.toLowerCase())
        if (!isValid) {
            notFound()
        }
    }

    return <RainMapPage initialUser={user} />
}
