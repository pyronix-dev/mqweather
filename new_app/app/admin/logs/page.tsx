// Developed by Omar Rafik (OMX) - omx001@proton.me

import { getUserFromSession } from '@/lib/auth-server'
import { redirect } from 'next/navigation'
import LogsClient from '@/components/admin/logs-client'

export const dynamic = 'force-dynamic'

export default async function AdminLogsPage() {
    const user = await getUserFromSession()

    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
        redirect('/')
    }

    return <LogsClient initialUser={user} />
}