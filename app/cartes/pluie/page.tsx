"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MartiniqueMap, MapMarker } from "@/components/MartiniqueMap"
import { MapControls } from "@/components/MapControls"
import { MARTINIQUE_CITIES } from "@/lib/constants"

import { useMapUrlState } from "@/hooks/useMapUrlState"

export default function RainMapPage() {
    const [markers, setMarkers] = useState<MapMarker[]>([])
    const [loading, setLoading] = useState(true)
    const { selectedDay, centerOn, handleSearch, handleDaySelect } = useMapUrlState()
    const [allData, setAllData] = useState<any[]>([])

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                // Build optimized URL for all cities
                const lats = MARTINIQUE_CITIES.map(c => c.lat).join(",")
                const lons = MARTINIQUE_CITIES.map(c => c.lon).join(",")

                // Fetch Precipitation Sum and Probability Max
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&daily=precipitation_sum,precipitation_probability_max&timezone=America/Martinique`)
                const data = await res.json()

                const results = Array.isArray(data) ? data : [data]
                setAllData(results)
            } catch (e) {
                console.error("Error fetching map data", e)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (!allData.length) return

        const newMarkers = MARTINIQUE_CITIES.map((city, index) => {
            const cityData = allData[index]
            if (!cityData || !cityData.daily) return null

            const precip = cityData.daily.precipitation_sum[selectedDay]
            const prob = cityData.daily.precipitation_probability_max[selectedDay]
            const isRaining = precip > 0.1

            return {
                id: city.name,
                lat: city.lat,
                lon: city.lon,
                component: (
                    <div
                        onClick={() => handleSearch(city)}
                        className="flex flex-col items-center group cursor-pointer transition-transform hover:z-50 hover:scale-110"
                    >
                        <div className={`
                            px-3 py-1.5 rounded-full shadow-lg border flex items-center gap-1.5 backdrop-blur-md
                            ${isRaining ? 'bg-blue-500/90 border-blue-400 text-white shadow-blue-500/30' : 'bg-white/90 border-slate-200 text-slate-500'}
                        `}>
                            <svg className={`w-3.5 h-3.5 ${isRaining ? 'text-blue-100' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                    d={isRaining
                                        ? "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z M8 19v2m4-2v2m4-2v2"
                                        : "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"}
                                />
                            </svg>
                            <span className="font-bold text-sm">
                                {precip !== null ? precip : "--"}
                                <span className="text-[10px] font-normal ml-0.5 opacity-80">mm</span>
                            </span>
                        </div>
                        {/* Hover Details */}
                        <div className="absolute top-full mt-2 bg-white/95 backdrop-blur px-3 py-2 rounded-xl shadow-xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none min-w-[120px]">
                            <p className="font-bold text-slate-800 text-xs text-center mb-1">{city.name}</p>
                            <div className="flex justify-between items-center text-[10px] text-slate-500">
                                <span>Probabilité:</span>
                                <span className={`font-bold ${prob > 50 ? 'text-blue-600' : 'text-slate-700'}`}>{prob}%</span>
                            </div>
                        </div>
                    </div>
                )
            }
        }).filter(Boolean) as MapMarker[]

        setMarkers(newMarkers)
    }, [selectedDay, allData, handleSearch])



    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 pt-24 lg:pt-6">
                <div className="mb-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Carte des Précipitations</h1>
                        <p className="text-slate-500">Accumulation de pluie journalière</p>
                    </div>
                    {/* Legend / Info Panel */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center gap-4 text-sm text-blue-900 hidden lg:flex">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z M8 19v2m4-2v2m4-2v2" />
                            </svg>
                            <span className="font-bold">mm</span>
                            <span>Précipitations (Jour)</span>
                        </div>
                    </div>
                </div>

                <MapControls
                    onSearch={handleSearch}
                    onDaySelect={handleDaySelect}
                    selectedDay={selectedDay}
                />

                <div className="h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200 relative">
                    <MartiniqueMap markers={markers} centerOn={centerOn} />
                </div>
            </main>
            <Footer />
        </div>
    )
}
