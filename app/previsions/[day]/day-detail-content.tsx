// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getDayIndexFromSlug } from "@/lib/utils"
import { useWeather } from "@/hooks/useWeather"

const BackIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
)

const SunIcon = () => (
  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
)

const CloudIcon = () => (
  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
    />
  </svg>
)

const CloudRainIcon = () => (
  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
    />
    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M8 19v2m4-2v2m4-2v2" />
  </svg>
)

const ThermometerIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
  </svg>
)

const HumidityIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
  </svg>
)

const WindIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"
    />
  </svg>
)

const PressureIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
)

const SunriseIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2v8" />
    <path d="m4.93 10.93 1.41 1.41" />
    <path d="M2 18h2" />
    <path d="M20 18h2" />
    <path d="m19.07 10.93-1.41 1.41" />
    <path d="M22 22H2" />
    <path d="m8 6 4-4 4 4" />
    <path d="M16 18a4 4 0 0 0-8 0" />
  </svg>
)

const SunsetIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 10V2" />
    <path d="m4.93 10.93 1.41 1.41" />
    <path d="M2 18h2" />
    <path d="M20 18h2" />
    <path d="m19.07 10.93-1.41 1.41" />
    <path d="M22 22H2" />
    <path d="m16 6-4 4-4-4" />
    <path d="M16 18a4 4 0 0 0-8 0" />
  </svg>
)

const UVIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v1" />
    <path d="M12 20v1" />
    <path d="M3 12h1" />
    <path d="M20 12h1" />
    <path d="m18.364 5.636-.707.707" />
    <path d="m6.343 17.657-.707.707" />
    <path d="m5.636 5.636.707.707" />
    <path d="m17.657 17.657.707.707" />
  </svg>
)

const RainIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
    />
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 19v2m4-2v2m4-2v2" />
  </svg>
)

const getWeatherIcon = (precipitation: number) => {
  if (precipitation > 60) return <CloudRainIcon />
  if (precipitation > 30) return <CloudIcon />
  return <SunIcon />
}

const getWeatherLabel = (precipitation: number) => {
  if (precipitation > 60) return "Pluvieux"
  if (precipitation > 30) return "Nuageux"
  return "Ensoleillé"
}

const getWeatherDescription = (precipitation: number) => {
  if (precipitation > 60) return "Journée pluvieuse avec des averses fréquentes. Prévoyez un parapluie."
  if (precipitation > 30) return "Ciel partiellement nuageux avec possibilité d'éclaircies."
  return "Belle journée ensoleillée. Conditions idéales pour les activités extérieures."
}

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
)

