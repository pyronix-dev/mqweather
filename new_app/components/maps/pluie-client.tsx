// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useEffect, useState, useMemo } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MartiniqueMap, MapMarker } from "@/components/MartiniqueMap"
import { MapControls } from "@/components/MapControls"
import { MARTINIQUE_CITIES } from "@/lib/constants"
import { useMapUrlState } from "@/hooks/useMapUrlState"

import { MapErrorDisplay } from "@/components/MapErrorDisplay"
import { MorningIcon, AfternoonIcon } from "@/components/TimeIcons"

export default function RainMapPage({ initialUser }: { initialUser: any }) {
    const [markers, setMarkers] = useState<MapMarker[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon'>('afternoon')
    const { selectedDay, selectedCity, centerOn, handleSearch, handleDaySelect, resetView } = useMapUrlState()
    const [allData, setAllData] = useState<any[]>([])

    const stats = useMemo(() => {
        if (!allData.length) return { avgPrecip: 0, maxPrecip: 0, analysis: "Chargement en cours..." }

        const baseIndex = selectedDay * 24
        const hourOffset = timeOfDay === 'morning' ? 8 : 14
        const dataIndex = baseIndex + hourOffset

        const precipValues = MARTINIQUE_CITIES.map((city, idx) => {
            const data = allData[idx]
            if (!data?.hourly?.precipitation) return null
            return data.hourly.precipitation[dataIndex] as number
        }).filter((p): p is number => typeof p === 'number')

        if (!precipValues.length && !loading && !error) return { avgPrecip: 0, maxPrecip: 0, analysis: "Données indisponibles." }
        if (loading) return { avgPrecip: 0, maxPrecip: 0, analysis: "Chargement..." }

        const avgPrecip = precipValues.reduce((a, b) => a + b, 0) / precipValues.length
        const maxPrecip = Math.max(...precipValues)


        let analysis = "";


        if (avgPrecip < 0.1) analysis += "Le ciel est globalement dégagé sur l'ensemble de l'île, sans précipitations notables prévues. ";
        else if (avgPrecip < 2) analysis += "Quelques averses passagères traversent l'île, arrosant principalement le relief et la côte au vent. ";
        else analysis += "Un épisode pluvieux significatif concerne la Martinique avec des pluies fréquentes et parfois soutenues. ";


        if (maxPrecip > 15) analysis += `Des cumuls importants sont relevés localement, atteignant ${maxPrecip.toFixed(1)} mm sur les zones les plus exposées. `;
        else if (maxPrecip > 5) analysis += `L'intensité reste modérée, avec des cumuls maximaux autour de ${maxPrecip.toFixed(1)} mm sous les grains les plus actifs. `;
        else analysis += "Les quantités d'eau restent anecdotiques, ne dépassant pas quelques millimètres sur les sommets. ";


        if (avgPrecip > 3) analysis += "La couverture nuageuse reste dense et menaçante, limitant grandement les éclaircies. ";
        else if (avgPrecip > 0.5) analysis += "Le ciel est variable, alternant entre passages nuageux porteurs d'averses et belles éclaircies. ";
        else analysis += "Le soleil domine largement malgré quelques nuages inoffensifs circulant dans le flux d'alizé. ";


        if (maxPrecip > 20) analysis += "La prudence est de mise à proximité des cours d'eau en raison du risque de montée rapide des eaux.";
        else if (avgPrecip > 1) analysis += "Un parapluie ou un imperméable pourra s'avérer utile lors de vos déplacements extérieurs.";
        else analysis += "Profitez de ces conditions sèches idéales pour toutes vos activités de plein air et de plage.";

        return { avgPrecip, maxPrecip, analysis }
    }, [allData, selectedDay, timeOfDay, loading, error])

    const fetchData = async () => {
        setLoading(true)
        setError(false)
        try {

            const lats = MARTINIQUE_CITIES.map(c => c.lat.toFixed(4)).join(",")
            const lons = MARTINIQUE_CITIES.map(c => c.lon.toFixed(4)).join(",")
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&hourly=precipitation,precipitation_probability&timezone=America/Martinique`)
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

        const visibleCities = MARTINIQUE_CITIES.filter((city) =>
            city.isDefault || city.name === selectedCity
        )

        const newMarkers = visibleCities.map((city) => {
            const originalIndex = MARTINIQUE_CITIES.findIndex(c => c.name === city.name)
            const cityData = allData[originalIndex]
            if (!cityData || !cityData.hourly) return null

            const baseIndex = selectedDay * 24
            const hourOffset = timeOfDay === 'morning' ? 8 : 14
            const dataIndex = baseIndex + hourOffset

            const precip = cityData.hourly.precipitation[dataIndex]
            const prob = cityData.hourly.precipitation_probability[dataIndex]
            const isRaining = precip > 0.1
            const isHeavy = precip > 5

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
                            px-1.5 py-1 rounded-lg shadow-lg border flex items-center gap-1
                            transition-all duration-300 hover:shadow-xl
                            ${isHeavy ? 'bg-gradient-to-br from-blue-600/95 to-indigo-600/95 border-blue-400/50 text-white shadow-blue-500/30' :
                                isRaining ? 'bg-gradient-to-br from-blue-500/95 to-cyan-500/95 border-blue-400/50 text-white shadow-blue-500/30' :
                                    'bg-white/95 border-slate-200/80 text-slate-500 shadow-slate-200/50'}
                        `}>
                            <i className={`bi ${isHeavy ? 'bi-cloud-rain-heavy-fill' : isRaining ? 'bi-cloud-drizzle-fill' : 'bi-cloud-fill'} ${isRaining ? 'text-white' : 'text-slate-400'} text-base`}></i>
                            <span className="font-black text-[10px] leading-none">
                                {precip !== null ? precip.toFixed(1) : "--"}
                                <span className="text-[8px] font-medium opacity-80 ml-0.5">mm</span>
                            </span>
                        </div>
                        { }
                        <div className="absolute top-full mt-2 bg-white/95 px-4 py-3 rounded-xl shadow-xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 pointer-events-none min-w-[140px] transform group-hover:translate-y-0 translate-y-1">
                            <p className="font-black text-slate-800 text-sm text-center mb-2">{city.name}</p>
                            <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-100 pt-2">
                                <span>Probabilité</span>
                                <span className={`font-black ${prob > 70 ? 'text-blue-600' : prob > 40 ? 'text-cyan-600' : 'text-slate-600'}`}>{prob}%</span>
                            </div>
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
                                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Carte des Précipitations</h2>
                                        <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                                            Précipitations horaires prévues
                                        </p>
                                    </div>
                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/20 text-white">
                                        <i className="bi bi-cloud-drizzle-fill text-xl"></i>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 relative overflow-hidden">
                                <MartiniqueMap markers={markers} centerOn={centerOn} onReset={resetView} />

                                { }
                                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 z-10">
                                    <div className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wide">Intensité</div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-white border-2 border-slate-300" />
                                            <span className="text-xs text-slate-600">Pas de pluie</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500" />
                                            <span className="text-xs text-slate-600">0.1-5 mm (Légère)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600" />
                                            <span className="text-xs text-slate-600">&gt; 5 mm (Forte)</span>
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
                                <div className="text-blue-500">
                                    <i className="bi bi-info-circle text-xl"></i>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">À propos de la pluie</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-4">
                                    <div className={`rounded-xl p-4 border ${stats.maxPrecip >= 10 ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-100'}`}>
                                        <p className={`text-sm font-medium ${stats.maxPrecip >= 10 ? 'text-blue-800' : 'text-slate-700'}`}>
                                            {stats.analysis}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Moyenne Île</p>
                                            <p className="text-xl font-black text-slate-800">{stats.avgPrecip.toFixed(1)} mm</p>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Max Locale</p>
                                            <p className={`text-xl font-black ${stats.maxPrecip >= 20 ? 'text-blue-600' : 'text-slate-800'}`}>
                                                {stats.maxPrecip.toFixed(1)} mm
                                            </p>
                                        </div>
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