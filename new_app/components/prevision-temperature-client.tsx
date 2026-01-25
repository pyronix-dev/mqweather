// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useParams, useSearchParams, useRouter } from "next/navigation"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getDayIndexFromSlug } from "@/lib/utils"
import { useWeather } from "@/hooks/useWeather"

const BackIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
)

export default function TemperaturePage({ initialUser }: { initialUser: any }) {
    const params = useParams()
    const searchParams = useSearchParams()
    const router = useRouter()

    const cityName = searchParams.get("city") || "Fort-de-France"
    const lat = searchParams.get("lat") || "14.6161"
    const lon = searchParams.get("lon") || "-61.059"

    const dayParam = Array.isArray(params.day) ? params.day[0] : params.day
    const dayIndex = getDayIndexFromSlug(dayParam || "today")

    const { weather, hourlyData, loading } = useWeather(lat, lon, dayIndex)

    const handleBack = () => {
        router.push(`/previsions/${dayParam}?city=${encodeURIComponent(cityName)}&lat=${lat}&lon=${lon}`)
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

    return (
        <div className="min-h-screen bg-background">
            <Header initialUser={initialUser} />
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <button
                    onClick={handleBack}
                    className="group flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium mb-6 transition-colors"
                >
                    <span className="p-2 rounded-xl bg-slate-100 group-hover:bg-slate-200 transition-colors">
                        <BackIcon />
                    </span>
                    <span>Retour au résumé</span>
                </button>

                {!loading && weather ? (
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
                        <div className="mb-8 border-b border-slate-100 pb-6">
                            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">Température</h1>
                            <p className="text-xl text-slate-500 capitalize">{formatDate(weather.date)} - {cityName}</p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-12 items-center mb-12">
                            <div className="flex-1 text-center md:text-left">
                                <div className="inline-block bg-orange-50 text-orange-600 px-4 py-2 rounded-full font-medium mb-4">
                                    Maximales
                                </div>
                                <div className="text-8xl font-bold text-slate-800 tracking-tight">
                                    {Math.round(weather.maxTemp)}°
                                </div>
                            </div>
                            <div className="w-px h-32 bg-slate-200 hidden md:block"></div>
                            <div className="flex-1 text-center md:text-left">
                                <div className="inline-block bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-medium mb-4">
                                    Minimales
                                </div>
                                <div className="text-8xl font-bold text-slate-400 tracking-tight">
                                    {Math.round(weather.minTemp)}°
                                </div>
                            </div>
                        </div>

                        <div className="h-96 w-full">
                            <h3 className="text-lg font-bold text-slate-800 mb-6">Évolution heure par heure</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={hourlyData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorTempBig" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                    <XAxis dataKey="time" stroke="#9ca3af" tickMargin={10} />
                                    <YAxis stroke="#9ca3af" domain={['auto', 'auto']} width={40} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#ffffff", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", borderRadius: "16px", padding: "12px" }}
                                        formatter={(value: number) => [`${Math.round(value)}°C`, ""]}
                                        labelStyle={{ color: "#6b7280", marginBottom: "4px" }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="temp"
                                        stroke="#f59e0b"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorTempBig)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ) : (
                    <div className="h-96 flex items-center justify-center">Loading...</div>
                )}
            </main>
            <Footer />
        </div>
    )
}