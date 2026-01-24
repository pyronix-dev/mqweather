"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const ArrowLeftIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
)

const MoonIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
)



const ShieldExclamationIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
    </svg>
)

import { DeleteAccountDialog } from "@/components/delete-account-dialog"

export default function SettingsPage({ initialUser }: { initialUser: any }) {
    const [darkMode, setDarkMode] = useState(false)

    const [loading, setLoading] = useState(true)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    // Fetch initial preferences
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/auth/me')
                if (res.ok) {
                    const data = await res.json()
                    // If backend sends nested notifications object

                    // Fallback to legacy if needed, or if nothing set
                }
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        fetchSettings()
    }, [])



    return (
        <div className="min-h-screen bg-stone-100 flex flex-col">
            <Header initialUser={initialUser} />

            <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-8">
                <div className="mb-6">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-colors mb-4"
                    >
                        <ArrowLeftIcon />
                        Retour au tableau de bord
                    </Link>
                    <h1 className="text-3xl font-black text-slate-800">Paramètres</h1>
                    <p className="text-slate-500 mt-1">Personnalisez votre expérience</p>
                </div>

                {loading ? (
                    <div className="py-12 text-center text-slate-500">Chargement...</div>
                ) : (
                    <div className="space-y-6">
                        {/* Theme Section */}
                        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <MoonIcon />
                                Apparence
                            </h2>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-slate-700">Mode Sombre</p>
                                    <p className="text-sm text-slate-500">Activer le thème sombre pour l'interface</p>
                                </div>
                                <button
                                    onClick={() => setDarkMode(!darkMode)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                            <p className="text-xs text-amber-600 mt-3 font-medium bg-amber-50 p-2 rounded-lg inline-block">
                                🚧 Bientôt disponible
                            </p>
                        </section>



                        {/* Privacy Section */}
                        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <ShieldExclamationIcon />
                                Confidentialité et Données
                            </h2>
                            <div className="space-y-4">
                                <button className="w-full text-left px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium transition-colors">
                                    Télécharger mes données (GDPR)
                                </button>
                                <button
                                    onClick={() => setIsDeleteOpen(true)}
                                    className="w-full text-left px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-medium transition-colors"
                                >
                                    Supprimer mon compte
                                </button>
                            </div>
                        </section>

                        <p className="text-center text-xs text-slate-400 font-medium pt-4">
                            Version 0.1.0 • ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                        </p>
                    </div>
                )}
            </main>

            <Footer />
            <DeleteAccountDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
            />
        </div>
    )
}
