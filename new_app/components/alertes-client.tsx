// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { UserPhoneInput } from "./ui/phone-input"

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
)

const EmailIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
)

const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7l-7 7 7 7" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
)

const QuestionIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const UserIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

const TractorIcon = () => (
  <svg
    className="w-7 h-7"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="6" cy="18" r="3" />
    <circle cx="17" cy="18" r="3" />
    <path d="M3 18h3M14 18h3M10 18h4" />
    <path d="M9 12V6h6l3 6" />
    <path d="M6 12h12" />
  </svg>
)

const FishIcon = () => (
  <svg
    className="w-7 h-7"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.46-3.44 6-7 6-3.56 0-7.56-2.54-8.5-6Z" />
    <path d="M18 12v.5" />
    <path d="M16 17.93a9.77 9.77 0 0 1 0-11.86" />
    <path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5 .23 6.5C6.11 18.03 7 16 7 13.33" />
    <path d="M10.46 7.26C10.96 7.09 11.48 7 12 7" />
  </svg>
)

const CameraIcon = () => (
  <svg
    className="w-7 h-7"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 4h-5L7 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
)

const StormIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const WindIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"
    />
  </svg>
)

const WaveIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
  </svg>
)

const CycloneIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 12c-3 0-6-2-6-6 0 6-6 6-6 6s6 0 6 6c0-4 3-6 6-6z" />
    <path d="M12 12c3 0 6 2 6 6 0-6 6-6 6-6s-6 0-6-6c0 4-3 6-6 6z" />
  </svg>
)

const HeatIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2v10" />
    <path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
  </svg>
)

const ShieldIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
)

const BellIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
)

const PROFILES = [
  { id: "particulier", label: "Particulier", icon: UserIcon },
  { id: "pro", label: "Pro / Agri", icon: TractorIcon },
  { id: "mer", label: "Mer / Pêche", icon: FishIcon },
  { id: "tourisme", label: "Tourisme", icon: CameraIcon },
]

const PHENOMENA = [
  { id: "orages", label: "ORAGES", icon: StormIcon },
  { id: "vent", label: "VENT FORT", icon: WindIcon },
  { id: "submersion", label: "SUBMERSION", icon: WaveIcon },
  { id: "cyclone", label: "CYCLONE", icon: CycloneIcon },
  { id: "chaleur", label: "CHALEUR", icon: HeatIcon },
]

const FAQ_DATA = [
  {
    question: "Quels phénomènes sont couverts ?",
    answer: "Tous : orages, pluies intenses, vent fort, houle/submersion, chaleur extrême, cyclone/ouragan.",
  },
  {
    question: "Comment me désinscrire ?",
    answer:
      'SMS : envoyez STOP. Email : cliquez sur le lien de désinscription ou utilisez la section "Gérer mon abonnement".',
  },
  {
    question: "Mes données sont-elles partagées ?",
    answer: "Non. Seuls le contact et les préférences nécessaires sont stockés.",
  },
  {
    question: "Comment fonctionnent les alertes ?",
    answer:
      "Dès qu'une vigilance jaune, orange ou rouge est émise par Météo France, vous recevez une alerte avec des conseils adaptés.",
  },
]

