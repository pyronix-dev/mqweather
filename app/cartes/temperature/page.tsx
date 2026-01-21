"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MartiniqueMap, MapMarker } from "@/components/MartiniqueMap"
import { MapControls } from "@/components/MapControls"
import { MARTINIQUE_CITIES } from "@/lib/constants"

import { useMapUrlState } from "@/hooks/useMapUrlState"

export default function TemperatureMapPage() {
    const [markers, setMarkers] = useState<MapMarker[]>([])
    const [loading, setLoading] = useState(true)
    const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon'>('afternoon')
    const { selectedDay, centerOn, handleSearch, handleDaySelect } = useMapUrlState()

    // Store all data: [cityIndex] -> { hourly: { temperature_2m: number[] } }
    const [allData, setAllData] = useState<any[]>([])

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                // Build optimized URL for all cities
                const lats = MARTINIQUE_CITIES.map(c => c.lat).join(",")
                const lons = MARTINIQUE_CITIES.map(c => c.lon).join(",")

                // Fetch hourly temperature
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&hourly=temperature_2m&timezone=America/Martinique`)
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

    // Update markers when selectedDay, timeOfDay or allData changes
    useEffect(() => {
        if (!allData.length) return

        const newMarkers = MARTINIQUE_CITIES.map((city, index) => {
            const cityData = allData[index]
            if (!cityData || !cityData.hourly) return null

            // Calculate index: 24 hours per day. 
            // Morning = 08:00 (index 8), Afternoon = 14:00 (index 14)
            const baseIndex = selectedDay * 24
            const hourOffset = timeOfDay === 'morning' ? 8 : 14
            const dataIndex = baseIndex + hourOffset

            const temp = Math.round(cityData.hourly.temperature_2m[dataIndex])

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
                            px-3 py-1.5 rounded-2xl shadow-lg border border-white/20 backdrop-blur-md flex items-center gap-1.5
                            ${temp >= 30 ? 'bg-gradient-to-br from-red-500/90 to-orange-500/90 text-white shadow-orange-500/20' :
                                temp >= 28 ? 'bg-gradient-to-br from-orange-500/90 to-amber-500/90 text-white shadow-orange-500/20' :
                                    'bg-gradient-to-br from-teal-500/90 to-blue-500/90 text-white shadow-blue-500/20'}
                        `}>
                            <span className="font-bold text-lg leading-none tracking-tight filter drop-shadow-sm">{temp}°</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full mt-1.5 shadow-sm border border-white/40 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                            {city.name}
                        </span>
                    </div>
                )
            }
        }).filter(Boolean) as MapMarker[]

        setMarkers(newMarkers)
    }, [selectedDay, timeOfDay, allData, handleSearch])

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 pt-24 lg:pt-6">
                <div className="mb-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Carte des Températures</h1>
                        <p className="text-slate-500">Moyennes journalières sur toute l'île</p>
                    </div>

                    {/* Time of Day Toggle */}
                    <div className="bg-slate-100 p-1 rounded-xl flex items-center">
                        <button
                            onClick={() => setTimeOfDay('morning')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${timeOfDay === 'morning' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <span className="mr-2">Matin</span>
                            <span className="text-xs font-normal opacity-70">08h</span>
                        </button>
                        <button
                            onClick={() => setTimeOfDay('afternoon')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${timeOfDay === 'afternoon' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <span className="mr-2">Après-midi</span>
                            <span className="text-xs font-normal opacity-70">14h</span>
                        </button>
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
