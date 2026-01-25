// Developed by Omar Rafik (OMX) - omx001@proton.me
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


    const initialDay = parseInt(searchParams.get("jour") || "0")


    const initialCityName = citySlug || sanitizeInput(searchParams.get("ville") || "")

    const latParam = parseFloat(searchParams.get("lat") || "")
    const lonParam = parseFloat(searchParams.get("lon") || "")

    const initialCity = initialCityName
        ? MARTINIQUE_CITIES.find(c => c.name.toLowerCase() === initialCityName.toLowerCase())
        : null

    const [selectedDay, setSelectedDay] = useState(isNaN(initialDay) ? 0 : initialDay)
    const [selectedCity, setSelectedCity] = useState<string | null>(initialCity?.name || null)


    const [centerOn, setCenterOn] = useState<{ lat: number; lon: number } | null>(
        initialCity ? { lat: initialCity.lat, lon: initialCity.lon } :
            (!isNaN(latParam) && !isNaN(lonParam) ? { lat: latParam, lon: lonParam } : null)
    )


    useEffect(() => {

        const params = new URLSearchParams(searchParams.toString())
        const currentJour = params.get("jour")
        const newJour = selectedDay === 0 ? null : selectedDay.toString()

        if (currentJour !== newJour) {
            if (newJour) params.set("jour", newJour)
            else params.delete("jour")

            router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        }
    }, [selectedDay, router, pathname, searchParams])


    useEffect(() => {
        if (!pathname.startsWith('/cartes')) return

        const handlePopState = () => {
            const segments = window.location.pathname.split('/').filter(Boolean)

            const cityFromUrl = segments[2] ? decodeURIComponent(segments[2]) : null

            if (cityFromUrl) {
                const cityData = MARTINIQUE_CITIES.find(c => c.name.toLowerCase() === cityFromUrl.toLowerCase())
                if (cityData) {
                    setSelectedCity(cityData.name)
                    setCenterOn({ lat: cityData.lat, lon: cityData.lon })
                } else {
                    // Try to read lat/lon from URL for generic places
                    const search = new URLSearchParams(window.location.search)
                    const lat = parseFloat(search.get("lat") || "")
                    const lon = parseFloat(search.get("lon") || "")

                    if (!isNaN(lat) && !isNaN(lon)) {
                        setSelectedCity(decodeURIComponent(cityFromUrl))
                        setCenterOn({ lat, lon })
                    } else {
                        setSelectedCity(null)
                        setCenterOn(null)
                    }
                }
            } else {
                setSelectedCity(null)
                setCenterOn(null)
            }
        }

        window.addEventListener('popstate', handlePopState)
        return () => window.removeEventListener('popstate', handlePopState)
    }, [pathname, setSelectedCity, setCenterOn])

    const handleSearch = useCallback((location: { name: string; lat: number; lon: number }) => {
        setCenterOn({ lat: location.lat, lon: location.lon })
        setSelectedCity(location.name)

        const params = new URLSearchParams(searchParams.toString())
        const isKnownCity = MARTINIQUE_CITIES.some(c => c.name.toLowerCase() === location.name.toLowerCase())

        if (isKnownCity) {
            params.delete("lat")
            params.delete("lon")
        } else {
            params.set("lat", location.lat.toString())
            params.set("lon", location.lon.toString())
        }
        if (selectedDay !== 0) params.set("jour", selectedDay.toString())
        const queryString = params.toString() ? `?${params.toString()}` : ""

        if (pathname.startsWith('/cartes')) {

            const segments = pathname.split('/').filter(Boolean)
            const type = segments[1]

            if (type) {
                const newPath = `/cartes/${type}/${encodeURIComponent(location.name)}`
                const fullUrl = `${newPath}${queryString}`


                params.delete("ville")


                window.history.pushState(null, '', fullUrl)
            }
        } else {

            params.set("ville", location.name)
            const fullUrl = `${pathname}?${params.toString()}`




            // Use pushState to avoid 404 errors on some hosting environments or due to router/server mismatches
            // This updates the URL without triggering a Next.js navigation
            window.history.pushState(null, '', fullUrl)
        }
    }, [selectedDay, router, pathname, searchParams, setSelectedCity, setCenterOn])

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


        if (pathname.startsWith('/cartes')) {
            const segments = pathname.split('/').filter(Boolean)

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