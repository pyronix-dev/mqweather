// Developed by Omar Rafik (OMX) - omx001@proton.me

import { getUserFromSession } from '@/lib/auth-server'
import PrevisionPage from '@/components/previsions-client'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default async function PrevisionsPage() {
    const user = await getUserFromSession()
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <PrevisionPage initialUser={user} />
        </Suspense>
    )
}