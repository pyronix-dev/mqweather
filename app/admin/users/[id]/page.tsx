// Developed by Omar Rafik (OMX) - omx001@proton.me

import { getUserFromSession } from '@/lib/auth-server'
import { redirect } from 'next/navigation'
import UserDetailClient from '@/components/admin/user-detail-client'

export const dynamic = 'force-dynamic'

export default async function AdminUserDetailPage({ params }: { params: { id: string } }) {
    const user = await getUserFromSession()

    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
        redirect('/')
    }

    return <UserDetailClient params={params} initialUser={user} />
}