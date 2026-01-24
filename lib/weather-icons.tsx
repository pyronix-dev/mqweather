// Developed by Omar Rafik (OMX) - omx001@proton.me
import React from 'react'





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
        case 0: 
            return 'bi-sun-fill'
        case 1: 
            return 'bi-sun-fill'
        case 2: 
            return 'bi-cloud-sun-fill'
        case 3: 
            return 'bi-clouds-fill'
        case 45: 
        case 48: 
            return 'bi-cloud-haze-fill'
        case 51: 
        case 53: 
        case 55: 
            return 'bi-cloud-drizzle-fill'
        case 56: 
        case 57: 
            return 'bi-cloud-drizzle-fill'
        case 61: 
        case 63: 
        case 65: 
            return 'bi-cloud-rain-fill'
        case 66: 
        case 67: 
            return 'bi-cloud-rain-heavy-fill'
        case 71: 
        case 73: 
        case 75: 
            return 'bi-cloud-snow-fill'
        case 77: 
            return 'bi-snow'
        case 80: 
        case 81: 
        case 82: 
            return 'bi-cloud-rain-fill'
        case 85: 
        case 86: 
            return 'bi-cloud-snow-fill'
        case 95: 
            return 'bi-cloud-lightning-fill'
        case 96: 
        case 99: 
            return 'bi-cloud-lightning-rain-fill'
        default:
            return 'bi-sun-fill'
    }
}

export const getWeatherIconColor = (code: number): string => {
    switch (code) {
        case 0: 
        case 1: 
            return '#FBBF24' 
        case 2: 
            return '#F59E0B' 
        case 3: 
            return '#94A3B8' 
        case 45: 
        case 48:
            return '#CBD5E1' 
        case 51: case 53: case 55: 
        case 56: case 57:
            return '#60A5FA' 
        case 61: case 63: case 65: 
        case 66: case 67:
        case 80: case 81: case 82:
            return '#3B82F6' 
        case 71: case 73: case 75: 
        case 77: case 85: case 86:
            return '#E2E8F0' 
        case 95: case 96: case 99: 
            return '#8B5CF6' 
        default:
            return '#FBBF24'
    }
}


export const getWeatherIcon = (code: number) => {
    const iconClass = getWeatherIconClass(code)
    const color = getWeatherIconColor(code)
    return <i className={`bi ${iconClass}`} style={{ color, fontSize: 'inherit' }} />
}


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