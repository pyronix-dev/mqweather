
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import useSWR from "swr"
import { useToast } from "@/components/ui/toast-context"
import { useConfirm } from "@/components/ui/confirm-context"
import { Header } from "@/components/header"
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Stats {
    totalUsers: number
    newUsersToday: number
    newUsersThisMonth: number
    activeSubscriptions: number
    totalObservations: number
    observationsToday: number
    bannedUsers: number
    chartData?: any[]
    topCities?: any[]
}

interface User {
    id: string
    reference_code: string
    email: string
    phone: string
    full_name: string
    created_at: string
    role: string
    is_banned: boolean
    is_verified: boolean
}

export default function AdminDashboard({ initialUser }: { initialUser: any }) {
    const { showToast } = useToast()
    const { confirm } = useConfirm()
    const [isAdmin, setIsAdmin] = useState<boolean | null>(
        initialUser?.role === "admin" || initialUser?.role === "super_admin" ? true : initialUser ? false : null
    )
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)

    const { data: stats, isLoading: statsLoading } = useSWR<Stats>("/api/admin/stats", fetcher)
    const { data: usersData, isLoading: usersLoading, mutate: mutateUsers } = useSWR(
        `/api/admin/users?page=${page}&limit=10&search=${encodeURIComponent(search)}`,
        fetcher
    )
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])

    const toggleSelectAll = () => {
        if (selectedUsers.length === usersData?.users?.length) {
            setSelectedUsers([])
        } else {
            setSelectedUsers(usersData?.users?.map((u: User) => u.id) || [])
        }
    }

    const toggleUser = (id: string) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(prev => prev.filter(uid => uid !== id))
        } else {
            setSelectedUsers(prev => [...prev, id])
        }
    }

    const handleBulkAction = async (action: 'ban' | 'unban' | 'delete') => {
        const isBan = action === 'ban'
        const result = await confirm({
            title: isBan ? 'Bannir des utilisateurs' : action === 'delete' ? 'Supprimer des utilisateurs' : 'Débannir des utilisateurs',
            message: `Voulez-vous vraiment appliquer "${action}" sur ${selectedUsers.length} utilisateurs ?`,
            inputPlaceholder: isBan ? "Raison du bannissement (optionnel)" : undefined,
            confirmText: 'Confirmer',
            variant: action === 'delete' ? 'danger' : 'warning'
        })

        if (!result && result !== '') return // Check for false (cancel) but allow empty string

        const reason = typeof result === 'string' ? result : undefined

        try {
            const res = await fetch('/api/admin/bulk-actions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userIds: selectedUsers, action, reason })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Erreur')
            }

            await mutateUsers()
            setSelectedUsers([])
            showToast("Opération réussie", "success")
        } catch (e: any) {
            showToast(e.message, "error")
        }
    }

    useEffect(() => {
        if (initialUser && isAdmin === null) {
            // Secondary check if initial state wasn't enough or if we need to refresh
            fetch("/api/auth/me")
                .then((res) => res.json())
                .then((data) => {
                    if (data.role === "admin" || data.role === "super_admin") {
                        setIsAdmin(true)
                    } else {
                        setIsAdmin(false)
                    }
                })
                .catch(() => setIsAdmin(false))
        }
    }, [initialUser, isAdmin])

    if (isAdmin === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            </div>
        )
    }

    if (isAdmin === false) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Accès Refusé</h1>
                    <p className="text-slate-600 dark:text-slate-400">Vous n'avez pas les droits d'administrateur.</p>
                    <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
            <Header initialUser={initialUser} />
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white">Admin Dashboard</h1>
                    <div className="flex gap-3">
                        <Link
                            href="/admin/observations"
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                        >
                            Observations
                        </Link>
                        <Link
                            href="/admin/logs"
                            className="px-4 py-2 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
                        >
                            Audit Logs
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard label="Total Utilisateurs" value={stats?.totalUsers || 0} loading={statsLoading} />
                    <StatCard label="Nouveaux Aujourd'hui" value={stats?.newUsersToday || 0} loading={statsLoading} color="green" />
                    <StatCard label="Ce Mois" value={stats?.newUsersThisMonth || 0} loading={statsLoading} color="blue" />
                    <StatCard label="Abonnements Actifs" value={stats?.activeSubscriptions || 0} loading={statsLoading} color="purple" />
                    <StatCard label="Observations Total" value={stats?.totalObservations || 0} loading={statsLoading} />
                    <StatCard label="Observations Aujourd'hui" value={stats?.observationsToday || 0} loading={statsLoading} color="cyan" />
                    <StatCard label="Utilisateurs Bannis" value={stats?.bannedUsers || 0} loading={statsLoading} color="red" />
                    <StatCard label="Taux Vérification" value={`${Math.round((stats?.activeSubscriptions || 0) / Math.max(stats?.totalUsers || 1, 1) * 100)}%`} loading={statsLoading} color="amber" />
                </div>

                {/* --- ANALYTICS SECTION --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Growth Chart */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">Croissance & Activité (30 jours)</h2>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats?.chartData || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 12, fill: '#64748b' }}
                                        tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' })}
                                        minTickGap={30}
                                    />
                                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="users"
                                        name="Nouveaux Inscrits"
                                        stroke="#4f46e5"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#4f46e5', strokeWidth: 0 }}
                                        activeDot={{ r: 6 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="active"
                                        name="Utilisateurs Actifs"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Geo Distribution */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">Top Villes (Activité)</h2>
                        <div className="h-80 w-full flex items-center justify-center">
                            {(!stats?.topCities || stats.topCities.length === 0) ? (
                                <div className="text-center text-slate-400 dark:text-slate-500">
                                    <p className="mb-2">📍</p>
                                    <p>Pas assez de données géographiques</p>
                                    <p className="text-xs mt-1">Les données apparaîtront au fil des connexions.</p>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.topCities} layout="vertical" margin={{ left: 40 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                        <XAxis type="number" hide />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
                                            width={100}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            itemStyle={{ color: '#1e293b' }}
                                        />
                                        <Bar
                                            dataKey="value"
                                            name="Connexions"
                                            fill="#f59e0b"
                                            radius={[0, 4, 4, 0]}
                                            barSize={32}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>
                {/* ------------------------- */}

                {/* Users Table */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden relative">
                    {selectedUsers.length > 0 && (
                        <div className="absolute top-0 left-0 right-0 z-10 bg-indigo-600 text-white p-4 flex items-center justify-between animate-fade-in-down">
                            <span className="font-bold">{selectedUsers.length} sélectionné(s)</span>
                            <div className="flex gap-3">
                                <button onClick={() => handleBulkAction('ban')} className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded font-medium text-sm">Bannir</button>
                                <button onClick={() => handleBulkAction('unban')} className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded font-medium text-sm">Débannir</button>
                                <button onClick={() => handleBulkAction('delete')} className="px-3 py-1 bg-red-500/80 hover:bg-red-500 text-white rounded font-medium text-sm">Supprimer</button>
                                <button onClick={() => setSelectedUsers([])} className="ml-4 text-white/70 hover:text-white text-sm">Annuler</button>
                            </div>
                        </div>
                    )}
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Utilisateurs</h2>
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-700/50">
                                <tr>
                                    <th className="px-6 py-3 w-4">
                                        <input
                                            type="checkbox"
                                            checked={usersData?.users?.length > 0 && selectedUsers.length === usersData?.users?.length}
                                            onChange={toggleSelectAll}
                                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Nom</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Email/Tel</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Référence</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Rôle</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Statut</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {usersLoading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                                            Chargement...
                                        </td>
                                    </tr>
                                ) : usersData?.users?.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                                            Aucun utilisateur trouvé
                                        </td>
                                    </tr>
                                ) : (
                                    usersData?.users?.map((user: User) => (
                                        <tr key={user.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 ${selectedUsers.includes(user.id) ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''} border-b border-slate-100 dark:border-slate-700 last:border-0`}>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={() => toggleUser(user.id)}
                                                    className="rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-slate-700"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-800 dark:text-slate-200">{user.full_name || "Sans nom"}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{user.email || user.phone}</td>
                                            <td className="px-6 py-4 text-sm font-mono text-slate-500 dark:text-slate-400">{user.reference_code}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === "super_admin" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" :
                                                    user.role === "admin" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
                                                        "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.is_banned ? (
                                                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">Banni</span>
                                                ) : user.is_verified ? (
                                                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">Vérifié</span>
                                                ) : (
                                                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">Non vérifié</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`/admin/users/${user.id}`}
                                                    className="text-blue-600 hover:underline text-sm font-medium dark:text-blue-400"
                                                >
                                                    Voir détails
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {usersData?.pagination && (
                        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                Page {usersData.pagination.page} sur {usersData.pagination.totalPages} ({usersData.pagination.total} utilisateurs)
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-3 py-1 border border-slate-200 dark:border-slate-600 rounded-lg text-sm disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    Précédent
                                </button>
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={page >= usersData.pagination.totalPages}
                                    className="px-3 py-1 border border-slate-200 dark:border-slate-600 rounded-lg text-sm disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    Suivant
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

function StatCard({ label, value, loading, color = "slate" }: { label: string; value: number | string; loading: boolean; color?: string }) {
    const colorClass = {
        slate: "text-slate-700 dark:text-slate-300",
        green: "text-green-700 dark:text-green-400",
        blue: "text-blue-700 dark:text-blue-400",
        purple: "text-purple-700 dark:text-purple-400",
        cyan: "text-cyan-700 dark:text-cyan-400",
        red: "text-red-700 dark:text-red-400",
        amber: "text-amber-700 dark:text-amber-400",
    }[color]

    const bgClass = {
        slate: "bg-slate-100 dark:bg-slate-700/50",
        green: "bg-green-100 dark:bg-green-900/30",
        blue: "bg-blue-100 dark:bg-blue-900/30",
        purple: "bg-purple-100 dark:bg-purple-900/30",
        cyan: "bg-cyan-100 dark:bg-cyan-900/30",
        red: "bg-red-100 dark:bg-red-900/30",
        amber: "bg-amber-100 dark:bg-amber-900/30",
    }[color]

    return (
        <div className={`p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm ${bgClass}`}>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">{label}</p>
            {loading ? (
                <div className="h-8 w-16 bg-white/50 rounded animate-pulse" />
            ) : (
                <p className={`text-2xl font-black ${colorClass}`}>{value}</p>
            )}
        </div>
    )
}
