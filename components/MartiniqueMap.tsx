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
    const [loaded, setLoaded] = useState(false)
    const [showResetButton, setShowResetButton] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const initialCenter: [number, number] = [-61.0242, 14.6415]
    const getInitialZoom = () => 9.2

    // Store marker positions (x, y) in pixels to render React components
    const [projectedMarkers, setProjectedMarkers] = useState<{ id: string, x: number, y: number }[]>([])

    // Keep markers ref up to date for the resize handler (which is a closure formed on mount)
    const markersRef = useRef(markers)

    // Handle centerOn changes
    useEffect(() => {
        if (map.current && centerOn && !isNaN(centerOn.lat) && !isNaN(centerOn.lon)) {
            map.current.flyTo({
                center: [centerOn.lon, centerOn.lat],
                zoom: 12,
                essential: true
            })
            // Iterate checking just in case moveend doesn't fire perfectly or we want faster feedback
            // But moveend is safest to avoid flickering.
        }
    }, [centerOn])

    useEffect(() => { markersRef.current = markers }, [markers])

    useEffect(() => {
        if (map.current) return

        if (mapContainer.current) {
            const zoomLevel = getInitialZoom()

            map.current = new maplibregl.Map({
                container: mapContainer.current,
                style: "https://api.maptiler.com/maps/dataviz-v4/style.json?key=UxUuNKolwcBvNiLEf3iZ",
                center: initialCenter,
                zoom: zoomLevel,
                interactive: false, // Disable user interaction as requested
                attributionControl: false
            })

            map.current.on('load', () => {
                setLoaded(true)
                updateMarkerPositions()
                checkResetButtonVisibility()
            })

            // Even though locked, resize might change positions
            map.current.on('resize', updateMarkerPositions)
            map.current.on('move', () => {
                updateMarkerPositions()
                checkResetButtonVisibility()
            })
            map.current.on('zoom', () => {
                updateMarkerPositions()
                checkResetButtonVisibility()
            })

            // Add ResizeObserver to force map resize when container changes (e.g. mobile/desktop switch)
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

    // Update positions whenever markers change or map loads
    useEffect(() => {
        if (loaded) {
            updateMarkerPositions()
            checkResetButtonVisibility()
        }
    }, [markers, loaded])

    const checkResetButtonVisibility = () => {
        if (!map.current) return
        const currentZoom = map.current.getZoom()
        const initialZoom = getInitialZoom()

        // Show button if zoom is significantly different from initial
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

    return (
        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-sm border border-slate-200 bg-slate-100">
            <div ref={mapContainer} className="w-full h-full" />

            {/* Reset View Button */}
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

            {/* Markers Layer */}
            {projectedMarkers.map((pos, index) => {
                const markerData = markers[index]
                if (!markerData) return null

                return (
                    <div
                        key={pos.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 hover:z-[100]"
                        style={{ left: pos.x, top: pos.y }}
                    >
                        {markerData.component}
                    </div>
                )
            })}
        </div>
    )
}
