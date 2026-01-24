
import { getUserFromSession } from '@/lib/auth-server'
import { redirect } from 'next/navigation'
import AdminDashboardClient from '@/components/admin/admin-dashboard-client'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
    const user = await getUserFromSession()

    // Server-side guard
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
        redirect('/')
    }

    return <AdminDashboardClient initialUser={user} />
}
