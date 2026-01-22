"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MartiniqueMap, MapMarker } from "@/components/MartiniqueMap"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MapControls } from "@/components/MapControls"
import { BEACH_LOCATIONS } from "@/lib/constants"
import { useMapUrlState } from "@/hooks/useMapUrlState"
import { getWeatherIcon } from "@/lib/weather-icons"
import { getSlugFromIndex } from "@/lib/utils"

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
            sea_surface_temperature_max: number[]
            wave_height_max: number[]
        }
    }
}

export default function BeachMapPage() {
    const { selectedDay, centerOn, handleSearch, handleDaySelect, resetView } = useMapUrlState()
    const [beachData, setBeachData] = useState<Record<string, BeachData>>({})
    const [markers, setMarkers] = useState<MapMarker[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true)
            const data: Record<string, BeachData> = {}

            await Promise.all(BEACH_LOCATIONS.map(async (beach) => {
                try {
                    const [weatherRes, marineRes] = await Promise.all([
                        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${beach.lat}&longitude=${beach.lon}&daily=weather_code,uv_index_max&timezone=America/Martinique`),
                        fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${beach.lat}&longitude=${beach.lon}&daily=sea_surface_temperature_max,wave_height_max&timezone=America/Martinique`)
                    ])
                    const weatherJson = await weatherRes.json()
                    const marineJson = await marineRes.json()
                    data[beach.name] = { weather: weatherJson, marine: marineJson }
                } catch (error) {
                    console.error(`Failed to fetch data for ${beach.name}`, error)
                }
            }))

            setBeachData(data)
            setLoading(false)
        }
        fetchAllData()
    }, [])

    useEffect(() => {
        if (loading) return

        const newMarkers: MapMarker[] = BEACH_LOCATIONS.map((beach) => {
            const data = beachData[beach.name]
            if (!data || !data.weather.daily || !data.marine.daily) return null

            const weatherCode = data.weather.daily.weather_code[selectedDay] || 0
            const uvIndex = Math.round(data.weather.daily.uv_index_max[selectedDay] || 0)
            const seaTemp = Math.round(data.marine.daily.sea_surface_temperature_max[selectedDay] || 28)
            const waveHeight = (data.marine.daily.wave_height_max[selectedDay] || 0).toFixed(1)

            const icon = getWeatherIcon(weatherCode)

            return {
                id: beach.name,
                lat: beach.lat,
                lon: beach.lon,
                component: (
                    <Link
                        key={beach.name}
                        href={`/previsions/${getSlugFromIndex(selectedDay)}/plage?city=${encodeURIComponent(beach.city)}&lat=${beach.lat}&lon=${beach.lon}`}
                        className="group relative cursor-pointer transition-all duration-300 hover:scale-105 z-10 hover:z-50 animate-fade-in-up"
                    >
                        {/* Beach Card Marker */}
                        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-200/50 p-2 flex flex-col items-center gap-1.5 min-w-[70px] transition-all duration-300 hover:shadow-2xl hover:border-amber-200">
                            {/* Weather Icon */}
                            <div className="text-2xl drop-shadow-sm">
                                {icon}
                            </div>

                            {/* Stats Row */}
                            <div className="flex items-center gap-2 w-full justify-center border-t border-slate-100 pt-1.5">
                                {/* Water Temp */}
                                <div className="flex items-center gap-0.5 text-blue-500" title="Température de l'eau">
                                    <i className="bi bi-thermometer-high text-xs"></i>
                                    <span className="text-[10px] font-black">{seaTemp}°</span>
                                </div>

                                {/* UV */}
                                <div className={`flex items-center gap-0.5 px-1 py-0 rounded-full ${uvIndex >= 6 ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`} title="Indice UV">
                                    <i className="bi bi-sun-fill text-xs"></i>
                                    <span className="text-[10px] font-black">{uvIndex}</span>
                                </div>
                            </div>
                        </div>

                        {/* Name Label */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-slate-800/95 backdrop-blur-sm text-white text-xs font-bold rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-1 shadow-lg">
                            {beach.name}
                        </div>
                    </Link>
                )
            }
        }).filter(Boolean) as MapMarker[]

        setMarkers(newMarkers)
    }, [selectedDay, beachData, loading, handleSearch])

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
                                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Météo des Plages</h2>
                                        <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                                            Température de l'eau, UV et conditions
                                        </p>
                                    </div>
                                    <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl shadow-lg shadow-cyan-500/20 text-white">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="-5.0 -10.0 110.0 120.0">
                                            <path d="m31.473 44.984c0 4.6523-3.7734 8.4258-8.4258 8.4258-4.6562 0-8.4297-3.7734-8.4297-8.4258 0-4.6562 3.7734-8.4258 8.4297-8.4258 4.6523 0 8.4258 3.7695 8.4258 8.4258z" />
                                            <path d="m23.047 56.145c-1.3086 0-2.3711 1.0625-2.3711 2.3711v4.6406c0 1.3086 1.0625 2.3711 2.3711 2.3711s2.3711-1.0625 2.3711-2.3711v-4.6406c0-1.3086-1.0625-2.3711-2.3711-2.3711z" />
                                            <path d="m11.801 52.879-3.2812 3.2812c-0.92578 0.92578-0.92578 2.4258 0 3.3555 0.46484 0.46484 1.0703 0.69531 1.6758 0.69531 0.60938 0 1.2148-0.23047 1.6758-0.69531l3.2812-3.2812c0.92578-0.92578 0.92578-2.4258 0-3.3555-0.92578-0.92578-2.4258-0.92969-3.3555 0z" />
                                            <path d="m11.887 44.984c0-1.3086-1.0625-2.3711-2.3711-2.3711h-4.6406c-1.3086 0-2.3711 1.0625-2.3711 2.3711 0 1.3125 1.0625 2.3711 2.3711 2.3711h4.6406c1.3086 0 2.3711-1.0625 2.3711-2.3711z" />
                                            <path d="m11.801 37.094c0.46484 0.46484 1.0703 0.69141 1.6758 0.69141 0.60938 0 1.2148-0.23047 1.6758-0.69531 0.92578-0.92578 0.92578-2.4258 0-3.3516l-3.2812-3.2812c-0.92578-0.92578-2.4258-0.92578-3.3555 0-0.92578 0.92578-0.92578 2.4258 0 3.3555l3.2812 3.2812z" />
                                            <path d="m23.047 33.824c1.3086 0 2.3711-1.0625 2.3711-2.3711v-4.6406c0-1.3086-1.0625-2.3711-2.3711-2.3711s-2.3711 1.0625-2.3711 2.3711v4.6406c0 1.3086 1.0625 2.3711 2.3711 2.3711z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 relative overflow-hidden">
                                <MartiniqueMap markers={markers} centerOn={centerOn} onReset={resetView} />

                                {/* Legend */}
                                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 z-10">
                                    <div className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wide">Conditions</div>
                                    <div className="flex flex-col gap-2.5">
                                        <div className="flex items-center gap-2">
                                            <i className="bi bi-thermometer-high text-blue-500"></i>
                                            <span className="text-xs text-slate-600">Temp. de l'eau</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <i className="bi bi-sun-fill text-amber-500"></i>
                                            <span className="text-xs text-slate-600">Indice UV</span>
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
                                <div className="text-cyan-500">
                                    <i className="bi bi-info-circle text-xl"></i>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">Infos Plages</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-100 flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-full shadow-sm">
                                        <i className="bi bi-water text-cyan-500"></i>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-cyan-700 uppercase">Qualité</p>
                                        <p className="text-sm text-slate-700">Excellente sur la majorité des sites.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Temp. Eau Moy.</p>
                                        <p className="text-lg font-black text-slate-800">28°C</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Vague Max</p>
                                        <p className="text-lg font-black text-slate-800">1.2m</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Beach List Section */}
                <div className="mt-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                        <span className="p-2 bg-cyan-100 rounded-xl text-cyan-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                        </span>
                        Explorez les Plages
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {BEACH_LOCATIONS.map((beach, index) => {
                            const data = beachData[beach.name]
                            if (!data || !data.weather?.daily) return null

                            const weatherCode = data.weather.daily.weather_code?.[selectedDay] || 0
                            const uvIndex = Math.round(data.weather.daily.uv_index_max?.[selectedDay] || 0)
                            const seaTemp = Math.round(data.marine?.daily?.sea_surface_temperature_max?.[selectedDay] || 28)
                            const waveHeight = (data.marine?.daily?.wave_height_max?.[selectedDay] || 0.5).toFixed(1)

                            return (
                                <Link
                                    key={beach.name}
                                    href={`/previsions/${getSlugFromIndex(selectedDay)}/plage?city=${encodeURIComponent(beach.city)}&lat=${beach.lat}&lon=${beach.lon}`}
                                    className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 flex items-center justify-between hover:border-cyan-200 group animate-fade-in-up"
                                    style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <span className="text-3xl">
                                                {getWeatherIcon(weatherCode)}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="font-black text-slate-800">{beach.name}</div>
                                            <div className="text-xs text-slate-500 font-medium">{beach.city}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-5 text-sm font-medium">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] text-slate-400 uppercase">Eau</span>
                                            <span className="text-blue-600 font-black text-lg flex items-center gap-1">
                                                <i className="bi bi-thermometer-high"></i>
                                                {seaTemp}°
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] text-slate-400 uppercase">Vagues</span>
                                            <span className="text-slate-700 font-black">{waveHeight}m</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] text-slate-400 uppercase">UV</span>
                                            <span className={`font-black ${uvIndex >= 6 ? 'text-orange-500' : 'text-emerald-500'}`}>{uvIndex}</span>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
