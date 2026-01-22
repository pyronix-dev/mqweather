"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MartiniqueMap, MapMarker } from "@/components/MartiniqueMap"
import { MapControls } from "@/components/MapControls"
import { MARTINIQUE_CITIES } from "@/lib/constants"
import { useMapUrlState } from "@/hooks/useMapUrlState"
import { getWeatherIcon } from "@/lib/weather-icons"

// Simple weather icon for header
const WeatherIcon = () => (
  <svg className="w-8 h-8 text-slate-600" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5.64 5.64l1.42 1.42M16.95 16.95l1.41 1.41M5.64 18.36l1.42-1.42M16.95 7.05l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
)

// Function to generate weather summary text based on conditions
function generateWeatherSummary(weatherData: any[], selectedDay: number): string {
  if (!weatherData.length) return "Chargement des données météo..."

  const today = new Date()
  today.setDate(today.getDate() + selectedDay)
  const dayName = today.toLocaleDateString('fr-FR', { weekday: 'long' })
  const dateStr = today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })

  // Analyze weather conditions across all cities
  let rainyCount = 0
  let cloudyCount = 0
  let sunnyCount = 0
  const rainyAreas: string[] = []
  const cloudyAreas: string[] = []

  weatherData.forEach((data, index) => {
    if (!data?.daily?.weather_code) return
    const code = data.daily.weather_code[selectedDay]
    const cityName = MARTINIQUE_CITIES[index]?.name || ''

    if (code >= 51 && code <= 99) {
      rainyCount++
      rainyAreas.push(cityName)
    } else if (code >= 1 && code <= 50) {
      cloudyCount++
      cloudyAreas.push(cityName)
    } else {
      sunnyCount++
    }
  })

  const total = weatherData.length
  let dayLabel = selectedDay === 0 ? "Aujourd'hui" : selectedDay === 1 ? "Demain" : `Le ${dayName}`
  let summary = `${dayLabel}, ${dateStr}, `

  if (sunnyCount > total * 0.7) {
    summary += "le temps est généralement beau avec un ciel dégagé sur l'ensemble de l'île. "
  } else if (cloudyCount > total * 0.5) {
    summary += "un temps nuageux est attendu sur une grande partie de la Martinique. "
  } else if (rainyCount > total * 0.5) {
    summary += "la pluie est prévue sur une grande partie de l'île. "
  } else {
    summary += "le temps est variable selon les régions. "
  }

  if (rainyAreas.length > 0 && rainyAreas.length <= 3) {
    summary += `De la pluie est attendue sur ${rainyAreas.join(', ')}. `
  } else if (rainyAreas.length > 3) {
    summary += `De la pluie est prévue dans plusieurs communes. `
  }

  if (cloudyAreas.length > 0 && cloudyAreas.length <= 2 && rainyAreas.length === 0) {
    summary += `Un passage nuageux est prévu sur ${cloudyAreas.join(' et ')}. `
  }

  return summary.trim()
}

