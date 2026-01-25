// Developed by Omar Rafik (OMX) - omx001@proton.me

import { getUserFromSession } from '@/lib/auth-server'
import AlertesCheckoutClient from '@/components/alertes-checkout-client'

export const dynamic = 'force-dynamic'

export default async function CheckoutPage() {
    const user = await getUserFromSession()
    return <AlertesCheckoutClient initialUser={user} />
}