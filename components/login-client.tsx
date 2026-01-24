// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const UserIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
)

const LockIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
)

const MailIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
)

export default function LoginPage({ initialUser }: { initialUser: any }) {
    const [step, setStep] = useState<"identifier" | "otp">("identifier")
    const [identifier, setIdentifier] = useState("")
    const [otp, setOtp] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    
    useEffect(() => {
    }, [])

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        
        const refCodeRegex = /^MQ\d{6}$/i

        const trimmedIdentifier = identifier.trim()

        if (!emailRegex.test(trimmedIdentifier) && !refCodeRegex.test(trimmedIdentifier)) {
            setError("Veuillez entrer une adresse email valide ou un code de référence commençant par 'MQ'.")
            setIsLoading(false)
            return
        }

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'send-code', identifier: trimmedIdentifier })
            })
            const data = await res.json()

            if (data.success) {
                setStep("otp")
            } else {
                setError(data.error || "Une erreur est survenue")
            }
        } catch (err) {
            setError("Erreur de connexion")
        }

        setIsLoading(false)
    }

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'verify-code', code: otp })
            })
            const data = await res.json()

            if (data.success) {
                router.push("/dashboard")
            } else {
                setError(data.error || "Code invalide")
            }
        } catch (err) {
            setError("Erreur de connexion")
        }

        setIsLoading(false)
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header initialUser={initialUser} />

            <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="w-full max-w-md">
                    {}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 text-white rounded-2xl mb-4 shadow-lg shadow-slate-200">
                            <UserIcon />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 mb-2">Espace Membre</h1>
                        <p className="text-slate-500 font-medium">
                            {step === "identifier"
                                ? "Connectez-vous à votre compte"
                                : "Vérifiez votre identité"}
                        </p>
                    </div>

                    {}
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                        <div className="h-1.5 bg-slate-900" />

                        {error && (
                            <div className="mx-6 mt-6 sm:mx-8 px-4 py-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 flex items-center gap-2">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {step === "identifier" ? (
                            <form onSubmit={handleSendCode} className="p-6 sm:p-8 space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Email ou numéro de référence
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <MailIcon />
                                        </div>
                                        <input
                                            type="text"
                                            value={identifier}
                                            onChange={(e) => {
                                                setIdentifier(e.target.value)
                                                setError("") 
                                            }}
                                            placeholder="votre@email.com ou MQ123456"
                                            required
                                            className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 focus:bg-white transition-all"
                                            suppressHydrationWarning
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-slate-900 hover:bg-black disabled:bg-slate-400 text-white font-bold text-lg rounded-xl transition-all shadow-lg shadow-slate-200 hover:shadow-slate-300 active:scale-[0.98]"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Envoi en cours...
                                        </span>
                                    ) : (
                                        "Recevoir le code"
                                    )}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyCode} className="p-6 sm:p-8 space-y-5">
                                <div className="text-center mb-6">
                                    <p className="text-slate-600 text-sm mb-1">Si vous avez un compte, un code à 6 chiffres a été envoyé à :</p>
                                    <p className="font-bold text-slate-900">{identifier}</p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setStep("identifier")
                                            setOtp("") 
                                        }}
                                        className="text-xs text-slate-600 hover:text-black font-medium hover:underline mt-2"
                                    >
                                        Modifier
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 text-center">
                                        Entrez le code de vérification
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <LockIcon />
                                        </div>
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 6)
                                                setOtp(val)
                                            }}
                                            placeholder="......"
                                            required
                                            pattern="[0-9]{6}"
                                            className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-mono text-xl tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 focus:bg-white transition-all placeholder:tracking-widest placeholder:text-slate-300"
                                            suppressHydrationWarning
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || otp.length !== 6}
                                    className="w-full py-4 bg-slate-900 hover:bg-black disabled:bg-slate-400 text-white font-bold text-lg rounded-xl transition-all shadow-lg shadow-slate-200 hover:shadow-slate-300 active:scale-[0.98]"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Vérification...
                                        </span>
                                    ) : (
                                        "Vérifier le code"
                                    )}
                                </button>

                                <p className="text-center text-xs text-slate-500 mt-4">
                                    Vous n&apos;avez rien reçu ?{" "}
                                    <button
                                        type="button"
                                        onClick={handleSendCode}
                                        className="text-slate-900 font-bold hover:underline"
                                    >
                                        Renvoyer le code
                                    </button>
                                </p>
                            </form>
                        )}

                        <div className="px-6 sm:px-8">
                            <div className="flex items-center gap-4">
                                <div className="flex-1 h-px bg-slate-100" />
                                <span className="text-xs text-slate-400 font-medium">OU</span>
                                <div className="flex-1 h-px bg-slate-100" />
                            </div>
                        </div>

                        <div className="p-6 sm:p-8 pt-4">
                            <p className="text-center text-slate-600">
                                Pas de compte ?{" "}
                                <Link href="/register" className="font-bold text-slate-900 hover:underline">
                                    Inscrivez-vous
                                </Link>
                            </p>
                        </div>
                    </div>

                    <p className="text-center text-xs text-slate-400 mt-6">
                        En vous connectant, vous acceptez nos{" "}
                        <a href="#" className="underline hover:text-slate-600">Conditions d&apos;utilisation</a>
                        {" "}et notre{" "}
                        <a href="#" className="underline hover:text-slate-600">Politique de confidentialité</a>
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    )
}