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
}

export function MartiniqueMap({ markers, centerOn }: MartiniqueMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null)
    const map = useRef<maplibregl.Map | null>(null)
    const [loaded, setLoaded] = useState(false)

    // Store marker positions (x, y) in pixels to render React components
    const [projectedMarkers, setProjectedMarkers] = useState<{ id: string, x: number, y: number }[]>([])

    // Keep markers ref up to date for the resize handler (which is a closure formed on mount)
    const markersRef = useRef(markers)

    // Handle centerOn changes
    useEffect(() => {
        if (map.current && centerOn) {
            map.current.flyTo({
                center: [centerOn.lon, centerOn.lat],
                zoom: 12,
                essential: true
            })
        }
    }, [centerOn])

    useEffect(() => { markersRef.current = markers }, [markers])

    useEffect(() => {
        if (map.current) return

        if (mapContainer.current) {
            map.current = new maplibregl.Map({
                container: mapContainer.current,
                style: "https://api.maptiler.com/maps/dataviz-v4/style.json?key=UxUuNKolwcBvNiLEf3iZ",
                center: [-61.0242, 14.6415], // Martinique Center
                zoom: 9.6, // Zoomed in by 0.4 as requested
                interactive: false, // Disable user interaction as requested
                attributionControl: false
            })

            map.current.on('load', () => {
                setLoaded(true)
                updateMarkerPositions()
            })

            // Even though locked, resize might change positions
            map.current.on('resize', updateMarkerPositions)
            map.current.on('move', updateMarkerPositions)
            map.current.on('zoom', updateMarkerPositions)
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
        }
    }, [markers, loaded])



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

    return (
        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-sm border border-slate-200 bg-slate-100">
            <div ref={mapContainer} className="w-full h-full" />

            {/* Markers Layer */}
            {projectedMarkers.map((pos, index) => {
                const markerData = markers[index]
                if (!markerData) return null

                return (
                    <div
                        key={pos.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                        style={{ left: pos.x, top: pos.y }}
                    >
                        {markerData.component}
                    </div>
                )
            })}
        </div>
    )
}
