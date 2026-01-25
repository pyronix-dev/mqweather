// Developed by Omar Rafik (OMX) - omx001@proton.me

import { getUserFromSession } from '@/lib/auth-server'
import CarteClient from '@/components/carte-client'

export const dynamic = 'force-dynamic'

export default async function CartePage() {
  const user = await getUserFromSession()
  return <CarteClient initialUser={user} />
}