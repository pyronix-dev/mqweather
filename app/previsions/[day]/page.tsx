
import { Suspense } from "react"
import DayDetailContent from "./day-detail-content"
import { getUserFromSession } from "@/lib/auth-server"

export const dynamic = "force-dynamic"

export default async function DayDetailPage() {
  const user = await getUserFromSession()
  return (
    <Suspense fallback={null}>
      <DayDetailContent initialUser={user} />
    </Suspense>
  )
}
