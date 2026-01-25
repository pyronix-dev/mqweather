// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const CheckCircleIcon = () => (
    <svg className="w-12 h-12 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
)

const SmallCheckIcon = () => (
    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
)

const LoadingSpinner = () => (
    <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
)

function SuccessContent({ initialUser }: { initialUser: any }) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const plan = searchParams.get("plan") || "subscription"
    const sessionId = searchParams.get("session_id")

    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
    const [referenceCode, setReferenceCode] = useState<string>('')
    const [userName, setUserName] = useState<string>('')

    useEffect(() => {
        if (!sessionId) {
            setStatus('success')
            return
        }

        const verifySession = async () => {
            try {
                const res = await fetch('/api/checkout/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ session_id: sessionId })
                })

                const data = await res.json()

                if (data.success && data.user) {
                    setReferenceCode(data.user.reference_code)
                    if (data.user.full_name) setUserName(data.user.full_name)
                    setStatus('success')
                    router.refresh() 
                } else if (data.status === 'pending') {
                    
                    setStatus('verifying') 
                } else {
                    console.error('Verification failed payload:', JSON.stringify(data))
                    console.error('Verification failed status:', res.status)
                    setStatus('success') 
                }
            } catch (error) {
                console.error('Verification exception:', error)
                setStatus('success')
            }
        }

        verifySession()
    }, [sessionId])

    const isSms = plan.includes("sms")
    const isEmail = plan.includes("email")

    const getPlanName = () => {
        switch (plan) {
            case "sms-monthly": return "SMS Standard - Mensuel (4,99€/mois)"
            case "sms-annual": return "SMS Standard - Annuel (49,90€/an)"
            case "email-annual": return "Alertes Email - Annuel (10€/an)"
            default: return "Abonnement Alertes"
        }
    }

    const getPrice = () => {
        switch (plan) {
            case "sms-monthly": return "4,99€"
            case "sms-annual": return "49,90€"
            case "email-annual": return "10€"
            default: return ""
        }
    }

    return (
        <div className="min-h-screen bg-stone-100">
            <Header initialUser={initialUser} />
            <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {}
                    <div className="px-6 sm:px-8 py-8 border-b border-slate-100">
                        <div className="flex items-start gap-4">
                            {status === 'verifying' ? <LoadingSpinner /> : <CheckCircleIcon />}
                            <div>
                                <h1 className="text-2xl font-black text-slate-800 mb-1">
                                    {status === 'verifying' ? 'Vérification...' : `MERCI ${userName ? userName.toUpperCase() : ''}`}
                                </h1>
                                <p className="text-slate-600 font-medium">
                                    {status === 'verifying'
                                        ? 'Nous finalisons la création de votre compte...'
                                        : 'Votre paiement a été mis en place avec succès'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {status === 'success' && (
                        <>
                            {}
                            <div className="px-6 sm:px-8 py-6 bg-slate-50">
                                <p className="text-lg font-black text-slate-800 mb-4">
                                    Votre numéro de référence est: <span className="text-emerald-600">{referenceCode || 'Généré par email'}</span>
                                </p>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <SmallCheckIcon />
                                        <p className="text-slate-600">
                                            Nous vous informerons avant que le premier paiement de <span className="font-bold text-slate-800">{getPrice()}</span> ne soit effectué
                                        </p>
                                    </div>

                                    {isSms && (
                                        <div className="flex items-start gap-3">
                                            <SmallCheckIcon />
                                            <p className="text-slate-600">
                                                Veuillez vérifier vos SMS, car un message de confirmation est en cours d'envoi vers votre numéro
                                            </p>
                                        </div>
                                    )}

                                    {isEmail && (
                                        <div className="flex items-start gap-3">
                                            <SmallCheckIcon />
                                            <p className="text-slate-600">
                                                Veuillez vérifier votre boîte de réception, car un e-mail de confirmation est en cours d'acheminement
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {}
                            <div className="px-6 sm:px-8 py-6 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-bold text-slate-500">Votre abonnement</span>
                                    <span className="font-black text-slate-800">{getPlanName()}</span>
                                </div>

                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                    <p className="text-sm text-amber-800">
                                        <span className="font-bold">Important :</span> Conservez votre numéro de référence pour gérer votre abonnement ou contacter notre support.
                                    </p>
                                </div>
                            </div>

                            {}
                            <div className="px-6 sm:px-8 py-6 border-t border-slate-100">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href="/login"
                                        className="flex-1 py-4 bg-slate-800 hover:bg-slate-900 text-white font-black text-center rounded-xl transition-all"
                                    >
                                        Se connecter
                                    </Link>
                                    <Link
                                        href="/alertes"
                                        className="flex-1 py-4 bg-white border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-black text-center rounded-xl transition-all"
                                    >
                                        Gérer mes alertes
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default function SuccessPage({ initialUser }: { initialUser: any }) {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-stone-100 flex items-center justify-center">
                <div className="text-slate-600 font-medium">Chargement...</div>
            </div>
        }>
            <SuccessContent initialUser={initialUser} />
        </Suspense>
    )
}