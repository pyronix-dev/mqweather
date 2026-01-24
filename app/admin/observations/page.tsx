// Developed by Omar Rafik (OMX) - omx001@proton.me

import { getUserFromSession } from '@/lib/auth-server'
import { redirect } from 'next/navigation'
import ObservationsClient from '@/components/admin/observations-client'

export const dynamic = 'force-dynamic'

export default async function AdminObservationsPage() {
    const user = await getUserFromSession()

    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
        redirect('/')
    }

    return <ObservationsClient initialUser={user} />
}