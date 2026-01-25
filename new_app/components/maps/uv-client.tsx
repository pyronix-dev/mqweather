// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useEffect, useState, useMemo } from "react"
import { MartiniqueMap, MapMarker } from "@/components/MartiniqueMap"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MapControls } from "@/components/MapControls"
import { MARTINIQUE_CITIES } from "@/lib/constants"
import { useMapUrlState } from "@/hooks/useMapUrlState"

const getUVColor = (uv: number) => {
    if (uv >= 11) return "bg-gradient-to-br from-violet-600 to-purple-700 text-white shadow-violet-500/40"
    if (uv >= 8) return "bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-rose-500/40"
    if (uv >= 6) return "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-500/40"
    if (uv >= 3) return "bg-gradient-to-br from-lime-400 to-green-500 text-white shadow-lime-500/40"
    return "bg-gradient-to-br from-sky-400 to-cyan-500 text-white shadow-sky-500/40"
}

const getUVLabel = (uv: number) => {
    if (uv >= 11) return "Extrême"
    if (uv >= 8) return "Très Élevé"
    if (uv >= 6) return "Élevé"
    if (uv >= 3) return "Modéré"
    return "Faible"
}

import { MapErrorDisplay } from "@/components/MapErrorDisplay"
import { MorningIcon, AfternoonIcon } from "@/components/TimeIcons"

