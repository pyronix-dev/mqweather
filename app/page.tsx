
import { getUserFromSession } from '@/lib/auth-server'
import { HomeClient } from '@/components/home-client'

// Force dynamic because we use cookies/headers
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const user = await getUserFromSession()
  return <HomeClient initialUser={user} />
}