export function AlertesClient({ initialUser }: { initialUser: any }) {
  const searchParams = useSearchParams()
  const [user, setUser] = useState<{ email: string | null, phone: string | null, full_name?: string } | null>(initialUser)
  // If we have an initial user, we might want to refresh to be sure we have latest phone (handles staled server cache)
  // Start loading if we have a user but no phone (optimistic check) or if we want to confirm
  const [isLoadingUser, setIsLoadingUser] = useState(!!initialUser && !initialUser.phone)

  useEffect(() => {
    const fetchUser = async () => {
      if (!initialUser) return

      // If we already have a phone from server, we don't strictly *need* to load, but we can do it silently
      // If we DON'T have a phone, we definitely want to check API in case it was just added
      if (!initialUser.phone) setIsLoadingUser(true)

      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const data = await res.json()
          setUser(prev => prev ? { ...prev, ...data } : data)
        }
      } catch (e) {
        console.error("Failed to refresh user", e)
      } finally {
        setIsLoadingUser(false)
      }
    }
    fetchUser()
  }, [initialUser])

  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState(initialUser?.phone || "")
  const [selectedProfile, setSelectedProfile] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isHoveredStandard, setIsHoveredStandard] = useState(false)
  const [isHoveredPro, setIsHoveredPro] = useState(false)
  const [showEmailSubscription, setShowEmailSubscription] = useState(false)
  const [showSmsSubscription, setShowSmsSubscription] = useState(false)
  const [email, setEmail] = useState(initialUser?.email || "")
  const [emailProfile, setEmailProfile] = useState("particulier")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptSmsterms, setAcceptSmsTerms] = useState(false)


  useEffect(() => {
    if (showEmailSubscription) {
      setPhoneVerified(user?.email ? true : false)
      setCodeSent(false)
      setVerificationCode("")
    }
  }, [showEmailSubscription, user])

  useEffect(() => {
    if (showSmsSubscription) {
      setPhoneVerified(false)
      setCodeSent(false)
      setVerificationCode("")
    }
  }, [showSmsSubscription])

  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [smsBillingCycle, setSmsBillingCycle] = useState<"monthly" | "annual">("annual")
  const [isLoading, setIsLoading] = useState(false)

  const [isSendingCode, setIsSendingCode] = useState(false)
  const [isVerifyingCode, setIsVerifyingCode] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)




  useEffect(() => {
    const urlEmail = searchParams.get('email')
    const urlPhone = searchParams.get('phone')
    const mode = searchParams.get('mode')

    if (urlEmail) setEmail(urlEmail)
    if (urlPhone) setPhone(urlPhone)

    if (mode === 'sms') {
      setShowSmsSubscription(true)
      if (user?.phone) {
        setPhoneVerified(true)
        setStep(2)
      }
    } else if (mode === 'email') {
      setShowEmailSubscription(true)
      if (user?.email) {
        setPhoneVerified(true) // Reusing this state for "verified contact" generally
      }
    }
  }, [searchParams, user])

  const handleSendCode = async () => {
    if (!phone || !selectedProfile) {
      alert("Veuillez entrer votre numéro et choisir un profil.")
      return
    }

    setIsSendingCode(true)
    try {
      const res = await fetch('/api/auth/send-otp-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      const data = await res.json()
      if (res.ok) {
        setCodeSent(true)
        alert("Code envoyé par SMS !")
      } else {
        alert(data.error || "Erreur d'envoi")
      }
    } catch (e) {
      alert("Erreur de connexion")
    } finally {
      setIsSendingCode(false)
    }
  }

  const [rateLimitUntil, setRateLimitUntil] = useState<number | null>(null)


  useEffect(() => {
    if (!rateLimitUntil) return
    const interval = setInterval(() => {
      if (Date.now() > rateLimitUntil) {
        setRateLimitUntil(null)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [rateLimitUntil])

  const handleVerifyCode = async () => {
    setIsVerifyingCode(true)
    try {
      const res = await fetch('/api/auth/verify-otp-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: verificationCode })
      })
      const data = await res.json()

      if (res.status === 429) {


        const waitMinutes = 5
        setRateLimitUntil(Date.now() + waitMinutes * 60 * 1000)
        alert(data.error)
        return
      }

      if (res.ok) {
        setPhoneVerified(true)
        setStep(2)
      } else {
        alert(data.error || "Code invalide")
      }
    } catch (e) {
      alert("Erreur de verification")
    } finally {
      setIsVerifyingCode(false)
    }
  }

  const handleSendEmailCode = async () => {
    if (!email) {
      alert("Email requis")
      return
    }
    setIsSendingCode(true)
    try {
      const res = await fetch('/api/auth/send-otp-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (res.ok) {
        setCodeSent(true)
        alert('Code envoyé par email !')
      } else {
        alert(data.error || "Erreur d'envoi")
      }
    } catch (e) {
      alert("Erreur de connexion")
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleVerifyEmailCode = async () => {
    setIsVerifyingCode(true)
    try {
      const res = await fetch('/api/auth/verify-otp-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode })
      })
      const data = await res.json()
      if (res.ok) {
        setPhoneVerified(true)
      } else {
        alert(data.error || "Code invalide")
      }
    } catch (e) {
      alert("Erreur de vérification")
    } finally {
      setIsVerifyingCode(false)
    }
  }


  const router = useRouter()
  const handleCheckout = (plan: 'sms-monthly' | 'sms-annual' | 'email-annual') => {
    const params = new URLSearchParams()
    params.set('plan', plan)


    if (plan.includes('sms')) {
      if (phone) params.set('phone', phone)
      if (selectedProfile) params.set('profile', selectedProfile)
    } else {
      if (email) params.set('email', email)
      if (emailProfile) params.set('profile', emailProfile)
    }

    router.push(`/alertes/checkout?${params.toString()}`)
  }


  if (showEmailSubscription) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header initialUser={initialUser} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <button
            onClick={() => setShowEmailSubscription(false)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium mb-6 transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              <ArrowLeftIcon />
            </span>
            Retour aux formules
          </button>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            <div className="flex-1">
              <div className="relative bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm animate-fade-in-up overflow-hidden">
                { }
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                    <EmailIcon />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800">Alertes Email</h2>
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
                    0.01€/an
                  </span>
                </div>
                <p className="text-slate-500 font-medium mb-8 ml-14">
                  Couverture{" "}
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Martinique entière</span>{" "}
                  — tous les <span className="font-bold text-emerald-700">phénomènes</span> météo à risque sont traités
                  automatiquement.
                </p>

                { }
                <div className="flex items-center gap-4 mb-10">
                  <button
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${!phoneVerified ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 border border-slate-300"}`}
                  >
                    {phoneVerified ? <CheckIcon /> : <span className="w-6 h-6 flex items-center justify-center bg-white/20 rounded-full">1</span>}
                    <span>Vérifier l'email</span>
                  </button>
                  <div className="flex-1 h-0.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full bg-slate-600 transition-all duration-500 ${phoneVerified ? "w-full" : "w-0"}`} />
                  </div>
                  <button
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${phoneVerified ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-400 border border-slate-200"}`}
                  >
                    <span className="w-6 h-6 flex items-center justify-center bg-white/20 rounded-full">2</span>
                    <span>Confirmer et payer</span>
                  </button>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-3">
                    <label className="block text-sm font-black text-slate-700 uppercase tracking-wide">
                      Adresse email
                    </label>
                    {user?.email ? (
                      <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
                          <UserIcon />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-emerald-800 text-sm">Connecté</p>
                          <p className="text-xs text-emerald-600">{user.email}</p>
                        </div>
                        <span className="bg-emerald-200 text-emerald-800 text-xs font-bold px-2 py-1 rounded">Vérifié</span>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="email"
                          placeholder="votre@email.fr"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={phoneVerified || codeSent}
                          className="w-full px-5 py-4 border border-slate-200 rounded-xl bg-white text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:bg-slate-100 disabled:text-slate-500"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                          {phoneVerified ? <span className="text-emerald-500 font-bold">✓</span> : <EmailIcon />}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-black text-slate-700 uppercase tracking-wide">Profil</label>
                    <div className="grid grid-cols-2 gap-3">
                      {PROFILES.map((profile) => {
                        const Icon = profile.icon
                        return (
                          <button
                            key={profile.id}
                            onClick={() => setEmailProfile(profile.id)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${emailProfile === profile.id ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-slate-200 text-slate-500 bg-white hover:border-slate-300"}`}
                          >
                            <Icon />
                            <span className="text-xs font-bold">{profile.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Verification Code - Only show if not logged in */}
                {!user?.email && !phoneVerified && (
                  <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-200">
                    <h3 className="text-sm font-black text-slate-700 mb-4 uppercase tracking-wide">
                      Code de vérification
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                        <input
                          type="text"
                          placeholder="• • • • • •"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          maxLength={6}
                          className="flex-1 px-5 py-4 border border-slate-200 rounded-xl bg-white text-center text-xl tracking-[0.5em] font-mono font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        />
                        {!codeSent ? (
                          <button
                            onClick={handleSendEmailCode}
                            disabled={!email || isSendingCode}
                            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-300 text-white font-black rounded-xl transition-all hover:shadow-lg active:scale-95"
                          >
                            {isSendingCode ? 'Envoi...' : 'Envoyer le code'}
                          </button>
                        ) : (
                          <button
                            onClick={handleVerifyEmailCode}
                            disabled={!verificationCode || isVerifyingCode}
                            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-black rounded-xl transition-all hover:shadow-lg active:scale-95"
                          >
                            {isVerifyingCode ? 'Vérif...' : 'Vérifier'}
                          </button>
                        )}
                      </div>
                      {codeSent && (
                        <div className="text-center">
                          <p className="text-xs text-slate-500 mb-2">Code non reçu ?</p>
                          <button
                            onClick={handleSendEmailCode}
                            disabled={isSendingCode}
                            className="text-sm font-bold text-slate-700 underline hover:text-slate-900 disabled:opacity-50"
                          >
                            {isSendingCode ? 'Envoi...' : 'Renvoyer un nouveau code'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {phoneVerified && !user?.email && (
                  <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
                      <CheckIcon />
                    </div>
                    <div>
                      <p className="font-bold text-emerald-800">Email vérifié avec succès !</p>
                      <p className="text-sm text-emerald-600">Vous pouvez maintenant procéder au paiement.</p>
                    </div>
                  </div>
                )}

                {/* Payment section */}
                <div className="mb-8">
                  <h3 className="text-sm font-black text-slate-700 mb-4 uppercase tracking-wide">
                    Paiement sécurisé
                  </h3>
                  <div className="border-2 border-slate-200 rounded-xl p-5 bg-gradient-to-br from-slate-50 to-white flex items-center gap-4">
                    <div className="p-3 bg-slate-100 rounded-lg">
                      <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-slate-700">Paiement via Stripe</p>
                      <p className="text-sm text-slate-500">Carte bancaire sécurisée</p>
                    </div>
                  </div>
                </div>

                {/* Terms checkbox */}
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 mb-8">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="w-6 h-6 mt-0.5 rounded-lg border-2 border-emerald-300 text-emerald-600"
                    />
                    <span className="text-sm text-emerald-700 font-medium leading-relaxed">
                      J'accepte de recevoir des alertes météo par email. Je peux me désinscrire à tout moment via le lien
                      dans chaque email.
                    </span>
                  </label>
                </div>

                { }
                <button
                  disabled={!email || !acceptTerms || isLoading || (!phoneVerified && !user?.email)}
                  onClick={() => handleCheckout('email-annual')}
                  className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white font-black text-lg rounded-xl transition-all duration-300 hover:shadow-xl active:scale-[0.98]"
                >
                  {isLoading ? 'Chargement...' : "Payer 0.01€ et s'abonner pour 1 an"}
                </button>
              </div>
            </div>


          </div>
        </main>
        <Footer />
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-stone-50">
      <Header initialUser={initialUser} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        { }
        <div className="text-center mb-10 sm:mb-14 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 mb-4">
            <BellIcon />
            <span className="font-bold text-slate-700">Service d'alertes météo</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800 mb-4 tracking-tight">
            Inscription aux <span className="text-amber-700">Alertes Météo</span>
          </h1>
          <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Complétez le formulaire ci-dessous pour recevoir les{" "}
            <span className="font-bold text-slate-700">notifications météo</span> sur votre téléphone.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          <div className="flex-1 space-y-8">
            {/* SMS Subscription Form */}
            {showSmsSubscription && (
              <>
                <button
                  onClick={() => setShowSmsSubscription(false)}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium mb-2 transition-colors"
                >
                  <ArrowLeftIcon />
                  Retour aux formules
                </button>
                <div className="relative bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm animate-slide-in-left overflow-hidden">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-slate-800 text-white">
                      <ShieldIcon />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-800">S'abonner en 2 étapes</h2>
                  </div>
                  <p className="text-slate-500 font-medium mb-8 ml-14">
                    Couverture{" "}
                    <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Martinique entière</span>{" "}
                    — tous les <span className="font-bold text-amber-700">phénomènes</span> météo à risque sont traités
                    automatiquement.
                  </p>

                  { }
                  <div className="flex items-center gap-4 mb-10">
                    <button
                      onClick={() => setStep(1)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${step === 1 ? "bg-slate-800 text-white" : step > 1 ? "bg-slate-100 text-slate-600 border border-slate-300" : "bg-slate-100 text-slate-400 border border-slate-200"}`}
                    >
                      {step > 1 ? (
                        <CheckIcon />
                      ) : (
                        <span className="w-6 h-6 flex items-center justify-center bg-white/20 rounded-full">1</span>
                      )}
                      <span>Vérifier le numéro</span>
                    </button>
                    <div className="flex-1 h-0.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-slate-600 transition-all duration-500 ${step > 1 ? "w-full" : "w-0"}`}
                      />
                    </div>
                    <button
                      onClick={() => step > 1 && setStep(2)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${step === 2 ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-400 border border-slate-200"}`}
                    >
                      <span className="w-6 h-6 flex items-center justify-center bg-white/20 rounded-full">2</span>
                      <span>Confirmer l'abonnement</span>
                    </button>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div className="space-y-3">
                      <label className="block text-sm font-black text-slate-700 uppercase tracking-wide">
                        Numéro de téléphone
                      </label>
                      <div className="relative">
                        {isLoadingUser ? (
                          /* Skeleton for Phone Input/Verified Box */
                          <div className="animate-pulse">
                            <div className="h-[58px] bg-slate-100 rounded-xl border border-slate-200"></div>
                          </div>
                        ) : user?.phone ? (
                          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 animate-fade-in-up">
                            <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
                              <PhoneIcon />
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-emerald-800 text-sm">Connecté</p>
                              <p className="text-xs text-emerald-600">{user.phone}</p>
                            </div>
                            <span className="bg-emerald-200 text-emerald-800 text-xs font-bold px-2 py-1 rounded">Vérifié</span>
                          </div>
                        ) : (
                          <UserPhoneInput
                            value={phone}
                            onChange={(val) => setPhone(val)}
                            disabled={phoneVerified || codeSent}
                          />
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-black text-slate-700 uppercase tracking-wide">Profil</label>
                      <div className="grid grid-cols-2 gap-3">
                        {PROFILES.map((profile) => {
                          const Icon = profile.icon
                          return (
                            <button
                              key={profile.id}
                              onClick={() => !phoneVerified && setSelectedProfile(profile.id)}
                              disabled={phoneVerified}
                              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${selectedProfile === profile.id ? "border-slate-800 bg-slate-50 text-slate-800" : "border-slate-200 text-slate-500 bg-white"} disabled:opacity-70`}
                            >
                              <Icon />
                              <span className="text-xs font-bold">{profile.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* SMS Verification - COMMENTED OUT: No pre-verification needed, SMS sent on purchase success
                  {!phoneVerified && !user?.phone && (
                    <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-200">
                      <h3 className="text-sm font-black text-slate-700 mb-4 uppercase tracking-wide">
                        Code de vérification (SMS #1)
                      </h3>
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                          <input
                            type="text"
                            placeholder="• • • • • •"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            maxLength={6}
                            disabled={!codeSent}
                            className="flex-1 px-5 py-4 border border-slate-200 rounded-xl bg-white text-center text-xl tracking-[0.5em] font-mono font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:bg-slate-100 disabled:cursor-not-allowed"
                          />
                          {!codeSent ? (
                            <button
                              onClick={handleSendCode}
                              disabled={!phone || !selectedProfile || isSendingCode}
                              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-300 text-white font-black rounded-xl transition-all hover:shadow-lg active:scale-95"
                            >
                              {isSendingCode ? 'Envoi...' : 'Envoyer le code'}
                            </button>
                          ) : (
                            <button
                              onClick={handleVerifyCode}
                              disabled={!verificationCode || isVerifyingCode}
                              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-black rounded-xl transition-all hover:shadow-lg active:scale-95"
                            >
                              {isVerifyingCode ? 'Vérif...' : 'Vérifier'}
                            </button>
                          )}
                        </div>

                        {codeSent && (
                          <div className="text-center">
                            <p className="text-xs text-slate-500 mb-2">Code non reçu ?</p>
                            <button
                              onClick={handleSendCode}
                              disabled={isSendingCode || !!rateLimitUntil}
                              className="text-sm font-bold text-slate-700 underline hover:text-slate-900 disabled:opacity-50"
                            >
                              {isSendingCode
                                ? 'Envoi en cours...'
                                : !!rateLimitUntil
                                  ? `Veuillez patienter...`
                                  : 'Renvoyer un nouveau code'
                              }
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {phoneVerified && (
                    <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
                        <CheckIcon />
                      </div>
                      <div>
                        <p className="font-bold text-emerald-800">Numéro vérifié avec succès !</p>
                        <p className="text-sm text-emerald-600">Vous pouvez maintenant procéder au paiement.</p>
                      </div>
                    </div>
                  )}
                  END SMS Verification */}

                  {/* Billing Cycle Selection */}
                  <div className="mb-8">
                    <h3 className="text-sm font-black text-slate-700 mb-4 uppercase tracking-wide">
                      Choisissez votre formule
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Monthly Option */}
                      <button
                        onClick={() => setSmsBillingCycle("monthly")}
                        className={`relative p-5 rounded-xl border-2 transition-all duration-300 text-left ${smsBillingCycle === "monthly"
                          ? "border-amber-500 bg-amber-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                      >
                        <div className="mb-2">
                          <span className="text-2xl font-black text-slate-800">4,99€</span>
                          <span className="text-slate-500 font-bold text-sm">/mois</span>
                        </div>
                        <p className="text-sm font-bold text-slate-600">Mensuel</p>
                        <p className="text-xs text-slate-400 mt-1">Sans engagement</p>
                        {smsBillingCycle === "monthly" && (
                          <div className="absolute top-3 right-3">
                            <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                              <CheckIcon />
                            </div>
                          </div>
                        )}
                      </button>

                      {/* Annual Option */}
                      <button
                        onClick={() => setSmsBillingCycle("annual")}
                        className={`relative p-5 rounded-xl border-2 transition-all duration-300 text-left ${smsBillingCycle === "annual"
                          ? "border-amber-500 bg-amber-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                      >
                        <div className="absolute -top-3 left-4">
                          <span className="bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-full">
                            2 MOIS OFFERTS
                          </span>
                        </div>
                        <div className="mb-2">
                          <span className="text-2xl font-black text-slate-800">49,90€</span>
                          <span className="text-slate-500 font-bold text-sm">/an</span>
                        </div>
                        <p className="text-sm font-bold text-slate-600">Annuel</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-400 line-through">59,88€</span>
                          <span className="text-xs text-emerald-600 font-bold">Économisez 9,98€</span>
                        </div>
                        {smsBillingCycle === "annual" && (
                          <div className="absolute top-3 right-3">
                            <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                              <CheckIcon />
                            </div>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Payment section */}
                  <div className="mb-8">
                    <h3 className="text-sm font-black text-slate-700 mb-4 uppercase tracking-wide">
                      Paiement sécurisé
                    </h3>
                    <div className="border-2 border-slate-200 rounded-xl p-5 bg-gradient-to-br from-slate-50 to-white flex items-center gap-4">
                      <div className="p-3 bg-slate-100 rounded-lg">
                        <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-slate-700">Paiement via Stripe</p>
                        <p className="text-sm text-slate-500">Carte bancaire sécurisée</p>
                      </div>
                    </div>
                  </div>

                  {/* Terms checkbox */}
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mb-8">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acceptSmsterms}
                        onChange={(e) => setAcceptSmsTerms(e.target.checked)}
                        className="w-6 h-6 mt-0.5 rounded-lg border-2 border-slate-300 text-slate-800"
                      />
                      <span className="text-sm text-slate-700 font-medium leading-relaxed">
                        J'accepte de recevoir des alertes météo par SMS. Je peux me désinscrire à tout moment en
                        répondant STOP au SMS reçu.
                      </span>
                    </label>
                  </div>

                  { }
                  <button
                    disabled={isLoading || !acceptSmsterms || !phone || !selectedProfile}
                    onClick={() => handleCheckout(smsBillingCycle === 'monthly' ? 'sms-monthly' : 'sms-annual')}
                    className="w-full py-5 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-black text-lg rounded-xl transition-all hover:shadow-xl active:scale-95 mb-8"
                  >
                    {isLoading
                      ? 'Chargement...'
                      : smsBillingCycle === "monthly"
                        ? "Payer 4,99€ et s'abonner (mensuel)"
                        : "Payer 49,90€ et s'abonner pour 1 an"}
                  </button>

                  { }
                  <div>
                    <h3 className="text-sm font-black text-slate-700 mb-4 uppercase tracking-wide">
                      Phénomènes couverts
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {PHENOMENA.map((phenomenon) => {
                        const Icon = phenomenon.icon
                        return (
                          <span
                            key={phenomenon.id}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black border border-slate-300 bg-white text-slate-600"
                          >
                            <Icon />
                            {phenomenon.label}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}

            { }
            {!showSmsSubscription && (
              <div className="animate-slide-in-left">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-6">Formules Alertes</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  { }
                  <div
                    className="relative bg-white border-2 border-emerald-500 rounded-2xl p-6 transition-all duration-500 cursor-pointer group flex flex-col hover:shadow-lg hover:-translate-y-1"
                    onClick={() => setShowEmailSubscription(true)}
                  >
                    <div className="absolute -top-4 left-6">
                      <span className="bg-emerald-600 text-white text-xs font-black px-4 py-2 rounded-full">
                        NOUVEAU
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-2 mt-2">Alertes Email</h3>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-3xl font-black text-emerald-700">10€</span>
                      <span className="text-slate-500 font-bold">/an</span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-5">Pour tous les profils.</p>
                    <ul className="space-y-2 mb-6 flex-1">
                      {[
                        "Alertes email détaillées",
                        "Prévisions complètes",
                        "Cartes météo incluses",
                        "Résiliation libre",
                      ].map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm font-bold text-slate-700">
                          <span className="p-1 rounded-full bg-emerald-100 text-emerald-700">
                            <CheckIcon />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl transition-all">
                      S'abonner
                    </button>
                  </div>

                  {/* SMS Standard */}
                  <div
                    className={`relative bg-white border-2 rounded-2xl p-6 transition-all duration-500 cursor-pointer group flex flex-col ${isHoveredStandard ? "border-amber-600 shadow-lg -translate-y-1" : "border-amber-500"}`}
                    onMouseEnter={() => setIsHoveredStandard(true)}
                    onMouseLeave={() => setIsHoveredStandard(false)}
                    onClick={() => setShowSmsSubscription(true)}
                  >
                    <div className="absolute -top-4 left-6">
                      <span className="bg-amber-600 text-white text-xs font-black px-4 py-2 rounded-full">
                        RECOMMANDÉ
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-2 mt-2">SMS Standard</h3>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-3xl font-black text-amber-700">4,99€</span>
                      <span className="text-slate-500 font-bold">/mois</span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-5">Pour les particuliers.</p>
                    <ul className="space-y-2 mb-6 flex-1">
                      {["Alertes immédiates", "Tous phénomènes", "Conseils sécurité"].map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm font-bold text-slate-700">
                          <span className="p-1 rounded-full bg-amber-100 text-amber-700">
                            <CheckIcon />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl transition-all">
                      S'abonner
                    </button>
                  </div>

                  { }
                  <a
                    href="/alertes/devis"
                    className={`relative bg-white border rounded-2xl p-6 transition-all duration-500 flex flex-col ${isHoveredPro ? "border-slate-400 shadow-lg -translate-y-1" : "border-slate-200"}`}
                    onMouseEnter={() => setIsHoveredPro(true)}
                    onMouseLeave={() => setIsHoveredPro(false)}
                  >
                    <div className="absolute -top-4 left-6">
                      <span className="bg-slate-600 text-white text-xs font-black px-4 py-2 rounded-full">
                        PROFESSIONNELS
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-2">SMS Pro</h3>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-3xl font-black text-slate-700">Sur devis</span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-5">Entreprises & Collectivités.</p>
                    <ul className="space-y-2 mb-6 flex-1">
                      {["Multi-numéros", "Support prioritaire", "Historique & Rapports"].map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm font-bold text-slate-700">
                          <span className="p-1 rounded-full bg-slate-100 text-slate-600">
                            <CheckIcon />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <span className="w-full py-3 bg-white border-2 border-slate-800 text-slate-800 hover:bg-slate-50 font-black rounded-xl transition-all text-center">
                      Demander un devis
                    </span>
                  </a>
                </div>
              </div>
            )}



            { }
            {!showSmsSubscription && (
              <div
                className="relative bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm animate-slide-in-left overflow-hidden"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-slate-100">
                    <QuestionIcon />
                  </div>
                  <h2 className="text-xl font-black text-slate-800">Questions fréquentes</h2>
                </div>
                <div className="space-y-3">
                  {FAQ_DATA.map((faq, index) => (
                    <div key={index} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                      <button
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors group"
                      >
                        <span className="font-bold text-slate-800 group-hover:text-slate-900 transition-colors">{faq.question}</span>
                        <div className={`transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`}>
                          <ChevronDownIcon />
                        </div>
                      </button>
                      <div
                        className={`grid transition-all duration-300 ease-in-out ${openFaq === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                      >
                        <div className="overflow-hidden">
                          <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
                            {faq.answer}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}


export default function AlertesPage({ initialUser }: { initialUser: any }) {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <AlertesClient initialUser={initialUser} />
    </Suspense>
  )
}