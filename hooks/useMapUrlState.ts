"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter, usePathname, useParams } from "next/navigation"
import { MARTINIQUE_CITIES } from "@/lib/constants"
import { sanitizeInput } from "@/lib/utils"

export function useMapUrlState() {
    const params = useParams()
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const citySlug = params?.city?.[0] ? decodeURIComponent(params.city[0]) : null

    // Initialize state from URL params
    const initialDay = parseInt(searchParams.get("jour") || "0")

    // Support both new path /cartes/uv/Fort-de-France and legacy ?ville=Fort-de-France
    const initialCityName = citySlug || sanitizeInput(searchParams.get("ville") || "")

    const latParam = parseFloat(searchParams.get("lat") || "")
    const lonParam = parseFloat(searchParams.get("lon") || "")

    const initialCity = initialCityName
        ? MARTINIQUE_CITIES.find(c => c.name.toLowerCase() === initialCityName.toLowerCase())
        : null

    const [selectedDay, setSelectedDay] = useState(isNaN(initialDay) ? 0 : initialDay)
    const [selectedCity, setSelectedCity] = useState<string | null>(initialCity?.name || null)

    // Always prioritize city coordinates if city is found, otherwise fallback to params or null
    const [centerOn, setCenterOn] = useState<{ lat: number; lon: number } | null>(
        initialCity ? { lat: initialCity.lat, lon: initialCity.lon } :
            (!isNaN(latParam) && !isNaN(lonParam) ? { lat: latParam, lon: lonParam } : null)
    )

    // Update URL when state changes
    useEffect(() => {
        // Sync day param only
        const params = new URLSearchParams(searchParams.toString())
        const currentJour = params.get("jour")
        const newJour = selectedDay === 0 ? null : selectedDay.toString()

        if (currentJour !== newJour) {
            if (newJour) params.set("jour", newJour)
            else params.delete("jour")

            router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        }
    }, [selectedDay, router, pathname, searchParams])

    // Enable History API navigation for map pages to prevent server reloads
    useEffect(() => {
        if (!pathname.startsWith('/cartes')) return

        const handlePopState = () => {
            const segments = window.location.pathname.split('/').filter(Boolean)
            // Expected: cartes, [type], [city?]
            const cityFromUrl = segments[2] ? decodeURIComponent(segments[2]) : null

            if (cityFromUrl) {
                const cityData = MARTINIQUE_CITIES.find(c => c.name.toLowerCase() === cityFromUrl.toLowerCase())
                if (cityData) {
                    setSelectedCity(cityData.name)
                    setCenterOn({ lat: cityData.lat, lon: cityData.lon })
                }
            } else {
                setSelectedCity(null)
                setCenterOn(null)
            }
        }

        window.addEventListener('popstate', handlePopState)
        return () => window.removeEventListener('popstate', handlePopState)
    }, [pathname, setSelectedCity, setCenterOn]) // Added setSelectedCity, setCenterOn to deps for clarity, though they are stable

    const handleSearch = useCallback((location: { name: string; lat: number; lon: number }) => {
        setCenterOn({ lat: location.lat, lon: location.lon })
        setSelectedCity(location.name)

        const params = new URLSearchParams(searchParams.toString())
        params.delete("lat")
        params.delete("lon")
        if (selectedDay !== 0) params.set("jour", selectedDay.toString())
        const queryString = params.toString() ? `?${params.toString()}` : ""

        if (pathname.startsWith('/cartes')) {
            // We are on a specific map page, use clean URL structure: /cartes/[type]/[CityName]
            const segments = pathname.split('/').filter(Boolean)
            const type = segments[1] // uv, temperature, etc.

            if (type) {
                const newPath = `/cartes/${type}/${encodeURIComponent(location.name)}`
                const fullUrl = `${newPath}${queryString}`

                // Clean path does not use 'ville' query param
                params.delete("ville")

                // Use History API for smooth transition without reload
                window.history.pushState(null, '', fullUrl)
            }
        } else {
            // We are on Home Page (or other), use legacy query param
            params.set("ville", location.name)
            const fullUrl = `${pathname}?${params.toString()}`

            // Use router for home page to maintain compatibility usually, but history is fine here too if we want smooth
            // logic previously used router.push. Let's stick to router.push for home to be safe, or just router.replace logic handling above.
            // Actually, for consistency and "smoothness" everywhere, let's keep router.push on Home Page as it worked well.
            router.push(fullUrl, { scroll: false })
        }
    }, [selectedDay, router, pathname, searchParams, setSelectedCity, setCenterOn]) // Added setSelectedCity, setCenterOn to deps

    const handleDaySelect = useCallback((dayIndex: number) => {
        setSelectedDay(dayIndex)
    }, [])

    const resetView = useCallback(() => {
        setSelectedCity(null)
        setCenterOn(null)

        const params = new URLSearchParams(searchParams.toString())
        params.delete("ville")
        params.delete("lat")
        params.delete("lon")

        // If we are on a path like /cartes/[type]/[CityName], we need to navigate up to /cartes/[type]
        if (pathname.startsWith('/cartes')) {
            const segments = pathname.split('/').filter(Boolean)
            // Expected segments: ['cartes', 'pluie', 'CityName']
            if (segments.length >= 3) {
                const type = segments[1]
                const newPath = `/cartes/${type}`
                router.push(`${newPath}?${params.toString()}`, { scroll: false })
                return
            }
        }

        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }, [router, pathname, searchParams])

    return {
        selectedDay,
        selectedCity,
        centerOn,
        handleSearch,
        handleDaySelect,
        resetView
    }
}
