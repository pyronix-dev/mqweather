// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const SunIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="5" fill="#FBBF24" />
        <g stroke="#FBBF24" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </g>
    </svg>
)

const PartlyCloudyIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="9" r="4" fill="#FBBF24" />
        <g stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round">
            <line x1="9" y1="2" x2="9" y2="3" />
            <line x1="15.36" y1="4.64" x2="14.66" y2="5.34" />
            <line x1="2" y1="9" x2="3" y2="9" />
            <line x1="3.34" y1="4.64" x2="4.04" y2="5.34" />
        </g>
        <path
            d="M17 18H7a4 4 0 01-1.5-7.71 5 5 0 019.92.38A3.5 3.5 0 0117 18z"
            fill="#E5E7EB"
            stroke="#D1D5DB"
            strokeWidth="0.5"
        />
    </svg>
)

const CloudyIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path
            d="M18 18H6a4 4 0 01-1.5-7.71 5 5 0 019.92.38A3.5 3.5 0 0118 18z"
            fill="#D1D5DB"
            stroke="#9CA3AF"
            strokeWidth="0.5"
        />
    </svg>
)

const RainIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path
            d="M16 13H6a4 4 0 01-1.5-7.71 5 5 0 019.92.38A3.5 3.5 0 0116 13z"
            fill="#D1D5DB"
            stroke="#9CA3AF"
            strokeWidth="0.5"
        />
        <g stroke="#60A5FA" strokeWidth="2" strokeLinecap="round">
            <line x1="8" y1="15" x2="8" y2="19" />
            <line x1="12" y1="15" x2="12" y2="21" />
            <line x1="16" y1="15" x2="16" y2="18" />
        </g>
    </svg>
)

const ThunderIcon = () => (
    <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M11 5 6 9H2v6h4l5 4V5Z" fill="none" stroke="none" />
        <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9" stroke="#6B7280" />
        <path d="M13 11l-4 6h6l-4 6" stroke="#FBBF24" fill="#FBBF24" />
    </svg>
)

const WindIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round">
        <path d="M9.59 4.59A2 2 0 1111 8H2" />
        <path d="M12.59 19.41A2 2 0 1014 16H2" />
        <path d="M17.73 7.73A2.5 2.5 0 1119.5 12H2" />
    </svg>
)

const WaveIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round">
        <path d="M2 10c2-2 4-3 6-3s4 2 6 3 4 1.5 6 0" />
        <path d="M2 16c2-2 4-3 6-3s4 2 6 3 4 1.5 6 0" />
    </svg>
)

const CycloneIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g fill="#4fd1d9">
            <path d="M58 33.2c-.4-14.1-12.6-24.7-26.7-22.1c-12 2.2-19.3 15.1-13.9 26.1c2.6 5.4 9.1 7.8 14.8 6.5c6-1.3 9.2-8.5 6.9-13.9c-1.3-3-6.3-1.7-5 1.4c2.4 5.7-3.6 9.1-8.5 7c-3.7-1.6-4.9-5.9-4.9-9.6c.1-9.1 10.7-14 18.7-12.6c10.2 1.9 14.6 13.6 13 22.8c-1.7 9.9-10.8 16.5-20.3 18.2c-3.3.6-1.9 5.6 1.4 5C47.6 59.4 58.4 47.8 58 33.2" />
            <path d="M46.6 25.5c-6.4-11.2-25.6-4.9-21 8.2c1.1 3.1 6.1 1.8 5-1.4c-1.7-4.9 1.7-8.3 6.9-7.6c4 .6 6 5.1 6.4 8.6C45.4 45 31.8 51.1 22.5 47c-8.8-3.9-12.7-13.9-10.6-22.9c2.2-9 10.7-16.2 19.9-16.9c3.3-.3 3.3-5.4 0-5.2C18 3.1 7.1 14.4 6.1 28C5 41.6 16.8 54.1 30.5 53.6c14-.5 23-16.1 16.1-28.1" />
        </g>
    </svg>
)

const FogIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round">
        <path d="M4 8h16" />
        <path d="M6 12h12" />
        <path d="M4 16h16" />
        <path d="M8 20h8" />
    </svg>
)

const RefreshIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M1 4v6h6M23 20v-6h-6" />
        <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
    </svg>
)

const Skeleton = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
)

const weatherTypes = [
    { id: "soleil", label: "Soleil", icon: SunIcon },
    { id: "eclaircies", label: "Éclaircies", icon: PartlyCloudyIcon },
    { id: "nuageux", label: "Nuageux", icon: CloudyIcon },
    { id: "pluie", label: "Pluie", icon: RainIcon },
    { id: "orage", label: "Orage", icon: ThunderIcon },
    { id: "vent", label: "Vent", icon: WindIcon },
    { id: "houle", label: "Houle", icon: WaveIcon },
    { id: "cyclone", label: "Cyclone", icon: CycloneIcon },
    { id: "brume", label: "Brume", icon: FogIcon },
]



interface Marker {
    id: string | number
    x: number
    y: number
    type: string
    temp?: string
    details?: string
    createdAt?: Date
}

interface ImageBounds {
    left: number
    top: number
    width: number
    height: number
}

const layoutConfig = {} 

export default function CarteClient({ initialUser }: { initialUser: any }) {
    const [loading, setLoading] = useState(true)
    const [mapLoaded, setMapLoaded] = useState(false)
    const [selectedWeather, setSelectedWeather] = useState<string | null>(null)
    const [temperature, setTemperature] = useState("")
    const [details, setDetails] = useState("")
    const [markers, setMarkers] = useState<Marker[]>([])
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null)

    const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null)
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const mapImageRef = useRef<HTMLImageElement>(null)
    const [imageBounds, setImageBounds] = useState<ImageBounds | null>(null)

    
    const [isDesktop, setIsDesktop] = useState(false)

    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 1280)
        checkDesktop()
        window.addEventListener("resize", checkDesktop)
        return () => window.removeEventListener("resize", checkDesktop)
    }, [])

    
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            
            const target = e.target as HTMLElement
            if (target.closest('[data-marker-popup]') || target.closest('[data-marker-button]')) {
                return
            }
            setSelectedMarker(null)
        }

        if (selectedMarker) {
            document.addEventListener('click', handleClickOutside)
            return () => document.removeEventListener('click', handleClickOutside)
        }
    }, [selectedMarker])

    const handleSaveConfig = () => {
        console.log("Layout Config:", JSON.stringify(layoutConfig, null, 2))
        alert("Configuration saved to console! (Check F12)")
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 1200)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const calculateImageBounds = () => {
            if (!mapContainerRef.current || !mapImageRef.current || !mapLoaded) return

            const container = mapContainerRef.current
            const img = mapImageRef.current
            const containerRect = container.getBoundingClientRect()

            
            const naturalWidth = img.naturalWidth
            const naturalHeight = img.naturalHeight
            const containerWidth = containerRect.width
            const containerHeight = containerRect.height

            
            const imageAspect = naturalWidth / naturalHeight
            const containerAspect = containerWidth / containerHeight

            let displayedWidth: number
            let displayedHeight: number
            let offsetLeft: number
            let offsetTop: number

            if (imageAspect > containerAspect) {
                
                displayedWidth = containerWidth
                displayedHeight = containerWidth / imageAspect
                offsetLeft = 0
                offsetTop = (containerHeight - displayedHeight) / 2
            } else {
                
                displayedHeight = containerHeight
                displayedWidth = containerHeight * imageAspect
                offsetLeft = (containerWidth - displayedWidth) / 2
                offsetTop = 0
            }

            setImageBounds({
                left: offsetLeft,
                top: offsetTop,
                width: displayedWidth,
                height: displayedHeight,
            })
        }

        calculateImageBounds()
        window.addEventListener("resize", calculateImageBounds)
        return () => window.removeEventListener("resize", calculateImageBounds)
    }, [mapLoaded])

    
    useEffect(() => {
        const fetchMarkers = async () => {
            try {
                const res = await fetch('/api/observations')
                if (res.ok) {
                    const data = await res.json()
                    
                    const loadedMarkers = data.map((obs: any) => ({
                        id: obs.id, 
                        x: Number(obs.x),
                        y: Number(obs.y),
                        type: obs.type,
                        temp: obs.temp,
                        details: obs.details,
                        createdAt: new Date(obs.created_at)
                    }))
                    setMarkers(loadedMarkers)
                }
            } catch (e) {
                console.error('Failed to fetch observations', e)
            }
        }
        fetchMarkers()
    }, [])

    const handlePublish = async () => {
        if (selectedWeather && clickPosition && details.trim()) {
            setLoading(true) 
            try {
                const res = await fetch('/api/observations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: selectedWeather,
                        x: clickPosition.x,
                        y: clickPosition.y,
                        temp: temperature,
                        details: details
                    })
                })

                if (res.ok) {
                    const newObs = await res.json()
                    const newMarker: Marker = {
                        id: newObs.id,
                        x: Number(newObs.x),
                        y: Number(newObs.y),
                        type: newObs.type,
                        temp: newObs.temp,
                        details: newObs.details,
                        createdAt: new Date(newObs.created_at)
                    }
                    setMarkers([newMarker, ...markers])

                    
                    setSelectedWeather(null)
                    setTemperature("")
                    setDetails("")
                    setClickPosition(null)
                } else {
                    alert("Erreur lors de la publication")
                }
            } catch (e) {
                console.error("Error publishing", e)
                alert("Erreur de connexion")
            } finally {
                setLoading(false)
            }
        }
    }

    const isMarkerOld = (createdAt?: Date) => {
        if (!createdAt) return false
        const hoursDiff = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60)
        return hoursDiff > 12 
    }

    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!mapContainerRef.current || !imageBounds) return
        
        setSelectedMarker(null)

        const rect = mapContainerRef.current.getBoundingClientRect()
        const clickX = e.clientX - rect.left
        const clickY = e.clientY - rect.top

        
        if (
            clickX < imageBounds.left ||
            clickX > imageBounds.left + imageBounds.width ||
            clickY < imageBounds.top ||
            clickY > imageBounds.top + imageBounds.height
        ) {
            
            return
        }

        
        const x = ((clickX - imageBounds.left) / imageBounds.width) * 100
        const y = ((clickY - imageBounds.top) / imageBounds.height) * 100

        setClickPosition({ x, y })
    }

    const handleMarkerClick = (e: React.MouseEvent, marker: Marker) => {
        e.stopPropagation()
        setSelectedMarker(selectedMarker?.id === marker.id ? null : marker)
    }



    const handleRefresh = () => {
        setIsRefreshing(true)
        setTimeout(() => {
            setIsRefreshing(false)
        }, 1500)
    }

    const getMarkerIcon = (type: string) => {
        const weather = weatherTypes.find((w) => w.id === type)
        return weather ? weather.icon : SunIcon
    }

    const getWeatherLabel = (type: string) => {
        const weather = weatherTypes.find((w) => w.id === type)
        return weather ? weather.label : type
    }

    const getMarkerPosition = (markerX: number, markerY: number) => {
        if (!imageBounds || !mapContainerRef.current) {
            return { left: `${markerX}%`, top: `${markerY}%` }
        }

        const containerRect = mapContainerRef.current.getBoundingClientRect()
        const actualX = imageBounds.left + (markerX / 100) * imageBounds.width
        const actualY = imageBounds.top + (markerY / 100) * imageBounds.height

        
        const containerX = (actualX / containerRect.width) * 100
        const containerY = (actualY / containerRect.height) * 100

        return { left: `${containerX}%`, top: `${containerY}%` }
    }

    const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        
        if (value === "" || value === "-" || /^-?\d+$/.test(value)) {
            setTemperature(value)
        }
    }

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col">
            <Header initialUser={initialUser} />

            <main className="flex-1 w-full px-4 sm:px-6 py-4 sm:py-6 relative">
                <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 transition-all duration-300">
                    {}
                    <div className="w-full xl:w-auto animate-fade-in-up transition-all duration-300 xl:flex-[0_0_60%] xl:max-w-[60%]">
                        <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                {loading ? (
                                    <div>
                                        <Skeleton className="h-7 w-48 mb-2" />
                                        <Skeleton className="h-4 w-64" />
                                    </div>
                                ) : (
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Carte des observations</h2>
                                        <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                                            Cliquez sur la carte pour signaler un événement météo.
                                        </p>
                                    </div>
                                )}
                                {!loading && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full self-start sm:self-auto">
                                        <span className="text-xs font-bold text-slate-700">EN DIRECT</span>
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    </div>
                                )}
                            </div>

                            {loading ? (
                                <div className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[16/8] bg-slate-100 animate-pulse flex items-center justify-center">
                                    <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                                </div>
                            ) : (
                                <div
                                    ref={mapContainerRef}
                                    className="relative cursor-crosshair overflow-hidden bg-slate-100 h-[800px] md:h-[650px]"
                                    onClick={handleMapClick}
                                >
                                    {!mapLoaded && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
                                            <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                                        </div>
                                    )}
                                    <img
                                        ref={mapImageRef}
                                        src="https://raw.githubusercontent.com/pyronix-dev/upwork/main/map_bg.png"
                                        alt="Carte de Martinique"
                                        className={`w-full h-full object-contain transition-opacity duration-500 ${mapLoaded ? "opacity-100" : "opacity-0"}`}
                                        onLoad={() => setMapLoaded(true)}
                                        draggable={false}
                                        key="map-image-static"
                                    />

                                    {markers.map((marker) => {
                                        const IconComponent = getMarkerIcon(marker.type)
                                        const isOld = isMarkerOld(marker.createdAt)
                                        const position = getMarkerPosition(marker.x, marker.y)
                                        return (
                                            <div
                                                key={marker.id}
                                                className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-bounce-in z-20"
                                                style={{ left: position.left, top: position.top }}
                                            >
                                                <button
                                                    data-marker-button
                                                    onClick={(e) => handleMarkerClick(e, marker)}
                                                    className={`w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg border-2 border-slate-200 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer ${isOld ? "opacity-50" : ""}`}
                                                >
                                                    <IconComponent />
                                                </button>

                                                {selectedMarker?.id === marker.id && (
                                                    <div data-marker-popup className={`absolute left-1/2 -translate-x-1/2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 p-3 animate-fade-in-up z-30 ${marker.y < 25 ? 'top-full mt-2' : 'bottom-full mb-2'
                                                        }`}>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <IconComponent />
                                                            <span className="font-bold text-slate-800 text-sm">{getWeatherLabel(marker.type)}</span>
                                                        </div>
                                                        {marker.temp && (
                                                            <p className="text-sm text-slate-600 mb-1">
                                                                <span className="font-semibold">Temp:</span> {marker.temp}°C
                                                            </p>
                                                        )}
                                                        {marker.details && <p className="text-xs text-slate-500">{marker.details}</p>}
                                                        {isOld && <p className="text-xs text-amber-600 mt-2 font-medium">{"Observation > 48h"}</p>}
                                                        {}
                                                        <div className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-l-transparent border-r-transparent ${marker.y < 25
                                                            ? 'bottom-full border-b-8 border-b-white'
                                                            : 'top-full border-t-8 border-t-white'
                                                            }`} />
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}

                                    {clickPosition && (
                                        <div
                                            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
                                            style={{
                                                left: getMarkerPosition(clickPosition.x, clickPosition.y).left,
                                                top: getMarkerPosition(clickPosition.x, clickPosition.y).top,
                                            }}
                                        >
                                            <div className="w-4 h-4 bg-amber-500/40 rounded-full border-2 border-amber-500 animate-pulse" />
                                            <div className="absolute inset-0 w-4 h-4 bg-amber-500/20 rounded-full animate-ping" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {}
                    <div
                        className="w-full xl:flex-1 animate-fade-in-up transition-all duration-300"
                        style={
                            isDesktop
                                ? {
                                    flexBasis: `40%`,
                                    maxWidth: `40%`,
                                }
                                : {}
                        }
                    >
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full">
                            <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between">
                                {loading ? (
                                    <div>
                                        <Skeleton className="h-6 w-48 mb-2" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-bold text-slate-800">Signaler un événement</h3>
                                        <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                                            Partagez vos observations météo
                                        </p>
                                    </div>
                                )}
                                {!loading && (
                                    <button
                                        onClick={handleRefresh}
                                        disabled={isRefreshing}
                                        className={`p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors ${isRefreshing ? "animate-spin" : ""}`}
                                    >
                                        <RefreshIcon />
                                    </button>
                                )}
                            </div>

                            <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
                                {loading ? (
                                    <>
                                        <div>
                                            <Skeleton className="h-5 w-24 mb-3" />
                                            <div className="grid grid-cols-3 gap-2">
                                                {[...Array(9)].map((_, i) => (
                                                    <Skeleton key={i} className="h-16 rounded-xl" />
                                                ))}
                                            </div>
                                        </div>
                                        <Skeleton className="h-12 w-full rounded-xl" />
                                        <Skeleton className="h-24 w-full rounded-xl" />
                                        <Skeleton className="h-12 w-full rounded-xl" />
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-3">Type de phénomène</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {weatherTypes.map((type) => {
                                                    const IconComponent = type.icon
                                                    return (
                                                        <button
                                                            key={type.id}
                                                            onClick={() => setSelectedWeather(type.id)}
                                                            className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1.5 hover:scale-105 ${selectedWeather === type.id
                                                                ? "border-amber-500 bg-amber-50"
                                                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                                                }`}
                                                        >
                                                            <IconComponent />
                                                            <span className="text-xs font-medium text-slate-700">{type.label}</span>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Température (optionnel)</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="-?[0-9]*"
                                                    value={temperature}
                                                    onChange={handleTemperatureChange}
                                                    onKeyDown={(e) => {
                                                        
                                                        if (
                                                            ["Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight"].includes(
                                                                e.key,
                                                            ) ||
                                                            (e.key === "-" && temperature === "")
                                                        ) {
                                                            return
                                                        }
                                                        
                                                        if (!/^\d$/.test(e.key)) {
                                                            e.preventDefault()
                                                        }
                                                    }}
                                                    placeholder="Ex: 28"
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">°C</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                                            <textarea
                                                value={details}
                                                onChange={(e) => setDetails(e.target.value)}
                                                placeholder="Décrivez ce que vous observez..."
                                                rows={3}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
                                            />
                                        </div>



                                            {initialUser ? (
                                            <button
                                                onClick={handlePublish}
                                                disabled={!selectedWeather || !clickPosition || !details.trim()}
                                                className="w-full py-3 rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                Publier l'observation
                                            </button>
                                        ) : (
                                            <div className="bg-slate-100 rounded-xl p-4 text-center border border-slate-200">
                                                <p className="text-sm text-slate-600 font-medium mb-3">
                                                    Vous devez être connecté pour signaler un événement.
                                                </p>
                                                <a
                                                    href="/login"
                                                    className="inline-block w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-colors"
                                                >
                                                    Se connecter
                                                </a>
                                            </div>
                                        )}

                                        {(!selectedWeather || !clickPosition || !details.trim()) && (
                                            <p className="text-xs text-slate-500 text-center">
                                                {!clickPosition
                                                    ? "Cliquez sur la carte pour sélectionner un emplacement"
                                                    : !selectedWeather
                                                        ? "Sélectionnez un type de phénomène"
                                                        : "Ajoutez une description"}
                                            </p>
                                        )}
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