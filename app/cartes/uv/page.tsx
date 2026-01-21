"use client"

import { useEffect, useState } from "react"
import { MartiniqueMap, MapMarker } from "@/components/MartiniqueMap"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MapControls } from "@/components/MapControls"
import { MARTINIQUE_CITIES } from "@/lib/constants"
import { useMapUrlState } from "@/hooks/useMapUrlState"

interface UVData {
    latitude: number
    longitude: number
    daily: {
        time: string[]
        uv_index_max: number[]
    }
}

// UV Color Scale Helper
const getUVColor = (uv: number) => {
    if (uv >= 11) return "bg-purple-600 text-white" // Extreme
    if (uv >= 8) return "bg-red-500 text-white"     // Very High
    if (uv >= 6) return "bg-orange-500 text-white"  // High
    if (uv >= 3) return "bg-yellow-400 text-slate-900" // Moderate
    return "bg-emerald-500 text-white"              // Low
}

const getUVLabel = (uv: number) => {
    if (uv >= 11) return "Extrême"
    if (uv >= 8) return "Très Élevé"
    if (uv >= 6) return "Élevé"
    if (uv >= 3) return "Modéré"
    return "Faible"
}

export default function UVMapPage() {
    const { selectedDay, centerOn, handleSearch, handleDaySelect } = useMapUrlState()
    const [uvData, setUvData] = useState<Record<string, UVData>>({})
    const [markers, setMarkers] = useState<MapMarker[]>([])
    const [loading, setLoading] = useState(true)

    // Fetch UV data for all cities
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true)
            const data: Record<string, UVData> = {}

            // Build bulk request or parallelize
            // Open-Meteo allows multiple points but let's stick to parallel fetch for simplicity with this small list
            await Promise.all(MARTINIQUE_CITIES.map(async (city) => {
                try {
                    const res = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&daily=uv_index_max&timezone=America/Martinique`
                    )
                    const json = await res.json()
                    data[city.name] = json
                } catch (error) {
                    console.error(`Failed to fetch UV for ${city.name}`, error)
                }
            }))

            setUvData(data)
            setLoading(false)
        }

        fetchAllData()
    }, [])

    // Update markers when day changes or data loads
    useEffect(() => {
        if (loading) return

        const newMarkers: MapMarker[] = MARTINIQUE_CITIES.map((city) => {
            const cityData = uvData[city.name]
            if (!cityData) return null

            const uvIndex = Math.round(cityData.daily.uv_index_max[selectedDay] || 0)
            const colorClass = getUVColor(uvIndex)

            return {
                id: city.name,
                lat: city.lat,
                lon: city.lon,
                component: (
                    <div
                        onClick={() => handleSearch(city)}
                        className="group relative cursor-pointer transform hover:scale-110 transition-transform"
                    >
                        {/* Marker Circle */}
                        <div className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center border-2 border-white ${colorClass}`}>
                            <span className="font-bold text-sm">{uvIndex}</span>
                        </div>

                        {/* Tooltip */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                            <div className="font-bold mb-0.5">{city.name}</div>
                            <div className="flex items-center gap-1">
                                <span className="opacity-80">Indice UV:</span>
                                <span className="font-bold">{uvIndex}</span>
                            </div>
                            <div className="text-slate-300 mt-1">{getUVLabel(uvIndex)}</div>
                        </div>
                    </div>
                )
            }
        }).filter(Boolean) as MapMarker[]

        setMarkers(newMarkers)
    }, [selectedDay, uvData, loading, handleSearch])

    return (
        <div className="min-h-screen bg-stone-100 flex flex-col">
            <Header />

            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col gap-6 h-[calc(100vh-12rem)] min-h-[600px]">
                    {/* Header & Controls */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                                <span className="p-2 bg-amber-100 rounded-xl text-amber-600">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7a5 5 0 110 10 5 5 0 010-10z" />
                                    </svg>
                                </span>
                                Carte UV
                            </h1>
                            <p className="text-slate-500 font-medium mt-1">Indice UV maximum prévu</p>
                        </div>

                        <MapControls
                            onDaySelect={handleDaySelect}
                            selectedDay={selectedDay}
                            selectedCity={null}
                            onCitySelect={() => { }}
                        />
                    </div>

                    {/* Map Container */}
                    <div className="group relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                        <MartiniqueMap
                            markers={markers}
                            centerOn={centerOn}
                        />

                        {/* Legend */}
                        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur p-4 rounded-2xl border border-slate-200 shadow-lg max-w-[160px] md:max-w-xs z-10 text-xs md:text-sm">
                            <div className="font-bold text-slate-800 mb-2">Indices UV</div>
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 border border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-white">1-2</div>
                                    <span className="text-slate-600">Faible</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-yellow-400 border border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-slate-900">3-5</div>
                                    <span className="text-slate-600">Modéré</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-orange-500 border border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-white">6-7</div>
                                    <span className="text-slate-600">Élevé</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-red-500 border border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-white">8-10</div>
                                    <span className="text-slate-600">Très Élevé</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-purple-600 border border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-white">11+</div>
                                    <span className="text-slate-600">Extrême</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
