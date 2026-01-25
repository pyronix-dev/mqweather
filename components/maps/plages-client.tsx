// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { MartiniqueMap, MapMarker } from "@/components/MartiniqueMap"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MapControls } from "@/components/MapControls"
import { BEACH_LOCATIONS } from "@/lib/constants"
import { useMapUrlState } from "@/hooks/useMapUrlState"
import { getWeatherIcon } from "@/lib/weather-icons"
import { MorningIcon, AfternoonIcon } from "@/components/TimeIcons"
import { getSlugFromIndex } from "@/lib/utils"

interface BeachData {
    weather: {
        hourly: {
            time: string[]
            weather_code: number[]
            uv_index: number[]
        }
    }
    marine: {
        hourly: {
            time: string[]
            sea_surface_temperature: number[]
            wave_height: number[]
        }
    }
}

import { MapErrorDisplay } from "@/components/MapErrorDisplay"

export default function BeachMapPage({ initialUser }: { initialUser: any }) {
    const { selectedDay, centerOn, handleSearch, handleDaySelect, resetView } = useMapUrlState()
    const [beachData, setBeachData] = useState<Record<string, BeachData>>({})
    const [markers, setMarkers] = useState<MapMarker[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon'>('afternoon')

    const stats = useMemo(() => {
        const beaches = Object.values(beachData);
        if (!beaches.length) return { avgSeaTemp: 0, maxWave: 0, analysis: "Chargement en cours..." }


        const baseIndex = selectedDay * 24
        const hourOffset = timeOfDay === 'morning' ? 8 : 14
        const dataIndex = baseIndex + hourOffset

        let tempSum = 0;
        let tempCount = 0;
        let maxWave = 0;

        beaches.forEach(data => {
            if (data.marine?.hourly) {
                const temp = data.marine.hourly.sea_surface_temperature[dataIndex]
                const wave = data.marine.hourly.wave_height[dataIndex]
                if (typeof temp === 'number') {
                    tempSum += temp
                    tempCount++
                }
                if (typeof wave === 'number' && wave > maxWave) {
                    maxWave = wave
                }
            }
        })

        if (tempCount === 0 && !loading && !error) return { avgSeaTemp: 0, maxWave: 0, analysis: "Données indisponibles pour ce créneau." }
        if (loading) return { avgSeaTemp: 0, maxWave: 0, analysis: "Chargement..." }

        const avgSeaTemp = tempSum / tempCount;


        let analysis = "";


        if (maxWave >= 2.5) analysis += "La mer est forte et agitée, rendant la baignade périlleuse sur les côtes exposées. ";
        else if (maxWave >= 1.5) analysis += "Une houle modérée concerne le littoral Atlantique, soyez vigilants lors de la baignade. ";
        else analysis += "Le plan d'eau est globalement calme, offrant des conditions idéales pour la baignade en famille. ";


        if (avgSeaTemp >= 29) analysis += `L'eau est particulièrement chaude avec une moyenne de ${avgSeaTemp.toFixed(1)}°C, idéale pour la détente. `;
        else if (avgSeaTemp >= 27) analysis += `La température de l'eau est agréable, autour de ${avgSeaTemp.toFixed(1)}°C, conforme aux normales de saison. `;
        else analysis += `La mer est un peu plus fraîche aujourd'hui (${avgSeaTemp.toFixed(1)}°C), mais reste très accessible. `;


        if (timeOfDay === 'morning') analysis += "La matinée offre souvent les meilleures conditions de clarté et de calme avant le vent thermique. ";
        else analysis += "L'après-midi, le clapot peut se lever légèrement avec le renforcement des alizés. ";


        if (maxWave > 2.0) analysis += "Il est recommandé de privilégier les plages de la côte Caraïbe, plus abritées de la houle.";
        else analysis += "C'est une excellente journée pour profiter de l'ensemble des plages de l'île, y compris sur la côte au vent.";

        return { avgSeaTemp, maxWave, analysis }
    }, [beachData, selectedDay, timeOfDay, loading, error])

    const fetchAllData = async () => {
        setLoading(true)
        setError(false)

        try {

            const lats = BEACH_LOCATIONS.map(b => b.lat).join(',')
            const lons = BEACH_LOCATIONS.map(b => b.lon).join(',')

            const [weatherRes, marineRes] = await Promise.all([
                fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&hourly=weather_code,uv_index&timezone=America/Martinique`),
                fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${lats}&longitude=${lons}&hourly=sea_surface_temperature,wave_height&timezone=America/Martinique`)
            ])

            if (!weatherRes.ok || !marineRes.ok) throw new Error('Failed to fetch data from weather APIs')

            const weatherJsonArray = await weatherRes.json()
            const marineJsonArray = await marineRes.json()

            const data: Record<string, BeachData> = {}

            BEACH_LOCATIONS.forEach((beach, index) => {



                data[beach.name] = {
                    weather: weatherJsonArray[index],
                    marine: marineJsonArray[index]
                }
            })

            setBeachData(data)
        } catch (error) {
            console.error(`Failed to fetch beach data`, error)
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAllData()
    }, [])

    useEffect(() => {
        if (loading) return

        const newMarkers: MapMarker[] = BEACH_LOCATIONS.map((beach) => {
            const data = beachData[beach.name]
            if (!data || !data.weather.hourly || !data.marine.hourly) return null

            const baseIndex = selectedDay * 24
            const hourOffset = timeOfDay === 'morning' ? 8 : 14
            const dataIndex = baseIndex + hourOffset

            const weatherCode = data.weather.hourly.weather_code[dataIndex] || 0
            const uvIndex = Math.round(data.weather.hourly.uv_index[dataIndex] || 0)
            const seaTemp = Math.round(data.marine.hourly.sea_surface_temperature[dataIndex] || 28)
            const waveHeight = (data.marine.hourly.wave_height[dataIndex] || 0).toFixed(1)

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
                        { }
                        <div className="bg-white/95 rounded-xl shadow-xl border border-slate-200/50 p-1 flex flex-col items-center gap-1 min-w-[55px] transition-all duration-300 hover:shadow-2xl hover:border-amber-200">
                            { }
                            <div className="text-lg drop-shadow-sm">
                                {icon}
                            </div>

                            { }
                            <div className="flex items-center gap-1 w-full justify-center border-t border-slate-100 pt-1">
                                { }
                                <div className="flex items-center gap-0.5 text-blue-500" title="Température de l'eau">
                                    <i className="bi bi-thermometer-high text-[10px]"></i>
                                    <span className="text-[8px] font-black">{seaTemp}°</span>
                                </div>

                                { }
                                <div className={`flex items-center gap-0.5 px-1 py-0 rounded-full ${uvIndex >= 6 ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`} title="Indice UV">
                                    <i className="bi bi-sun-fill text-[10px]"></i>
                                    <span className="text-[8px] font-black">{uvIndex}</span>
                                </div>
                            </div>
                        </div>

                        { }
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-slate-800/95 text-white text-xs font-bold rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-1 shadow-lg">
                            {beach.name}
                        </div>
                    </div>
                )
            }
        }).filter(Boolean) as MapMarker[]

        setMarkers(newMarkers)
    }, [selectedDay, beachData, loading, handleSearch, timeOfDay])

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header initialUser={initialUser} />
            <main className="flex-1 w-full px-4 sm:px-6 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch my-6">
                    { }
                    <div className="relative w-full h-[85vh] min-h-[500px] lg:h-[700px] animate-fade-in-up">
                        <div className="absolute inset-0 bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col">
                            {error && <MapErrorDisplay onRetry={fetchAllData} />}

                            <div className="p-4 sm:p-6 border-b border-slate-200 flex-shrink-0">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Météo des Plages</h2>
                                        <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                                            Température de l'eau, UV et conditions
                                        </p>
                                    </div>
                                    <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl shadow-lg shadow-cyan-500/20 text-white">
                                        <i className="bi bi-water text-xl"></i>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 relative overflow-hidden">
                                <MartiniqueMap markers={markers} centerOn={centerOn} onReset={resetView} />

                                {/* Legend */}
                                <div className="absolute bottom-6 left-6 bg-white/95 p-4 rounded-2xl shadow-xl border border-white/50 z-10">
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

                    { }
                    <div className="w-full space-y-4 sm:space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        { }
                        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-2">Contrôles</h3>
                                <p className="text-sm text-slate-500">Sélectionnez le jour et l'heure</p>
                            </div>

                            <div className="space-y-6">
                                {/* Time Toggle */}
                                <div className="bg-slate-50 p-1.5 rounded-2xl flex items-center border border-slate-200">
                                    <button
                                        onClick={() => setTimeOfDay('morning')}
                                        className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${timeOfDay === 'morning'
                                            ? 'bg-white text-orange-600 shadow-sm border border-slate-100'
                                            : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <MorningIcon />
                                        <span>Matin (08h)</span>
                                    </button>
                                    <button
                                        onClick={() => setTimeOfDay('afternoon')}
                                        className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${timeOfDay === 'afternoon'
                                            ? 'bg-white text-red-600 shadow-sm border border-slate-100'
                                            : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <AfternoonIcon />
                                        <span>Après-midi (14h)</span>
                                    </button>
                                </div>

                                <MapControls
                                    onSearch={handleSearch}
                                    onDaySelect={handleDaySelect}
                                    selectedDay={selectedDay}
                                />
                            </div>
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
                                <div className="space-y-4">
                                    <div className={`rounded-xl p-4 border ${stats.maxWave >= 2 ? 'bg-amber-50 border-amber-100' : 'bg-cyan-50 border-cyan-100'}`}>
                                        <p className={`text-sm font-medium ${stats.maxWave >= 2 ? 'text-amber-800' : 'text-slate-700'}`}>
                                            {stats.analysis}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Temp. Eau Moy.</p>
                                            <div className="flex items-center gap-1">
                                                <p className="text-xl font-black text-slate-800">{stats.avgSeaTemp > 0 ? stats.avgSeaTemp.toFixed(1) : '--'}°C</p>
                                                <i className="bi bi-thermometer-half text-blue-500"></i>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Vague Max</p>
                                            <p className="text-xl font-black text-slate-800">{stats.maxWave > 0 ? stats.maxWave.toFixed(1) : '--'} m</p>
                                        </div>
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
                            if (!data || !data.weather?.hourly) return null

                            const baseIndex = selectedDay * 24
                            const hourOffset = timeOfDay === 'morning' ? 8 : 14
                            const dataIndex = baseIndex + hourOffset

                            const weatherCode = data.weather.hourly.weather_code[dataIndex] || 0
                            const uvIndex = Math.round(data.weather.hourly.uv_index[dataIndex] || 0)
                            const seaTemp = Math.round(data.marine.hourly.sea_surface_temperature[dataIndex] || 28)
                            const waveHeight = (data.marine.hourly.wave_height[dataIndex] || 0.5).toFixed(1)

                            return (
                                <Link
                                    key={beach.name}
                                    href={`/previsions/${getSlugFromIndex(selectedDay)}/plage?city=${encodeURIComponent(beach.city)}&lat=${beach.lat}&lon=${beach.lon}&source=map`}
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