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
        <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch my-6">
                    {/* Map Section */}
                    <div className="relative w-full h-auto min-h-[500px] sm:min-h-[600px] lg:min-h-[650px] animate-fade-in-up">
                        <div className="absolute inset-0 bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col">
                            <div className="p-4 sm:p-6 border-b border-slate-200 flex-shrink-0">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Carte des Précipitations</h2>
                                        <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                                            Accumulation de pluie journalière
                                        </p>
                                    </div>
                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/20 text-white">
                                        <i className="bi bi-cloud-drizzle-fill text-xl"></i>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 relative overflow-hidden">
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
                                onSearch={handleSearch}
                                onDaySelect={handleDaySelect}
                                selectedDay={selectedDay}
                            />
                        </div>

                        {/* Info Card */}
                        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="text-blue-500">
                                    <i className="bi bi-info-circle text-xl"></i>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">À propos de la pluie</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-full shadow-sm">
                                        <i className="bi bi-cloud-rain-fill text-blue-600"></i>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-blue-700 uppercase">Données</p>
                                        <p className="text-sm text-slate-700">Accumulation totale prévue sur 24h.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Moyenne Mensuelle</p>
                                        <p className="text-lg font-black text-slate-800">150 mm</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Max 24h</p>
                                        <p className="text-lg font-black text-slate-800">80 mm</p>
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
