"use client"

import { useEffect, useState } from "react"
import { MartiniqueMap, MapMarker } from "@/components/MartiniqueMap"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MapControls } from "@/components/MapControls"
import { MARTINIQUE_CITIES } from "@/lib/constants"
import { useMapUrlState } from "@/hooks/useMapUrlState"

const getUVColor = (uv: number) => {
    if (uv >= 11) return "bg-gradient-to-br from-violet-600 to-purple-700 text-white shadow-violet-500/40"
    if (uv >= 8) return "bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-rose-500/40"
    if (uv >= 6) return "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-500/40"
    if (uv >= 3) return "bg-gradient-to-br from-lime-400 to-green-500 text-white shadow-lime-500/40"
    return "bg-gradient-to-br from-sky-400 to-cyan-500 text-white shadow-sky-500/40"
}

const getUVLabel = (uv: number) => {
    if (uv >= 11) return "Extrême"
    if (uv >= 8) return "Très Élevé"
    if (uv >= 6) return "Élevé"
    if (uv >= 3) return "Modéré"
    return "Faible"
}

export default function UVMapPage() {
    const { selectedDay, selectedCity, centerOn, handleSearch, handleDaySelect, resetView } = useMapUrlState()
    const [allData, setAllData] = useState<any[]>([])
    const [markers, setMarkers] = useState<MapMarker[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                const lats = MARTINIQUE_CITIES.map(c => c.lat).join(",")
                const lons = MARTINIQUE_CITIES.map(c => c.lon).join(",")
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&daily=uv_index_max&timezone=America/Martinique`)
                const data = await res.json()
                const results = Array.isArray(data) ? data : [data]
                setAllData(results)
            } catch (e) {
                console.error("Error fetching UV data", e)
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

        const newMarkers: MapMarker[] = visibleCities.map((city) => {
            const originalIndex = MARTINIQUE_CITIES.findIndex(c => c.name === city.name)
            const cityData = allData[originalIndex]
            if (!cityData || !cityData.daily) return null

            const uvIndex = Math.round(cityData.daily.uv_index_max[selectedDay] || 0)
            const colorClass = getUVColor(uvIndex)

            return {
                id: city.name,
                lat: city.lat,
                lon: city.lon,
                component: (
                    <div
                        onClick={() => handleSearch(city)}
                        className="group relative cursor-pointer transition-all duration-300 hover:scale-110 hover:z-[100] animate-fade-in-up"
                    >
                        {/* Tooltip - positioned ABOVE the marker */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-3 bg-white/95 backdrop-blur-md text-slate-800 rounded-xl shadow-xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-[200] pointer-events-none transform group-hover:translate-y-0 -translate-y-1">
                            <div className="font-black text-sm mb-1">{city.name}</div>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="text-slate-500">Indice UV:</span>
                                <span className="font-black">{uvIndex}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getUVColor(uvIndex)}`}>
                                    {getUVLabel(uvIndex)}
                                </span>
                            </div>
                        </div>

                        <div className={`w-7 h-7 rounded-full shadow-lg flex items-center justify-center border-2 border-white/70 ${colorClass} transition-all duration-300 hover:shadow-xl`}>
                            <span className="font-black text-xs">{uvIndex}</span>
                        </div>
                    </div>
                )
            }
        }).filter(Boolean) as MapMarker[]

        setMarkers(newMarkers)
    }, [selectedDay, allData, handleSearch, selectedCity])

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <main className="flex-1 w-full px-4 sm:px-6 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch my-6">
                    {/* Map Section */}
                    <div className="relative w-full h-auto min-h-[500px] sm:min-h-[600px] lg:min-h-[650px] animate-fade-in-up">
                        <div className="absolute inset-0 bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col">
                            <div className="p-4 sm:p-6 border-b border-slate-200 flex-shrink-0">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Carte UV</h2>
                                        <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                                            Indice UV maximum prévu
                                        </p>
                                    </div>
                                    <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg shadow-amber-500/20 text-white">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 relative overflow-hidden">
                                <MartiniqueMap markers={markers} centerOn={centerOn} onReset={resetView} />

                                {/* Legend */}
                                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 z-10">
                                    <div className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wide">Indices UV</div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 border-2 border-white shadow-sm flex items-center justify-center text-[9px] font-black text-white">1-2</div>
                                            <span className="text-xs text-slate-600 font-medium">Faible</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-lime-400 to-green-500 border-2 border-white shadow-sm flex items-center justify-center text-[9px] font-black text-white">3-5</div>
                                            <span className="text-xs text-slate-600 font-medium">Modéré</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white shadow-sm flex items-center justify-center text-[9px] font-black text-white">6-7</div>
                                            <span className="text-xs text-slate-600 font-medium">Élevé</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-500 to-red-600 border-2 border-white shadow-sm flex items-center justify-center text-[9px] font-black text-white">8-10</div>
                                            <span className="text-xs text-slate-600 font-medium">Très Élevé</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 border-2 border-white shadow-sm flex items-center justify-center text-[9px] font-black text-white">11+</div>
                                            <span className="text-xs text-slate-600 font-medium">Extrême</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Section */}
                    <div className="w-full space-y-4 sm:space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        {/* Controls Card */}
                        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-2">Contrôles</h3>
                                <p className="text-sm text-slate-500">Sélectionnez le jour</p>
                            </div>

                            <MapControls
                                onDaySelect={handleDaySelect}
                                selectedDay={selectedDay}
                                selectedCity={null}
                                onCitySelect={() => { }}
                                onSearch={handleSearch}
                            />
                        </div>

                        {/* Info Card */}
                        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="text-amber-500">
                                    <i className="bi bi-info-circle text-xl"></i>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">À propos des UV</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-full shadow-sm">
                                        <i className="bi bi-sun-fill text-amber-500"></i>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-amber-700 uppercase">Protection</p>
                                        <p className="text-sm text-slate-700">Crème solaire recommandée dès l'indice 3.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Moyenne Max</p>
                                        <p className="text-lg font-black text-slate-800">11+</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Heures Critiques</p>
                                        <p className="text-lg font-black text-slate-800">10h - 15h</p>
                                    </div>
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
