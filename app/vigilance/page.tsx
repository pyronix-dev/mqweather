"use client"

import { useRef, useState } from "react"
import useSWR from "swr"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const SunIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5" strokeWidth="2" />
    <path
      strokeWidth="2"
      d="M12 1v6M12 17v6M23 12h-6M7 12H1M20.485 3.515l-4.242 4.242M7.757 15.728l-4.242 4.242M20.485 20.485l-4.242-4.242M7.757 8.272l-4.242-4.242"
    />
  </svg>
)

const VIGILANCE_COLORS = [
  { id: 1, color: "bg-green-500", name: "vert", label: "Vert - Pas de vigilance" },
  { id: 2, color: "bg-yellow-400", name: "jaune", label: "Jaune - Soyez attentif" },
  { id: 3, color: "bg-orange-500", name: "orange", label: "Orange - Soyez vigilant" },
  { id: 4, color: "bg-red-500", name: "rouge", label: "Rouge - Vigilance absolue" },
  { id: 5, color: "bg-purple-600", name: "violet", label: "Violet - Danger extrême" },
  { id: 0, color: "bg-gray-500", name: "gris", label: "Gris - Fin de vigilance" },
  { id: -1, color: "bg-red-600", name: "erreur", label: "Erreur - Données indisponibles" },
]