export default function HomePage() {
  const [markers, setMarkers] = useState<MapMarker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { selectedDay, selectedCity, centerOn, handleSearch, handleDaySelect, resetView } = useMapUrlState()
  const [allData, setAllData] = useState<any[]>([])
  const [weatherSummary, setWeatherSummary] = useState("")
  const [aiBulletin, setAiBulletin] = useState("")
  const [bulletinLoading, setBulletinLoading] = useState(false)
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon'>('afternoon')



  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const lats = MARTINIQUE_CITIES.map(c => c.lat).join(",")
        const lons = MARTINIQUE_CITIES.map(c => c.lon).join(",")
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&daily=temperature_2m_max,temperature_2m_min,weather_code&hourly=temperature_2m,weather_code&timezone=America/Martinique`,
          { cache: 'no-store' }
        )
        if (!res.ok) throw new Error(`API Error: ${res.status}`)
        const data = await res.json()
        const results = Array.isArray(data) ? data : [data]
        setAllData(results)
      } catch (e) {
        console.error("Error fetching weather data", e)
        setError("Impossible de charger les données météo")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Fetch AI-generated bulletin when data changes
  useEffect(() => {
    if (!allData.length) return

    // Generate simple fallback summary
    setWeatherSummary(generateWeatherSummary(allData, selectedDay))

    // Fetch AI bulletin
    async function fetchAIBulletin() {
      setBulletinLoading(true)
      try {
        const enrichedData = allData.map((data, index) => ({
          ...data,
          cityName: MARTINIQUE_CITIES[index]?.name
        }))

        const res = await fetch('/api/weather-bulletin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ weatherData: enrichedData, selectedDay, selectedCity })
        })

        if (res.ok) {
          const result = await res.json()
          setAiBulletin(result.bulletin)
        }
      } catch (e) {
        console.error('Failed to fetch AI bulletin:', e)
      } finally {
        setBulletinLoading(false)
      }
    }

    fetchAIBulletin()

    // Create markers
    const newMarkers = MARTINIQUE_CITIES.map((city, index) => {
      const cityData = allData[index]
      if (!cityData || !cityData.daily || !cityData.hourly) return null

      // Switch to hourly data logic based on timeOfDay
      const baseIndex = selectedDay * 24
      const hourOffset = timeOfDay === 'morning' ? 8 : 14
      const dataIndex = baseIndex + hourOffset

      // Fallback safe access
      if (!cityData.hourly.temperature_2m || !cityData.hourly.temperature_2m[dataIndex]) return null

      const temp = Math.round(cityData.hourly.temperature_2m[dataIndex])
      const weatherCode = cityData.hourly.weather_code[dataIndex] || 0

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
                px-3 py-2 rounded-2xl shadow-lg border border-white/50 backdrop-blur-md flex items-center gap-2
                transition-all duration-300 hover:scale-110 hover:shadow-xl
                bg-white/90
            `}>
              <span className="text-2xl drop-shadow-sm filter">
                {getWeatherIcon(weatherCode)}
              </span>
              <span className="font-black text-lg leading-none tracking-tight text-slate-800">{temp}°</span>
            </div>

            {/* City Name Label on hover */}
            <span className="text-[10px] font-bold text-slate-700 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full mt-2 shadow-md border border-white/50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-1">
              {city.name}
            </span>
          </div>
        )
      }
    }).filter(Boolean) as MapMarker[]

    setMarkers(newMarkers)
  }, [selectedDay, allData, handleSearch, selectedCity, timeOfDay])

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Header />
      <main className="flex-1 w-full px-4 sm:px-6 py-6">
        {/* Two Column Layout like Vigilance Page */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch max-w-[1600px] mx-auto">

          <div className="lg:col-span-2 relative w-full h-auto min-h-[800px] md:min-h-[650px] lg:min-h-[700px] animate-fade-in-up">
            <div className="absolute inset-0 bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col">
              {/* Map Header */}
              <div className="p-5 border-b border-slate-200 flex-shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-100 rounded-xl">
                      <WeatherIcon />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                        Météo Martinique
                      </h1>
                      <p className="text-slate-500 text-sm mt-0.5">
                        Prévisions sur 7 jours
                      </p>
                    </div>
                  </div>
                </div>

                {/* Day Selector */}
                <div className="mt-4">
                  <MapControls
                    onSearch={handleSearch}
                    onDaySelect={handleDaySelect}
                    selectedDay={selectedDay}
                  />

                  {/* Time Toggle - Positioned below day selector */}
                  <div className="flex justify-center md:justify-start mt-4">
                    <div className="bg-slate-100 p-1 rounded-xl flex items-center shadow-inner">
                      <button
                        onClick={() => setTimeOfDay('morning')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-2 ${timeOfDay === 'morning'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        <span>Matin</span>
                      </button>
                      <button
                        onClick={() => setTimeOfDay('afternoon')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-2 ${timeOfDay === 'afternoon'
                          ? 'bg-white text-red-600 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        <span>Après-midi</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Container */}
              <div className="flex-1 relative">
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin"></div>
                      <p className="text-slate-500 font-medium">Chargement de la carte...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <p className="text-red-600 font-bold">{error}</p>
                      <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-xl font-bold hover:bg-sky-600 transition-colors"
                      >
                        Réessayer
                      </button>
                    </div>
                  </div>
                ) : (
                  <MartiniqueMap markers={markers} centerOn={centerOn} onReset={resetView} />
                )}

                {/* Legend Overlay - hidden on mobile */}
                <div className="hidden sm:block absolute bottom-4 left-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 z-10 animate-slide-in-left">
                  <div className="text-xs font-bold text-slate-600 mb-3 uppercase tracking-wider">Légende</div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="12" r="5" />
                          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                        </svg>
                      </div>
                      <span className="text-xs text-slate-600 font-medium">Ensoleillé</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
                        </svg>
                      </div>
                      <span className="text-xs text-slate-600 font-medium">Nuageux</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.5 19a4.5 4.5 0 100-9 4.5 4.5 0 000 9z" opacity="0.3" />
                          <path d="M7 14l-1 4M11 14l-1 4M15 14l-1 4M5 18l-1 4M9 18l-1 4M13 18l-1 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                          <path d="M16.5 8A5.49 5.49 0 0012 4a5.5 5.5 0 00-5.27 4A4 4 0 003 12a4 4 0 004 4h9.5a3.5 3.5 0 000-7z" fill="currentColor" opacity="0.6" />
                        </svg>
                      </div>
                      <span className="text-xs text-slate-600 font-medium">Pluie</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Column (1/3 width) */}
          <div className="space-y-5 animate-slide-in-right">
            {/* AI Weather Bulletin Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-[346px] flex flex-col">
              {/* Header */}
              <div className="bg-slate-800 p-5 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{selectedCity ? `Météo à ${selectedCity}` : "Bulletin Météo"}</h2>
                    <p className="text-white/60 text-xs">
                      {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col min-h-0 bg-white">
                {loading || bulletinLoading ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-5 space-y-3 opacity-60">
                    <div className="w-8 h-8 relative animate-spin">
                      <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
                    </div>
                    <p className="text-sm font-medium text-indigo-600 animate-pulse">
                      Génération du bulletin...
                    </p>
                  </div>
                ) : error ? (
                  <div className="text-center py-6 flex-1 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <p className="text-red-500 font-medium">Bulletin non disponible</p>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-1">
                      <div className="bg-gradient-to-br from-slate-50 to-sky-50 rounded-2xl p-4 border border-slate-100">
                        <p className="text-slate-700 text-sm leading-relaxed">
                          {(aiBulletin || weatherSummary).split(/(\*\*[^*]+\*\*)/).map((part, i) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return (
                                <span key={i} className="font-bold text-sky-600">
                                  {part.slice(2, -2)}
                                </span>
                              )
                            }
                            return part
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Quick Stats fixed at bottom */}
                    {allData.length > 0 && allData[0]?.daily && (
                      <div className="p-4 border-t border-slate-100 bg-white z-10">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-red-50 rounded-lg p-3 border border-red-100 text-center">
                            <span className="text-xs text-red-600 font-bold block mb-1">Après-midi</span>
                            <p className="text-xl font-black text-red-700 leading-none">
                              {Math.round(Math.max(...allData.map(d => d.daily?.temperature_2m_max?.[selectedDay] || 0)))}°C
                            </p>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 text-center">
                            <span className="text-xs text-blue-600 font-bold block mb-1">Matin</span>
                            <p className="text-xl font-black text-blue-700 leading-none">
                              {Math.round(Math.min(...allData.map(d => d.daily?.temperature_2m_min?.[selectedDay] || 99)))}°C
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Quick Access Cards */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">Cartes Détaillées</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    name: 'Températures',
                    href: '/cartes/temperature',
                    color: 'from-red-400 to-orange-500',
                    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  },
                  {
                    name: 'Vent',
                    href: '/cartes/vent',
                    color: 'from-teal-400 to-cyan-500',
                    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  },
                  {
                    name: 'Pluie',
                    href: '/cartes/pluie',
                    color: 'from-blue-400 to-indigo-500',
                    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                  },
                  {
                    name: 'UV',
                    href: '/cartes/uv',
                    color: 'from-amber-400 to-yellow-500',
                    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group relative flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-slate-300 hover:bg-gradient-to-br hover:from-white hover:to-slate-50 overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                    <div className="flex items-center gap-2.5 relative z-10">
                      <span className="text-slate-600 group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{item.name}</span>
                    </div>
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Marine Weather Link */}
            <a
              href="/meteo-marine"
              className="group block bg-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 15.75c5.4 0 8.25-7.5 11.25-7.5s5.85 7.5 11.25 7.5M2.25 19.5c5.4 0 8.25-7.5 11.25-7.5s5.85 7.5 11.25 7.5" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-sm">Météo Marine</h3>
                  <p className="text-white/60 text-xs">État de la mer</p>
                </div>
                <svg className="w-4 h-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>

            {/* Vigilance Link */}
            <a
              href="/vigilance"
              className="group block bg-slate-700 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-sm">Vigilance Météo</h3>
                  <p className="text-white/60 text-xs">Alertes et avertissements</p>
                </div>
                <svg className="w-4 h-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          </div>
        </div>
      </main>
      <Footer />

      {/* Add custom animation for slow spin */}
      <style jsx global>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
            `}</style>
    </div>
  )
}
