// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Suspense } from "react"

function ReturnContent({ initialUser }: { initialUser: any }) {
    const [status, setStatus] = useState<string | null>(null);
    const [customerEmail, setCustomerEmail] = useState('');
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const router = useRouter();

    useEffect(() => {
        if (!sessionId) {
            setStatus('error')
            return
        }

        fetch(`/api/checkout/verify?session_id=${sessionId}`)
            .then((res) => res.json())
            .then((data) => {
                setStatus(data.status);
                if (data.customer_email) {
                    setCustomerEmail(data.customer_email)
                }
            });
    }, [sessionId]);

    if (status === 'open') {
        return (
            <div className="max-w-md mx-auto text-center py-12">
                <h1 className="text-xl font-medium text-slate-800">Paiement en cours...</h1>
                <p className="text-slate-500">Veuillez patienter.</p>
            </div>
        )
    }

    if (status === 'complete') {
        return (
            <div id="success" className="bg-white rounded-3xl p-8 shadow-xl max-w-lg mx-auto text-center border border-emerald-100 animate-fade-in-up mt-12">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="bi bi-check-lg text-4xl text-emerald-600"></i>
                </div>
                <h1 className="text-2xl font-black text-slate-800 mb-4">Abonnement Confirmé !</h1>
                <p className="text-slate-600 mb-6">
                    Merci pour votre confiance. Un email de confirmation a été envoyé à
                    <span className="font-bold text-slate-900 block mt-1">{customerEmail}</span>
                </p>

                <div className="bg-slate-50 rounded-xl p-4 mb-8 text-sm text-slate-500">
                    Vos alertes météo sont désormais actives. Vous pouvez configurer vos préférences à tout moment.
                </div>

                <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-600/20"
                >
                    Accéder à mon tableau de bord
                </button>
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div className="max-w-md mx-auto text-center py-12 bg-red-50 rounded-2xl border border-red-100 mt-12">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="bi bi-x-lg text-2xl"></i>
                </div>
                <h1 className="text-xl font-bold text-red-900 mb-2">Erreur</h1>
                <p className="text-red-700 mb-6">Impossible de vérifier le paiement.</p>
                <button onClick={() => router.push('/alertes/devis')} className="text-red-800 underline">Retourner aux offres</button>
            </div>
        )
    }

    return (
        <div className="min-h-[400px] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
    );
}

export default function ReturnPage({ initialUser }: { initialUser: any }) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Header initialUser={initialUser} />
            <main className="flex-1 w-full px-4 sm:px-6 py-12">
                <Suspense fallback={<div>Chargement...</div>}>
                    <ReturnContent initialUser={initialUser} />
                </Suspense>
            </main>
            <Footer />
        </div>
    )
}