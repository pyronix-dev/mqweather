// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { UserPhoneInput } from "./ui/phone-input"


const CheckIcon = ({ className }: { className?: string }) => (
    <svg className={className || "w-4 h-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
    </svg>
)

export default function RegisterPage({ initialUser }: { initialUser: any }) {
    const router = useRouter()
    const [step, setStep] = useState<"register" | "otp">("register")
    const [otp, setOtp] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [submitAttempted, setSubmitAttempted] = useState(false)


    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        password: "",
        firstName: "",
        lastName: ""
    })


    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        number: false,
        special: false
    })


    useEffect(() => {
        const pwd = formData.password
        setPasswordCriteria({
            length: pwd.length >= 8,
            number: /\d/.test(pwd),
            special: /[@$!%*?&]/.test(pwd)
        })
    }, [formData.password])

    const isPasswordValid = Object.values(passwordCriteria).every(Boolean)


    const isFieldInvalid = (field: keyof typeof formData) => {
        if (!submitAttempted) return false
        if (field === 'phone') return false
        if (field === 'password') return !isPasswordValid
        return !formData[field]
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitAttempted(true)


        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
            return
        }
        if (!isPasswordValid) {
            return
        }

        setIsLoading(true)

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await res.json()

            if (data.success) {
                setStep("otp")
            } else {
                alert(data.error || "Une erreur est survenue")
            }
        } catch (e) {
            console.error(e)
            alert("Erreur de connexion")
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'verify-code', code: otp })
            })
            const data = await res.json()

            if (data.success) {
                router.push('/dashboard')
            } else {
                alert(data.error || "Code invalide")
            }
        } catch (e) {
            alert("Erreur de connexion")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Header initialUser={initialUser} />

            <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
                <div className="w-full max-w-lg">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-slate-800 mb-2">
                            {step === "register" ? "Créer un compte" : "Vérification"}
                        </h1>
                        <p className="text-slate-500 font-medium">
                            {step === "register"
                                ? "Rejoignez la communauté Météo Martinique pour partager vos observations."
                                : "Entrez le code reçu par email pour valider votre compte."}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                        <div className="p-6 sm:p-8">

                            {step === "register" ? (
                                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-700 uppercase">
                                                Prénom
                                                <span className="text-red-500 ml-0.5">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 font-medium transition-colors
                                                    ${isFieldInvalid('firstName')
                                                        ? 'border-red-500 focus:ring-red-200 bg-red-50'
                                                        : 'border-slate-200 focus:ring-slate-200'}`}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-700 uppercase">
                                                Nom
                                                <span className="text-red-500 ml-0.5">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 font-medium transition-colors
                                                    ${isFieldInvalid('lastName')
                                                        ? 'border-red-500 focus:ring-red-200 bg-red-50'
                                                        : 'border-slate-200 focus:ring-slate-200'}`}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 uppercase">
                                            Email
                                            <span className="text-red-500 ml-0.5">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 font-medium transition-colors
                                                ${isFieldInvalid('email')
                                                    ? 'border-red-500 focus:ring-red-200 bg-red-50'
                                                    : 'border-slate-200 focus:ring-slate-200'}`}
                                            suppressHydrationWarning={true}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 uppercase">Téléphone (Optionnel)</label>
                                        <UserPhoneInput
                                            value={formData.phone}
                                            onChange={val => setFormData({ ...formData, phone: val })}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-700 uppercase">
                                                Mot de passe
                                                <span className="text-red-500 ml-0.5">*</span>
                                            </label>
                                            <input
                                                type="password"
                                                value={formData.password}
                                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 font-medium transition-colors
                                                    ${isFieldInvalid('password')
                                                        ? 'border-red-500 focus:ring-red-200 bg-red-50'
                                                        : 'border-slate-200 focus:ring-slate-200'}`}
                                            />
                                        </div>

                                        { }
                                        <div className="grid grid-cols-1 gap-2 bg-slate-50 p-3 rounded-xl">
                                            <div className={`flex items-center gap-2 text-xs font-medium transition-all duration-300 ${passwordCriteria.length ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${passwordCriteria.length ? 'bg-emerald-100' : 'bg-slate-200'}`}>
                                                    {passwordCriteria.length && <CheckIcon />}
                                                </div>
                                                Au moins 8 caractères
                                            </div>
                                            <div className={`flex items-center gap-2 text-xs font-medium transition-all duration-300 ${passwordCriteria.number ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${passwordCriteria.number ? 'bg-emerald-100' : 'bg-slate-200'}`}>
                                                    {passwordCriteria.number && <CheckIcon />}
                                                </div>
                                                Au moins 1 chiffre
                                            </div>
                                            <div className={`flex items-center gap-2 text-xs font-medium transition-all duration-300 ${passwordCriteria.special ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${passwordCriteria.special ? 'bg-emerald-100' : 'bg-slate-200'}`}>
                                                    {passwordCriteria.special && <CheckIcon />}
                                                </div>
                                                Au moins 1 caractère spécial (@$!%*?&)
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full py-4 bg-slate-900 hover:bg-black text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    <span>Création du compte...</span>
                                                </>
                                            ) : (
                                                "Créer mon compte"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleVerify} className="space-y-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 uppercase text-center block">Code de vérification</label>
                                        <input
                                            required
                                            type="text"
                                            maxLength={6}
                                            value={otp}
                                            onChange={e => setOtp(e.target.value)}
                                            className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 font-mono text-center text-2xl tracking-[0.5em] font-bold"
                                            placeholder="••••••"
                                        />
                                        <p className="text-center text-sm text-slate-500">
                                            Envoyé à {formData.email || formData.phone}
                                        </p>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-70"
                                    >
                                        {isLoading ? "Vérification..." : "Vérifier et Accéder"}
                                    </button>
                                </form>
                            )}
                        </div>

                        {step === "register" && (
                            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 text-center">
                                <p className="text-slate-600 text-sm">
                                    Déjà un compte ?{" "}
                                    <Link href="/login" className="font-bold text-slate-900 hover:underline">
                                        Se connecter
                                    </Link>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}