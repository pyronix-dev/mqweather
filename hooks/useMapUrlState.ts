"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { MARTINIQUE_CITIES } from "@/lib/constants"

export function useMapUrlState() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    // Initialize state from URL params
    const initialDay = parseInt(searchParams.get("jour") || "0")
    const initialCityName = searchParams.get("ville")
    const latParam = parseFloat(searchParams.get("lat") || "")
    const lonParam = parseFloat(searchParams.get("lon") || "")

    const initialCity = initialCityName
        ? MARTINIQUE_CITIES.find(c => c.name.toLowerCase() === initialCityName.toLowerCase())
        : null

    const [selectedDay, setSelectedDay] = useState(isNaN(initialDay) ? 0 : initialDay)
    const [centerOn, setCenterOn] = useState<{ lat: number; lon: number } | null>(
        !isNaN(latParam) && !isNaN(lonParam)
            ? { lat: latParam, lon: lonParam }
            : initialCity
                ? { lat: initialCity.lat, lon: initialCity.lon }
                : null
    )

    // Update URL when state changes
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())

        // Update 'jour'
        const currentJour = params.get("jour")
        const newJour = selectedDay === 0 ? null : selectedDay.toString()

        if (currentJour !== newJour) {
            if (newJour) {
                params.set("jour", newJour)
            } else {
                params.delete("jour")
            }
            router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        }
    }, [selectedDay, router, pathname, searchParams])

    const handleSearch = useCallback((location: { name: string; lat: number; lon: number }) => {
        setCenterOn({ lat: location.lat, lon: location.lon })

        // Update URL immediately for better UX
        const params = new URLSearchParams(searchParams.toString())
        params.set("ville", location.name)
        params.set("lat", location.lat.toString())
        params.set("lon", location.lon.toString())

        if (selectedDay !== 0) params.set("jour", selectedDay.toString())

        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }, [selectedDay, router, pathname, searchParams])

    const handleDaySelect = useCallback((dayIndex: number) => {
        setSelectedDay(dayIndex)
    }, [])

    return {
        selectedDay,
        centerOn,
        handleSearch,
        handleDaySelect
    }
}
