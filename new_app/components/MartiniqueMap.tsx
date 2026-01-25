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
    const markersRef = useRef<maplibregl.Marker[]>([])
    const [showResetButton, setShowResetButton] = useState(false)

    const [isMapReady, setIsMapReady] = useState(false)

    // Center on Martinique
    const initialCenter: [number, number] = [-61.0242, 14.6415]

    const getInitialZoom = () => {
        return 9.5
    }

    // Effect to handle marker updates efficiently
    useEffect(() => {
        if (!map.current || !isMapReady) return

        // 1. Clear existing markers
        markersRef.current.forEach(marker => marker.remove())
        markersRef.current = []

        // Requires dynamic import for createRoot if not available in scope, 
        // usually strictly typed in Next.js 13+
        // We will assume standard import or use basic ReactDOM if needed.
        // For safety in this environment, we'll try to use a cleaner approach:
        // We create elements and mount React roots on them

        const ReactDOM = require('react-dom/client')

        // 2. Add new markers
        markers.forEach(marker => {
            const el = document.createElement('div')
            el.className = 'weather-marker-container' // Hook for global CSS if needed

            // Create root and render
            const root = ReactDOM.createRoot(el)
            root.render(marker.component)

            // Create MapLibre marker
            const newMarker = new maplibregl.Marker({
                element: el,
                anchor: 'center' // Default
            })
                .setLngLat([marker.lon, marker.lat])
                .addTo(map.current!)

            markersRef.current.push(newMarker)
        })

    }, [markers, isMapReady]) // Re-run when markers data changes or map becomes ready

    useEffect(() => {
        if (map.current && centerOn) {
            map.current.flyTo({
                center: [centerOn.lon, centerOn.lat],
                zoom: 12,
                essential: true,
                duration: 1500
            })
        }
    }, [centerOn])

    useEffect(() => {
        if (map.current) return

        if (mapContainer.current) {
            const zoomLevel = getInitialZoom()

            map.current = new maplibregl.Map({
                container: mapContainer.current,
                style: "https://api.maptiler.com/maps/dataviz-v4/style.json?key=UxUuNKolwcBvNiLEf3iZ",
                center: initialCenter,
                zoom: zoomLevel,
                dragPan: false,
                boxZoom: false,
                dragRotate: false,
                keyboard: false,
                doubleClickZoom: false,
                touchZoomRotate: false,
                scrollZoom: false
            })

            map.current.on('load', () => {
                setIsMapReady(true)
                checkResetButtonVisibility()
                // Disable interactions
                map.current?.touchZoomRotate.disable()
                map.current?.dragPan.disable()
            })

            map.current.on('zoom', checkResetButtonVisibility)
            map.current.on('move', checkResetButtonVisibility)
        }

        return () => {
            markersRef.current.forEach(m => m.remove())
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
        <div className="relative w-full h-full overflow-hidden rounded-2xl">
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
        </div>
    )
}