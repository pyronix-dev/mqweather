// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const ErrorCircleIcon = () => (
    <svg className="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
    </svg>
)

const WarningIcon = () => (
    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
)

function CancelContent({ initialUser }: { initialUser: any }) {
    const searchParams = useSearchParams()
    const reason = searchParams.get("reason") || "canceled"

    const isPaymentFailed = reason === "failed"
    const isCanceled = reason === "canceled" || !isPaymentFailed

    return (
        <div className="min-h-screen bg-stone-100">
            <Header initialUser={initialUser} />
            <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {}
                    <div className="px-6 sm:px-8 py-8 border-b border-slate-100">
                        <div className="flex items-start gap-4">
                            <ErrorCircleIcon />
                            <div>
                                <h1 className="text-2xl font-black text-slate-800 mb-1">
                                    {isPaymentFailed ? "PAIEMENT ÉCHOUÉ" : "PAIEMENT ANNULÉ"}
                                </h1>
                                <p className="text-slate-600 font-medium">
                                    {isPaymentFailed
                                        ? "Votre paiement n'a pas pu être traité"
                                        : "Vous avez annulé le processus de paiement"
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="px-6 sm:px-8 py-6 bg-slate-50">
                        <div className="space-y-3">
                            {isPaymentFailed ? (
                                <>
                                    <div className="flex items-start gap-3">
                                        <WarningIcon />
                                        <p className="text-slate-600">
                                            Votre carte a été refusée. Veuillez vérifier vos informations bancaires et réessayer.
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <WarningIcon />
                                        <p className="text-slate-600">
                                            Assurez-vous que votre carte n'a pas expiré et que vous disposez de fonds suffisants.
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <WarningIcon />
                                        <p className="text-slate-600">
                                            Si le problème persiste, contactez votre banque ou essayez une autre carte.
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-start gap-3">
                                        <WarningIcon />
                                        <p className="text-slate-600">
                                            Aucun montant n'a été débité de votre compte.
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <WarningIcon />
                                        <p className="text-slate-600">
                                            Vous pouvez reprendre votre abonnement à tout moment depuis la page Alertes.
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {}
                    <div className="px-6 sm:px-8 py-6 border-t border-slate-100">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <p className="text-sm text-blue-800">
                                <span className="font-bold">Besoin d'aide ?</span> Contactez-nous à{" "}
                                <a href="mailto:support@mqweather.fr" className="font-black underline">
                                    support@mqweather.fr
                                </a>{" "}
                                et nous vous aiderons à résoudre le problème.
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="px-6 sm:px-8 py-6 border-t border-slate-100">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/alertes"
                                className="flex-1 py-4 bg-slate-800 hover:bg-slate-900 text-white font-black text-center rounded-xl transition-all"
                            >
                                Réessayer
                            </Link>
                            <Link
                                href="/"
                                className="flex-1 py-4 bg-white border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-black text-center rounded-xl transition-all"
                            >
                                Retour à l'accueil
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default function CancelPage({ initialUser }: { initialUser: any }) {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-stone-100 flex items-center justify-center">
                <div className="text-slate-600 font-medium">Chargement...</div>
            </div>
        }>
            <CancelContent initialUser={initialUser} />
        </Suspense>
    )
}