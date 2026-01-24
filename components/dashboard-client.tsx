// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useToast } from "@/components/ui/toast-context"
import { EditProfileDialog } from "@/components/edit-profile-dialog"


const UserIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
)
const MessageIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
)
const BellIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
)
const CreditCardIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
)
const LogOutIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
)
const DownloadIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
)
const CheckBadgeIcon = () => (
    <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.491 4.491 0 013.497-1.307zm4.45 6.45l-3.25 3.5a.75.75 0 11-1.1-1.02l2.7-2.9 2.7-2.9a.75.75 0 011.1 1.02l-3.25 3.5z" clipRule="evenodd" />
    </svg>
)

interface UserData {
    reference: string
    full_name: string | null
    email: string | null
    phone: string | null
    notifications_enabled?: boolean
    notifications?: {
        enabled: boolean
        sms: boolean
        email: boolean
    }
    role?: string
    subscription: {
        plan: string
        price: string
        status: string
        nextBilling: string
    } | null
}

export function DashboardClient({ initialUser }: { initialUser: any }) {
    const { showToast } = useToast()
    
    
    
    
    
    
    

    
    
    
    

    
    
    

    const [user, setUser] = useState<UserData | null>(initialUser ? {
        reference: initialUser.reference || initialUser.name, 
        full_name: initialUser.name,
        email: initialUser.email,
        phone: null,
        role: initialUser.role,
        subscription: null 
    } as any : null)

    
    

    const [loading, setLoading] = useState(!initialUser)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        
        

        const fetchUserData = async () => {
            try {
                const res = await fetch('/api/auth/me')
                if (!res.ok) {
                    router.push('/login')
                    return
                }
                const data = await res.json()
                setUser(data) 
            } catch (error) {
                console.error('Failed to fetch user data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()
    }, [router])

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/login')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-stone-100 flex items-center justify-center">
                <div className="text-slate-600 font-medium">Chargement...</div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    
    let displayName = user.reference
    if (user.full_name) {
        displayName = user.full_name.split(' ')[0]
    } else if (user.email) {
        displayName = user.email
    }

    
    
    
    const headerUser = {
        name: displayName,
        email: user.email || '',
        role: user.role
    }

    
    
    let primaryContact = user.email || user.phone || 'Non défini';
    let contactLabel = 'Email';
    let isSmsPlan = false;

    if (user.subscription) {
        if (user.subscription.plan.toLowerCase().includes('sms')) {
            primaryContact = user.phone || primaryContact;
            contactLabel = 'Numéro vérifié';
            isSmsPlan = true;
        } else if (user.subscription.plan.toLowerCase().includes('email')) {
            primaryContact = user.email || primaryContact;
            contactLabel = 'Email';
        }
    } else {
        if (user.email) {
            primaryContact = user.email;
            contactLabel = 'Email';
        } else if (user.phone) {
            primaryContact = user.phone;
            contactLabel = 'Téléphone';
        }
    }

    const changePlanParams = new URLSearchParams()
    if (user.email) changePlanParams.set('email', user.email)
    if (user.phone) changePlanParams.set('phone', user.phone)
    if (user.reference) changePlanParams.set('ref', user.reference)

    return (
        <div className="min-h-screen bg-stone-100">
            <Header initialUser={headerUser} />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-800">
                            Bonjour, {displayName} 👋
                        </h1>
                        <p className="text-slate-500 font-medium">
                            Gérez votre abonnement et vos alertes
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors text-sm w-fit shadow-sm"
                    >
                        <LogOutIcon />
                        Se déconnecter
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {}
                    <div className="lg:col-span-2 space-y-6">

                        {}
                        {user.subscription ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <h2 className="font-black text-slate-800 flex items-center gap-2">
                                        <CheckBadgeIcon />
                                        Abonnement Actif
                                    </h2>
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wide">
                                        {user.subscription.status}
                                    </span>
                                </div>

                                <div className="p-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-1">
                                                {user.subscription.plan}
                                            </h3>
                                            <p className="text-slate-500 text-sm">
                                                Renouvellement le {user.subscription.nextBilling}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-2xl font-black text-slate-800">
                                                {user.subscription.price}
                                            </span>
                                            <span className="text-xs text-slate-500 font-medium">
                                                {user.subscription.plan.includes('Mensuel') ? '/ mois' : '/ an'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">
                                                Référence
                                            </p>
                                            <p className="font-mono font-bold text-slate-700 text-lg">
                                                {user.reference}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">
                                                {contactLabel}
                                            </p>
                                            <div className="flex items-center gap-2 text-slate-700 font-medium">
                                                {primaryContact}
                                                {isSmsPlan && <span className="text-emerald-500">✓</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-4">
                                    <Link
                                        href={`/alertes?${changePlanParams.toString()}`}
                                        className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
                                    >
                                        Changer de plan
                                    </Link>
                                    <Link
                                        href="/dashboard/cancel"
                                        className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors ml-auto"
                                    >
                                        Annuler l&apos;abonnement
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
                                <h2 className="font-black text-slate-800 text-xl mb-2">Aucun abonnement actif</h2>
                                <p className="text-slate-500 mb-6">Souscrivez à nos alertes météo pour rester informé</p>
                                <a href="/alertes" className="inline-block px-6 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors">
                                    Voir les offres
                                </a>
                            </div>
                        )}
                    </div>

                    {}
                    <div className="space-y-6">

                        {}
                        {(user.role === 'admin' || user.role === 'super_admin') && (
                            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl shadow-lg p-6 text-white overflow-hidden relative group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                                    </svg>
                                </div>
                                <h3 className="font-black text-xl mb-2 relative z-10">Espace Admin</h3>
                                <p className="text-indigo-100 text-sm mb-4 relative z-10">
                                    Gérez les utilisateurs, modérez les observations et consultez les statistiques.
                                </p>
                                <Link
                                    href="/admin"
                                    className="block w-full text-center py-2.5 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-sm relative z-10"
                                >
                                    Accéder au Dashboard
                                </Link>
                            </div>
                        )}

                        {}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{user.reference}</h3>
                                    <p className="text-sm text-slate-500">{primaryContact}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => setIsEditOpen(true)}
                                    className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl transition-colors text-sm font-medium group"
                                >
                                    <UserIcon />
                                    Modifier mon profil
                                </button>

                                <Link
                                    href="/dashboard/settings"
                                    className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl transition-colors text-sm font-medium group"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Paramètres
                                </Link>

                                {user.subscription && (
                                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl">
                                        <div className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                                            <BellIcon />
                                            Notifications
                                        </div>
                                        <button
                                            
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 ${(user.notifications ? (user.notifications.sms || user.notifications.email) : user.notifications_enabled) ? 'bg-emerald-500' : 'bg-slate-200'}`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${(user.notifications ? (user.notifications.sms || user.notifications.email) : user.notifications_enabled) ? 'translate-x-6' : 'translate-x-1'}`}
                                            />
                                        </button>
                                    </div>
                                )}
                                <Link
                                    href="/contact"
                                    className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl transition-colors text-sm font-medium group"
                                >
                                    <MessageIcon />
                                    Support client
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
            {
                user && (
                    <EditProfileDialog
                        isOpen={isEditOpen}
                        onClose={() => setIsEditOpen(false)}
                        user={user}
                    />
                )
            }
        </div >
    )
}