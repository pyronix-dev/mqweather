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
    const { selectedDay, selectedCity, centerOn, handleSearch, handleDaySelect, resetView } = useMapUrlState()
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

        // Filter to show only default cities + the currently selected/searched city
        const visibleCities = MARTINIQUE_CITIES.filter((city, index) =>
            city.isDefault || city.name === selectedCity
        )

        const newMarkers = visibleCities.map((city) => {
            // Find the original index in MARTINIQUE_CITIES for data lookup
            const originalIndex = MARTINIQUE_CITIES.findIndex(c => c.name === city.name)
            const cityData = allData[originalIndex]
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
                            px-3 py-2 rounded-2xl shadow-lg border border-white/50 backdrop-blur-md flex items-center gap-2
                            transition-all duration-300 hover:scale-110 hover:shadow-xl
                            bg-white/90
                        `}>
                            <span className="text-2xl drop-shadow-sm filter">
                                {/* Use generic getWeatherIcon which now returns styled icon or use WeatherIcon directly if imported */}
                                {getWeatherIcon(weatherCode)}
                            </span>
                            <span className="font-black text-lg leading-none tracking-tight text-slate-800">{temp}°</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full mt-2 shadow-md border border-white/50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-1">
                            {city.name}
                        </span>
                    </div>
                )
            }
        }).filter(Boolean) as MapMarker[]

        setMarkers(newMarkers)
    }, [selectedDay, timeOfDay, allData, handleSearch, selectedCity])

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
                {/* Hero Header */}
                <div className="mb-8 animate-fade-in-up">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg shadow-orange-500/20">
                                <i className="bi bi-thermometer-sun text-white text-3xl"></i>
                            </div>
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
                                    Carte des Températures
                                </h1>
                                <p className="text-slate-500 font-medium mt-1">Températures en temps réel sur toute l'île</p>
                            </div>
                        </div>

                        {/* Header content only - toggle moved below */}
                    </div>
                </div>

                <div className="flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <MapControls
                        onSearch={handleSearch}
                        onDaySelect={handleDaySelect}
                        selectedDay={selectedDay}
                    />

                    {/* Time Toggle - Positioned above map */}
                    <div className="flex justify-center mb-2">
                        <div className="bg-white/90 backdrop-blur-sm p-1 rounded-xl flex items-center shadow-sm border border-slate-200">
                            <button
                                onClick={() => setTimeOfDay('morning')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${timeOfDay === 'morning'
                                    ? 'bg-amber-100 text-amber-700 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                            >
                                <span>Matin</span>
                            </button>
                            <button
                                onClick={() => setTimeOfDay('afternoon')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${timeOfDay === 'afternoon'
                                    ? 'bg-orange-100 text-orange-700 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                            >
                                <span>Après-midi</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="h-[800px] md:h-[650px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 relative mt-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <MartiniqueMap markers={markers} centerOn={centerOn} onReset={resetView} />

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
