// Developed by Omar Rafik (OMX) - omx001@proton.me
import React from "react"

interface MapErrorDisplayProps {
    onRetry: () => void
}

export function MapErrorDisplay({ onRetry }: MapErrorDisplayProps) {
    return (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#1a1a1a] p-6 animate-fade-in">
            {}
            <div className="w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>

            {}
            <h3 className="text-red-500 font-medium text-lg text-center mb-8">
                Impossible de charger les données météo
            </h3>

            {}
            <button
                onClick={onRetry}
                className="px-6 py-2.5 bg-[#0088cc] hover:bg-[#0099e6] text-white font-bold rounded-full transition-all duration-300 shadow-lg shadow-blue-900/20 active:scale-95"
            >
                Réessayer
            </button>
        </div>
    )
}