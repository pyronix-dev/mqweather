"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MartiniqueMap, MapMarker } from "@/components/MartiniqueMap"
import { MapControls } from "@/components/MapControls"
import { MARTINIQUE_CITIES } from "@/lib/constants"

import { useMapUrlState } from "@/hooks/useMapUrlState"

export default function WindMapPage() {
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

                // Fetch Wind Speed, Direction and Gusts
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&daily=wind_speed_10m_max,wind_direction_10m_dominant,wind_gusts_10m_max&timezone=America/Martinique`)
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

            const speed = Math.round(cityData.daily.wind_speed_10m_max[selectedDay])
            const direction = cityData.daily.wind_direction_10m_dominant[selectedDay]
            const gusts = Math.round(cityData.daily.wind_gusts_10m_max[selectedDay])

            return {
                id: city.name,
                lat: city.lat,
                lon: city.lon,
                component: (
                    <div
                        onClick={() => handleSearch(city)}
                        className="flex flex-col items-center group cursor-pointer transition-transform hover:z-50 hover:scale-110"
                    >
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-teal-200 flex items-center gap-1.5 hover:bg-teal-50 transition-colors">
                            <svg
                                className="w-3.5 h-3.5 text-teal-600 font-bold"
                                style={{ transform: `rotate(${direction}deg)` }}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                            </svg>
                            <span className={`font-bold text-teal-800 text-sm`}>
                                {speed}
                                <span className="text-[10px] font-normal text-teal-600 ml-0.5">km/h</span>
                            </span>
                        </div>
                        {/* Hover Details */}
                        <div className="absolute top-full mt-2 bg-white/95 backdrop-blur px-3 py-2 rounded-xl shadow-xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none min-w-[120px]">
                            <p className="font-bold text-slate-800 text-xs text-center mb-1">{city.name}</p>
                            <div className="flex justify-between items-center text-[10px] text-slate-500">
                                <span>Rafales:</span>
                                <span className="font-bold text-slate-700">{gusts} km/h</span>
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
                        <h1 className="text-3xl font-bold text-slate-800">Carte des Vents</h1>
                        <p className="text-slate-500">Vitesse et direction du vent en Martinique</p>
                    </div>
                    {/* Legend / Info Panel */}
                    <div className="bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 flex items-center gap-4 text-sm text-teal-900 hidden lg:flex">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                            </svg>
                            <span>Direction</span>
                        </div>
                        <div className="w-px h-4 bg-teal-200"></div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold">km/h</span>
                            <span>Vitesse Moy.</span>
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
