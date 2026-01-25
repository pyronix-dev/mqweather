// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useParams, useSearchParams, useRouter } from "next/navigation"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getDayIndexFromSlug } from "@/lib/utils"
import { useWeather } from "@/hooks/useWeather"

const BackIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
)

export default function RainPage({ initialUser }: { initialUser: any }) {
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
                            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">Précipitations</h1>
                            <p className="text-xl text-slate-500 capitalize">{formatDate(weather.date)} - {cityName}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-blue-50 rounded-2xl p-8 text-center">
                                <p className="text-blue-600 font-medium mb-2">Probabilité Max</p>
                                <div className="text-6xl font-bold text-slate-800">
                                    {weather.precipitation}%
                                </div>
                            </div>
                            <div className="bg-indigo-50 rounded-2xl p-8 text-center">
                                <p className="text-indigo-600 font-medium mb-2">Volume Total</p>
                                <div className="text-6xl font-bold text-slate-800">
                                    {weather.precipSum?.toFixed(1)} <span className="text-3xl text-slate-500">mm</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-96 w-full">
                            <h3 className="text-lg font-bold text-slate-800 mb-6">Risque de pluie par heure</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={hourlyData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                    <XAxis dataKey="time" stroke="#9ca3af" tickMargin={10} interval={2} />
                                    <YAxis stroke="#9ca3af" domain={[0, 100]} width={40} />
                                    <Tooltip
                                        cursor={{ fill: '#f1f5f9' }}
                                        contentStyle={{ backgroundColor: "#ffffff", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", borderRadius: "16px", padding: "12px" }}
                                        formatter={(value: number) => [`${value}%`, "Probabilité"]}
                                        labelStyle={{ color: "#6b7280", marginBottom: "4px" }}
                                    />
                                    <Bar dataKey="precipitation" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={20} />
                                </BarChart>
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