// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function UnsubscribePage({ initialUser }: { initialUser: any }) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const ref = searchParams.get("ref")
    const id = searchParams.get("id")

    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [errorMessage, setErrorMessage] = useState("")

    const handleUnsubscribe = async () => {
        setStatus("loading")
        try {
            const res = await fetch("/api/subscription/unsubscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ref, id }),
            })

            const data = await res.json()

            if (res.ok) {
                setStatus("success")
            } else {
                setStatus("error")
                setErrorMessage(data.error || "Une erreur est survenue")
            }
        } catch (e) {
            setStatus("error")
            setErrorMessage("Erreur de connexion")
        }
    }

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col">
            <Header initialUser={initialUser} />
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    <div className="p-8 text-center">
                        {status === "idle" && (
                            <>
                                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </div>
                                <h1 className="text-2xl font-black text-slate-800 mb-2">Se désinscrire ?</h1>
                                <p className="text-slate-500 mb-8">
                                    Vous ne recevrez plus d{"'"}alertes météo. Cette action est immédiate.
                                </p>
                                <div className="space-y-3">
                                    <button
                                        onClick={handleUnsubscribe}
                                        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
                                    >
                                        Confirmer la désinscription
                                    </button>
                                    <button
                                        onClick={() => router.push("/")}
                                        className="w-full py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </>
                        )}

                        {status === "loading" && (
                            <div className="py-8">
                                <div className="animate-spin w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full mx-auto mb-4"></div>
                                <p className="text-slate-600 font-bold">Traitement en cours...</p>
                            </div>
                        )}

                        {status === "success" && (
                            <>
                                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h1 className="text-2xl font-black text-slate-800 mb-2">Désabonné</h1>
                                <p className="text-slate-500 mb-8">
                                    Votre abonnement a été annulé avec succès. Vous ne recevrez plus d{"'"}alertes.
                                </p>
                                <button
                                    onClick={() => router.push("/")}
                                    className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors"
                                >
                                    Retour à l{"'"}accueil
                                </button>
                            </>
                        )}

                        {status === "error" && (
                            <>
                                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        />
                                    </svg>
                                </div>
                                <h1 className="text-xl font-black text-slate-800 mb-2">Erreur</h1>
                                <p className="text-slate-500 mb-8">{errorMessage}</p>
                                <div className="space-y-3">
                                    <button
                                        onClick={handleUnsubscribe}
                                        className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors"
                                    >
                                        Réessayer
                                    </button>
                                    <button
                                        onClick={() => router.push("/")}
                                        className="w-full py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                                    >
                                        Retour
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}