export default function UVMapPage({ initialUser }: { initialUser: any }) {
    const { selectedDay, selectedCity, centerOn, handleSearch, handleDaySelect, resetView } = useMapUrlState()
    const [allData, setAllData] = useState<any[]>([])
    const [markers, setMarkers] = useState<MapMarker[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon'>('afternoon')

    const stats = useMemo(() => {
        if (!allData.length) return { maxUV: 0, analysis: "Chargement en cours..." }

        const baseIndex = selectedDay * 24
        const hourOffset = timeOfDay === 'morning' ? 8 : 14
        const dataIndex = baseIndex + hourOffset

        const uvValues = MARTINIQUE_CITIES.map((city, idx) => {
            const data = allData[idx]
            if (!data?.hourly?.uv_index) return null
            return data.hourly.uv_index[dataIndex] as number
        }).filter((u): u is number => typeof u === 'number')

        if (!uvValues.length && !loading && !error) return { maxUV: 0, analysis: "Données indisponibles pour ce créneau." }
        if (loading) return { maxUV: 0, analysis: "Chargement..." }

        const maxUV = Math.round(Math.max(...uvValues))
        const avgUV = uvValues.reduce((a, b) => a + b, 0) / uvValues.length


        let analysis = "";


        if (maxUV >= 11) analysis += "L'indice UV atteint des niveaux extrêmes sur l'ensemble de l'île aujourd'hui. ";
        else if (maxUV >= 8) analysis += "Le rayonnement solaire est très intense, avec des indices UV particulièrement élevés. ";
        else if (maxUV >= 6) analysis += "L'ensoleillement est généreux, entraînant un indice UV élevé sur toutes les communes. ";
        else analysis += "L'intensité du rayonnement UV reste modérée grâce à une couverture nuageuse protectrice. ";


        if (timeOfDay === 'afternoon') analysis += "Le risque est maximal actuellement, correspondant au pic d'intensité solaire. ";
        else analysis += "L'intensité va augmenter rapidement au cours des prochaines heures pour atteindre son maximum à la mi-journée. ";


        if (maxUV >= 8) analysis += "Le risque de brûlures est très rapide pour les peaux non protégées (moins de 15 minutes). ";
        else if (maxUV >= 5) analysis += "Une exposition prolongée sans protection peut entraîner des coups de soleil significatifs. ";
        else analysis += "Le risque de lésions cutanées est limité pour les expositions de courte durée. ";


        if (maxUV >= 8) analysis += "La protection maximale est impérative : écran total, chapeau, lunettes et vêtements couvrants.";
        else if (maxUV >= 3) analysis += "L'application de crème solaire et le port de lunettes sont vivement recommandés.";
        else analysis += "Aucune protection particulière n'est requise, sauf pour les peaux les plus sensibles.";

        return { maxUV, analysis, avgUV }
    }, [allData, selectedDay, timeOfDay, loading, error])

    const fetchData = async () => {
        setLoading(true)
        setError(false)
        try {
            const lats = MARTINIQUE_CITIES.map(c => c.lat).join(",")
            const lons = MARTINIQUE_CITIES.map(c => c.lon).join(",")
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&hourly=uv_index&timezone=America/Martinique`)
            if (!res.ok) throw new Error('Network response was not ok')
            const data = await res.json()
            const results = Array.isArray(data) ? data : [data]
            setAllData(results)
        } catch (e) {
            console.error("Error fetching UV data", e)
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

        const visibleCities = MARTINIQUE_CITIES.filter((city) =>
            city.isDefault || city.name === selectedCity
        )

        const newMarkers: MapMarker[] = visibleCities.map((city) => {
            const originalIndex = MARTINIQUE_CITIES.findIndex(c => c.name === city.name)
            const cityData = allData[originalIndex]
            if (!cityData || !cityData.hourly) return null

            const baseIndex = selectedDay * 24
            const hourOffset = timeOfDay === 'morning' ? 8 : 14
            const dataIndex = baseIndex + hourOffset

            const uvIndex = Math.round(cityData.hourly.uv_index[dataIndex] || 0)
            const colorClass = getUVColor(uvIndex)

            return {
                id: city.name,
                lat: city.lat,
                lon: city.lon,
                component: (
                    <div
                        onClick={() => handleSearch(city)}
                        className="group relative cursor-pointer transition-all duration-300 hover:scale-110 hover:z-[100] animate-fade-in-up"
                    >
                        { }
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-3 bg-white/95 text-slate-800 rounded-xl shadow-xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-[200] pointer-events-none transform group-hover:translate-y-0 -translate-y-1">
                            <div className="font-black text-sm mb-1">{city.name}</div>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="text-slate-500">Indice UV:</span>
                                <span className="font-black">{uvIndex}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getUVColor(uvIndex)}`}>
                                    {getUVLabel(uvIndex)}
                                </span>
                            </div>
                        </div>

                        <div className={`w-8 h-8 rounded-full shadow-lg flex items-center justify-center border-2 border-white/70 ${colorClass} transition-all duration-300 hover:shadow-xl`}>
                            <span className="font-black text-xs">{uvIndex}</span>
                        </div>
                    </div>
                )
            }
        }).filter(Boolean) as MapMarker[]

        setMarkers(newMarkers)
    }, [selectedDay, allData, handleSearch, selectedCity, timeOfDay])

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
                                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Carte UV</h2>
                                        <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                                            Indice UV maximum prévu
                                        </p>
                                    </div>
                                    <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg shadow-amber-500/20 text-white">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 relative overflow-hidden">
                                <MartiniqueMap markers={markers} centerOn={centerOn} onReset={resetView} />

                                { }
                                <div className="absolute bottom-6 left-6 bg-white/95 p-4 rounded-2xl shadow-xl border border-white/50 z-10">
                                    <div className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wide">Indices UV</div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 border-2 border-white shadow-sm flex items-center justify-center text-[9px] font-black text-white">1-2</div>
                                            <span className="text-xs text-slate-600 font-medium">Faible</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-lime-400 to-green-500 border-2 border-white shadow-sm flex items-center justify-center text-[9px] font-black text-white">3-5</div>
                                            <span className="text-xs text-slate-600 font-medium">Modéré</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white shadow-sm flex items-center justify-center text-[9px] font-black text-white">6-7</div>
                                            <span className="text-xs text-slate-600 font-medium">Élevé</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-500 to-red-600 border-2 border-white shadow-sm flex items-center justify-center text-[9px] font-black text-white">8-10</div>
                                            <span className="text-xs text-slate-600 font-medium">Très Élevé</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 border-2 border-white shadow-sm flex items-center justify-center text-[9px] font-black text-white">11+</div>
                                            <span className="text-xs text-slate-600 font-medium">Extrême</span>
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
                                    onDaySelect={handleDaySelect}
                                    selectedDay={selectedDay}
                                    selectedCity={null}
                                    onCitySelect={() => { }}
                                    onSearch={handleSearch}
                                />
                            </div>
                        </div>

                        {/* Info Card */}
                        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex-1">

                            <div className="flex items-center gap-3 mb-4">
                                <div className="text-amber-500">
                                    <i className="bi bi-info-circle text-xl"></i>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">À propos des UV</h3>
                            </div>

                            <div className="space-y-4">
                                <div className={`rounded-xl p-4 border ${stats.maxUV >= 8 ? 'bg-rose-50 border-rose-100' : stats.maxUV >= 6 ? 'bg-amber-50 border-amber-100' : 'bg-lime-50 border-lime-100'}`}>
                                    <p className={`text-sm font-medium ${stats.maxUV >= 8 ? 'text-rose-800' : stats.maxUV >= 6 ? 'text-amber-800' : 'text-slate-700'}`}>
                                        {stats.analysis}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Max Île</p>
                                        <p className={`text-xl font-black ${stats.maxUV >= 8 ? 'text-rose-600' : 'text-slate-800'}`}>
                                            {stats.maxUV > 0 ? stats.maxUV : '--'}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Heures Critiques</p>
                                        <p className="text-xl font-black text-slate-800">10h - 15h</p>
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