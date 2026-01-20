import { Suspense } from "react"
import { getSlugFromIndex } from "@/lib/utils"
import DayDetailContent from "./day-detail-content"

export function generateStaticParams() {
  return Array.from({ length: 7 }, (_, i) => ({
    day: getSlugFromIndex(i),
  }))
}

















export default function DayDetailPage() {
  return (
    <Suspense fallback={null}>
      <DayDetailContent />
    </Suspense>
  )
}
