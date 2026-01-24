// Developed by Omar Rafik (OMX) - omx001@proton.me

import { useState, useEffect } from "react"

export interface DailyWeather {
    date: string
    maxTemp: number
    minTemp: number
    precipitation: number
    precipSum: number
    sunrise: string
    sunset: string
    windMax: number
    uvIndex: number
    waveHeight?: number
    waveDirection?: number
    wavePeriod?: number
    waterTemp?: number
}

export interface HourlyWeather {
    time: string
    temp: number
    humidity: number
    precipitation: number
    wind: number
}

export function useWeather(lat: string, lon: string, dayIndex: number) {
    const [weather, setWeather] = useState<DailyWeather | null>(null)
    const [hourlyData, setHourlyData] = useState<HourlyWeather[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true)
            try {
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,visibility&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,sunrise,sunset,wind_speed_10m_max,uv_index_max&timezone=America/Martinique`,
                )
                const data = await response.json()

                if (data.daily && dayIndex < data.daily.time.length) {
                    const dayData: DailyWeather = {
                        date: data.daily.time[dayIndex],
                        maxTemp: data.daily.temperature_2m_max[dayIndex],
                        minTemp: data.daily.temperature_2m_min[dayIndex],
                        precipitation: data.daily.precipitation_probability_max[dayIndex],
                        precipSum: data.daily.precipitation_sum[dayIndex],
                        sunrise: data.daily.sunrise[dayIndex],
                        sunset: data.daily.sunset[dayIndex],
                        windMax: data.daily.wind_speed_10m_max[dayIndex],
                        uvIndex: data.daily.uv_index_max[dayIndex],
                    }
                    setWeather(dayData)
                }

                
                if (data.hourly) {
                    const startIndex = dayIndex * 24
                    const dayHourlyData = data.hourly.time.slice(startIndex, startIndex + 24).map((time: string, i: number) => ({
                        time: new Date(time).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
                        temp: data.hourly.temperature_2m[startIndex + i],
                        humidity: data.hourly.relative_humidity_2m[startIndex + i],
                        precipitation: data.hourly.precipitation_probability[startIndex + i] || 0,
                        wind: data.hourly.wind_speed_10m[startIndex + i],
                    }))
                    setHourlyData(dayHourlyData)
                }

                
                try {
                    
                    const marineResponse = await fetch(
                        `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&daily=wave_height_max,wave_direction_dominant,wave_period_max&hourly=wave_height,wave_period,wave_direction,sea_surface_temperature&timezone=America/Martinique`
                    )
                    const marineData = await marineResponse.json()

                    if (marineData.daily && dayIndex < marineData.daily.time.length) {
                        
                        const noonIndex = (dayIndex * 24) + 12
                        const waterTemp = marineData.hourly?.sea_surface_temperature ? marineData.hourly.sea_surface_temperature[noonIndex] : null

                        setWeather(prev => prev ? ({
                            ...prev,
                            waveHeight: marineData.daily.wave_height_max[dayIndex],
                            waveDirection: marineData.daily.wave_direction_dominant[dayIndex],
                            wavePeriod: marineData.daily.wave_period_max[dayIndex],
                            waterTemp: waterTemp
                        }) : null)
                    }
                } catch (e) {
                    console.log("Marine data unavailable")
                }
            } catch (error) {
                console.log("[MQ] Weather fetch error:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchWeather()
    }, [lat, lon, dayIndex])

    return { weather, hourlyData, loading }
}