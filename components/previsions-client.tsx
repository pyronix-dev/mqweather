// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { getSlugFromIndex } from "@/lib/utils"
import { MARTINIQUE_CITIES } from "@/lib/constants"

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const MapPinIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
)

const ZoomInIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
  </svg>
)

const ZoomOutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
  </svg>
)

const LocationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const ThermometerIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 9a4 4 0 0 0-2 7.5" />
    <path d="M12 3v2" />
    <path d="M6.6 18.4l-1.4 1.4" />
    <path d="M20 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
    <path d="M4 13H2" />
    <path d="M6.34 7.34 4.93 5.93" />
  </svg>
)

const FeelsLikeIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
    <path d="M14 9h5.5" />
    <path d="M14 6h3" />
    <path d="M14 12h2" />
  </svg>
)

const HumidityIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    <path d="M9.1 16.5a2.4 2.4 0 0 1 0-3" />
  </svg>
)

const WindIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"
    />
  </svg>
)

const PressureIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
    <circle cx="12" cy="12" r="10" />
    <path d="M12 12L8 8" />
    <path d="M12 6V2" />
    <path d="M18 12h4" />
    <path d="M6 12H2" />
    <path d="M16.24 7.76l2.83-2.83" />
    <path d="M7.76 7.76L4.93 4.93" />
  </svg>
)

const VisibilityIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
)

const RainIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
    />
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 19v2m4-2v2m4-2v2" />
  </svg>
)

const CompassIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" stroke="none" />
  </svg>
)

const SunIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
)

const CloudIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
    />
  </svg>
)

const CloudRainIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
    />
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 19v2m4-2v2m4-2v2" />
  </svg>
)



const getWeatherIcon = (precipitation: number) => {
  if (precipitation > 60) return <CloudRainIcon />
  if (precipitation > 30) return <CloudIcon />
  return <SunIcon />
}

const getWeatherLabel = (precipitation: number) => {
  if (precipitation > 60) return "Pluvieux"
  if (precipitation > 30) return "Nuageux"
  return "Ensoleillé"
}

const getWindDirectionLabel = (degrees: number) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

const SmallDropIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z" />
  </svg>
)

const SmallWindIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"
    />
  </svg>
)

const SmallEyeIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
)

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
)

const MapSkeleton = () => (
  <div className="relative border border-border rounded-xl overflow-hidden h-80 sm:h-96 mb-8 animate-pulse">
    <div className="w-full h-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100" />
    <div className="absolute bottom-4 left-4 bg-white/90 px-4 py-2 rounded-lg">
      <Skeleton className="h-5 w-32 mb-1" />
      <Skeleton className="h-3 w-20" />
    </div>
    <div className="absolute top-4 right-4 flex flex-col gap-2">
      <Skeleton className="h-10 w-10 rounded-xl" />
      <Skeleton className="h-10 w-10 rounded-xl" />
      <Skeleton className="h-10 w-10 rounded-xl" />
    </div>
  </div>
)

const WeatherDataSkeleton = () => (
  <div className="border border-border rounded-xl p-4 sm:p-6 lg:p-8 mb-8">
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
      <div className="col-span-2">
        <div className="flex items-center gap-3 mb-2">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-14 w-24" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-xl p-3 sm:p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-5 w-5 sm:h-6 sm:w-6 rounded" />
            <Skeleton className="h-3 w-12 sm:w-16" />
          </div>
          <Skeleton className="h-6 sm:h-8 w-14 sm:w-16" />
        </div>
      ))}
    </div>
  </div>
)

const ChartSkeleton = () => (
  <div className="border border-border rounded-xl p-4 sm:p-5">
    <Skeleton className="h-6 w-40 mb-4" />
    <div className="h-[200px] flex items-end gap-2 px-4">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="flex-1 flex flex-col justify-end">
          <Skeleton className="w-full rounded-t" style={{ height: `${Math.random() * 60 + 40}%` }} />
        </div>
      ))}
    </div>
  </div>
)

