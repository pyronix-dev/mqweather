import { Suspense } from "react"
import DayDetailContent from "./day-detail-content"

export function generateStaticParams() {
  return Array.from({ length: 7 }, (_, i) => ({
    day: i.toString(),
  }))
}

















export default function DayDetailPage() {
  return (
    <Suspense fallback={null}>
      <DayDetailContent />
    </Suspense>
  )
}
