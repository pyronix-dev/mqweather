// Developed by Omar Rafik (OMX) - omx001@proton.me

import { getUserFromSession } from '@/lib/auth-server'
import ConfidentialiteClient from '@/components/confidentialite-client'

export const dynamic = 'force-dynamic'

export default async function ConfidentialitePage() {
    const user = await getUserFromSession()
    return <ConfidentialiteClient initialUser={user} />
}