// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

const ArrowLeftIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7l-7 7 7 7" />
    </svg>
)

const BuildingIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
)

const CheckIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
)

const SendIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
)

export default function DevisPage({ initialUser }: { initialUser: any }) {
    const [formData, setFormData] = useState({
        company: "",
        contact: "",
        email: "",
        phone: "",
        employees: "",
        message: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        
        await new Promise(resolve => setTimeout(resolve, 1500))

        setIsSubmitting(false)
        setIsSubmitted(true)
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-stone-50">
                <Header initialUser={initialUser} />
                <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl animate-fade-in-up">
                        <div className="relative bg-gradient-to-r from-slate-700 to-slate-900 px-6 py-12 text-center text-white overflow-hidden">
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full animate-pulse" />
                            </div>
                            <div className="relative">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h1 className="text-3xl font-black mb-3">Demande envoyée !</h1>
                                <p className="text-white/90 font-medium">Nous vous répondrons sous 24-48h</p>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8 space-y-6">
                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Merci pour votre demande de devis. Notre équipe commerciale analysera vos besoins
                                    et vous contactera rapidement avec une proposition personnalisée.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/"
                                    className="flex-1 py-4 bg-slate-800 hover:bg-slate-900 text-white font-black text-center rounded-xl transition-all"
                                >
                                    Retour à l&apos;accueil
                                </Link>
                                <Link
                                    href="/alertes"
                                    className="flex-1 py-4 bg-white border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-black text-center rounded-xl transition-all"
                                >
                                    Voir les alertes
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-stone-50">
            <Header initialUser={initialUser} />
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <Link
                    href="/alertes"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium mb-6 transition-colors group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">
                        <ArrowLeftIcon />
                    </span>
                    Retour aux alertes
                </Link>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    {}
                    <div className="relative bg-gradient-to-r from-slate-700 to-slate-900 px-6 py-10 text-white overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
                            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full" />
                        </div>
                        <div className="relative flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-xl">
                                <BuildingIcon />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-black mb-1">SMS Pro - Demande de devis</h1>
                                <p className="text-white/80 font-medium">Pour entreprises & collectivités</p>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="px-6 py-6 bg-slate-50 border-b border-slate-200">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {["Multi-numéros illimités", "Support prioritaire 24/7", "Historique & Rapports détaillés"].map((feature) => (
                                <div key={feature} className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                    <span className="p-1 rounded-full bg-emerald-100 text-emerald-600">
                                        <CheckIcon />
                                    </span>
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>

                    {}
                    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-black text-slate-700 mb-2">
                                    Nom de l&apos;entreprise *
                                </label>
                                <input
                                    type="text"
                                    required
                                    autoComplete="organization"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    placeholder="Ex: Météo Martinique SARL"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                    suppressHydrationWarning
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-black text-slate-700 mb-2">
                                    Nom du contact *
                                </label>
                                <input
                                    type="text"
                                    required
                                    autoComplete="name"
                                    value={formData.contact}
                                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                    placeholder="Ex: Jean Dupont"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                    suppressHydrationWarning
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-black text-slate-700 mb-2">
                                    Email professionnel *
                                </label>
                                <input
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="contact@entreprise.fr"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                    suppressHydrationWarning
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-black text-slate-700 mb-2">
                                    Téléphone *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    autoComplete="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+596 696 00 00 00"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                    suppressHydrationWarning
                                />
                            </div>
                        </div>

                        {}
                        <div>
                            <label className="block text-sm font-black text-slate-700 mb-3">
                                Nombre de numéros à alerter
                            </label>
                            <div className="space-y-2">
                                {[
                                    { value: "1-10", label: "1 à 10 numéros" },
                                    { value: "11-50", label: "11 à 50 numéros" },
                                    { value: "51-100", label: "51 à 100 numéros" },
                                    { value: "100+", label: "Plus de 100 numéros" },
                                ].map((option) => (
                                    <label
                                        key={option.value}
                                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200
                                            ${formData.employees === option.value
                                                ? "border-slate-800 bg-slate-50"
                                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                                            ${formData.employees === option.value
                                                ? "border-slate-800 bg-slate-800"
                                                : "border-slate-300"
                                            }`}
                                        >
                                            {formData.employees === option.value && (
                                                <div className="w-2 h-2 bg-white rounded-full" />
                                            )}
                                        </div>
                                        <input
                                            type="radio"
                                            name="employees"
                                            value={option.value}
                                            checked={formData.employees === option.value}
                                            onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                                            className="sr-only"
                                        />
                                        <span className={`font-medium transition-colors ${formData.employees === option.value ? "text-slate-800" : "text-slate-600"}`}>
                                            {option.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-black text-slate-700 mb-2">
                                Message / Besoins spécifiques
                            </label>
                            <textarea
                                rows={4}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Décrivez vos besoins (zones géographiques, types d'alertes, intégrations souhaitées...)"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
                                suppressHydrationWarning
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 disabled:from-slate-400 disabled:to-slate-400 text-white font-black text-lg rounded-xl transition-all hover:shadow-lg active:scale-[0.98]"
                        >
                            {isSubmitting ? (
                                "Envoi en cours..."
                            ) : (
                                <>
                                    <SendIcon />
                                    Envoyer ma demande de devis
                                </>
                            )}
                        </button>

                        <p className="text-xs text-slate-500 text-center">
                            En soumettant ce formulaire, vous acceptez d&apos;être contacté par notre équipe commerciale.
                            Vos données ne seront jamais partagées avec des tiers.
                        </p>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    )
}