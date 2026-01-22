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
    const { selectedDay, selectedCity, centerOn, handleSearch, handleDaySelect, resetView } = useMapUrlState()
    const [allData, setAllData] = useState<any[]>([])

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                const lats = MARTINIQUE_CITIES.map(c => c.lat).join(",")
                const lons = MARTINIQUE_CITIES.map(c => c.lon).join(",")
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

        // Filter to show only default cities + the currently selected/searched city
        const visibleCities = MARTINIQUE_CITIES.filter((city) =>
            city.isDefault || city.name === selectedCity
        )

        const newMarkers = visibleCities.map((city) => {
            const originalIndex = MARTINIQUE_CITIES.findIndex(c => c.name === city.name)
            const cityData = allData[originalIndex]
            if (!cityData || !cityData.daily) return null

            const precip = cityData.daily.precipitation_sum[selectedDay]
            const prob = cityData.daily.precipitation_probability_max[selectedDay]
            const isRaining = precip > 0.1
            const isHeavy = precip > 10

            return {
                id: city.name,
                lat: city.lat,
                lon: city.lon,
                component: (
                    <div
                        onClick={() => handleSearch(city)}
                        className="flex flex-col items-center group cursor-pointer transition-all duration-300 hover:z-50 hover:scale-110 animate-fade-in-up"
                    >
                        <div className={`
                            px-2 py-1.5 rounded-xl shadow-lg border backdrop-blur-md flex items-center gap-1.5
                            transition-all duration-300 hover:shadow-xl
                            ${isHeavy ? 'bg-gradient-to-br from-blue-600/95 to-indigo-600/95 border-blue-400/50 text-white shadow-blue-500/30' :
                                isRaining ? 'bg-gradient-to-br from-blue-500/95 to-cyan-500/95 border-blue-400/50 text-white shadow-blue-500/30' :
                                    'bg-white/95 border-slate-200/80 text-slate-500 shadow-slate-200/50'}
                        `}>
                            <i className={`bi ${isHeavy ? 'bi-cloud-rain-heavy-fill' : isRaining ? 'bi-cloud-drizzle-fill' : 'bi-cloud-fill'} ${isRaining ? 'text-white' : 'text-slate-400'} text-lg`}></i>
                            <span className="font-black text-xs leading-none">
                                {precip !== null ? precip.toFixed(1) : "--"}
                                <span className="text-[9px] font-medium opacity-80 ml-0.5">mm</span>
                            </span>
                        </div>
                        {/* Hover Details */}
                        <div className="absolute top-full mt-2 bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 pointer-events-none min-w-[140px] transform group-hover:translate-y-0 translate-y-1">
                            <p className="font-black text-slate-800 text-sm text-center mb-2">{city.name}</p>
                            <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-100 pt-2">
                                <span>Probabilité</span>
                                <span className={`font-black ${prob > 70 ? 'text-blue-600' : prob > 40 ? 'text-cyan-600' : 'text-slate-600'}`}>{prob}%</span>
                            </div>
                        </div>
                    </div>
                )
            }
        }).filter(Boolean) as MapMarker[]

        setMarkers(newMarkers)
    }, [selectedDay, allData, handleSearch, selectedCity])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50 flex flex-col">
            <Header />
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
                {/* Hero Header */}
                <div className="mb-8 animate-fade-in-up">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl shadow-lg shadow-blue-500/20">
                                <i className="bi bi-cloud-drizzle-fill text-white text-3xl"></i>
                            </div>
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
                                    Carte des Précipitations
                                </h1>
                                <p className="text-slate-500 font-medium mt-1">Accumulation de pluie journalière</p>
                            </div>
                        </div>

                        {/* Legend Info */}
                        <div className="bg-white/80 backdrop-blur-sm px-5 py-3 rounded-2xl flex items-center gap-6 shadow-lg border border-white/50">
                            <div className="flex items-center gap-2">
                                <i className="bi bi-cloud-drizzle-fill text-blue-500 text-lg"></i>
                                <span className="font-black text-blue-600">mm</span>
                                <span className="text-sm text-slate-600 font-medium">Précipitations</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <MapControls
                        onSearch={handleSearch}
                        onDaySelect={handleDaySelect}
                        selectedDay={selectedDay}
                    />
                </div>

                <div className="h-[800px] md:h-[650px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 relative mt-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <MartiniqueMap markers={markers} centerOn={centerOn} onReset={resetView} />

                    {/* Legend */}
                    <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 z-10">
                        <div className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wide">Intensité</div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-white border-2 border-slate-300" />
                                <span className="text-xs text-slate-600">Pas de pluie</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500" />
                                <span className="text-xs text-slate-600">0.1-10 mm (Légère)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600" />
                                <span className="text-xs text-slate-600">&gt; 10 mm (Forte)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
