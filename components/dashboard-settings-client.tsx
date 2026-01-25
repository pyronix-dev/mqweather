// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Switch } from "@headlessui/react"

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

const BellIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
)

const ShieldExclamationIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
    </svg>
)

const CreditCardIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
)

const BrandIcon = ({ brand }: { brand: string }) => {
    switch (brand.toLowerCase()) {
        case 'visa':
            return (
                <svg className="w-8 h-5" viewBox="0 0 48 32" fill="none">
                    <rect width="48" height="32" rx="2" fill="#1434CB" />
                    <path d="M19.6644 11.52L17.76 22.8H14.7822L16.6867 11.52H19.6644ZM33.2067 22.0978C32.7467 22.3111 31.9467 22.6133 30.7022 22.6133C27.4667 22.6133 25.1822 20.8889 25.1644 18.3822C25.1822 16.2133 27.1111 15.0222 28.5689 14.3111C29.6711 13.7778 30.0444 13.44 30.0444 12.8711C30.0444 12.0178 29.1378 11.6622 28.2489 11.6622C27.1289 11.6622 26.3111 11.9644 25.4489 12.3556L24.8444 9.52889C25.7511 9.12 27.4222 8.8 28.9778 8.8C33.1911 8.8 35.84 10.8622 35.84 14.3644C35.84 18.0622 30.1511 18.2756 30.1689 19.8933C30.1689 20.3733 30.7378 20.6222 31.5911 20.6222C32.4444 20.6222 33.6333 20.3733 34.3089 20.0711L33.2067 22.0978ZM42.6667 22.8H39.8044C39.1289 22.8 38.6133 22.6044 38.3644 21.4667L37.28 16.2133L36.32 20.8978C35.9467 22.6044 34.6667 22.8 34.6667 22.8H31.7867L35.9644 9.15556H39.1111L42.6667 22.8ZM12.7822 22.8L10.5956 12.4267L10.3289 11.0933C10.0444 10.08 9.17333 9.38667 8.35556 8.85333L13.8489 22.8H12.7822ZM8.42667 8.92444L8.46222 8.94222L5.81333 8.85333C4.94222 8.8 4.21333 8.99556 3.84 9.88444L0.0533333 18.7911L3.52 22.8L7.18222 13.9733L8.42667 8.92444Z" fill="white" />
                </svg>
            )
        case 'mastercard':
            return (
                <svg className="w-8 h-5" viewBox="0 0 48 32" fill="none">
                    <rect width="48" height="32" rx="2" fill="#222" />
                    <circle cx="18" cy="16" r="10" fill="#EB001B" />
                    <circle cx="30" cy="16" r="10" fill="#F79E1B" fillOpacity="0.9" />
                </svg>
            )
        case 'amex':
            return (
                <svg className="w-8 h-5" viewBox="0 0 48 32" fill="none">
                    <rect width="48" height="32" rx="2" fill="#006FCF" />
                    <path d="M30 18H26V16H30V18ZM15 15H9V12H21V15H17V18H21V21H9V18H13V15ZM26 21H30V19H26V21ZM26 15H30V13H26V15ZM32 21H34L35 19H37L38 21H40L37 13H35L32 21ZM6 21H8V15H6V12H8V15H11V12H13V21H11V18H8V21H6ZM23 21H25V18H23V21ZM23 15H25V12H23V15ZM34 16H35L36 18L37 16H38L36 13L34 16Z" fill="white" />
                </svg>
            )
        default:
            return (
                <svg className="w-8 h-5" viewBox="0 0 48 32" fill="none">
                    <rect width="48" height="32" rx="2" fill="#64748B" />
                    <path d="M6 10H42" stroke="white" strokeWidth="2" />
                    <rect x="6" y="16" width="12" height="4" rx="1" fill="white" />
                    <rect x="22" y="16" width="20" height="2" rx="1" fill="white" />
                </svg>
            )
    }
}

import { DeleteAccountDialog } from "@/components/delete-account-dialog"

export default function SettingsPage({ initialUser }: { initialUser: any }) {
    const [darkMode, setDarkMode] = useState(false)
    const [smsAlerts, setSmsAlerts] = useState(false)
    const [emailAlerts, setEmailAlerts] = useState(false)
    const [paymentMethods, setPaymentMethods] = useState<any[]>([])

    const [loading, setLoading] = useState(true)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    // Initial load
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/auth/me')
                if (res.ok) {
                    const data = await res.json()
                    if (data.notifications) {
                        setSmsAlerts(!!data.notifications.sms)
                        setEmailAlerts(!!data.notifications.email)
                    }
                }

                const pmRes = await fetch('/api/user/payment-methods')
                if (pmRes.ok) {
                    const pmData = await pmRes.json()
                    setPaymentMethods(pmData.paymentMethods || [])
                }
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        fetchSettings()
    }, [])

    const handleToggle = async (type: 'sms' | 'email', value: boolean) => {
        // Optimistic update
        if (type === 'sms') setSmsAlerts(value)
        if (type === 'email') setEmailAlerts(value)

        try {
            const res = await fetch('/api/user/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [type]: value })
            })
            if (!res.ok) throw new Error('Failed to update')
        } catch (e) {
            // Revert on error
            if (type === 'sms') setSmsAlerts(!value)
            if (type === 'email') setEmailAlerts(!value)
            alert("Erreur lors de la mise à jour des paramètres")
        }
    }


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

                        {/* Notifications Section - RESTORED */}
                        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <BellIcon />
                                Gestion des Notifications
                            </h2>
                            <div className="space-y-6">
                                {/* SMS Toggle */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-slate-700">Alertes par SMS</p>
                                        <p className="text-sm text-slate-500">Recevez les vigilances météo directement par SMS.</p>
                                    </div>
                                    <ToggleSwitch enabled={smsAlerts} onChange={(val) => handleToggle('sms', val)} />
                                </div>
                                <div className="h-px bg-slate-100" />
                                {/* Email Toggle */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-slate-700">Alertes par Email</p>
                                        <p className="text-sm text-slate-500">Recevez les bulletins et alertes dans votre boîte mail.</p>
                                    </div>
                                    <ToggleSwitch enabled={emailAlerts} onChange={(val) => handleToggle('email', val)} />
                                </div>
                            </div>
                        </section>

                        {/* Payment Methods Section */}
                        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <CreditCardIcon />
                                Moyens de paiement
                            </h2>
                            {paymentMethods.length > 0 ? (
                                <div className="space-y-3">
                                    {paymentMethods.map((pm) => (
                                        <div key={pm.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-white p-1 rounded border border-slate-200 shadow-sm">
                                                    <BrandIcon brand={pm.brand} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 capitalize flex items-center gap-2">
                                                        {pm.brand}
                                                        <span className="text-slate-500 font-mono text-sm">•••• {pm.last4}</span>
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        Expire fin {pm.exp_month}/{pm.exp_year}
                                                    </p>
                                                </div>
                                            </div>
                                            {/* <button className="text-xs text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                                                Supprimer
                                            </button> */}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <p className="text-sm text-slate-500">Aucun moyen de paiement enregistré</p>
                                </div>
                            )}
                        </section>


                        {/* Appearance Section */}
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
                                <ToggleSwitch enabled={darkMode} onChange={setDarkMode} disabled={true} />
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

function ToggleSwitch({ enabled, onChange, disabled = false }: { enabled: boolean, onChange: (val: boolean) => void, disabled?: boolean }) {
    return (
        <button
            onClick={() => !disabled && onChange(!enabled)}
            disabled={disabled}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 ${enabled ? 'bg-slate-800' : 'bg-slate-200'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    )
}