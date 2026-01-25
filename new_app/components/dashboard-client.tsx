// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useToast } from "@/components/ui/toast-context"
import { EditProfileDialog } from "@/components/edit-profile-dialog"
import { User, MessageSquare, Bell, LogOut, BadgeCheck, Settings, Check } from "lucide-react"




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
        phone: initialUser.phone || null,
        notifications_enabled: initialUser.notifications_enabled ?? true,
        role: initialUser.role,
        subscription: initialUser.subscription
    } as any : null)




    const [loading, setLoading] = useState(!initialUser)
    // If we have an initial user but no subscription, we still want to "load" 
    // to double-check with the API (handles webhook race conditions)
    const [subscriptionLoading, setSubscriptionLoading] = useState(!!initialUser && !initialUser.subscription)
    const [isClientFetching, setIsClientFetching] = useState(true)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {



        const fetchUserData = async () => {
            try {
                const res = await fetch('/api/auth/me')
                if (!res.ok) {
                    // Only redirect if we don't have an initial user (session might have expired)
                    // If we have initialUser, it means server rendered it fine, so maybe API error is temporary
                    if (!initialUser) {
                        router.push('/login')
                    }
                    return
                }
                const data = await res.json()
                // Merge with existing state, preserve subscription if API returns null
                setUser(prev => {
                    if (!prev) return data
                    return {
                        ...prev,
                        ...data,
                        // Keep existing subscription if API returns null/undefined
                        subscription: data.subscription || prev.subscription
                    }
                })
            } catch (error) {
                console.error('Failed to fetch user data:', error)
            } finally {
                setLoading(false)
                setSubscriptionLoading(false)
                setIsClientFetching(false)
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


    let displayName = 'Utilisateur'
    if (user.full_name) {
        displayName = user.full_name.split(' ')[0]
    } else if (user.email) {
        displayName = user.email.split('@')[0]
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
                { }
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-2">
                            <span>Bonjour,</span>
                            {(isClientFetching && (!user.full_name || (user.email && user.full_name === user.email.split('@')[0]))) ? (
                                <div className="h-8 w-32 bg-slate-200 rounded-lg animate-pulse" />
                            ) : (
                                <span>{displayName} 👋</span>
                            )}
                        </h1>
                        <p className="text-slate-500 font-medium">
                            Gérez votre abonnement et vos alertes
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors text-sm w-fit shadow-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        Se déconnecter
                    </button>
                </div >

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    { }
                    <div className="lg:col-span-2 space-y-6">

                        { }
                        {user.subscription ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <h2 className="font-black text-slate-800 flex items-center gap-2">
                                        <BadgeCheck className="w-6 h-6 text-emerald-500" />
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
                                                {isSmsPlan && <Check className="w-4 h-4 text-emerald-500" />}
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
                        ) : (loading || subscriptionLoading) ? (
                            /* Detailed Skeleton to match "Abonnement Actif" design */
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-pulse">
                                {/* Header Skeleton */}
                                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-slate-200 rounded-full"></div>
                                        <div className="h-6 bg-slate-200 rounded w-40"></div>
                                    </div>
                                    <div className="h-6 bg-slate-200 rounded-full w-20"></div>
                                </div>

                                {/* Body Skeleton */}
                                <div className="p-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                        <div className="space-y-2">
                                            <div className="h-8 bg-slate-200 rounded w-48"></div>
                                            <div className="h-4 bg-slate-200 rounded w-32"></div>
                                        </div>
                                        <div className="text-right space-y-2">
                                            <div className="h-8 bg-slate-200 rounded w-24 ml-auto"></div>
                                            <div className="h-3 bg-slate-200 rounded w-10 ml-auto"></div>
                                        </div>
                                    </div>

                                    {/* Info Grid Skeleton */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 h-24"></div>
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 h-24"></div>
                                    </div>
                                </div>

                                {/* Footer Skeleton */}
                                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                    <div className="h-5 bg-slate-200 rounded w-32"></div>
                                    <div className="h-5 bg-slate-200 rounded w-40"></div>
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

                    { }
                    <div className="space-y-6">

                        { }
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

                        { }
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
                                    <User className="w-5 h-5" />
                                    Modifier mon profil
                                </button>

                                <Link
                                    href="/dashboard/settings"
                                    className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl transition-colors text-sm font-medium group"
                                >
                                    <Settings className="w-5 h-5" />
                                    Paramètres
                                </Link>

                                {(user.subscription || subscriptionLoading) && (
                                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl">
                                        <div className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                                            <Bell className="w-5 h-5" />
                                            Notifications
                                        </div>
                                        <button
                                            onClick={async () => {
                                                const newState = !user.notifications_enabled
                                                // Optimistic update
                                                setUser(prev => prev ? { ...prev, notifications_enabled: newState } : null)

                                                try {
                                                    const res = await fetch('/api/user/notifications', {
                                                        method: 'PATCH',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ enabled: newState })
                                                    })
                                                    if (!res.ok) throw new Error('Failed')

                                                    // Refresh data to get granular updates (sms/email might have changed)
                                                    const updatedRes = await fetch('/api/auth/me')
                                                    if (updatedRes.ok) {
                                                        const updatedData = await updatedRes.json()
                                                        setUser(updatedData)
                                                    }
                                                } catch (e) {
                                                    // Revert
                                                    setUser(prev => prev ? { ...prev, notifications_enabled: !newState } : null)
                                                    showToast("Erreur lors de la mise à jour", "error")
                                                }
                                            }}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 ${user.notifications_enabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user.notifications_enabled ? 'translate-x-6' : 'translate-x-1'}`}
                                            />
                                        </button>
                                    </div>
                                )}
                                <Link
                                    href="/contact"
                                    className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl transition-colors text-sm font-medium group"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                    Support client
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </main >

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