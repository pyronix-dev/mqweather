"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MartiniqueMap, MapMarker } from "@/components/MartiniqueMap"
import { MapControls } from "@/components/MapControls"
import { MARTINIQUE_CITIES } from "@/lib/constants"
import { useMapUrlState } from "@/hooks/useMapUrlState"
import { getWeatherIcon } from "@/lib/weather-icons"

export default function TemperatureMapPage() {
    const [markers, setMarkers] = useState<MapMarker[]>([])
    const [loading, setLoading] = useState(true)
    const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon'>('afternoon')
    const { selectedDay, centerOn, handleSearch, handleDaySelect } = useMapUrlState()
    const [allData, setAllData] = useState<any[]>([])

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                const lats = MARTINIQUE_CITIES.map(c => c.lat).join(",")
                const lons = MARTINIQUE_CITIES.map(c => c.lon).join(",")
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&hourly=temperature_2m,weather_code&timezone=America/Martinique`)
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
            if (!cityData || !cityData.hourly) return null

            const baseIndex = selectedDay * 24
            const hourOffset = timeOfDay === 'morning' ? 8 : 14
            const dataIndex = baseIndex + hourOffset

            const temp = Math.round(cityData.hourly.temperature_2m[dataIndex])
            const weatherCode = cityData.hourly.weather_code[dataIndex] || 0

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
                            px-2 py-1.5 rounded-xl shadow-lg border border-white/30 backdrop-blur-md flex items-center gap-1.5
                            transition-all duration-300 hover:shadow-xl
                            ${temp >= 30 ? 'bg-gradient-to-br from-red-500/95 to-orange-500/95 text-white shadow-orange-500/30' :
                                temp >= 28 ? 'bg-gradient-to-br from-orange-500/95 to-amber-500/95 text-white shadow-amber-500/30' :
                                    'bg-gradient-to-br from-cyan-500/95 to-blue-500/95 text-white shadow-blue-500/30'}
                        `}>
                            <div className="w-5 h-5 opacity-90 drop-shadow-sm">
                                {getWeatherIcon(weatherCode)}
                            </div>
                            <span className="font-black text-base leading-none tracking-tight drop-shadow-sm">{temp}°</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full mt-2 shadow-md border border-white/50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-1">
                            {city.name}
                        </span>
                    </div>
                )
            }
        }).filter(Boolean) as MapMarker[]

        setMarkers(newMarkers)
    }, [selectedDay, timeOfDay, allData, handleSearch])

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex flex-col">
            <Header />
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
                {/* Hero Header */}
                <div className="mb-8 animate-fade-in-up">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg shadow-orange-500/20">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
                                    Carte des Températures
                                </h1>
                                <p className="text-slate-500 font-medium mt-1">Températures en temps réel sur toute l'île</p>
                            </div>
                        </div>

                        {/* Time Toggle */}
                        <div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl flex items-center shadow-lg border border-white/50">
                            <button
                                onClick={() => setTimeOfDay('morning')}
                                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${timeOfDay === 'morning'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0-5a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1z" />
                                </svg>
                                <span>Matin</span>
                                <span className="text-xs font-medium opacity-80">08h</span>
                            </button>
                            <button
                                onClick={() => setTimeOfDay('afternoon')}
                                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${timeOfDay === 'afternoon'
                                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z" />
                                </svg>
                                <span>Après-midi</span>
                                <span className="text-xs font-medium opacity-80">14h</span>
                            </button>
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

                <div className="h-[650px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 relative mt-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <MartiniqueMap markers={markers} centerOn={centerOn} />

                    {/* Legend */}
                    <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 z-10">
                        <div className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wide">Légende</div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500" />
                                <span className="text-xs text-slate-600">&lt; 28°C</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-orange-500 to-amber-500" />
                                <span className="text-xs text-slate-600">28-30°C</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-500 to-orange-500" />
                                <span className="text-xs text-slate-600">&gt; 30°C</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
