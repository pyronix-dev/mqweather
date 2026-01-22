import React from 'react'

// Bootstrap Icons wrapper for weather conditions
// Uses WMO Weather interpretation codes from Open-Meteo API
// https://open-meteo.com/en/docs

interface WeatherIconProps {
    className?: string
    style?: React.CSSProperties
}

export const WeatherIcon = ({ code, className = "", style }: { code: number } & WeatherIconProps) => {
    const iconClass = getWeatherIconClass(code)
    const color = getWeatherIconColor(code)
    return <i className={`bi ${iconClass} ${className}`} style={{ color, ...style }} />
}

export const getWeatherIconClass = (code: number): string => {
    switch (code) {
        case 0: // Clear sky
            return 'bi-sun-fill'
        case 1: // Mainly clear
            return 'bi-sun-fill'
        case 2: // Partly cloudy
            return 'bi-cloud-sun-fill'
        case 3: // Overcast
            return 'bi-clouds-fill'
        case 45: // Fog
        case 48: // Depositing rime fog
            return 'bi-cloud-haze-fill'
        case 51: // Drizzle: Light
        case 53: // Drizzle: Moderate
        case 55: // Drizzle: Dense
            return 'bi-cloud-drizzle-fill'
        case 56: // Freezing Drizzle: Light
        case 57: // Freezing Drizzle: Dense
            return 'bi-cloud-drizzle-fill'
        case 61: // Rain: Slight
        case 63: // Rain: Moderate
        case 65: // Rain: Heavy
            return 'bi-cloud-rain-fill'
        case 66: // Freezing Rain: Light
        case 67: // Freezing Rain: Heavy
            return 'bi-cloud-rain-heavy-fill'
        case 71: // Snow fall: Slight
        case 73: // Snow fall: Moderate
        case 75: // Snow fall: Heavy
            return 'bi-cloud-snow-fill'
        case 77: // Snow grains
            return 'bi-snow'
        case 80: // Rain showers: Slight
        case 81: // Rain showers: Moderate
        case 82: // Rain showers: Violent
            return 'bi-cloud-rain-fill'
        case 85: // Snow showers: Slight
        case 86: // Snow showers: Heavy
            return 'bi-cloud-snow-fill'
        case 95: // Thunderstorm: Slight or moderate
            return 'bi-cloud-lightning-fill'
        case 96: // Thunderstorm with hail: Slight
        case 99: // Thunderstorm with hail: Heavy
            return 'bi-cloud-lightning-rain-fill'
        default:
            return 'bi-sun-fill'
    }
}

export const getWeatherIconColor = (code: number): string => {
    switch (code) {
        case 0: // Clear sky
        case 1: // Mainly clear
            return '#FBBF24' // Amber/Yellow
        case 2: // Partly cloudy
            return '#F59E0B' // Orange-ish
        case 3: // Overcast
            return '#94A3B8' // Slate gray
        case 45: // Fog
        case 48:
            return '#CBD5E1' // Light gray
        case 51: case 53: case 55: // Drizzle
        case 56: case 57:
            return '#60A5FA' // Light blue
        case 61: case 63: case 65: // Rain
        case 66: case 67:
        case 80: case 81: case 82:
            return '#3B82F6' // Blue
        case 71: case 73: case 75: // Snow
        case 77: case 85: case 86:
            return '#E2E8F0' // White-ish
        case 95: case 96: case 99: // Thunderstorm
            return '#8B5CF6' // Purple
        default:
            return '#FBBF24'
    }
}

// Legacy function for backwards compatibility
export const getWeatherIcon = (code: number) => {
    const iconClass = getWeatherIconClass(code)
    const color = getWeatherIconColor(code)
    return <i className={`bi ${iconClass}`} style={{ color, fontSize: 'inherit' }} />
}

// Common weather-related icons
export const SunIcon = ({ className = "", style }: WeatherIconProps) => (
    <i className={`bi bi-sun-fill ${className}`} style={{ color: '#FBBF24', ...style }} />
)

export const CloudIcon = ({ className = "", style }: WeatherIconProps) => (
    <i className={`bi bi-cloud-fill ${className}`} style={{ color: '#94A3B8', ...style }} />
)

export const RainIcon = ({ className = "", style }: WeatherIconProps) => (
    <i className={`bi bi-cloud-drizzle-fill ${className}`} style={{ color: '#3B82F6', ...style }} />
)

export const ThunderstormIcon = ({ className = "", style }: WeatherIconProps) => (
    <i className={`bi bi-cloud-lightning-rain-fill ${className}`} style={{ color: '#8B5CF6', ...style }} />
)

export const SnowIcon = ({ className = "", style }: WeatherIconProps) => (
    <i className={`bi bi-cloud-snow-fill ${className}`} style={{ color: '#E2E8F0', ...style }} />
)

export const WindIcon = ({ className = "", style }: WeatherIconProps) => (
    <i className={`bi bi-wind ${className}`} style={{ color: '#64748B', ...style }} />
)

export const HumidityIcon = ({ className = "", style }: WeatherIconProps) => (
    <i className={`bi bi-droplet-fill ${className}`} style={{ color: '#06B6D4', ...style }} />
)

export const ThermometerIcon = ({ className = "", style }: WeatherIconProps) => (
    <i className={`bi bi-thermometer-half ${className}`} style={{ color: '#EF4444', ...style }} />
)

export const ThermometerHighIcon = ({ className = "", style }: WeatherIconProps) => (
    <i className={`bi bi-thermometer-high ${className}`} style={{ color: '#EF4444', ...style }} />
)

export const ThermometerLowIcon = ({ className = "", style }: WeatherIconProps) => (
    <i className={`bi bi-thermometer-low ${className}`} style={{ color: '#3B82F6', ...style }} />
)

export const SunriseIcon = ({ className = "", style }: WeatherIconProps) => (
    <i className={`bi bi-sunrise-fill ${className}`} style={{ color: '#F97316', ...style }} />
)

export const SunsetIcon = ({ className = "", style }: WeatherIconProps) => (
    <i className={`bi bi-sunset-fill ${className}`} style={{ color: '#EA580C', ...style }} />
)

export const WaterIcon = ({ className = "", style }: WeatherIconProps) => (
    <i className={`bi bi-water ${className}`} style={{ color: '#0EA5E9', ...style }} />
)

export const HurricaneIcon = ({ className = "", style }: WeatherIconProps) => (
    <i className={`bi bi-hurricane ${className}`} style={{ color: '#DC2626', ...style }} />
)

export const LightningIcon = ({ className = "", style }: WeatherIconProps) => (
    <i className={`bi bi-lightning-charge-fill ${className}`} style={{ color: '#EAB308', ...style }} />
)

export const UVIcon = ({ className = "", style }: WeatherIconProps) => (
    <i className={`bi bi-sun-fill ${className}`} style={{ color: '#F59E0B', ...style }} />
)
