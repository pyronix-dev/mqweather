"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const AlertIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  </svg>
)

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const MapPinIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
)

const LocationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
  </svg>
)

const CrosshairIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <line x1="12" y1="2" x2="12" y2="6" strokeWidth="2" />
    <line x1="12" y1="18" x2="12" y2="22" strokeWidth="2" />
    <line x1="2" y1="12" x2="6" y2="12" strokeWidth="2" />
    <line x1="18" y1="12" x2="22" y2="12" strokeWidth="2" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
  </svg>
)

const MARTINIQUE_CITIES = [
  { name: "Fort-de-France", lat: 14.6161, lon: -61.059 },
  { name: "Le Lamentin", lat: 14.59, lon: -61.0 },
  { name: "Saint-Joseph", lat: 14.67, lon: -61.04 },
  { name: "Schœlcher", lat: 14.61, lon: -61.09 },
  { name: "L'Ajoupa-Bouillon", lat: 14.82, lon: -61.11 },
  { name: "Basse-Pointe", lat: 14.87, lon: -61.11 },
  { name: "Grand'Rivière", lat: 14.88, lon: -61.18 },
  { name: "Gros-Morne", lat: 14.73, lon: -61.03 },
  { name: "Le Lorrain", lat: 14.83, lon: -61.06 },
  { name: "Macouba", lat: 14.88, lon: -61.13 },
  { name: "Le Marigot", lat: 14.78, lon: -61.01 },
  { name: "Le Robert", lat: 14.68, lon: -60.94 },
  { name: "Sainte-Marie", lat: 14.78, lon: -61.01 },
  { name: "La Trinité", lat: 14.74, lon: -60.97 },
  { name: "Bellefontaine", lat: 14.67, lon: -61.15 },
  { name: "Le Carbet", lat: 14.71, lon: -61.18 },
  { name: "Case-Pilote", lat: 14.64, lon: -61.13 },
  { name: "Fonds-Saint-Denis", lat: 14.73, lon: -61.1 },
  { name: "Le Morne-Rouge", lat: 14.77, lon: -61.11 },
  { name: "Le Morne-Vert", lat: 14.72, lon: -61.13 },
  { name: "Le Prêcheur", lat: 14.8, lon: -61.22 },
  { name: "Saint-Pierre", lat: 14.74, lon: -61.18 },
  { name: "Les Anses-d'Arlet", lat: 14.49, lon: -61.08 },
  { name: "Le Diamant", lat: 14.47, lon: -61.03 },
  { name: "Ducos", lat: 14.55, lon: -60.97 },
  { name: "Le François", lat: 14.62, lon: -60.9 },
  { name: "Le Marin", lat: 14.47, lon: -60.87 },
  { name: "Rivière-Pilote", lat: 14.48, lon: -60.9 },
  { name: "Rivière-Salée", lat: 14.53, lon: -60.99 },
  { name: "Saint-Esprit", lat: 14.55, lon: -60.93 },
  { name: "Sainte-Anne", lat: 14.43, lon: -60.88 },
  { name: "Sainte-Luce", lat: 14.47, lon: -60.93 },
  { name: "Les Trois-Îlets", lat: 14.54, lon: -61.04 },
  { name: "Le Vauclin", lat: 14.55, lon: -60.83 },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCitySuggestions, setShowCitySuggestions] = useState(false)
  const [locating, setLocating] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const searchRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const pathname = usePathname()
  const router = useRouter()

  // Fetch user session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const data = await res.json()
          // Construct display name: Full Name -> Email -> Reference
          // We don't have full_name in api/auth/me yet, let's assume update
          // or fallback to reference/email
          // For now, let's use what we have. 
          // Note: Ideally /api/auth/me should return full_name. 
          // We can patch /api/auth/me later or now. 
          // If we recently updated DB, we should update /api/auth/me too.
          // For now, let's use a safe fallback.
          const name = data.name || data.reference
          setUser({ name: name, email: data.email || '' })
        }
      } catch (e) {
        // Not logged in
      }
    }
    checkSession()
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowCitySuggestions(false)
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setShowCitySuggestions(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/login')
  }

  const filteredCities = MARTINIQUE_CITIES.filter((city) => city.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleCitySelect = (city: (typeof MARTINIQUE_CITIES)[0]) => {
    setSearchQuery(city.name)
    setShowCitySuggestions(false)
    router.push(`/previsions?city=${encodeURIComponent(city.name)}&lat=${city.lat}&lon=${city.lon}`)
  }

  const handleGetLocation = () => {
    setLocating(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          // Find nearest city
          const nearest = MARTINIQUE_CITIES.reduce((prev, curr) => {
            const prevDist = Math.abs(prev.lat - latitude) + Math.abs(prev.lon - longitude)
            const currDist = Math.abs(curr.lat - latitude) + Math.abs(curr.lon - longitude)
            return currDist < prevDist ? curr : prev
          })
          setSearchQuery(nearest.name)
          setShowCitySuggestions(false)
          setLocating(false)
          router.push(`/previsions?city=${encodeURIComponent(nearest.name)}&lat=${nearest.lat}&lon=${nearest.lon}`)
        },
        (error) => {
          console.error("Geolocation error:", error)
          setLocating(false)
          alert("Impossible d'obtenir votre position. Veuillez vérifier les permissions de localisation.")
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      )
    } else {
      setLocating(false)
      alert("La géolocalisation n'est pas supportée par votre navigateur.")
    }
  }

  const getPageName = () => {
    switch (pathname) {
      case "/":
      case "/carte":
        return "Carte"
      case "/previsions":
        return "Prévisions"
      case "/vigilance":
        return "Vigilance"
      case "/alertes":
        return "Alertes"
      default:
        if (pathname.startsWith("/previsions/")) {
          return "Détail Jour"
        }
        return null
    }
  }

  const currentPage = getPageName()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="w-full px-4 sm:px-6 py-3 sm:py-4">
        {/* Desktop Header */}
        <div className="hidden sm:flex items-center justify-between gap-4">
          {/* Logo Section */}
          <div className="flex-shrink-0 animate-fade-in-up">
            <Link href="/carte">
              <img
                src="https://raw.githubusercontent.com/pyronix-dev/upwork/main/logo-text.png"
                alt="Météo Martinique"
                className="h-10 object-contain hover:scale-105 transition-transform"
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-4 lg:gap-6 flex-wrap justify-center flex-1">
            <Link
              href="#"
              className="flex items-center gap-1 text-red-500 font-bold text-sm hover:text-red-600 transition whitespace-nowrap animate-slide-in-left"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> EN DIRECT
            </Link>
            <Link
              href="/previsions"
              className={`font-bold transition whitespace-nowrap animate-slide-in-left relative ${pathname === "/previsions" || pathname.startsWith("/previsions/")
                ? "text-slate-800"
                : "text-slate-600 hover:text-slate-800"
                }`}
              style={{ animationDelay: "0.2s" }}
            >
              Prévisions
              {(pathname === "/previsions" || pathname.startsWith("/previsions/")) && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-slate-800 rounded-full" />
              )}
            </Link>
            <Link
              href="/vigilance"
              className={`font-bold transition whitespace-nowrap animate-slide-in-left relative ${pathname === "/vigilance" ? "text-slate-800" : "text-slate-600 hover:text-slate-800"
                }`}
              style={{ animationDelay: "0.3s" }}
            >
              Vigilance
              {pathname === "/vigilance" && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-slate-800 rounded-full" />
              )}
            </Link>
            <Link
              href="/carte"
              className={`font-bold transition whitespace-nowrap animate-slide-in-left relative ${pathname === "/carte" || pathname === "/" ? "text-slate-800" : "text-slate-600 hover:text-slate-800"
                }`}
              style={{ animationDelay: "0.4s" }}
            >
              Carte
              {(pathname === "/carte" || pathname === "/") && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-slate-800 rounded-full" />
              )}
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3 flex-shrink-0 animate-slide-in-right">
            <div className="hidden lg:block relative" ref={searchRef}>
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 focus-within:border-slate-400 transition-colors">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Chercher une ville..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowCitySuggestions(true)
                  }}
                  onFocus={() => setShowCitySuggestions(true)}
                  className="bg-transparent text-sm outline-none text-slate-800 placeholder:text-slate-400 w-40"
                />
                {showCitySuggestions && searchQuery && (
                  <button
                    onClick={() => {
                      setShowCitySuggestions(false)
                      setSearchQuery("")
                    }}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <CloseIcon />
                  </button>
                )}
              </div>

              {/* City suggestions dropdown */}
              {showCitySuggestions && (
                <div className="absolute top-full mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 max-h-80 overflow-hidden animate-fade-in-up">
                  <button
                    onClick={handleGetLocation}
                    disabled={locating}
                    className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors text-sm text-blue-600 border-b border-slate-200 flex items-center gap-3 font-medium ${locating ? "opacity-50" : ""}`}
                  >
                    <CrosshairIcon />
                    <span>{locating ? "Localisation en cours..." : "Ma localisation"}</span>
                  </button>

                  <div className="max-h-60 overflow-y-auto">
                    {filteredCities.length > 0 ? (
                      filteredCities.map((city, index) => (
                        <button
                          key={city.name}
                          onClick={() => handleCitySelect(city)}
                          className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-all duration-200 text-sm text-slate-700 border-b border-slate-100 last:border-b-0 flex items-center gap-3 group"
                        >
                          <div className="text-slate-400 group-hover:text-slate-600 transition-colors">
                            <MapPinIcon />
                          </div>
                          <span className="group-hover:text-slate-900 transition-colors">{city.name}</span>
                        </button>
                      ))
                    ) : searchQuery ? (
                      <div className="px-4 py-3 text-sm text-slate-500 text-center">Aucune ville trouvée</div>
                    ) : (
                      MARTINIQUE_CITIES.slice(0, 8).map((city) => (
                        <button
                          key={city.name}
                          onClick={() => handleCitySelect(city)}
                          className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-all duration-200 text-sm text-slate-700 border-b border-slate-100 last:border-b-0 flex items-center gap-3 group"
                        >
                          <div className="text-slate-400 group-hover:text-slate-600 transition-colors">
                            <MapPinIcon />
                          </div>
                          <span className="group-hover:text-slate-900 transition-colors">{city.name}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/alertes"
              className={`flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm transition whitespace-nowrap ${pathname === "/alertes" ? "ring-2 ring-red-300" : ""}`}
            >
              <AlertIcon />
              Alertes
            </Link>

            {/* Authenticated User Menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 px-2 py-1.5 pr-4 rounded-full border border-slate-200 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-slate-800 leading-tight">Bonjour,</p>
                    <p className="text-xs text-slate-500 truncate max-w-[80px]">{user.name}</p>
                  </div>
                  <div className="text-slate-400">
                    <svg className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in-up">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                      <p className="font-bold text-slate-800 text-sm truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      Mon Tableau de bord
                    </Link>
                    <button
                      className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      Paramètres
                    </button>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className={`flex items-center gap-2 text-slate-700 font-bold hover:text-slate-900 transition whitespace-nowrap px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 ${pathname === "/login" ? "bg-slate-50 border-slate-300" : ""}`}
              >
                <UserIcon />
                <span className="hidden lg:inline">Espace Membre</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Header */}
        <div className="sm:hidden flex items-center justify-between gap-3">
          <div className="flex-shrink-0 animate-fade-in-up">
            <Link href="/carte">
              <img
                src="https://raw.githubusercontent.com/pyronix-dev/upwork/main/logo.png"
                alt="Météo Martinique"
                className="h-10 w-10 object-contain hover:scale-105 transition-transform"
              />
            </Link>
          </div>

          {currentPage && (
            <div className="flex-1 text-center">
              <span className="text-sm font-bold text-slate-800">{currentPage}</span>
            </div>
          )}

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-800 flex-shrink-0">
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="sm:hidden mt-4 space-y-3 animate-slide-in-left border-t border-slate-200 pt-4">
            <Link
              href="#"
              className="flex items-center gap-1 text-red-500 font-bold text-sm hover:text-red-600 transition block"
            >
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> EN DIRECT
            </Link>
            <Link
              href="/previsions"
              className={`font-bold hover:text-slate-600 transition block ${pathname === "/previsions" || pathname.startsWith("/previsions/") ? "text-slate-800 border-l-2 border-slate-800 pl-2" : "text-slate-600"}`}
            >
              Prévisions
            </Link>
            <Link
              href="/vigilance"
              className={`font-bold hover:text-slate-600 transition block ${pathname === "/vigilance" ? "text-slate-800 border-l-2 border-slate-800 pl-2" : "text-slate-600"}`}
            >
              Vigilance
            </Link>
            <Link
              href="/carte"
              className={`font-bold hover:text-slate-600 transition block ${pathname === "/carte" || pathname === "/" ? "text-slate-800 border-l-2 border-slate-800 pl-2" : "text-slate-600"}`}
            >
              Carte
            </Link>
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <div className="relative" ref={mobileSearchRef}>
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
                  <SearchIcon />
                  <input
                    type="text"
                    placeholder="Chercher une ville..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setShowCitySuggestions(true)
                    }}
                    onFocus={() => setShowCitySuggestions(true)}
                    className="bg-transparent text-sm outline-none text-slate-800 placeholder:text-slate-400 w-full"
                  />
                </div>

                {showCitySuggestions && (
                  <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-60 overflow-hidden">
                    {/* Ma localisation button */}
                    <button
                      onClick={() => {
                        handleGetLocation()
                        setMobileMenuOpen(false)
                      }}
                      disabled={locating}
                      className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors text-sm text-blue-600 border-b border-slate-200 flex items-center gap-3 font-medium ${locating ? "opacity-50" : ""}`}
                    >
                      <CrosshairIcon />
                      <span>{locating ? "Localisation en cours..." : "Ma localisation"}</span>
                    </button>

                    <div className="max-h-48 overflow-y-auto">
                      {filteredCities.length > 0 ? (
                        filteredCities.slice(0, 6).map((city) => (
                          <button
                            key={city.name}
                            onClick={() => {
                              handleCitySelect(city)
                              setMobileMenuOpen(false)
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors text-sm text-slate-700 border-b border-slate-100 last:border-b-0 flex items-center gap-3"
                          >
                            <MapPinIcon />
                            <span>{city.name}</span>
                          </button>
                        ))
                      ) : searchQuery ? (
                        <div className="px-4 py-3 text-sm text-slate-500 text-center">Aucune ville trouvée</div>
                      ) : (
                        MARTINIQUE_CITIES.slice(0, 6).map((city) => (
                          <button
                            key={city.name}
                            onClick={() => {
                              handleCitySelect(city)
                              setMobileMenuOpen(false)
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors text-sm text-slate-700 border-b border-slate-100 last:border-b-0 flex items-center gap-3"
                          >
                            <MapPinIcon />
                            <span>{city.name}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/alertes"
                className="w-full flex items-center gap-2 justify-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm transition"
              >
                <AlertIcon />
                Alertes
              </Link>

              {/* Mobile Espace Membre */}
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="w-full flex items-center gap-3 justify-center px-4 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-sm"
                  >
                    <div className="w-6 h-6 rounded-full bg-slate-600 border border-slate-500 flex items-center justify-center text-[10px]">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    Mon Tableau de bord
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 justify-center text-red-600 font-bold px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 transition"
                  >
                    Se déconnecter
                  </button>
                </>

              ) : (
                <Link
                  href="/login"
                  className="w-full flex items-center gap-2 justify-center text-slate-700 font-bold px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50"
                >
                  <UserIcon />
                  Espace Membre
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