const ForecastSkeleton = () => (
  <div className="border border-border rounded-2xl p-4 sm:p-6">
    <div className="flex items-center gap-3 mb-6">
      <Skeleton className="h-10 w-10 rounded-xl" />
      <Skeleton className="h-6 w-40" />
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="rounded-2xl p-3 sm:p-4 border border-border">
          <Skeleton className="h-4 w-12 mx-auto mb-1" />
          <Skeleton className="h-3 w-16 mx-auto mb-3" />
          <Skeleton className="h-8 w-8 mx-auto mb-3 rounded-full" />
          <Skeleton className="h-8 w-12 mx-auto mb-1" />
          <Skeleton className="h-4 w-8 mx-auto" />
        </div>
      ))}
    </div>
  </div>
)

const ChevronRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
)

export default function PrevisionPage({ initialUser }: { initialUser: any }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState(MARTINIQUE_CITIES[0])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [weather, setWeather] = useState<any>(null)
  const [dailyData, setDailyData] = useState<any[]>([])
  const [hourlyData, setHourlyData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [zoom, setZoom] = useState(12)
  const [locating, setLocating] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapKey, setMapKey] = useState(0)
  const searchRef = useRef<HTMLDivElement>(null)
  const initializedFromUrl = useRef(false)
  const prevCoords = useRef<{ lat: number; lon: number } | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (initializedFromUrl.current) return

    const cityName = searchParams.get("city")


    const validCity = cityName ? MARTINIQUE_CITIES.find(c => c.name.toLowerCase() === cityName.toLowerCase()) : null

    if (validCity) {

      setSelectedCity(validCity)
      setSearchQuery(validCity.name)
    }
    initializedFromUrl.current = true
  }, [])

  useEffect(() => {
    const fetchWeather = async () => {
      if (prevCoords.current?.lat === selectedCity.lat && prevCoords.current?.lon === selectedCity.lon) {
        return
      }
      prevCoords.current = { lat: selectedCity.lat, lon: selectedCity.lon }

      setLoading(true)
      setMapLoaded(false)
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,visibility&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,sunrise,sunset,wind_speed_10m_max,uv_index_max&timezone=America/Martinique`,
        )
        const data = await response.json()
        setWeather(data.current)

        if (data.hourly) {
          const hourly = data.hourly.time.slice(0, 24).map((time: string, i: number) => ({
            time: new Date(time).toLocaleTimeString("fr-FR", { hour: "2-digit" }),
            temp: data.hourly.temperature_2m[i],
            humidity: data.hourly.relative_humidity_2m[i],
            precipitation: data.hourly.precipitation_probability[i] || 0,
          }))
          setHourlyData(hourly)
        }

        if (data.daily) {
          const daily = data.daily.time.map((time: string, i: number) => ({
            date: new Date(time).toLocaleDateString("fr-FR", { weekday: "short" }),
            fullDate: new Date(time).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
            max: data.daily.temperature_2m_max[i],
            min: data.daily.temperature_2m_min[i],
            precipitation: data.daily.precipitation_probability_max[i],
          }))
          setDailyData(daily)
        }
      } catch (error) {
        console.log("[MQ] Weather fetch error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchWeather()
  }, [selectedCity.lat, selectedCity.lon])

  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const marker = useRef<maplibregl.Marker | null>(null)

  useEffect(() => {
    if (loading) return
    if (map.current) return

    if (mapContainer.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: "https://api.maptiler.com/maps/dataviz-v4/style.json?key=UxUuNKolwcBvNiLEf3iZ",
        center: [selectedCity.lon, selectedCity.lat],
        zoom: zoom,
        attributionControl: false,
        scrollZoom: false, // Disable scroll zoom
      })

      map.current.addControl(new maplibregl.NavigationControl({ showCompass: false, showZoom: false }), "top-right")


      const el = document.createElement("div")
      el.className = "w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"

      marker.current = new maplibregl.Marker({ element: el })
        .setLngLat([selectedCity.lon, selectedCity.lat])
        .addTo(map.current)


      return () => {
        marker.current?.remove()
        map.current?.remove()
        map.current = null
      }
    }
  }, [loading])

  useEffect(() => {
    if (!map.current) return

    map.current.flyTo({
      center: [selectedCity.lon, selectedCity.lat],
      zoom: zoom,
      essential: true,
    })


    if (marker.current) {
      marker.current.setLngLat([selectedCity.lon, selectedCity.lat])
    }
  }, [selectedCity.lat, selectedCity.lon, zoom])

  const filteredSuggestions = MARTINIQUE_CITIES.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 1, 18))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 1, 5))
  }

  const handleGetLocation = () => {
    setLocating(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const nearest = MARTINIQUE_CITIES.reduce((prev, curr) => {
            const prevDist = Math.abs(prev.lat - latitude) + Math.abs(prev.lon - longitude)
            const currDist = Math.abs(curr.lat - latitude) + Math.abs(curr.lon - longitude)
            return currDist < prevDist ? curr : prev
          })
          setSelectedCity(nearest)
          setSearchQuery(nearest.name)
          setLocating(false)
        },
        () => {
          setLocating(false)
        },
      )
    } else {
      setLocating(false)
    }
  }

  const handleDayClick = (dayIndex: number, day: any) => {
    const params = new URLSearchParams()
    params.set("city", selectedCity.name)
    params.set("lat", selectedCity.lat.toString())
    params.set("lon", selectedCity.lon.toString())
    params.set("dayIndex", dayIndex.toString())

    const slug = getSlugFromIndex(dayIndex)
    router.push(`/previsions/${slug}?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header initialUser={initialUser} />

      { }
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-sm relative z-40" ref={searchRef}>
            <div className="flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-2 text-muted-foreground focus-within:border-primary transition-colors">
              <SearchIcon />
              <input
                type="text"
                placeholder="Chercher une ville..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                className="flex-1 outline-none text-sm bg-transparent text-foreground placeholder:text-muted-foreground"
              />
              {showSuggestions && (
                <button
                  onClick={() => setShowSuggestions(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white border border-border rounded-xl shadow-2xl z-40 animate-dropdown overflow-hidden max-h-60 overflow-y-auto">
                {filteredSuggestions.map((city, index) => (
                  <button
                    key={city.name}
                    onClick={() => {
                      setSelectedCity(city)
                      setSearchQuery(city.name)
                      setShowSuggestions(false)
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-primary/5 transition-all duration-200 text-sm text-foreground border-b border-border/50 last:border-b-0 flex items-center gap-3 group"
                    style={{
                      animationDelay: `${index * 20}ms`,
                    }}
                  >
                    <div className="text-muted-foreground group-hover:text-primary transition-colors">
                      <MapPinIcon />
                    </div>
                    <span className="group-hover:text-primary transition-colors">{city.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      { }
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading ? (
          <div className="space-y-6 sm:space-8">
            <MapSkeleton />
            <div>
              <Skeleton className="h-8 sm:h-10 w-40 sm:w-48 mb-2" />
              <Skeleton className="h-4 sm:h-5 w-32 sm:w-40" />
            </div>
            <WeatherDataSkeleton />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <ChartSkeleton />
              <ChartSkeleton />
            </div>
            <ForecastSkeleton />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              { }
              <div className="order-2 lg:order-1">
                { }
                <div className="mb-4 sm:mb-6 animate-fade-in">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                    {selectedCity.name}
                  </h2>
                  <p className="text-muted-foreground text-sm sm:text-base">Martinique - Aujourd&apos;hui</p>
                </div>

                { }
                <div className="border border-border rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 animate-slide-in-left shadow-sm bg-white">
                  <div className="flex flex-col gap-4">
                    { }
                    <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100 flex items-center gap-6">
                      <div className="p-4 bg-white rounded-full shadow-sm text-amber-500">
                        <ThermometerIcon />
                      </div>
                      <div>
                        <div className="text-7xl sm:text-8xl font-black text-slate-800 tracking-tight leading-none">
                          {Math.round(weather?.temperature_2m || 26)}°C
                        </div>
                        <p className="text-slate-500 font-medium text-lg mt-1">Température Actuelle</p>
                      </div>
                    </div>

                    { }
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                      { }
                      <div className="rounded-xl p-4 border border-border bg-slate-50/50 hover:bg-white transition-colors duration-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-amber-500">
                            <PressureIcon />
                          </div>
                          <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Pression</p>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-foreground">
                          {Math.round(weather?.pressure_msl || 1013)}
                          <span className="text-sm font-bold text-muted-foreground ml-1">mb</span>
                        </p>
                      </div>

                      { }
                      <div className="rounded-xl p-4 border border-border bg-slate-50/50 hover:bg-white transition-colors duration-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-orange-500">
                            <FeelsLikeIcon />
                          </div>
                          <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Ressenti</p>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-foreground">
                          {Math.round(weather?.apparent_temperature || 26)}°
                        </p>
                      </div>

                      { }
                      <div className="rounded-xl p-4 border border-border bg-slate-50/50 hover:bg-white transition-colors duration-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-blue-500">
                            <HumidityIcon />
                          </div>
                          <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Humidité</p>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-foreground">{weather?.relative_humidity_2m}%</p>
                      </div>

                      { }
                      <div className="rounded-xl p-4 border border-border bg-slate-50/50 hover:bg-white transition-colors duration-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-teal-500">
                            <WindIcon />
                          </div>
                          <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Vent</p>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-foreground">
                          {Math.round(weather?.wind_speed_10m || 15)}
                          <span className="text-sm font-bold text-muted-foreground ml-1">km/h</span>
                        </p>
                      </div>

                      { }
                      <div className="rounded-xl p-4 border border-border bg-slate-50/50 hover:bg-white transition-colors duration-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-green-500">
                            <VisibilityIcon />
                          </div>
                          <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Visibilité</p>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-foreground">
                          {Math.round((weather?.visibility || 10000) / 1000)}
                          <span className="text-sm font-bold text-muted-foreground ml-1">km</span>
                        </p>
                      </div>

                      { }
                      <div className="rounded-xl p-4 border border-border bg-slate-50/50 hover:bg-white transition-colors duration-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-blue-500">
                            <RainIcon />
                          </div>
                          <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Précip.</p>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-foreground">
                          {weather?.precipitation || 0}
                          <span className="text-sm font-bold text-muted-foreground ml-1">mm</span>
                        </p>
                      </div>

                      { }
                      <div className="rounded-xl p-4 border border-border bg-slate-50/50 hover:bg-white transition-colors duration-200 col-span-2 sm:col-span-2">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-indigo-500">
                            <CompassIcon />
                          </div>
                          <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Direction</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-2xl sm:text-3xl font-black text-foreground">
                            {Math.round(weather?.wind_direction_10m || 0)}°
                          </p>
                          <div className="mt-1 px-2 py-0.5 rounded-full bg-slate-100 text-xs font-bold text-slate-500 border border-slate-200">
                            {getWindDirectionLabel(weather?.wind_direction_10m || 0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              { }
              <div className="order-1 lg:order-2">
                <div className="relative border border-border rounded-xl overflow-hidden h-80 sm:h-[432px] animate-fade-in-up shadow-sm">
                  <div ref={mapContainer} className="w-full h-full" />

                  { }
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg z-20 border border-border">
                    <p className="font-bold text-foreground">{selectedCity.name}</p>
                    <p className="text-xs text-muted-foreground">Martinique</p>
                  </div>

                  { }
                  <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                    <button
                      onClick={handleZoomIn}
                      className="group bg-white hover:bg-primary text-foreground hover:text-white w-10 h-10 rounded-xl shadow-lg border border-border flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95"
                      title="Zoom avant"
                    >
                      <ZoomInIcon />
                    </button>
                    <button
                      onClick={handleZoomOut}
                      className="group bg-white hover:bg-primary text-foreground hover:text-white w-10 h-10 rounded-xl shadow-lg border border-border flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95"
                      title="Zoom arrière"
                    >
                      <ZoomOutIcon />
                    </button>
                    <div className="h-px bg-border my-1" />
                    <button
                      onClick={handleGetLocation}
                      disabled={locating}
                      className={`group bg-white hover:bg-blue-500 text-foreground hover:text-white w-10 h-10 rounded-xl shadow-lg border border-border flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95 ${locating ? "animate-pulse bg-blue-50" : ""}`}
                      title="Ma position"
                    >
                      <LocationIcon />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              { }
              <div className="border border-border rounded-xl p-4 sm:p-5 animate-slide-in-up shadow-sm">
                <h3 className="text-base sm:text-lg font-bold text-foreground mb-4">Température (24h)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={hourlyData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#fdba74" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="time" stroke="#6b7280" style={{ fontSize: "10px" }} />
                    <YAxis
                      stroke="#6b7280"
                      width={30}
                      style={{ fontSize: "10px" }}
                      tickFormatter={(value) => `${value}°C`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "6px" }}
                      labelStyle={{ color: "#374151" }}
                      formatter={(value: number) => [`${Math.round(value)}°C`, "Température"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="temp"
                      stroke="#f97316"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorTemp)"
                      isAnimationActive
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              { }
              <div className="border border-border rounded-xl p-4 sm:p-5 animate-slide-in-up shadow-sm">
                <h3 className="text-base sm:text-lg font-bold text-foreground mb-4">Humidité & Précipitations</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={hourlyData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="time" stroke="#6b7280" style={{ fontSize: "10px" }} />
                    <YAxis stroke="#6b7280" width={30} style={{ fontSize: "10px" }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "6px" }}
                      labelStyle={{ color: "#374151" }}
                      formatter={(value: number) => [`${value}%`, undefined]}
                    />
                    <Line
                      type="monotone"
                      dataKey="humidity"
                      stroke="#3b82f6"
                      dot={false}
                      strokeWidth={2}
                      name="Humidité"
                      isAnimationActive
                    />
                    <Line
                      type="monotone"
                      dataKey="precipitation"
                      stroke="#ec4899"
                      dot={false}
                      strokeWidth={2}
                      name="Précip."
                      isAnimationActive
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            { }
            <div className="border border-border rounded-2xl p-4 sm:p-6 animate-fade-in-up shadow-sm bg-slate-50">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="bg-slate-700 p-2 rounded-xl">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">Prévisions 7 jours</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
                {dailyData.map((day, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleDayClick(idx, day)}
                    className="group bg-white rounded-2xl p-4 sm:p-5 text-center border border-slate-200 hover:shadow-xl hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 cursor-pointer relative"
                    style={{
                      animationDelay: `${idx * 80}ms`,
                      animation: "fadeSlideUp 0.5s ease-out forwards",
                      opacity: 0,
                    }}
                  >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
                      <ChevronRightIcon />
                    </div>

                    { }
                    <p className="text-slate-800 font-bold text-sm mb-3 capitalize">{day.date}</p>

                    { }
                    <div className="flex justify-center mb-3 text-amber-500 group-hover:scale-110 transition-transform duration-300">
                      <div className="w-12 h-12 flex items-center justify-center">
                        {getWeatherIcon(day.precipitation)}
                      </div>
                    </div>

                    { }
                    <p className="text-3xl font-bold text-slate-800 mb-1">{Math.round(day.max)}°C</p>

                    <div className="text-xs text-slate-500 mb-1">
                      <span className="font-bold text-red-500">Max {Math.round(day.max)}°C</span>
                    </div>
                    <div className="text-xs font-bold text-blue-500 mb-3">Min {Math.round(day.min)}°C</div>

                    { }
                    <p className="text-xs text-slate-600 font-medium mb-4 pb-3 border-b border-slate-100">
                      {getWeatherLabel(day.precipitation)} ({day.precipitation}%)
                    </p>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <SmallDropIcon />
                          <span>Humidité:</span>
                        </div>
                        <span className="font-semibold text-slate-700">{60 + idx * 3}%</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <SmallWindIcon />
                          <span>Vent:</span>
                        </div>
                        <span className="font-semibold text-slate-700">{10 + idx * 2} km/h</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <SmallEyeIcon />
                          <span>Visibilité:</span>
                        </div>
                        <span className="font-semibold text-slate-700">{10 + idx} km</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs font-semibold text-slate-500">Voir détails</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
      <style jsx>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}