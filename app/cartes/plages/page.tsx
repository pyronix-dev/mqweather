"use client"

import { useEffect, useState } from "react"
import { MartiniqueMap, MapMarker } from "@/components/MartiniqueMap"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MapControls } from "@/components/MapControls"
import { BEACH_LOCATIONS } from "@/lib/constants"
import { useMapUrlState } from "@/hooks/useMapUrlState"
import { getWeatherIcon } from "@/lib/weather-icons"

interface BeachData {
    weather: {
        daily: {
            time: string[]
            weather_code: number[]
            uv_index_max: number[]
        }
    }
    marine: {
        daily: {
            time: string[]
            sea_surface_temperature_max: number[] // or mean
            wave_height_max: number[]
        }
    }
}

export default function BeachMapPage() {
    const { selectedDay, centerOn, handleSearch, handleDaySelect } = useMapUrlState()
    const [beachData, setBeachData] = useState<Record<string, BeachData>>({})
    const [markers, setMarkers] = useState<MapMarker[]>([])
    const [loading, setLoading] = useState(true)

    // Fetch data for all beaches
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true)
            const data: Record<string, BeachData> = {}

            await Promise.all(BEACH_LOCATIONS.map(async (beach) => {
                try {
                    // Parallel fetch for Weather and Marine data
                    const [weatherRes, marineRes] = await Promise.all([
                        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${beach.lat}&longitude=${beach.lon}&daily=weather_code,uv_index_max&timezone=America/Martinique`),
                        fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${beach.lat}&longitude=${beach.lon}&daily=sea_surface_temperature_max,wave_height_max&timezone=America/Martinique`)
                    ])

                    const weatherJson = await weatherRes.json()
                    const marineJson = await marineRes.json()

                    data[beach.name] = {
                        weather: weatherJson,
                        marine: marineJson
                    }
                } catch (error) {
                    console.error(`Failed to fetch data for ${beach.name}`, error)
                }
            }))

            setBeachData(data)
            setLoading(false)
        }

        fetchAllData()
    }, [])

    // Update markers
    useEffect(() => {
        if (loading) return

        const newMarkers: MapMarker[] = BEACH_LOCATIONS.map((beach) => {
            const data = beachData[beach.name]
            if (!data || !data.weather.daily || !data.marine.daily) return null

            const weatherCode = data.weather.daily.weather_code[selectedDay] || 0
            const uvIndex = Math.round(data.weather.daily.uv_index_max[selectedDay] || 0)
            const seaTemp = Math.round(data.marine.daily.sea_surface_temperature_max[selectedDay] || 28) // fallback
            const waveHeight = (data.marine.daily.wave_height_max[selectedDay] || 0).toFixed(1)

            const icon = getWeatherIcon(weatherCode)

            return {
                id: beach.name,
                lat: beach.lat,
                lon: beach.lon,
                component: (
                    <div
                        onClick={() => handleSearch(beach)}
                        className="group relative cursor-pointer transform hover:scale-105 transition-transform z-10 hover:z-50"
                    >
                        {/* Beach Card Marker */}
                        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-blue-100 p-2 flex flex-col items-center gap-1 min-w-[80px]">
                            {/* Weather Icon */}
                            <div className="w-8 h-8 text-amber-500">
                                {icon}
                            </div>

                            {/* Stats Row */}
                            <div className="flex items-center gap-2 w-full justify-center border-t border-slate-100 pt-1 mt-0.5">
                                {/* Water Temp */}
                                <div className="flex items-center gap-0.5 text-blue-500" title="Température de l'eau">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                                    <span className="text-[10px] font-bold">{seaTemp}°</span>
                                </div>

                                {/* UV */}
                                <div className={`flex items-center gap-0.5 px-1 rounded ${uvIndex >= 6 ? 'text-orange-500' : 'text-emerald-500'}`} title="Indice UV">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
                                    <span className="text-[10px] font-bold">{uvIndex}</span>
                                </div>
                            </div>
                        </div>

                        {/* Name Label */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2 py-0.5 bg-slate-800/90 text-white text-[10px] font-bold rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                            {beach.name}
                        </div>
                    </div>
                )
            }
        }).filter(Boolean) as MapMarker[]

        setMarkers(newMarkers)
    }, [selectedDay, beachData, loading, handleSearch])

    return (
        <div className="min-h-screen bg-stone-100 flex flex-col">
            <Header />

            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col gap-6 h-[calc(100vh-12rem)] min-h-[600px]">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                                <span className="p-2 bg-blue-100 rounded-xl text-blue-600">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 22v-9.5m0 0a9.5 9.5 0 01-9.5-9.5h19a9.5 9.5 0 01-9.5 9.5z" />
                                    </svg>
                                </span>
                                Météo des Plages
                            </h1>
                            <p className="text-slate-500 font-medium mt-1">Température de l'eau, UV et conditions</p>
                        </div>

                        <MapControls
                            onDaySelect={handleDaySelect}
                            selectedDay={selectedDay}
                            selectedCity={null}
                            onCitySelect={() => { }}
                        />
                    </div>

                    {/* Map */}
                    <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 relative">
                        <MartiniqueMap
                            markers={markers}
                            centerOn={centerOn}
                        />
                    </div>
                </div>

                {/* Beach List Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
                        <span>📋</span> Explorez les Plages
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {BEACH_LOCATIONS.map(beach => {
                            const data = beachData[beach.name]
                            if (!data) return null

                            const weatherCode = data.weather.daily.weather_code[selectedDay] || 0
                            const uvIndex = Math.round(data.weather.daily.uv_index_max[selectedDay] || 0)
                            const seaTemp = Math.round(data.marine.daily.sea_surface_temperature_max[selectedDay] || 28)
                            const waveHeight = (data.marine.daily.wave_height_max[selectedDay] || 0.5).toFixed(1)
                            const icon = getWeatherIcon(weatherCode)

                            return (
                                <div key={beach.name} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">
                                            {icon}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800">{beach.name}</div>
                                            <div className="text-xs text-slate-500 font-medium">{beach.city}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm font-medium">
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs text-slate-400">Eau</span>
                                            <span className="text-blue-600 font-bold">{seaTemp}°</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs text-slate-400">Vagues</span>
                                            <span className="text-slate-700 font-bold">{waveHeight}m</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs text-slate-400">UV</span>
                                            <span className={`${uvIndex >= 6 ? 'text-orange-500' : 'text-emerald-500'} font-bold`}>{uvIndex}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
