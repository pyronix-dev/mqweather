// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ContactPage({ initialUser }: { initialUser: any }) {
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('sending')
        
        await new Promise(resolve => setTimeout(resolve, 1500))
        setStatus('success')
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Header initialUser={initialUser} />
            <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-12">
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-4 tracking-tight">
                        Nous contacter
                    </h1>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">
                        Une question, une suggestion ou un problème ? N'hésitez pas à nous écrire via le formulaire ci-dessous.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-10 animate-fade-in-up">
                    {status === 'success' ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Message envoyé !</h2>
                            <p className="text-slate-500 mb-8">Nous vous répondrons dans les plus brefs délais.</p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                            >
                                Envoyer un autre message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Nom</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Votre nom"
                                        defaultValue={initialUser?.name || ''}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all font-medium text-slate-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Email</label>
                                    <input
                                        required
                                        type="email"
                                        placeholder="votre@email.com"
                                        defaultValue={initialUser?.email || ''}
                                        readOnly={!!initialUser?.email}
                                        suppressHydrationWarning={true}
                                        className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all font-medium text-slate-800 ${initialUser?.email ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                                {initialUser?.reference && (
                                    <div className="space-y-2 sm:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Référence Client</label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={initialUser.reference}
                                            className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl focus:outline-none font-bold text-slate-600 cursor-not-allowed"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Sujet</label>
                                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all font-medium text-slate-800">
                                    <option>Question générale</option>
                                    <option>Problème technique</option>
                                    <option>Suggestion</option>
                                    <option>Partenariat</option>
                                    <option>Autre</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Message</label>
                                <textarea
                                    required
                                    rows={5}
                                    placeholder="Comment pouvons-nous vous aider ?"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all font-medium text-slate-800 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {status === 'sending' ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Envoi en cours...</span>
                                    </>
                                ) : (
                                    <span>Envoyer le message</span>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}