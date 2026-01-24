// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const ExclamationCircleIcon = () => (
    <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
)

export default function CancelSubscriptionPage({ initialUser }: { initialUser: any }) {
    const [isCancelling, setIsCancelling] = useState(false)
    const router = useRouter()

    const handleConfirmCancel = async () => {
        setIsCancelling(true)
        try {
            const res = await fetch('/api/subscription/cancel', {
                method: 'POST'
            })

            if (res.ok) {
                router.push('/dashboard')
            } else {
                const data = await res.json()
                alert(data.error || "Une erreur est survenue lors de l'annulation.")
            }
        } catch (error) {
            console.error('Cancellation error:', error)
            alert("Erreur de connexion.")
        } finally {
            setIsCancelling(false)
        }
    }

    return (
        <div className="min-h-screen bg-stone-100 flex flex-col">
            <Header initialUser={initialUser} />

            <main className="flex-grow flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-8 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-red-50 rounded-full animate-bounce-slow">
                            <ExclamationCircleIcon />
                        </div>
                    </div>

                    <h1 className="text-2xl font-black text-slate-800 mb-4">
                        Êtes-vous sûr de vouloir annuler ?
                    </h1>

                    <p className="text-slate-600 mb-8 font-medium leading-relaxed">
                        En annulant votre abonnement, vous ne recevrez plus les alertes météo de vigilance.
                        Cette action est immédiate et irréversible.
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleConfirmCancel}
                            disabled={isCancelling}
                            className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-black rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                        >
                            {isCancelling ? 'Annulation en cours...' : 'Oui, supprimer mon abonnement'}
                        </button>

                        <Link
                            href="/dashboard"
                            className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                        >
                            Retour au tableau de bord
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}