export default function DayDetailContent({ initialUser }: { initialUser: any }) {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  
  const dayParam = Array.isArray(params.day) ? params.day[0] : params.day
  const dayIndex = getDayIndexFromSlug(dayParam || "today")

  const cityName = searchParams.get("city") || "Fort-de-France"
  const lat = searchParams.get("lat") || "14.6161"
  const lon = searchParams.get("lon") || "-61.059"

  const { weather, hourlyData, loading } = useWeather(lat, lon, dayIndex)

  const handleBack = () => {
    router.push(`/previsions?city=${encodeURIComponent(cityName)}&lat=${lat}&lon=${lon}`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header initialUser={initialUser} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {}
        <button
          onClick={handleBack}
          className="group flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium mb-6 transition-colors"
        >
          <span className="p-2 rounded-xl bg-slate-100 group-hover:bg-slate-200 transition-colors">
            <BackIcon />
          </span>
          <span>Retour aux prévisions</span>
        </button>

        {loading ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-3xl p-6 sm:p-8">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-5 w-40 mb-8" />
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <Skeleton className="w-32 h-32 rounded-full" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-16 w-32" />
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full max-w-md" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          </div>
        ) : weather ? (
          <>
            {}
            <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-3xl p-6 sm:p-8 mb-6 border border-amber-100 shadow-sm">
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 capitalize">{formatDate(weather.date)}</h1>
                <p className="text-slate-600">{cityName}, Martinique</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
                <div className="text-amber-500">{getWeatherIcon(weather.precipitation)}</div>

                <div className="text-center sm:text-left">
                  <div className="flex items-baseline gap-3 justify-center sm:justify-start">
                    <span className="text-6xl sm:text-7xl font-bold text-slate-800">
                      {Math.round(weather.maxTemp)}°
                    </span>
                    <span className="text-3xl text-slate-400">/ {Math.round(weather.minTemp)}°</span>
                  </div>
                  <p className="text-xl font-semibold text-slate-700 mt-2">{getWeatherLabel(weather.precipitation)}</p>
                  <p className="text-slate-500 mt-1 max-w-md">{getWeatherDescription(weather.precipitation)}</p>
                </div>
              </div>
            </div>

            {}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-orange-500 mb-2">
                  <ThermometerIcon />
                  <span className="text-sm font-medium text-slate-500">Ressenti</span>
                </div>
                <p className="text-2xl font-bold text-slate-800">
                  {Math.round((weather.maxTemp + weather.minTemp) / 2)}°C
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-blue-500 mb-2">
                  <HumidityIcon />
                  <span className="text-sm font-medium text-slate-500">Humidité</span>
                </div>
                <p className="text-2xl font-bold text-slate-800">{65 + dayIndex * 2}%</p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-teal-500 mb-2">
                  <WindIcon />
                  <span className="text-sm font-medium text-slate-500">Vent max</span>
                </div>
                <p className="text-2xl font-bold text-slate-800">{Math.round(weather.windMax)} km/h</p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-purple-500 mb-2">
                  <PressureIcon />
                  <span className="text-sm font-medium text-slate-500">Pression</span>
                </div>
                <p className="text-2xl font-bold text-slate-800">{1013 + dayIndex} hPa</p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-amber-500 mb-2">
                  <SunriseIcon />
                  <span className="text-sm font-medium text-slate-500">Lever</span>
                </div>
                <p className="text-2xl font-bold text-slate-800">{formatTime(weather.sunrise)}</p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-orange-500 mb-2">
                  <SunsetIcon />
                  <span className="text-sm font-medium text-slate-500">Coucher</span>
                </div>
                <p className="text-2xl font-bold text-slate-800">{formatTime(weather.sunset)}</p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-yellow-500 mb-2">
                  <UVIcon />
                  <span className="text-sm font-medium text-slate-500">Indice UV</span>
                </div>
                <p className="text-2xl font-bold text-slate-800">{Math.round(weather.uvIndex)}</p>
                <p className="text-xs text-slate-400">
                  {weather.uvIndex > 7 ? "Très élevé" : weather.uvIndex > 5 ? "Élevé" : "Modéré"}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-blue-500 mb-2">
                  <RainIcon />
                  <span className="text-sm font-medium text-slate-500">Précipitations</span>
                </div>
                <p className="text-2xl font-bold text-slate-800">{weather.precipSum?.toFixed(1) || 0} mm</p>
                <p className="text-xs text-slate-400">{weather.precipitation}% chance</p>
              </div>
            </div>

            {}
            <div
              onClick={() => router.push(`/previsions/${dayParam}/temperature?city=${encodeURIComponent(cityName)}&lat=${lat}&lon=${lon}`)}
              className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 mb-6 cursor-pointer hover:border-orange-300 hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-orange-500 transition-colors">Température horaire</h3>
                <span className="text-sm text-slate-400 group-hover:text-orange-500">Voir détails →</span>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={hourlyData} margin={{ top: 10, right: 0, left: -30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTempDetail" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" stroke="#6b7280" style={{ fontSize: "10px" }} interval={2} />
                  <YAxis stroke="#6b7280" style={{ fontSize: "10px" }} domain={["auto", "auto"]} width={30} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px" }}
                    labelStyle={{ color: "#374151", fontWeight: "bold" }}
                    formatter={(value: number) => [`${Math.round(value)}°C`, "Température"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="temp"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTempDetail)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div
                onClick={() => router.push(`/previsions/${dayParam}/pluie?city=${encodeURIComponent(cityName)}&lat=${lat}&lon=${lon}`)}
                className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-500 transition-colors">Probabilité de pluie</h3>
                  <span className="text-sm text-slate-400 group-hover:text-blue-500">Voir détails →</span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={hourlyData} margin={{ top: 10, right: 0, left: -30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="time" stroke="#6b7280" style={{ fontSize: "10px" }} interval={3} />
                    <YAxis stroke="#6b7280" style={{ fontSize: "10px" }} domain={[0, 100]} width={30} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px" }}
                      formatter={(value: number) => [`${value}%`, "Probabilité"]}
                    />
                    <Bar dataKey="precipitation" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div
                onClick={() => router.push(`/previsions/${dayParam}/vent?city=${encodeURIComponent(cityName)}&lat=${lat}&lon=${lon}`)}
                className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 cursor-pointer hover:border-teal-300 hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-teal-500 transition-colors">Vitesse du vent</h3>
                  <span className="text-sm text-slate-400 group-hover:text-teal-500">Voir détails →</span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={hourlyData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="time" stroke="#6b7280" style={{ fontSize: "10px" }} interval={3} />
                    <YAxis stroke="#6b7280" style={{ fontSize: "10px" }} width={30} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px" }}
                      formatter={(value: number) => [`${Math.round(value)} km/h`, "Vent"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="wind"
                      stroke="#14b8a6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorWind)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {}
            <div
              onClick={() => router.push(`/previsions/${dayParam}/plage?city=${encodeURIComponent(cityName)}&lat=${lat}&lon=${lon}`)}
              className="mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-lg transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Conditions Plage & Marine</h3>
                  <p className="text-cyan-100">Voir la houle, les vagues et la température de l'eau</p>
                </div>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-lg font-medium">
                Voir →
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500">Impossible de charger les données météo.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}