// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useRef, useState, useEffect } from "react"
import useSWR from "swr"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VIGILANCE_TEXTS, VigilanceContent } from "../app/vigilance/vigilance-texts"
import { Smartphone, TriangleAlert, CheckCircle, Info, Sun } from "lucide-react"



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

export function VigilanceClient({ initialUser }: { initialUser: any }) {
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

  const mapUrl = vigilanceData?.mapUrl || "https://raw.githubusercontent.com/pyronix-dev/upwork/main/error.png"

  

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
      <Header initialUser={initialUser} />
      <main className="flex-1 w-full px-4 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch">
          {}
          <div className="relative w-full h-auto min-h-[500px] sm:min-h-[600px] lg:min-h-[650px] animate-fade-in-up">
            <div
              className={`absolute inset-0 bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col ${currentVigilance.name === "rouge"
                ? "pulse-border-red border-red-200"
                : currentVigilance.name === "violet"
                  ? "pulse-border-violet border-purple-200"
                  : ""
                }`}
            >
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
                    {isLoading ? (
                      <div className="w-20 h-6 bg-slate-200 rounded-full animate-pulse" />
                    ) : (
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
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col flex-1 overflow-hidden">
                <div
                  ref={mapContainerRef}
                  className="flex-1 flex items-center justify-center relative overflow-hidden p-4"
                  style={{ backgroundColor: "#f7f7f7" }}
                >
                  {isLoading ? (
                    <div className="w-full h-[380px] sm:h-[480px] lg:h-[550px] flex items-center justify-center">
                      <div className="w-[80%] h-[80%] bg-slate-200 animate-pulse rounded-2xl opacity-50 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shimmer" />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={mapUrl || "/placeholder.svg"}
                      alt="Carte de Martinique"
                      className="max-h-[380px] sm:max-h-[480px] lg:max-h-[550px] w-auto object-contain"
                      draggable={false}
                    />
                  )}

                  <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm rounded px-2 py-1 shadow-sm">
                    <p className="text-[9px] text-slate-500 font-medium" suppressHydrationWarning>Mise à jour: {formatLastUpdate()}</p>
                  </div>

                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-600 mb-2 uppercase tracking-wide">Légende</p>
                    <div className="flex flex-col gap-1.5 text-[10px] sm:text-xs">
                      {VIGILANCE_COLORS.filter((c) => c.id !== 0 && c.id !== -1).map((item, i) => (
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

          {}
          <div className="w-full space-y-4 sm:space-y-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="text-amber-500 animate-pulse flex-shrink-0">
                  <Sun className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800">Bulletin Météo</h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">Martinique</p>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                {isLoading ? (
                  <>
                    <div className="rounded-xl p-4 bg-gray-50 border-l-4 border-gray-200">
                      <div className="h-3 w-24 bg-slate-200 rounded animate-pulse mb-2" />
                      <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-2" />
                      <div className="flex gap-1 mt-2">
                        <div className="h-4 w-16 bg-slate-200 rounded-full animate-pulse" />
                        <div className="h-4 w-16 bg-slate-200 rounded-full animate-pulse" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
                      <div className="space-y-1">
                        <div className="h-3 w-full bg-slate-200 rounded animate-pulse" />
                        <div className="h-3 w-4/5 bg-slate-200 rounded animate-pulse" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
                      <div className="h-3 w-3/4 bg-slate-200 rounded animate-pulse" />
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3 sm:p-4 border-l-4 border-slate-200">
                      <div className="h-3 w-32 bg-slate-200 rounded animate-pulse mb-2" />
                      <div className="h-3 w-full bg-slate-200 rounded animate-pulse" />
                    </div>

                    <div className="border-t border-slate-200 pt-3 sm:pt-4">
                      <div className="h-3 w-full bg-slate-200 rounded animate-pulse" />
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className={`rounded-xl p-3 sm:p-4 border-l-4 transition-colors duration-300 ${currentVigilance.name === "vert"
                        ? "bg-green-50/80 border-green-500"
                        : currentVigilance.name === "jaune"
                          ? "bg-yellow-50/80 border-yellow-400"
                          : currentVigilance.name === "orange"
                            ? "bg-orange-50/80 border-orange-500"
                            : currentVigilance.name === "rouge"
                              ? "bg-red-50/80 border-red-500"
                              : currentVigilance.name === "violet"
                                ? "bg-purple-50/80 border-purple-600"
                                : currentVigilance.name === "erreur"
                                  ? "bg-red-100/80 border-red-600"
                                  : "bg-gray-50/80 border-gray-500"
                        }`}
                    >
                      {}
                      {(() => {
                        const colorKey = currentVigilance.name as keyof typeof VIGILANCE_TEXTS
                        
                        const content: VigilanceContent = (VIGILANCE_TEXTS[colorKey] || VIGILANCE_TEXTS['erreur']) as any

                        return (
                          <div className="space-y-2.5">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wide opacity-70 mb-0.5 flex items-center gap-1">
                                <Info className="w-3 h-3" />
                                Situation Actuelle
                              </p>
                              <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                                {content.headline}
                              </h4>
                              <div className="text-[11px] sm:text-xs text-slate-700 mt-1.5 whitespace-pre-wrap leading-relaxed">
                                {content.description}
                              </div>
                            </div>

                            {}
                            {content.showSubscription && (
                              <div className="bg-white/60 rounded-lg p-2 border border-slate-200/50 flex items-start gap-2">
                                <div className="p-1 bg-blue-100 text-blue-600 rounded-md flex-shrink-0">
                                  <Smartphone className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-slate-800 leading-tight">Restez informé en temps réel</p>
                                  <p className="text-[10px] text-slate-600 mt-0.5 leading-tight">
                                    Abonnez-vous :{" "}
                                    <a href="https://www.meteo-martinique.fr/alertes" target="_blank" rel="noreferrer" className="text-blue-600 font-medium hover:underline">
                                      meteo-martinique.fr/alertes
                                    </a>
                                  </p>
                                </div>
                              </div>
                            )}

                            {}
                            {content.impacts && content.impacts.length > 0 && (
                              <div className="bg-white/40 rounded-lg p-2.5">
                                <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                                  <TriangleAlert className="w-3 h-3" />
                                  Impacts Possibles
                                </p>
                                <ul className="space-y-1">
                                  {content.impacts.map((impact, idx) => (
                                    <li key={idx} className="text-[10px] sm:text-[11px] text-slate-700 flex items-start gap-1.5 leading-snug">
                                      <span className="mt-1 w-1 h-1 rounded-full bg-slate-400 flex-shrink-0" />
                                      <span>{impact}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {}
                            {content.recommendations && content.recommendations.length > 0 && (
                              <div className="bg-white/60 rounded-lg p-2.5 border border-slate-200/50">
                                <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Recommandations & Consignes
                                </p>
                                <ul className="space-y-1">
                                  {content.recommendations.map((rec, idx) => (
                                    <li key={idx} className="text-[10px] sm:text-[11px] text-slate-700 flex items-start gap-1.5 leading-snug">
                                      <span className={`mt-1 w-1 h-1 rounded-full flex-shrink-0 ${currentVigilance.name === 'vert' ? 'bg-green-500' :
                                        currentVigilance.name === 'jaune' ? 'bg-yellow-500' :
                                          currentVigilance.name === 'orange' ? 'bg-orange-500' :
                                            'bg-red-500'
                                        }`} />
                                      <span>{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {}
                            {content.footer && (
                              <p className="text-[10px] text-slate-500 italic border-t border-slate-200/50 pt-2 mt-1.5 whitespace-pre-wrap leading-tight">
                                {content.footer}
                              </p>
                            )}

                          </div>
                        )
                      })()}

                      {}
                      {vigilanceData?.phenomena && vigilanceData.phenomena.length > 0 && (
                        <div className="mt-3 border-t border-black/5 pt-2">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Phénomènes Identifiés (Météo-France)</p>
                          <div className="flex flex-col gap-1.5">
                            {vigilanceData.phenomena.map((p, i) => (
                              <div key={i} className="flex items-center gap-1.5 bg-white/60 p-1.5 rounded-md">
                                <span className={`w-1.5 h-1.5 rounded-full ${currentVigilance.color}`}></span>
                                <span className="text-xs font-bold text-slate-700">
                                  {p}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-amber-50 rounded-xl p-2.5 border-l-4 border-amber-400 mt-3">
                      <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1.5">Conseil de Vigilance</p>
                      <div className="text-[10px] text-slate-600 border-t border-amber-200 pt-2 leading-tight font-medium space-y-1.5">
                        <p>Nous fournissons une vigilance Martinique en direct aussi fiable que possible.</p>
                        <p>
                          Suivez toujours en priorité les consignes officielles :<br />
                          • Météo-France • Préfecture • Sécurité Civile
                        </p>
                        <p className="font-bold text-slate-700">Danger immédiat ? Appelez le 18 / 15 / 17 / 112.</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}