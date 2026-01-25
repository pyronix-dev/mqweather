// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useState, use } from "react"
import Link from "next/link"
import useSWR from "swr"
import { Header } from "@/components/header"
import { useToast } from "@/components/ui/toast-context"
import { useConfirm } from "@/components/ui/confirm-context"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface UserDetail {
    user: {
        id: string
        reference_code: string
        email: string
        phone: string
        full_name: string
        created_at: string
        role: string
        is_banned: boolean
        banned_reason: string | null
        is_verified: boolean
        notifications_enabled: boolean
        notif_sms: boolean
        notif_email: boolean
    }
    loginHistory: Array<{
        id: string
        ip_address: string
        user_agent: string
        location_country: string
        location_city: string
        isp: string
        created_at: string
    }>
    subscriptions: Array<{
        id: string
        plan: string
        status: string
        amount: number
        created_at: string
        expires_at: string
    }>
}

export default function UserDetailPage({ params, initialUser }: { params: { id: string }, initialUser: any }) {
    const { id } = use(params)
    const { data, isLoading, mutate } = useSWR<UserDetail>(`/api/admin/users/${id}`, fetcher)
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState<Partial<UserDetail["user"]>>({})
    const { showToast } = useToast()
    const { confirm } = useConfirm()

    const handleEdit = () => {
        setForm({
            full_name: data?.user.full_name,
            email: data?.user.email,
            phone: data?.user.phone,
            is_banned: data?.user.is_banned,
            banned_reason: data?.user.banned_reason,
        })
        setEditing(true)
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            await fetch(`/api/admin/users/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })
            await mutate()
            setEditing(false)
            showToast("Modifications enregistrées", "success")
        } catch (e) {
            showToast("Erreur lors de la sauvegarde", "error")
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!(await confirm({
            title: "Supprimer l'utilisateur ?",
            message: "Cette action est irréversible. Toutes les données associées seront perdues.",
            confirmText: "Supprimer définitivement",
            variant: "danger"
        }))) return

        try {
            await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
            window.location.href = "/admin"
        } catch (e) {
            showToast("Erreur lors de la suppression", "error")
        }
    }

    const toggleBan = async () => {
        const newBanState = !data?.user.is_banned
        let reason = null

        if (newBanState) {
            const result = await confirm({
                title: "Bannir cet utilisateur ?",
                message: "Veuillez indiquer la raison.",
                inputPlaceholder: "Raison (ex: Spam)",
                confirmText: "Bannir",
                variant: "danger"
            })
            if (!result && result !== '') return
            reason = typeof result === 'string' ? result : null
        }

        try {
            await fetch(`/api/admin/users/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_banned: newBanState, banned_reason: reason }),
            })
            await mutate()
            showToast(newBanState ? "Utilisateur banni" : "Utilisateur débanni", "success")
        } catch (e) {
            showToast("Erreur lors de la mise à jour", "error")
        }
    }

    const handleManageSubscription = async (action: 'grant' | 'extend' | 'cancel', durationDays?: number) => {
        try {
            const res = await fetch('/api/admin/subscriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: id, action, durationDays })
            })
            const result = await res.json()
            if (!res.ok) throw new Error(result.error)
            await mutate()
            showToast("Action effectuée avec succès", "success")
        } catch (e: any) {
            showToast(e.message || "Erreur lors de l'action", "error")
        }
    }

    const handleAddSub = async () => {
        const result = await confirm({
            title: "Ajouter un abonnement",
            message: "Entrez la durée en jours",
            inputPlaceholder: "30",
            inputDefaultValue: "30",
            confirmText: "Ajouter",
            variant: "info"
        })
        if (!result) return
        const days = parseInt(typeof result === 'string' ? result : "30")
        if (isNaN(days)) return showToast("Durée invalide", "error")
        handleManageSubscription('grant', days)
    }

    const handleExtendSub = async () => {
        const result = await confirm({
            title: "Prolonger l'abonnement",
            message: "Entrez la durée en jours supplémentaire",
            inputPlaceholder: "30",
            inputDefaultValue: "30",
            confirmText: "Prolonger",
            variant: "info"
        })
        if (!result) return
        const days = parseInt(typeof result === 'string' ? result : "30")
        if (isNaN(days)) return showToast("Durée invalide", "error")
        handleManageSubscription('extend', days)
    }

    const handleCancelSub = async () => {
        if (!(await confirm({
            title: "Annuler l'abonnement ?",
            message: "L'utilisateur perdra son accès premium immédiatement.",
            confirmText: "Annuler l'abonnement",
            variant: "danger"
        }))) return
        handleManageSubscription('cancel')
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            </div>
        )
    }

    if (!data?.user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Utilisateur non trouvé</h1>
                    <Link href="/admin" className="text-blue-600 hover:underline">Retour</Link>
                </div>
            </div>
        )
    }

    const user = data.user

    return (
        <div className="min-h-screen bg-slate-50">
            <Header initialUser={initialUser} />
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/admin" className="text-slate-500 hover:text-slate-700">
                        ← Retour
                    </Link>
                    <h1 className="text-2xl font-black text-slate-800">Détails Utilisateur</h1>
                </div>

                {}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">{user.full_name || "Sans nom"}</h2>
                            <p className="text-slate-500 font-mono">{user.reference_code}</p>
                        </div>
                        <div className="flex gap-2">
                            {!editing ? (
                                <>
                                    <button onClick={handleEdit} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600">
                                        Modifier
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 disabled:opacity-50">
                                        {saving ? "Sauvegarde..." : "Sauvegarder"}
                                    </button>
                                    <button onClick={() => setEditing(false)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300">
                                        Annuler
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                            {editing ? (
                                <input type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg" />
                            ) : (
                                <p className="text-slate-800">{user.email || "-"}</p>
                            )}
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Téléphone</label>
                            {editing ? (
                                <input type="tel" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg" />
                            ) : (
                                <p className="text-slate-800">{user.phone || "-"}</p>
                            )}
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Nom Complet</label>
                            {editing ? (
                                <input type="text" value={form.full_name || ""} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg" />
                            ) : (
                                <p className="text-slate-800">{user.full_name || "-"}</p>
                            )}
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Rôle</label>
                            <p className="text-slate-800 capitalize">{user.role}</p>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Créé le</label>
                            <p className="text-slate-800">{new Date(user.created_at).toLocaleString("fr-FR")}</p>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Statut</label>
                            <div className="flex gap-2 mt-1">
                                {user.is_banned && <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">Banni</span>}
                                {user.is_verified && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Vérifié</span>}
                            </div>
                        </div>
                    </div>
                    {user.is_banned && user.banned_reason && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-xs font-bold text-red-600 uppercase mb-1">Raison du bannissement</p>
                            <p className="text-red-700">{user.banned_reason}</p>
                        </div>
                    )}
                </div>

                {}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Historique de Connexion</h3>
                    {data.loginHistory.length === 0 ? (
                        <p className="text-slate-500">Aucun historique disponible</p>
                    ) : (
                        <div className="space-y-3">
                            {data.loginHistory.map((log) => (
                                <div key={log.id} className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                                    <div>
                                        <p className="font-mono text-sm text-slate-800">{log.ip_address || "IP inconnue"}</p>
                                        <p className="text-xs text-slate-500">{log.location_city}, {log.location_country} • {log.isp}</p>
                                    </div>
                                    <p className="text-xs text-slate-500">{new Date(log.created_at).toLocaleString("fr-FR")}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-800">Abonnements</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={handleAddSub}
                                className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-100"
                            >
                                + Ajouter
                            </button>
                        </div>
                    </div>

                    {data.subscriptions.length === 0 ? (
                        <p className="text-slate-500">Aucun abonnement</p>
                    ) : (
                        <div className="space-y-3">
                            {data.subscriptions.map((sub) => (
                                <div key={sub.id} className="p-3 bg-slate-50 rounded-lg flex items-center justify-between group">
                                    <div>
                                        <p className="font-medium text-slate-800">{sub.plan}</p>
                                        <p className="text-xs text-slate-500">{(sub.amount / 100).toFixed(2)}€ • Expire: {sub.expires_at ? new Date(sub.expires_at).toLocaleDateString("fr-FR") : "N/A"}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${sub.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"}`}>
                                            {sub.status}
                                        </span>
                                        {sub.status === 'active' && (
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={handleExtendSub}
                                                    className="p-1 hover:bg-slate-200 rounded"
                                                    title="Prolonger"
                                                >
                                                    ➕
                                                </button>
                                                <button
                                                    onClick={handleCancelSub}
                                                    className="p-1 hover:bg-red-100 rounded text-red-600"
                                                    title="Annuler"
                                                >
                                                    ✖️
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}