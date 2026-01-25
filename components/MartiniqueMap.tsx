// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useEffect, useRef, useState } from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

export interface MapMarker {
    id: string
    lat: number
    lon: number
    component: React.ReactNode
}

interface MartiniqueMapProps {
    markers: MapMarker[]
    centerOn?: { lat: number; lon: number } | null
    onReset?: () => void
}

export function MartiniqueMap({ markers, centerOn, onReset }: MartiniqueMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null)
    const map = useRef<maplibregl.Map | null>(null)
    const [currentZoom, setCurrentZoom] = useState(9)

    const [loaded, setLoaded] = useState(false)
    const [projectedMarkers, setProjectedMarkers] = useState<{ id: string; x: number; y: number }[]>([])
    const markersRef = useRef(markers)
    const [showResetButton, setShowResetButton] = useState(false)

    // Center on Martinique
    const initialCenter: [number, number] = [-61.0242, 14.6415]

    const getInitialZoom = () => {
        if (typeof window === 'undefined') return 9.5
        return window.innerWidth < 768 ? 8.5 : 9.5
    }

    useEffect(() => {
        markersRef.current = markers
        if (loaded) {
            updateMarkerPositions()
        }
    }, [markers, loaded])

    useEffect(() => {
        if (loaded && map.current && centerOn) {
            map.current.flyTo({
                center: [centerOn.lon, centerOn.lat],
                zoom: 12,
                essential: true,
                duration: 1500
            })
        }
    }, [centerOn, loaded])

    useEffect(() => {
        if (map.current) return

        if (mapContainer.current) {
            const zoomLevel = getInitialZoom()

            map.current = new maplibregl.Map({
                container: mapContainer.current,
                style: "https://api.maptiler.com/maps/dataviz-v4/style.json?key=UxUuNKolwcBvNiLEf3iZ",
                center: initialCenter,
                zoom: zoomLevel,
                interactive: true,
                attributionControl: false,
                scrollZoom: false // Disable scroll zoom
            })

            map.current.on('load', () => {
                setLoaded(true)
                updateMarkerPositions()
                checkResetButtonVisibility()
            })

            map.current.on('zoom', () => {
                if (map.current) setCurrentZoom(map.current.getZoom())
                updateMarkerPositions()
                checkResetButtonVisibility()
            })

            map.current.on('resize', updateMarkerPositions)
            map.current.on('move', () => {
                updateMarkerPositions()
                checkResetButtonVisibility()
            })

            const resizeObserver = new ResizeObserver(() => {
                map.current?.resize()
                updateMarkerPositions()
            })
            resizeObserver.observe(mapContainer.current)
        }

        return () => {
            map.current?.remove()
            map.current = null
        }
    }, [])

    const checkResetButtonVisibility = () => {
        if (!map.current) return
        const currentZoom = map.current.getZoom()
        const initialZoom = getInitialZoom()
        setShowResetButton(currentZoom > initialZoom + 0.5)
    }

    const updateMarkerPositions = () => {
        if (!map.current) return

        const newPositions = markersRef.current.map(marker => {
            const point = map.current!.project([marker.lon, marker.lat])
            return {
                id: marker.id,
                x: point.x,
                y: point.y
            }
        })

        if (JSON.stringify(newPositions) !== JSON.stringify(projectedMarkers)) {
            setProjectedMarkers(newPositions)
        }
    }

    const handleResetView = () => {
        if (map.current) {
            map.current.flyTo({
                center: initialCenter,
                zoom: getInitialZoom(),
                essential: true
            })
            checkResetButtonVisibility()
            onReset?.()
        }
    }

    const getMarkerScale = () => {
        const base = 1
        const max = 2.5
        const zoomThreshold = 11
        if (currentZoom <= zoomThreshold) return base
        const scale = base + ((currentZoom - zoomThreshold) * 0.8)
        return Math.min(scale, max)
    }
    const markerScale = getMarkerScale()

    return (
        <div className="relative w-full h-full">
            <div ref={mapContainer} className="w-full h-full" />

            {showResetButton && (
                <button
                    onClick={handleResetView}
                    className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-slate-700 p-2 rounded-xl shadow-lg border border-slate-200 hover:bg-white transition-colors z-20 animate-in fade-in zoom-in duration-300"
                    title="Réinitialiser la vue"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                </button>
            )}

            {/* Markers Container - Fades in only when map is loaded */}
            <div className={`transition-opacity duration-700 ease-in-out ${loaded ? 'opacity-100' : 'opacity-0'}`}>
                {projectedMarkers.map((pos, index) => {
                    const markerData = markers[index]
                    if (!markerData) return null

                    return (
                        <div
                            key={pos.id}
                            className="absolute z-10 hover:z-[100] transition-transform duration-200 will-change-transform"
                            style={{
                                left: pos.x,
                                top: pos.y,
                                transform: `translate(-50%, 6px) scale(${markerScale})`
                            }}
                        >
                            {markerData.component}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}