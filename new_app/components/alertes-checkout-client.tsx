// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { StripeCheckout } from "@/components/StripeCheckout"
import { Suspense } from "react"


function CheckoutLoading() {
    return (
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-cyan-500 animate-spin"></div>
            <p className="text-slate-500 font-medium">Initialisation du paiement sécurisé...</p>
        </div>
    )
}

function CheckoutContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const plan = searchParams.get("plan")

        
        
        if (!plan) {
            setError("Aucun plan sélectionné.")
            return
        }

        const email = searchParams.get("email")
        const phone = searchParams.get("phone")
        const profile = searchParams.get("profile")

        
        fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                plan,
                email,
                phone,
                profile
            })
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.clientSecret) {
                    setClientSecret(data.clientSecret)
                } else {
                    setError("Erreur lors de l'initialisation du paiement.")
                }
            })
            .catch((err) => {
                console.error(err)
                setError("Une erreur est survenue.")
            })

    }, [searchParams])

    if (error) {
        return (
            <div className="max-w-md mx-auto mt-12 text-center p-8 bg-red-50 rounded-2xl border border-red-100">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </div>
                <h2 className="text-lg font-bold text-red-900 mb-2">Erreur</h2>
                <p className="text-red-700 mb-6">{error}</p>
                <button
                    onClick={() => router.back()}
                    className="px-6 py-2 bg-white border border-red-200 text-red-700 font-bold rounded-xl hover:bg-red-50 transition-colors"
                >
                    Retour
                </button>
            </div>
        )
    }

    if (!clientSecret) {
        return <CheckoutLoading />
    }

    return (
        <div className="max-w-3xl mx-auto w-full animate-fade-in-up">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-black text-slate-800 mb-2">Paiement Sécurisé</h1>
                <p className="text-slate-500">Finalisez votre abonnement via Stripe</p>
            </div>

            <StripeCheckout clientSecret={clientSecret} />
        </div>
    )
}

export default function CheckoutPage({ initialUser }: { initialUser: any }) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Header initialUser={initialUser} />
            <main className="flex-1 w-full px-4 sm:px-6 py-12">
                <Suspense fallback={<CheckoutLoading />}>
                    <CheckoutContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    )
}