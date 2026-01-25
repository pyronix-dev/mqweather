// Developed by Omar Rafik (OMX) - omx001@proton.me

import { getUserFromSession } from '@/lib/auth-server'
import ContactClient from '@/components/contact-client'

export const dynamic = 'force-dynamic'

export default async function ContactPage() {
    const user = await getUserFromSession()
    return <ContactClient initialUser={user} />
}