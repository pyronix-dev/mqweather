// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useWeather } from "@/hooks/useWeather"
import { MARTINIQUE_CITIES } from "@/lib/constants"


const WaveIcon = () => (
    <svg className="w-12 h-12 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75c5.4 0 8.25-7.5 11.25-7.5s5.85 7.5 11.25 7.5" />
        <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M2.25 19.5c5.4 0 8.25-7.5 11.25-7.5s5.85 7.5 11.25 7.5" />
    </svg>
)

const ThermometerWaterIcon = () => (
    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 18a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
    </svg>
)

const CompassIcon = ({ degree }: { degree: number }) => (
    <div className="relative w-12 h-12 flex items-center justify-center border-2 border-slate-200 rounded-full" style={{ transform: `rotate(${degree}deg)` }}>
        <div className="w-0 h-0 border-l-[4px] border-l-transparent border-b-[14px] border-b-red-500 border-r-[4px] border-r-transparent absolute -top-1"></div>
    </div>
)

const SearchIcon = () => (
    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
)

const MapPinIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
)





export default function MarinePage({ initialUser }: { initialUser: any }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    
    const rawCityName = searchParams.get("city")
    const isValidCity = rawCityName && MARTINIQUE_CITIES.some(c => c.name.toLowerCase() === rawCityName.toLowerCase())
    const cityName = isValidCity ? rawCityName : "Le Diamant"
    const lat = searchParams.get("lat") || "14.478"
    const lon = searchParams.get("lon") || "-61.029"
    const dayIndex = 0 

    const { weather, loading } = useWeather(lat, lon, dayIndex)

    
    const [searchQuery, setSearchQuery] = useState("")
    const [showSuggestions, setShowSuggestions] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const filteredCities = MARTINIQUE_CITIES.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleCitySelect = (city: typeof MARTINIQUE_CITIES[0]) => {
        setSearchQuery("")
        setShowSuggestions(false)
        router.push(`/meteo-marine?city=${encodeURIComponent(city.name)}&lat=${city.lat}&lon=${city.lon}`)
    }

    
    const getDirection = (angle: number) => {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
        return directions[Math.round(angle / 45) % 8];
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Header initialUser={initialUser} />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                    <div>
                        <button
                            onClick={() => router.push("/")}
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-4 text-sm font-medium"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                            Retour à l'accueil
                        </button>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
                            Météo des Plages
                        </h1>
                        <p className="text-lg text-slate-500 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
                            Conditions en direct à <span className="font-bold text-slate-700">{cityName}</span>
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-80" ref={searchRef}>
                        <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-cyan-500/20 focus-within:border-cyan-500 transition-all">
                            <SearchIcon />
                            <input
                                type="text"
                                placeholder="Chercher une plage..."
                                className="bg-transparent outline-none w-full text-sm text-slate-700 placeholder:text-slate-400"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                    setShowSuggestions(true)
                                }}
                                onFocus={() => setShowSuggestions(true)}
                            />
                        </div>

                        {/* Suggestions Dropdown */}
                        {showSuggestions && searchQuery && (
                            <div className="absolute top-full mt-2 w-full bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                                {filteredCities.length > 0 ? filteredCities.map((city) => (
                                    <button
                                        key={city.name}
                                        onClick={() => handleCitySelect(city)}
                                        className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors text-sm text-slate-600 border-b border-slate-50 last:border-b-0 flex items-center gap-3"
                                    >
                                        <div className="text-slate-400">
                                            <MapPinIcon />
                                        </div>
                                        {city.name}
                                    </button>
                                )) : (
                                    <div className="px-4 py-3 text-sm text-slate-400 text-center">Aucune ville trouvée</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {['Le Diamant', 'Sainte-Anne', 'Tartane', 'Les Anses-d\'Arlet'].map((city) => {
                        const cityData = MARTINIQUE_CITIES.find(c => c.name === city)
                        if (!cityData) return null
                        const isActive = cityName === city
                        return (
                            <button
                                key={city}
                                onClick={() => router.push(`/meteo-marine?city=${encodeURIComponent(city)}&lat=${cityData.lat}&lon=${cityData.lon}`)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive
                                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-200'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-cyan-300 hover:text-cyan-600'
                                    }`}
                            >
                                {city}
                            </button>
                        )
                    })}
                </div>

                {!loading && weather ? (
                    <>
                        {}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                            {}
                            <div className="bg-white border border-slate-100 rounded-3xl p-8 relative overflow-hidden group hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                    <ThermometerWaterIcon />
                                </div>
                                <p className="text-blue-600 font-bold mb-2 uppercase tracking-wide text-xs">Eau</p>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <div className="text-5xl font-bold text-slate-800">
                                        {weather.waterTemp ? Math.round(weather.waterTemp) : "--"}
                                    </div>
                                    <span className="text-2xl text-slate-400 font-medium">°C</span>
                                </div>
                                <p className="text-slate-500 text-sm font-medium">Température de la mer</p>

                                <div className="mt-8 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[85%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                </div>
                                <p className="mt-3 text-xs text-blue-500 font-semibold bg-blue-50 inline-block px-2 py-1 rounded-md">Idéale pour la baignade</p>
                            </div>

                            {}
                            <div className="bg-white border border-slate-100 rounded-3xl p-8 relative overflow-hidden group hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                    <WaveIcon />
                                </div>
                                <p className="text-cyan-600 font-bold mb-2 uppercase tracking-wide text-xs">Houle</p>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <div className="text-5xl font-bold text-slate-800">
                                        {weather.waveHeight?.toFixed(1) || "--"}
                                    </div>
                                    <span className="text-2xl text-slate-400 font-medium">m</span>
                                </div>

                                <div className="flex items-center gap-4 mt-6">
                                    <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-2 rounded-xl">
                                        <CompassIcon degree={weather.waveDirection || 0} />
                                        <span className="font-bold">{getDirection(weather.waveDirection || 0)}</span>
                                    </div>
                                    <div className="w-px h-8 bg-slate-200"></div>
                                    <div className="text-slate-600">
                                        <span className="font-bold text-lg">{weather.wavePeriod?.toFixed(0)}s</span>
                                        <span className="text-xs text-slate-400 block font-medium">Période</span>
                                    </div>
                                </div>
                            </div>

                            {}
                            <div className="bg-white border border-slate-100 rounded-3xl p-8 relative overflow-hidden group hover:shadow-lg hover:shadow-teal-500/5 transition-all duration-300">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                    <svg className="w-16 h-16 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" /></svg>
                                </div>
                                <p className="text-teal-600 font-bold mb-2 uppercase tracking-wide text-xs">Vent</p>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <div className="text-5xl font-bold text-slate-800">
                                        {Math.round(weather.windMax)}
                                    </div>
                                    <span className="text-2xl text-slate-400 font-medium">km/h</span>
                                </div>
                                <p className="text-slate-500 text-sm font-medium">Rafales maximales</p>

                                <div className={`mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${weather.windMax > 40 ? "bg-orange-50 text-orange-600" : "bg-teal-50 text-teal-600"}`}>
                                    {weather.windMax > 40 ? "Venté" : "Calme"}
                                </div>
                            </div>
                        </div>

                        {}
                        <div className={`rounded-3xl p-6 sm:p-8 border flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left shadow-sm ${weather.waveHeight && weather.waveHeight > 1.8 ? 'bg-orange-50 border-orange-100' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100'}`}>
                            <div className={`p-4 rounded-2xl shrink-0 ${weather.waveHeight && weather.waveHeight > 1.8 ? 'bg-orange-100 text-orange-500' : 'bg-white text-green-500 shadow-sm'}`}>
                                {weather.waveHeight && weather.waveHeight > 1.8 ? (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                ) : (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                )}
                            </div>
                            <div>
                                <h3 className={`text-xl font-bold mb-2 ${weather.waveHeight && weather.waveHeight > 1.8 ? 'text-orange-800' : 'text-green-800'}`}>
                                    {weather.waveHeight && weather.waveHeight > 1.8 ? "Mer Agitée - Soyez Prudents" : "Conditions Idéales pour la Baignade"}
                                </h3>
                                <p className={`text-sm sm:text-base leading-relaxed ${weather.waveHeight && weather.waveHeight > 1.8 ? 'text-orange-700' : 'text-green-700'}`}>
                                    {weather.waveHeight && weather.waveHeight > 1.8
                                        ? "La houle est significative aujourd'hui. La baignade peut être dangereuse par endroits, surtout sur la côte Atlantique. Surveillez les drapeaux sur les plages surveillées."
                                        : "La mer est globalement calme. C'est une excellente journée pour la baignade, le snorkeling ou le paddle. Profitez de l'eau chaude !"}
                                </p>
                            </div>
                        </div>

                    </>
                ) : (
                    <div className="h-96 flex flex-col items-center justify-center text-slate-400">
                        <div className="w-12 h-12 border-4 border-slate-200 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
                        Chargement des données marines...
                    </div>
                )}

            </main>
            <Footer />
        </div>
    )
}