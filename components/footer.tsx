"use client"
import Link from "next/link"
import { useState } from "react"
import type React from "react"

const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
  </svg>
)

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.645.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
)

const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
  </svg>
)

export function Footer() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setTimeout(() => setSubscribed(false), 3000)
      setEmail("")
    }
  }

  return (
    <footer className="relative mt-auto bg-white border-t border-slate-200">
      <div className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Newsletter Section */}
          <div className="mb-12 sm:mb-16 p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">Restez informé de la météo</h3>
                <p className="text-slate-500 font-medium text-sm sm:text-base">
                  Recevez nos alertes météo et prévisions directement dans votre boîte mail.
                </p>
              </div>
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3 min-w-[280px] lg:min-w-[300px]"
              >
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre email"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all duration-300"
                    suppressHydrationWarning
                  />
                </div>
                <button
                  type="submit"
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${subscribed
                      ? "bg-slate-600 text-white"
                      : "bg-slate-800 text-white hover:bg-slate-700 hover:shadow-md"
                    }`}
                >
                  {subscribed ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Inscrit!
                    </span>
                  ) : (
                    "S'inscrire"
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-12">
            {/* Brand - Full width on mobile */}
            <div className="col-span-2 lg:col-span-1 order-1">
              <div className="flex items-center gap-3 mb-6">
                <img
                  src="https://raw.githubusercontent.com/pyronix-dev/upwork/main/logo.png"
                  alt="Logo"
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <h4 className="text-xl font-bold text-slate-800">Météo</h4>
                  <p className="text-sm font-semibold text-slate-600">Martinique</p>
                </div>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed mb-6 text-sm">
                Votre source fiable pour des prévisions météo précises en Martinique. Données actualisées en temps réel.
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-all duration-300"
                  aria-label="Facebook"
                >
                  <FacebookIcon />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-all duration-300"
                  aria-label="Twitter"
                >
                  <TwitterIcon />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
              </div>
            </div>

            {/* Liens Rapides */}
            <div className="col-span-1 order-2">
              <h4 className="text-base sm:text-lg font-bold text-slate-800 mb-4 sm:mb-6">Liens Rapides</h4>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  { label: "Prévisions", href: "/previsions" },
                  { label: "Carte", href: "/carte" },
                  { label: "Alertes", href: "/alertes" },
                  { label: "Vigilance", href: "/vigilance" },
                ].map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-slate-500 font-medium hover:text-slate-800 transition-colors duration-300 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="col-span-1 order-3">
              <h4 className="text-base sm:text-lg font-bold text-slate-800 mb-4 sm:mb-6">Services</h4>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  { label: "Météo des plages", href: "#" },
                  { label: "Météo marine", href: "#" },
                  { label: "Vigilance ouragans", href: "/vigilance" },
                  { label: "Alertes SMS", href: "/alertes" },
                ].map((service, i) => (
                  <li key={i}>
                    <Link
                      href={service.href}
                      className="text-slate-500 font-medium hover:text-slate-800 transition-colors duration-300 text-sm"
                    >
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="col-span-2 lg:col-span-1 order-4">
              <h4 className="text-base sm:text-lg font-bold text-slate-800 mb-4 sm:mb-6 text-left">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 justify-start">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-slate-800 font-semibold text-sm">Adresses</p>
                    <p className="text-slate-500 font-medium text-xs sm:text-sm">
                      Chemin Raynal – 31200 Toulouse – France
                    </p>
                    <p className="text-slate-500 font-medium text-xs sm:text-sm mt-1">
                      222 Boulevard Gustave Flaubert – 63000 Clermont-Ferrand – France
                    </p>
                  </div>
                </li>
                <li className="flex items-center gap-3 justify-start">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-slate-800 font-semibold text-sm">Email</p>
                    <a
                      href="mailto:bonjour@meteo-martinique.fr"
                      className="text-slate-500 font-medium text-xs sm:text-sm hover:text-slate-800 transition-colors"
                    >
                      bonjour@meteo-martinique.fr
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-slate-500 font-medium text-sm">
                  © 2026 <span className="text-slate-800 font-bold">Météo Martinique</span>. Tous droits réservés.
                </p>
                <p className="text-slate-500 text-sm mt-2 flex items-center justify-center md:justify-start gap-1.5 font-medium tracking-wide">
                  <span className="bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent">
                    Fait et géré avec
                  </span>
                  <span
                    className="inline-block text-red-500 text-base"
                    style={{
                      animation: "heartbeat 1.5s ease-in-out infinite",
                    }}
                  >
                    ❤️
                  </span>
                  <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    par une équipe martiniquaise
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                <Link
                  href="/mentions-legales"
                  className="text-slate-500 font-medium text-sm hover:text-slate-800 transition-colors duration-300"
                >
                  Mentions légales
                </Link>
                <Link
                  href="/confidentialite"
                  className="text-slate-500 font-medium text-sm hover:text-slate-800 transition-colors duration-300"
                >
                  Politique de confidentialité
                </Link>
                <Link
                  href="/conditions-generales"
                  className="text-slate-500 font-medium text-sm hover:text-slate-800 transition-colors duration-300"
                >
                  CGU
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          14% {
            transform: scale(1.15);
          }
          28% {
            transform: scale(1);
          }
          42% {
            transform: scale(1.15);
          }
          56%, 100% {
            transform: scale(1);
          }
        }
      `}</style>
    </footer>
  )
}
