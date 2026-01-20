import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSlugFromIndex(index: number): string {
  if (index === 0) return "today"
  const date = new Date()
  date.setDate(date.getDate() + index)
  // Get day name in French, lowercase, strip accents
  return date.toLocaleDateString("fr-FR", { weekday: "long" })
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

export function getDayIndexFromSlug(slug: string): number {
  if (slug === "today" || slug === "0") return 0

  // Try to match slug against next 7 days
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const daySlug = d.toLocaleDateString("fr-FR", { weekday: "long" })
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")

    if (daySlug === slug) return i
  }

  // Fallback: check if slug is a number
  const num = Number(slug)
  if (!isNaN(num)) return num

  return 0
}
