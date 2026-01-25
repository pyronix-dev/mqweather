// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"
import Link from "next/link"

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


  return (
    <footer className="relative mt-auto bg-white border-t border-slate-200">
      <div className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          { }


          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
            { }
            <div className="lg:col-span-5 order-1">
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
              <p className="text-slate-500 font-medium leading-relaxed mb-6 text-lg max-w-sm">
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

            { }
            <div className="lg:col-span-2 order-2">
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

            { }
            <div className="lg:col-span-2 order-3">
              <h4 className="text-base sm:text-lg font-bold text-slate-800 mb-4 sm:mb-6">Services</h4>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  { label: "Météo des plages", href: "/cartes/plages" },
                  { label: "Météo marine", href: "/meteo-marine" },
                  { label: "Vigilance ouragans", href: "/vigilance" },
                  { label: "Alertes SMS", href: "/alertes?mode=sms" },
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
          </div>

          { }
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
                  href="/contact"
                  className="text-slate-500 font-medium text-sm hover:text-slate-800 transition-colors duration-300"
                >
                  Contact
                </Link>
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