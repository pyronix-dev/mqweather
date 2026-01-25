// Developed by Omar Rafik (OMX) - omx001@proton.me
import { redirect } from 'next/navigation'
import { getUserSession } from '@/lib/auth-server'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getUserSession()

    if (!session) {
        redirect('/login')
    }

    return (
        <>
            {children}
        </>
    )
}