interface VigilanceData {
  colorId: number
  colorName: string
  mapUrl: string
  lastUpdate: string
  phenomena: string[]
  error?: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function VigilancePage() {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const {
    data: vigilanceData,
    isLoading,
    error,
  } = useSWR<VigilanceData>("/api/vigilance", fetcher, {
    refreshInterval: 10 * 60 * 1000,
    revalidateOnFocus: true,
    onSuccess: () => setLastRefresh(new Date()),
  })

  const currentVigilance = vigilanceData
    ? VIGILANCE_COLORS.find((c) => c.name === vigilanceData.colorName) || VIGILANCE_COLORS[6]
    : VIGILANCE_COLORS[6]

  const mapUrl = vigilanceData?.mapUrl || "https://raw.githubusercontent.com/pyronix-dev/upwork/main/map_gris.png"

  const formatLastUpdate = () => {
    if (vigilanceData?.lastUpdate) {
      return new Date(vigilanceData.lastUpdate).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
    return lastRefresh.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-1 w-full px-4 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch">
          {/* Map Section */}
          <div className="relative w-full h-auto min-h-[500px] sm:min-h-[600px] lg:min-h-[650px] animate-fade-in-up">
            <div className="absolute inset-0 bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
              <div className="p-4 sm:p-6 border-b border-slate-200 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Carte de Vigilance</h2>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                      État de vigilance météorologique en cours
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {isLoading && (
                      <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                    )}
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${currentVigilance.name === "vert"
                        ? "bg-green-50 border border-green-200"
                        : currentVigilance.name === "jaune"
                          ? "bg-yellow-50 border border-yellow-200"
                          : currentVigilance.name === "orange"
                            ? "bg-orange-50 border border-orange-200"
                            : currentVigilance.name === "rouge"
                              ? "bg-red-50 border border-red-200"
                              : currentVigilance.name === "violet"
                                ? "bg-purple-50 border border-purple-200"
                                : currentVigilance.name === "erreur"
                                  ? "bg-red-100 border border-red-300"
                                  : "bg-gray-50 border border-gray-200"
                        }`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${currentVigilance.color}`} />
                      <span
                        className={`text-xs font-bold capitalize ${currentVigilance.name === "erreur" ? "text-red-600" : "text-slate-700"}`}
                      >
                        {currentVigilance.name === "erreur" ? "Erreur" : currentVigilance.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col flex-1 overflow-hidden">
                <div
                  ref={mapContainerRef}
                  className="flex-1 flex items-center justify-center relative overflow-hidden p-4"
                  style={{ backgroundColor: "#d4dfc4" }}
                >
                  <img
                    src={mapUrl || "/placeholder.svg"}
                    alt="Carte de Martinique"
                    className="max-h-[380px] sm:max-h-[480px] lg:max-h-[550px] w-auto object-contain"
                    draggable={false}
                  />

                  <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm rounded px-2 py-1 shadow-sm">
                    <p className="text-[9px] text-slate-500 font-medium" suppressHydrationWarning>Mise à jour: {formatLastUpdate()}</p>
                  </div>

                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-600 mb-2 uppercase tracking-wide">Légende</p>
                    <div className="flex flex-col gap-1.5 text-[10px] sm:text-xs">
                      {VIGILANCE_COLORS.filter((c) => c.id !== 0).map((item, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2 group ${currentVigilance.name === item.name ? "font-bold" : ""
                            }`}
                        >
                          <div
                            className={`w-2.5 h-2.5 flex-shrink-0 ${item.color} rounded-sm group-hover:scale-110 transition-transform ${currentVigilance.name === item.name ? "ring-2 ring-offset-1 ring-slate-400" : ""
                              }`}
                          />
                          <span className="text-slate-600 font-medium leading-tight">{item.label}</span>
                        </div>
                      ))}
                      <div
                        className={`flex items-center gap-2 group ${currentVigilance.name === "gris" ? "font-bold" : ""}`}
                      >
                        <div
                          className={`w-2.5 h-2.5 flex-shrink-0 bg-gray-500 rounded-sm group-hover:scale-110 transition-transform ${currentVigilance.name === "gris" ? "ring-2 ring-offset-1 ring-slate-400" : ""}`}
                        />
                        <span className="text-slate-600 font-medium leading-tight">Gris - Fin de vigilance</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Bulletin Météo */}
          <div className="w-full space-y-4 sm:space-y-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="text-amber-500 animate-pulse flex-shrink-0">
                  <SunIcon />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800">Bulletin Météo</h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">Martinique</p>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div
                  className={`rounded-xl p-4 ${currentVigilance.name === "vert"
                    ? "bg-green-50 border-l-4 border-green-500"
                    : currentVigilance.name === "jaune"
                      ? "bg-yellow-50 border-l-4 border-yellow-400"
                      : currentVigilance.name === "orange"
                        ? "bg-orange-50 border-l-4 border-orange-500"
                        : currentVigilance.name === "rouge"
                          ? "bg-red-50 border-l-4 border-red-500"
                          : currentVigilance.name === "violet"
                            ? "bg-purple-50 border-l-4 border-purple-600"
                            : currentVigilance.name === "erreur"
                              ? "bg-red-100 border-l-4 border-red-600"
                              : "bg-gray-50 border-l-4 border-gray-500"
                    }`}
                >
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Niveau actuel</p>
                  <p
                    className={`text-sm font-bold ${currentVigilance.name === "erreur" ? "text-red-600" : "text-slate-800"}`}
                  >
                    {currentVigilance.label}
                  </p>
                  {vigilanceData?.phenomena && vigilanceData.phenomena.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {vigilanceData.phenomena.map((p, i) => (
                        <span key={i} className="text-[10px] bg-white/50 px-2 py-0.5 rounded-full text-slate-600">
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="group">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Situation</p>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    Situation météorologique pour la matinée du vendredi. Belle journée en perspective avec un
                    ensoleillement généreux.
                  </p>
                </div>
                <div className="group">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">En Mer</p>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    Vent de travers dans le canal de la Dominique, mer formée.
                  </p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 sm:p-4 border-l-4 border-amber-400">
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">Conseil de Vigilance</p>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">
                    Journée idéale pour les activités en plein air.
                  </p>
                </div>
                <p className="text-xs text-slate-500 border-t border-slate-200 pt-3 sm:pt-4 leading-relaxed font-medium">
                  La Martinique enregistre en moyenne 2800 mm de pluie par an sur les hauteurs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
