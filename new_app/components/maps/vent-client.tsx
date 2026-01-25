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


const getCardinalDirection = (angle: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
    return directions[Math.round(angle / 45) % 8];
}

export default function WindMapPage({ initialUser }: { initialUser: any }) {
    const [markers, setMarkers] = useState<MapMarker[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon'>('afternoon')
    const { selectedDay, selectedCity, centerOn, handleSearch, handleDaySelect, resetView } = useMapUrlState()
    const [allData, setAllData] = useState<any[]>([])

    const stats = useMemo(() => {
        if (!allData.length) return { dominantDir: '--', maxGusts: 0, analysis: "Chargement en cours...", avgDirCode: 0 }


        const baseIndex = selectedDay * 24
        const hourOffset = timeOfDay === 'morning' ? 8 : 14
        const dataIndex = baseIndex + hourOffset


        const windData = MARTINIQUE_CITIES.map((city, idx) => {
            const data = allData[idx]
            if (!data?.hourly) return null
            return {
                dir: data.hourly.wind_direction_10m[dataIndex] || 0,
                gust: data.hourly.wind_gusts_10m[dataIndex] || 0,
                speed: data.hourly.wind_speed_10m[dataIndex] || 0
            }
        }).filter((d): d is { dir: number, gust: number, speed: number } => Boolean(d))

        if (!windData.length && !loading && !error) return { dominantDir: '--', maxGusts: 0, analysis: "Données indisponibles pour cette période.", avgDirCode: 0 }
        if (loading) return { dominantDir: '--', maxGusts: 0, analysis: "Chargement...", avgDirCode: 0 }


        let sinSum = 0;
        let cosSum = 0;
        let maxGusts = 0;
        let totalSpeed = 0;

        windData.forEach(d => {
            sinSum += Math.sin(d.dir * Math.PI / 180);
            cosSum += Math.cos(d.dir * Math.PI / 180);
            if (d.gust > maxGusts) maxGusts = d.gust;
            totalSpeed += d.speed;
        });

        const avgAngle = (Math.atan2(sinSum, cosSum) * 180 / Math.PI + 360) % 360;
        const dominantDir = getCardinalDirection(avgAngle);
        const avgSpeed = totalSpeed / windData.length;


        let analysis = "";


        if (avgSpeed < 15) analysis += "Les conditions sont calmes avec une brise légère dominante sur l'ensemble de l'île. ";
        else if (avgSpeed < 30) analysis += "Un régime d'alizés modéré souffle régulièrement, apportant une ventilation agréable sur les côtes. ";
        else analysis += "Le vent souffle de manière soutenue aujourd'hui, nécessitant une vigilance particulière sur le littoral. ";


        if (maxGusts > 50) analysis += `Des rafales importantes pouvant atteindre ${Math.round(maxGusts)} km/h sont attendues sur les caps exposés et les hauteurs. `;
        else if (maxGusts > 30) analysis += `Quelques rafales modérées autour de ${Math.round(maxGusts)} km/h pourront être ressenties sous les averses. `;
        else analysis += "Les rafales restent faibles et ne présentent aucun risque particulier pour les activités extérieures. ";


        if (dominantDir === 'E' || dominantDir === 'NE') analysis += "Le flux de secteur Est/Nord-Est maintient un temps classique pour la saison. ";
        else if (dominantDir === 'SE') analysis += "Le vent s'oriente au secteur Sud-Est, apportant une ambiance plus humide et lourde. ";
        else analysis += `Le vent est changeant, s'orientant temporairement au secteur ${dominantDir}. `;


        if (maxGusts > 60 || avgSpeed > 40) analysis += "Il est recommandé d'éviter les sorties en mer et les activités nautiques exposées.";
        else analysis += "Les conditions sont globalement favorables pour la navigation de plaisance et les loisirs nautiques.";

        return { dominantDir, maxGusts: Math.round(maxGusts), analysis, avgDirCode: avgAngle }
    }, [allData, selectedDay, timeOfDay, loading, error])

    const fetchData = async () => {
        setLoading(true)
        setError(false)
        try {
            const lats = MARTINIQUE_CITIES.map(c => c.lat).join(",")
            const lons = MARTINIQUE_CITIES.map(c => c.lon).join(",")
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&hourly=wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=America/Martinique`)
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

            const speed = Math.round(cityData.hourly.wind_speed_10m[dataIndex])
            const direction = cityData.hourly.wind_direction_10m[dataIndex]
            const gusts = Math.round(cityData.hourly.wind_gusts_10m[dataIndex])

            const isStrong = speed >= 40
            const isModerate = speed >= 25

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
                            px-2 py-1.5 rounded-lg shadow-lg border flex items-center gap-1
                            transition-all duration-300 hover:shadow-xl
                            ${isStrong ? 'bg-gradient-to-br from-red-500/95 to-pink-500/95 border-red-400/50 text-white shadow-red-500/30' :
                                isModerate ? 'bg-gradient-to-br from-teal-500/95 to-cyan-500/95 border-teal-400/50 text-white shadow-teal-500/30' :
                                    'bg-white/95 border-slate-200/80 text-slate-700 shadow-slate-200/50'}
                        `}>
                            <svg
                                className={`w-4 h-4 transition-transform duration-500 ${isStrong ? 'text-white animate-pulse' : isModerate ? 'text-white' : 'text-teal-600'}`}
                                style={{ transform: `rotate(${(direction + 180) % 360}deg)` }}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                            </svg>
                            <span className="font-black text-[10px] leading-none">
                                {speed}
                                <span className="text-[8px] font-medium opacity-80 ml-0.5">km/h</span>
                            </span>
                        </div>
                        { }
                        <div className="absolute top-full mt-2 bg-white/95 px-4 py-3 rounded-xl shadow-xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 pointer-events-none min-w-[140px] transform group-hover:translate-y-0 translate-y-1">
                            <p className="font-black text-slate-800 text-sm text-center mb-2">{city.name}</p>
                            <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-100 pt-2">
                                <span>Rafales</span>
                                <span className={`font-black ${gusts >= 50 ? 'text-red-600' : 'text-slate-700'}`}>{gusts} km/h</span>
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
                                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Carte des Vents</h2>
                                        <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                                            Vitesse et direction du vent en Martinique
                                        </p>
                                    </div>
                                    <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl shadow-lg shadow-teal-500/20 text-white">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" />
                                        </svg>
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
                                            <span className="text-xs text-slate-600">&lt; 25 km/h (Faible)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500" />
                                            <span className="text-xs text-slate-600">25-40 km/h (Modéré)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-500 to-pink-500" />
                                            <span className="text-xs text-slate-600">&gt; 40 km/h (Fort)</span>
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
                                <div className="text-teal-500">
                                    <i className="bi bi-wind text-xl"></i>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">À propos du vent</h3>
                            </div>

                            <div className="space-y-4">
                                <div className={`rounded-xl p-4 border ${stats.maxGusts >= 50 ? 'bg-red-50 border-red-100' : 'bg-teal-50 border-teal-100'}`}>
                                    <p className={`text-sm font-medium ${stats.maxGusts >= 50 ? 'text-red-800' : 'text-slate-700'}`}>
                                        {stats.analysis}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Vent Dominant</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xl font-black text-slate-800">{stats.dominantDir}</p>
                                            {stats.dominantDir !== '--' && (
                                                <svg className="w-5 h-5 text-teal-600" style={{ transform: `rotate(${(stats.avgDirCode + 180) % 360}deg)` }} fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Rafales Max</p>
                                        <p className={`text-xl font-black ${stats.maxGusts >= 50 ? 'text-red-600' : 'text-slate-800'}`}>
                                            {stats.maxGusts > 0 ? stats.maxGusts : '--'} km/h
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