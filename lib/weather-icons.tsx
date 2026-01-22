import React from 'react'

export const getWeatherIcon = (code: number) => {
    // WMO Weather interpretation codes (WW)
    // https://open-meteo.com/en/docs
    // Using filled icons with currentColor for proper color inheritance

    switch (code) {
        case 0: // Clear sky
            return (
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5.64 5.64l1.42 1.42M16.95 16.95l1.41 1.41M5.64 18.36l1.42-1.42M16.95 7.05l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
            )
        case 1: // Mainly clear - sun with small cloud
            return (
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="8" cy="8" r="3" />
                    <path d="M8 3v1M8 12v1M3 8h1M12 8h1M4.76 4.76l.7.7M10.54 10.54l.7.7M4.76 11.24l.7-.7M10.54 5.46l.7-.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                    <path d="M13 17.5a3.5 3.5 0 1 0-7 0h7z" />
                    <path d="M19 17.5a4 4 0 1 0-8 0h8z" />
                </svg>
            )
        case 2: // Partly cloudy
        case 3: // Overcast
            return (
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.5 19a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z" fillOpacity="0.3" />
                    <path d="M17.5 19H6.5a4.5 4.5 0 1 1 .36-9A6 6 0 0 1 18 14.5a3.5 3.5 0 0 1-.5 4.5z" />
                </svg>
            )
        case 45: // Fog
        case 48: // Depositing rime fog
            return (
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="8" width="18" height="2" rx="1" fillOpacity="0.4" />
                    <rect x="5" y="12" width="14" height="2" rx="1" fillOpacity="0.6" />
                    <rect x="3" y="16" width="18" height="2" rx="1" fillOpacity="0.8" />
                </svg>
            )
        case 51: // Drizzle: Light
        case 53: // Drizzle: Moderate
        case 55: // Drizzle: Dense intensity
        case 56: // Freezing Drizzle: Light
        case 57: // Freezing Drizzle: Dense
            return (
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.5 17H6.5a4.5 4.5 0 1 1 .36-9A6 6 0 0 1 18 12.5a3.5 3.5 0 0 1-.5 4.5z" />
                    <circle cx="8" cy="20" r="1" fillOpacity="0.7" />
                    <circle cx="12" cy="21" r="1" fillOpacity="0.7" />
                    <circle cx="16" cy="20" r="1" fillOpacity="0.7" />
                </svg>
            )
        case 61: // Rain: Slight
        case 63: // Rain: Moderate
        case 65: // Rain: Heavy intensity
        case 66: // Freezing Rain: Light
        case 67: // Freezing Rain: Heavy
        case 80: // Rain showers: Slight
        case 81: // Rain showers: Moderate
        case 82: // Rain showers: Violent
            return (
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.5 15H6.5a4.5 4.5 0 1 1 .36-9A6 6 0 0 1 18 10.5a3.5 3.5 0 0 1-.5 4.5z" />
                    <path d="M8 18l-1 3M12 18l-1 3M16 18l-1 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
            )
        case 71: // Snow fall: Slight
        case 73: // Snow fall: Moderate
        case 75: // Snow fall: Heavy intensity
        case 77: // Snow grains
        case 85: // Snow showers slight
        case 86: // Snow showers heavy
            return (
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.5 15H6.5a4.5 4.5 0 1 1 .36-9A6 6 0 0 1 18 10.5a3.5 3.5 0 0 1-.5 4.5z" />
                    <circle cx="8" cy="19" r="1.5" />
                    <circle cx="12" cy="21" r="1.5" />
                    <circle cx="16" cy="19" r="1.5" />
                </svg>
            )
        case 95: // Thunderstorm: Slight or moderate
        case 96: // Thunderstorm with slight hail
        case 99: // Thunderstorm with heavy hail
            return (
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.5 13H6.5a4.5 4.5 0 1 1 .36-9A6 6 0 0 1 18 8.5a3.5 3.5 0 0 1-.5 4.5z" />
                    <path d="M13 14l-2 4h3l-2 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
            )
        default: // Default to sun
            return (
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5.64 5.64l1.42 1.42M16.95 16.95l1.41 1.41M5.64 18.36l1.42-1.42M16.95 7.05l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
            )
    }
}
