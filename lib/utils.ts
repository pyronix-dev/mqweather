// Developed by Omar Rafik (OMX) - omx001@proton.me
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import DOMPurify from 'isomorphic-dompurify'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSlugFromIndex(index: number): string {
  if (index === 0) return "today"
  const date = new Date()
  date.setDate(date.getDate() + index)
  
  return date.toLocaleDateString("fr-FR", { weekday: "long" })
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

export function getDayIndexFromSlug(slug: string): number {
  if (slug === "today" || slug === "0") return 0

  
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const daySlug = d.toLocaleDateString("fr-FR", { weekday: "long" })
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")

    if (daySlug === slug) return i
  }

  
  const num = Number(slug)
  if (!isNaN(num)) return num

  return 0
}

export function sanitizeInput(input: string): string {
  if (!input) return ""
  return DOMPurify.sanitize(input).trim()
}