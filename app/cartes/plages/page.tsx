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
                    <div
                        onClick={() => handleSearch(beach)}
                        className="group relative cursor-pointer transition-all duration-300 hover:scale-105 z-10 hover:z-50 animate-fade-in-up"
                    >
                        {/* Beach Card Marker */}
                        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-200/50 p-2 flex flex-col items-center gap-1.5 min-w-[70px] transition-all duration-300 hover:shadow-2xl hover:border-amber-200">
                            {/* Weather Icon */}
                            <div className="w-7 h-7 drop-shadow-sm">
                                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="5" fill="#FBBF24" />
                                    <g stroke="#FBBF24" strokeWidth="2" strokeLinecap="round">
                                        <line x1="12" y1="1" x2="12" y2="3" />
                                        <line x1="12" y1="21" x2="12" y2="23" />
                                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                        <line x1="1" y1="12" x2="3" y2="12" />
                                        <line x1="21" y1="12" x2="23" y2="12" />
                                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                    </g>
                                </svg>
                            </div>

                            {/* Stats Row */}
                            <div className="flex items-center gap-2 w-full justify-center border-t border-slate-100 pt-1.5">
                                {/* Water Temp */}
                                <div className="flex items-center gap-0.5 text-blue-500" title="Température de l'eau">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                    </svg>
                                    <span className="text-[10px] font-black">{seaTemp}°</span>
                                </div>

                                {/* UV */}
                                <div className={`flex items-center gap-0.5 px-1 py-0 rounded-full ${uvIndex >= 6 ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`} title="Indice UV">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                    </svg>
                                    <span className="text-[10px] font-black">{uvIndex}</span>
                                </div>
                            </div>
                        </div>

                        {/* Name Label */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-slate-800/95 backdrop-blur-sm text-white text-xs font-bold rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-1 shadow-lg">
                            {beach.name}
                        </div>
                    </div>
                )
            }
        }).filter(Boolean) as MapMarker[]

        setMarkers(newMarkers)
    }, [selectedDay, beachData, loading, handleSearch])

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-sky-50 flex flex-col">
            <Header />
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
                {/* Hero Header */}
                <div className="mb-8 animate-fade-in-up">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl shadow-lg shadow-cyan-500/20">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="-5.0 -10.0 110.0 120.0">
                                    <path d="m31.473 44.984c0 4.6523-3.7734 8.4258-8.4258 8.4258-4.6562 0-8.4297-3.7734-8.4297-8.4258 0-4.6562 3.7734-8.4258 8.4297-8.4258 4.6523 0 8.4258 3.7695 8.4258 8.4258z" />
                                    <path d="m23.047 56.145c-1.3086 0-2.3711 1.0625-2.3711 2.3711v4.6406c0 1.3086 1.0625 2.3711 2.3711 2.3711s2.3711-1.0625 2.3711-2.3711v-4.6406c0-1.3086-1.0625-2.3711-2.3711-2.3711z" />
                                    <path d="m11.801 52.879-3.2812 3.2812c-0.92578 0.92578-0.92578 2.4258 0 3.3555 0.46484 0.46484 1.0703 0.69531 1.6758 0.69531 0.60938 0 1.2148-0.23047 1.6758-0.69531l3.2812-3.2812c0.92578-0.92578 0.92578-2.4258 0-3.3555-0.92578-0.92578-2.4258-0.92969-3.3555 0z" />
                                    <path d="m11.887 44.984c0-1.3086-1.0625-2.3711-2.3711-2.3711h-4.6406c-1.3086 0-2.3711 1.0625-2.3711 2.3711 0 1.3125 1.0625 2.3711 2.3711 2.3711h4.6406c1.3086 0 2.3711-1.0625 2.3711-2.3711z" />
                                    <path d="m11.801 37.094c0.46484 0.46484 1.0703 0.69141 1.6758 0.69141 0.60938 0 1.2148-0.23047 1.6758-0.69531 0.92578-0.92578 0.92578-2.4258 0-3.3516l-3.2812-3.2812c-0.92578-0.92578-2.4258-0.92578-3.3555 0-0.92578 0.92578-0.92578 2.4258 0 3.3555l3.2812 3.2812z" />
                                    <path d="m23.047 33.824c1.3086 0 2.3711-1.0625 2.3711-2.3711v-4.6406c0-1.3086-1.0625-2.3711-2.3711-2.3711s-2.3711 1.0625-2.3711 2.3711v4.6406c0 1.3086 1.0625 2.3711 2.3711 2.3711z" />
                                    <path d="m32.613 37.785c0.60547 0 1.2148-0.23047 1.6758-0.69531l3.2812-3.2812c0.92578-0.92578 0.92578-2.4258 0-3.3555-0.92578-0.92578-2.4258-0.92578-3.3555 0l-3.2812 3.2812c-0.92578 0.92578-0.92578 2.4258 0 3.3555 0.46484 0.46484 1.0703 0.69531 1.6758 0.69531z" />
                                    <path d="m41.223 42.613h-4.6406c-1.3086 0-2.3711 1.0625-2.3711 2.3711 0 1.3125 1.0625 2.3711 2.3711 2.3711h4.6406c1.3086 0 2.3711-1.0625 2.3711-2.3711 0-1.3125-1.0625-2.3711-2.3711-2.3711z" />
                                    <path d="m34.293 52.875c-0.92578-0.92578-2.4258-0.92578-3.3555 0-0.92578 0.92578-0.92578 2.4258 0 3.3555l3.2812 3.2812c0.46484 0.46484 1.0703 0.69141 1.6758 0.69141 0.60938 0 1.2148-0.23047 1.6758-0.69531 0.92578-0.92578 0.92578-2.4258 0-3.3516l-3.2812-3.2812z" />
                                    <path d="m77.977 19.695 0.75781-2.8203c0.30859-1.1406-0.36719-2.3203-1.5117-2.6289-1.1445-0.30859-2.3203 0.37109-2.6289 1.5117l-0.76172 2.8203c-13.668-2.7031-27.191 4.0234-31.41 15.977-0.23047 0.65234 0.007813 1.3789 0.57422 1.7734 0.57031 0.39453 1.332 0.35156 1.8594-0.09375 2.2109-1.8789 5.1992-2.5547 7.9922-1.8008 3.1562 0.85156 5.5664 3.3672 6.2891 6.5664 0.25 1.1094 1.8438 1.5352 2.6172 0.70312 2.2305-2.4023 5.5781-3.3633 8.7383-2.5156 3.1562 0.85156 5.5664 3.3672 6.2891 6.5664 0.125 0.55469 0.54688 0.99219 1.0977 1.1406 0.54688 0.14844 1.1328-0.019531 1.5195-0.4375 2.2305-2.4023 5.5781-3.3672 8.7383-2.5156 2.793 0.75391 5.0391 2.8398 6.0078 5.5742 0.23047 0.65234 0.87109 1.0703 1.5625 1.0195 0.69141-0.054687 1.2578-0.5625 1.3906-1.2422 2.3633-12.453-5.9492-25.066-19.125-29.598z" />
                                    <path d="m64.09 72.359 7.0391-27.309c0.30469-1.1367-0.37109-2.3125-1.5078-2.6211-1.1367-0.30469-2.3125 0.37109-2.6172 1.5078l-7.1562 27.738c-3.7383-0.49219-7.6797-0.76172-11.758-0.76172-16.746 0-31.262 4.457-38.355 10.973-1.5273 1.4023-0.58203 3.9375 1.4922 3.9375h73.727c2.0742 0 3.0195-2.5352 1.4922-3.9375-4.6992-4.3125-12.66-7.7148-22.359-9.5273z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
                                    Météo des Plages
                                </h1>
                                <p className="text-slate-500 font-medium mt-1">Température de l'eau, UV et conditions</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <MapControls
                        onDaySelect={handleDaySelect}
                        selectedDay={selectedDay}
                        selectedCity={null}
                        onCitySelect={() => { }}
                    />
                </div>

                {/* Map */}
                <div className="h-[800px] md:h-[650px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 relative mt-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <MartiniqueMap markers={markers} centerOn={centerOn} onReset={resetView} />

                    {/* Legend */}
                    <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 z-10">
                        <div className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wide">Légende</div>
                        <div className="flex flex-col gap-2.5">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-xs text-slate-600">Temp. de l'eau</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                </svg>
                                <span className="text-xs text-slate-600">Indice UV</span>
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
                                <div
                                    key={beach.name}
                                    className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 flex items-center justify-between hover:border-cyan-200 group animate-fade-in-up"
                                    style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="5" fill="#FBBF24" />
                                                <g stroke="#FBBF24" strokeWidth="2" strokeLinecap="round">
                                                    <line x1="12" y1="1" x2="12" y2="3" />
                                                    <line x1="12" y1="21" x2="12" y2="23" />
                                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                                    <line x1="1" y1="12" x2="3" y2="12" />
                                                    <line x1="21" y1="12" x2="23" y2="12" />
                                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                                </g>
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-black text-slate-800">{beach.name}</div>
                                            <div className="text-xs text-slate-500 font-medium">{beach.city}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-5 text-sm font-medium">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] text-slate-400 uppercase">Eau</span>
                                            <span className="text-blue-600 font-black text-lg">{seaTemp}°</span>
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
