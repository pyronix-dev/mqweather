// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DeleteAccountDialog } from "@/components/delete-account-dialog"

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

const InvoiceIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
)

const BrandIcon = ({ brand }: { brand: string }) => {
    switch (brand.toLowerCase()) {
        case 'visa':
            return (
                <svg className="w-8 h-5" role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <title>Visa</title>
                    <path d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z" />
                </svg>
            )
        case 'mastercard':
            return (
                <svg className="w-8 h-5" role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <title>MasterCard</title>
                    <path d="M11.343 18.031c.058.049.12.098.181.146-1.177.783-2.59 1.238-4.107 1.238C3.32 19.416 0 16.096 0 12c0-4.095 3.32-7.416 7.416-7.416 1.518 0 2.931.456 4.105 1.238-.06.051-.12.098-.165.15C9.6 7.489 8.595 9.688 8.595 12c0 2.311 1.001 4.51 2.748 6.031zm5.241-13.447c-1.52 0-2.931.456-4.105 1.238.06.051.12.098.165.15C14.4 7.489 15.405 9.688 15.405 12c0 2.31-1.001 4.507-2.748 6.031-.058.049-.12.098-.181.146 1.177.783 2.588 1.238 4.107 1.238C20.68 19.416 24 16.096 24 12c0-4.094-3.32-7.416-7.416-7.416-7.416zM12 6.174c-.096.075-.189.15-.28.231C10.156 7.764 9.169 9.765 9.169 12c0 2.236.987 4.236 2.551 5.595.09.08.185.158.28.232.096-.074.189-.152.28-.232 1.563-1.359 2.551-3.359 2.551-5.595 0-2.235-.987-4.236-2.551-5.595-.09-.08-.184-.156-.28-.231z" />
                </svg>
            )
        case 'amex':
            return (
                <svg className="w-8 h-5" role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <title>American Express</title>
                    <path d="M16.015 14.378c0-.32-.135-.496-.344-.622-.21-.12-.464-.135-.81-.135h-1.543v2.82h.675v-1.027h.72c.24 0 .39.024.478.125.12.13.104.38.104.55v.35h.66v-.555c-.002-.25-.017-.376-.108-.516-.06-.08-.18-.18-.33-.234l.02-.008c.18-.072.48-.297.48-.747zm-.87.407l-.028-.002c-.09.053-.195.058-.33.058h-.81v-.63h.824c.12 0 .24 0 .33.05.098.048.156.147.15.255 0 .12-.045.215-.134.27zM20.297 15.837H19v.6h1.304c.676 0 1.05-.278 1.05-.884 0-.28-.066-.448-.187-.582-.153-.133-.392-.193-.73-.207l-.376-.015c-.104 0-.18 0-.255-.03-.09-.03-.15-.105-.15-.21 0-.09.017-.166.09-.21.083-.046.177-.066.272-.06h1.23v-.602h-1.35c-.704 0-.958.437-.958.84 0 .9.776.855 1.407.87.104 0 .18.015.225.06.046.03.082.106.082.18 0 .07-.034.138-.09.18-.045.056-.136.07-.27.07h-1.288v.605h1.287c.42 0 .734-.118.9-.36h.03c.09-.134.135-.3.135-.523 0-.24-.045-.39-.135-.526zM18.597 14.208v-.583h-2.235V16.458h2.235v-.585h-1.57v-.57h1.533v-.584h-1.532v-.51M13.51 8.787h.685V11.6h-.684zM13.126 9.543l-.007.006c0-.314-.13-.5-.34-.624-.217-.125-.47-.135-.81-.135H10.43v2.82h.674v-1.034h.72c.24 0 .39.03.487.12.122.136.107.378.107.548v.354h.677v-.553c0-.25-.016-.375-.11-.516-.09-.107-.202-.19-.33-.237.172-.07.472-.3.472-.75zm-.855.396h-.015c-.09.054-.195.056-.33.056H11.1v-.623h.825c.12 0 .24.004.33.05.09.04.15.128.15.25s-.047.22-.134.266zM15.92 9.373h.632v-.6h-.644c-.464 0-.804.105-1.02.33-.286.3-.362.69-.362 1.11 0 .512.123.833.36 1.074.232.238.645.31.97.31h.78l.255-.627h1.39l.262.627h1.36v-2.11l1.272 2.11h.95l.002.002V8.786h-.684v1.963l-1.18-1.96h-1.02V11.4L18.11 8.744h-1.004l-.943 2.22h-.3c-.177 0-.362-.03-.468-.134-.125-.15-.186-.36-.186-.662 0-.285.08-.51.194-.63.133-.135.272-.165.516-.165zm1.668-.108l.464 1.118v.002h-.93l.466-1.12zM2.38 10.97l.254.628H4V9.393l.972 2.205h.584l.973-2.202.015 2.202h.69v-2.81H6.118l-.807 1.904-.876-1.905H3.343v2.663L2.205 8.787h-.997L.01 11.597h.72l.26-.626h1.39zm-.688-1.705l.46 1.118-.003.002h-.915l.457-1.12zM11.856 13.62H9.714l-.85.923-.825-.922H5.346v2.82H8l.855-.932.824.93h1.302v-.94h.838c.6 0 1.17-.164 1.17-.945l-.006-.003c0-.78-.598-.93-1.128-.93zM7.67 15.853l-.014-.002H6.02v-.557h1.47v-.574H6.02v-.51H7.7l.733.82-.764.824zm2.642.33l-1.03-1.147 1.03-1.108v2.253zm1.553-1.258h-.885v-.717h.885c.24 0 .42.098.42.344 0 .243-.15.372-.42.372zM9.967 9.373v-.586H7.73V11.6h2.237v-.58H8.4v-.564h1.527V9.88H8.4v-.507" />
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

export default function SettingsPage({ initialUser, initialPaymentMethods = [] }: { initialUser: any, initialPaymentMethods?: any[] }) {
    const [darkMode, setDarkMode] = useState(false)
    const [smsAlerts, setSmsAlerts] = useState(initialUser?.notifications_sms ?? true)
    const [emailAlerts, setEmailAlerts] = useState(initialUser?.notifications_email ?? true)
    const [paymentMethods, setPaymentMethods] = useState<any[]>(initialPaymentMethods)
    const [invoices, setInvoices] = useState<any[]>([])
    const [invoicesLoading, setInvoicesLoading] = useState(true)

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
            } catch (e) {
                console.error(e)
            }
        }

        const fetchInvoices = async () => {
            try {
                const res = await fetch('/api/user/invoices')
                if (res.ok) setInvoices(await res.json())
            } catch (e) {
                console.error("Failed to load invoices", e)
            } finally {
                setInvoicesLoading(false)
            }
        }

        fetchSettings()
        fetchInvoices()
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

                <div className="space-y-6">

                    {/* Notifications Section */}
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
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <p className="text-sm text-slate-500">Aucun moyen de paiement enregistré</p>
                            </div>
                        )}
                    </section>

                    {/* Invoices Section */}
                    <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <InvoiceIcon />
                            Factures
                        </h2>
                        {invoicesLoading ? (
                            <div className="space-y-3">
                                {[1].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 animate-pulse">
                                        <div>
                                            <div className="h-4 w-16 bg-slate-200 rounded mb-1"></div>
                                            <div className="h-3 w-24 bg-slate-200 rounded"></div>
                                        </div>
                                        <div className="h-8 w-24 bg-slate-200 rounded-lg"></div>
                                    </div>
                                ))}
                            </div>
                        ) : invoices.length > 0 ? (
                            <div className="space-y-3">
                                {invoices.map((inv) => (
                                    <div key={inv.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <div>
                                            <p className="font-bold text-slate-800">
                                                {(inv.amount / 100).toFixed(2)}€
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {new Date(inv.created_at).toLocaleDateString()} • #{inv.invoice_number || 'REF'}
                                            </p>
                                        </div>
                                        <a
                                            href={inv.invoice_pdf}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-bold text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                                        >
                                            Télécharger
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <p className="text-sm text-slate-500">Aucune facture disponible</p>
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
                        Version 0.1.0
                    </p>
                </div>
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
            className={`
                relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2
                ${enabled ? 'bg-slate-800' : 'bg-slate-200'}
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
            `}
        >
            <span
                aria-hidden="true"
                className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                    ${enabled ? 'translate-x-5' : 'translate-x-0'}
                `}
            />
        </button>
    )
}