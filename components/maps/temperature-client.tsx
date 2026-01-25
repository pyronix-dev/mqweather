// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useEffect, useState, useMemo } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MartiniqueMap, MapMarker } from "@/components/MartiniqueMap"
import { MapControls } from "@/components/MapControls"
import { MARTINIQUE_CITIES } from "@/lib/constants"
import { useMapUrlState } from "@/hooks/useMapUrlState"
import { getWeatherIconClass } from "@/lib/weather-icons"

import { MapErrorDisplay } from "@/components/MapErrorDisplay"
import { MorningIcon, AfternoonIcon } from "@/components/TimeIcons"

export default function TemperatureMapPage({ initialUser }: { initialUser: any }) {
    const [markers, setMarkers] = useState<MapMarker[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon'>('afternoon')
    const { selectedDay, selectedCity, centerOn, handleSearch, handleDaySelect, resetView } = useMapUrlState()
    const [allData, setAllData] = useState<any[]>([])


    const stats = useMemo(() => {
        if (!allData.length) return { avgTemp: 0, maxTemp: 0, analysis: "Chargement des données..." }

        const baseIndex = selectedDay * 24
        const hourOffset = timeOfDay === 'morning' ? 8 : 14
        const dataIndex = baseIndex + hourOffset

        const temps = MARTINIQUE_CITIES.map((city, idx) => {
            const data = allData[idx]
            if (!data?.hourly?.temperature_2m) return null
            return data.hourly.temperature_2m[dataIndex] as number
        }).filter((t): t is number => typeof t === 'number')


        if (!temps.length && !loading && !error) return { avgTemp: 0, maxTemp: 0, analysis: "Données indisponibles." }
        if (loading) return { avgTemp: 0, maxTemp: 0, analysis: "Chargement..." }

        const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length
        const maxTemp = Math.max(...temps)


        let analysis = "";


        if (avgTemp >= 30) analysis += "Une chaleur intense règne sur l'ensemble de l'île, avec des températures nettement supérieures aux normales. ";
        else if (avgTemp >= 28) analysis += "Les températures sont chaudes et conformes à la saison, avec un ressenti agréable grâce aux alizés. ";
        else analysis += "L'ambiance est relativement clémente aujourd'hui avec des températures modérées pour la saison. ";


        if (maxTemp >= 32) analysis += `Le thermomètre grimpe localement jusqu'à ${Math.round(maxTemp)}°C dans les plaines et zones abritées du vent. `;
        else analysis += `Le mercure reste raisonnable, ne dépassant pas ${Math.round(maxTemp)}°C au plus chaud de la journée sur le littoral. `;


        if (timeOfDay === 'afternoon') analysis += "L'inconfort thermique est maximal en ce moment, la chaleur étant accentuée par l'humidité ambiante. ";
        else analysis += "La fraîcheur matinale se dissipe rapidement pour laisser place à une chaleur lourde dès la mi-journée. ";


        if (avgTemp >= 31 || maxTemp >= 33) analysis += "Hydratez-vous fréquemment et évitez les efforts physiques intenses aux heures les plus chaudes.";
        else analysis += "Profitez de ces belles conditions climatiques, idéales pour les activités de plein air et la plage.";

        return { avgTemp, maxTemp, analysis }
    }, [allData, selectedDay, timeOfDay, loading, error])

    const fetchData = async () => {
        setLoading(true)
        setError(false)
        try {
            const lats = MARTINIQUE_CITIES.map(c => c.lat).join(",")
            const lons = MARTINIQUE_CITIES.map(c => c.lon).join(",")
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&hourly=temperature_2m,weather_code&timezone=America/Martinique`)
            if (!res.ok) throw new Error('Network response was not ok')
            const data = await res.json()
            const results = Array.isArray(data) ? data : [data]
            setAllData(results)
        } catch (e) {
            console.error("Error fetching map data", e)
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (!allData.length) return

        const visibleCities = MARTINIQUE_CITIES.filter((city, index) =>
            city.isDefault || city.name === selectedCity
        )

        const newMarkers = visibleCities.map((city) => {
            const originalIndex = MARTINIQUE_CITIES.findIndex(c => c.name === city.name)
            const cityData = allData[originalIndex]
            if (!cityData || !cityData.hourly) return null

            const baseIndex = selectedDay * 24
            const hourOffset = timeOfDay === 'morning' ? 8 : 14
            const dataIndex = baseIndex + hourOffset

            const temp = Math.round(cityData.hourly.temperature_2m[dataIndex])
            const weatherCode = cityData.hourly.weather_code[dataIndex] || 0

            const iconClass = getWeatherIconClass(weatherCode)

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
                            px-2 py-1.5 rounded-xl shadow-lg border border-white/30 flex items-center justify-center gap-1.5
                            transition-all duration-300 hover:shadow-xl
                            ${temp >= 30 ? 'bg-gradient-to-br from-red-500/95 to-orange-500/95 text-white shadow-orange-500/30' :
                                temp >= 28 ? 'bg-gradient-to-br from-orange-500/95 to-amber-500/95 text-white shadow-amber-500/30' :
                                    'bg-gradient-to-br from-cyan-500/95 to-blue-500/95 text-white shadow-blue-500/30'}
                        `}>
                            <i className={`bi ${iconClass} text-lg leading-none drop-shadow-sm`} />
                            <span className="font-black text-sm leading-none tracking-tight drop-shadow-sm pt-[2px]">{temp}°</span>
                        </div>
                        <span className="text-[9px] font-bold text-slate-700 bg-white/90 px-2 py-0.5 rounded-full mt-1 shadow-md border border-white/50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-1">
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
            <Header initialUser={initialUser} />
            <main className="flex-1 w-full px-4 sm:px-6 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch my-6">
                    { }
                    <div className="relative w-full h-[85vh] min-h-[500px] lg:h-[700px] animate-fade-in-up">
                        <div className="absolute inset-0 bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col">
                            {error && <MapErrorDisplay onRetry={fetchData} />}

                            <div className="p-4 sm:p-6 border-b border-slate-200 flex-shrink-0">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Carte des Températures</h2>
                                        <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                                            Températures en temps réel sur toute l'île
                                        </p>
                                    </div>
                                    <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg shadow-orange-500/20 text-white">
                                        <i className="bi bi-thermometer-sun text-xl"></i>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 relative overflow-hidden">
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
                        </div>
                    </div>

                    {/* Sidebar Section */}
                    <div className="w-full space-y-4 sm:space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        {/* Controls Card */}
                        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-2">Contrôles</h3>
                                <p className="text-sm text-slate-500">Sélectionnez le jour et l'heure</p>
                            </div>

                            <div className="space-y-6">
                                { }
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

                        { }
                        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="text-orange-500">
                                    <i className="bi bi-info-circle text-xl"></i>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">À propos des températures</h3>
                            </div>

                            <div className="space-y-4">
                                <div className={`rounded-xl p-4 border ${stats.avgTemp >= 30 ? 'bg-orange-50 border-orange-100' : 'bg-blue-50 border-blue-100'}`}>
                                    <p className={`text-sm font-medium ${stats.avgTemp >= 30 ? 'text-orange-800' : 'text-slate-700'}`}>
                                        {stats.analysis}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Moyenne Île</p>
                                        <div className="flex items-end gap-1">
                                            <p className="text-xl font-black text-slate-800">{stats.avgTemp > 0 ? stats.avgTemp.toFixed(1) : '--'}°C</p>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Max Relevé</p>
                                        <p className={`text-xl font-black ${stats.maxTemp >= 30 ? 'text-red-600' : 'text-slate-800'}`}>
                                            {stats.maxTemp > 0 ? stats.maxTemp : '--'}°C
                                        </p>
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