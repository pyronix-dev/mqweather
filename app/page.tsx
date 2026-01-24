// Developed by Omar Rafik (OMX) - omx001@proton.me

import { getUserFromSession } from '@/lib/auth-server'
import { HomeClient } from '@/components/home-client'


export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const user = await getUserFromSession()
  return <HomeClient initialUser={user} />
}