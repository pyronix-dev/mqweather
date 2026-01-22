"use client"
import Link from "next/link"
import { useState } from "react"
import type React from "react"

const FacebookIcon = () => (
  <i className="bi bi-facebook text-lg"></i>
)

const InstagramIcon = () => (
  <i className="bi bi-instagram text-lg"></i>
)

const TwitterIcon = () => (
  <i className="bi bi-twitter-x text-lg"></i>
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
