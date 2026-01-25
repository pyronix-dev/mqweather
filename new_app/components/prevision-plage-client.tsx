// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useParams, useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getDayIndexFromSlug } from "@/lib/utils"
import { useWeather } from "@/hooks/useWeather"

const BackIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
)

const WaveIcon = () => (
    <svg className="w-16 h-16 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75c5.4 0 8.25-7.5 11.25-7.5s5.85 7.5 11.25 7.5" />
        <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M2.25 19.5c5.4 0 8.25-7.5 11.25-7.5s5.85 7.5 11.25 7.5" />
    </svg>
)

const CompassIcon = ({ degree }: { degree: number }) => (
    <div className="relative w-16 h-16 flex items-center justify-center border-2 border-slate-300 rounded-full" style={{ transform: `rotate(${degree}deg)` }}>
        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-b-[20px] border-b-red-500 border-r-[6px] border-r-transparent absolute -top-1"></div>
        <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
    </div>
)

export default function BeachPage({ initialUser }: { initialUser: any }) {
    const params = useParams()
    const searchParams = useSearchParams()
    const router = useRouter()

    const cityName = searchParams.get("city") || "Fort-de-France"
    const lat = searchParams.get("lat") || "14.6161"
    const lon = searchParams.get("lon") || "-61.059"

    const dayParam = Array.isArray(params.day) ? params.day[0] : params.day
    const dayIndex = getDayIndexFromSlug(dayParam || "today")

    const { weather, loading } = useWeather(lat, lon, dayIndex)

    const source = searchParams.get("source")

    const handleBack = () => {
        if (source === "map") {
            router.push("/cartes/plages")
        } else {
            router.push(`/previsions/${dayParam}?city=${encodeURIComponent(cityName)}&lat=${lat}&lon=${lon}`)
        }
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

    
    const getDirection = (angle: number) => {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
        return directions[Math.round(angle / 45) % 8];
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
                            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">Conditions Plage</h1>
                            <p className="text-xl text-slate-500 capitalize">{formatDate(weather.date)} - {cityName}</p>
                        </div>

                        {weather.waveHeight !== undefined ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                                {}
                                <div className="bg-cyan-50 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                                    <WaveIcon />
                                    <p className="text-cyan-700 font-medium mt-4 mb-2 uppercase tracking-wide text-sm">Hauteur des Vagues</p>
                                    <div className="text-5xl font-bold text-slate-800">
                                        {weather.waveHeight.toFixed(1)}
                                        <span className="text-2xl text-slate-500 ml-1">m</span>
                                    </div>
                                </div>

                                {}
                                <div className="bg-slate-50 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                                    <CompassIcon degree={weather.waveDirection || 0} />
                                    <p className="text-slate-600 font-medium mt-4 mb-2 uppercase tracking-wide text-sm">Direction Houle</p>
                                    <div className="text-4xl font-bold text-slate-800">
                                        {getDirection(weather.waveDirection || 0)}
                                    </div>
                                    <p className="text-sm text-slate-400 mt-1">{weather.waveDirection}°</p>
                                </div>

                                {}
                                <div className="bg-teal-50 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                                    <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full text-2xl font-bold text-teal-600 shadow-sm">
                                        T
                                    </div>
                                    <p className="text-teal-700 font-medium mt-4 mb-2 uppercase tracking-wide text-sm">Période</p>
                                    <div className="text-5xl font-bold text-slate-800">
                                        {weather.wavePeriod?.toFixed(0)}
                                        <span className="text-2xl text-slate-500 ml-1">s</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                                <p className="text-slate-500 text-lg">Données maritimes non disponibles pour cette localité (intérieur des terres).</p>
                                <p className="text-slate-400 text-sm mt-2">Essayez une ville côtière comme Le Diamant ou Sainte-Anne.</p>
                            </div>
                        )}

                        <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                            <h3 className="text-lg font-bold text-blue-900 mb-2">Note sur la baignade</h3>
                            <p className="text-blue-700">
                                {weather.waveHeight && weather.waveHeight > 1.5
                                    ? "⚠️ Mer agitée. Prudence recommandée pour la baignade."
                                    : "✅ Mer calme à peu agitée. Baignade favorable."}
                            </p>
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