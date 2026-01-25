// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useState, useRef, useEffect } from "react"
import { MARTINIQUE_CITIES } from "@/lib/constants"

interface MapControlsProps {
    onSearch: (city: typeof MARTINIQUE_CITIES[0]) => void
    onDaySelect: (index: number) => void
    selectedDay: number
}

const SearchIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
)

const CloseIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
)

export function MapControls({ onSearch, onDaySelect, selectedDay }: MapControlsProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [showSuggestions, setShowSuggestions] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)


    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() + i)
        return {
            index: i,
            label: d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" }),
            fullDate: d.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
        }
    })

    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true) // Assume true initially if content might overflow
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
            setCanScrollLeft(scrollLeft > 0)
            // Use a small threshold (1px) to handle potential rounding errors
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
        }
    }

    useEffect(() => {
        checkScroll()
        window.addEventListener('resize', checkScroll)
        return () => window.removeEventListener('resize', checkScroll)
    }, [])

    const filteredCities = MARTINIQUE_CITIES.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="flex flex-col md:flex-row gap-4 w-full mb-4">
            { }
            <div className="relative w-full md:w-72 z-40" ref={searchRef}>
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 focus-within:border-teal-500 transition-colors shadow-sm">
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
                        className="bg-transparent text-sm outline-none text-slate-800 placeholder:text-slate-400 w-full"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600">
                            <CloseIcon />
                        </button>
                    )}
                </div>
                {showSuggestions && searchQuery && (
                    <div className="absolute top-fullmt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl mt-1 max-h-60 overflow-y-auto">
                        {filteredCities.length > 0 ? (
                            filteredCities.map(city => (
                                <button
                                    key={city.name}
                                    onClick={() => {
                                        onSearch(city)
                                        setSearchQuery(city.name)
                                        setShowSuggestions(false)
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700 block transition-colors"
                                >
                                    {city.name}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-sm text-slate-500">Aucune ville trouvée</div>
                        )}
                    </div>
                )}
            </div>

            { }
            <div className="flex-1 overflow-x-auto pb-2 md:pb-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style jsx>{`
                    div::-webkit-scrollbar {
                        display: none;
                    }
                    .no-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>
                {/* Scroll container replacement happens in next chunk */}
                {/* Dynamic Scroll Container */}
                <div className="flex items-center gap-2 w-full relative group">
                    {/* Left Arrow */}
                    <button
                        onClick={() => {
                            if (scrollContainerRef.current) {
                                scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' })
                            }
                        }}
                        className={`p-2 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 flex-shrink-0 transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none w-0 p-0 border-0'
                            }`}
                        aria-hidden={!canScrollLeft}
                        tabIndex={canScrollLeft ? 0 : -1}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div
                        ref={scrollContainerRef}
                        id="days-container"
                        onScroll={checkScroll}
                        className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-1"
                    >
                        {days.map(day => (
                            <button
                                key={day.index}
                                onClick={() => onDaySelect(day.index)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${selectedDay === day.index
                                    ? "bg-slate-800 text-white shadow-md transform scale-105"
                                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                                    }`}
                            >
                                {day.index === 0 ? "Auj." : day.label}
                            </button>
                        ))}
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={() => {
                            if (scrollContainerRef.current) {
                                scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' })
                            }
                        }}
                        className={`p-2 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 flex-shrink-0 transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none w-0 p-0 border-0'
                            }`}
                        aria-hidden={!canScrollRight}
                        tabIndex={canScrollRight ? 0 : -1}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}