// Developed by Omar Rafik (OMX) - omx001@proton.me

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import useSWR from "swr"
import { useToast } from "@/components/ui/toast-context"
import { useConfirm } from "@/components/ui/confirm-context"
import { Header } from "@/components/header"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    BarChart,
    Bar
} from "recharts"
import {
    Users,
    UserPlus,
    Calendar,
    Activity,
    FileText,
    Sun,
    ShieldAlert,
    ShieldCheck,
    Search,
    Download,
    Trash2,
    Ban,
    CheckCircle,
    AlertTriangle,
    TrendingUp
} from "lucide-react"


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

        if (!result && result !== '') return

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
                    <Link
                        href="/admin/observations"
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700 transition-colors shadow-sm flex items-center gap-2"
                    >
                        <FileText className="w-4 h-4" />
                        Observations
                    </Link>
                    <Link
                        href="/admin/logs"
                        className="px-4 py-2 border border-slate-300 text-slate-700 dark:text-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                        <ShieldAlert className="w-4 h-4" />
                        Audit Logs
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

                    <StatCard label="Total Utilisateurs" value={stats?.totalUsers || 0} loading={statsLoading} icon={Users} />
                    <StatCard label="Nouveaux (24h)" value={stats?.newUsersToday || 0} loading={statsLoading} color="green" icon={UserPlus} />
                    <StatCard label="Ce Mois" value={stats?.newUsersThisMonth || 0} loading={statsLoading} color="blue" icon={Calendar} />
                    <StatCard label="Abonnements Actifs" value={stats?.activeSubscriptions || 0} loading={statsLoading} color="purple" icon={Activity} />
                    <StatCard label="Observations Total" value={stats?.totalObservations || 0} loading={statsLoading} icon={FileText} />
                    <StatCard label="Obs. Aujourd'hui" value={stats?.observationsToday || 0} loading={statsLoading} color="cyan" icon={Sun} />
                    <StatCard label="Utilisateurs Bannis" value={stats?.bannedUsers || 0} loading={statsLoading} color="red" icon={ShieldAlert} />
                    <StatCard label="Taux Vérification" value={`${Math.round((stats?.activeSubscriptions || 0) / Math.max(stats?.totalUsers || 1, 1) * 100)}%`} loading={statsLoading} color="amber" icon={ShieldCheck} />
                </div>

                {/* --- ANALYTICS SECTION --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Growth Chart */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                Croissance & Activité
                            </h2>
                            <select className="bg-slate-50 border-slate-200 text-sm rounded-lg px-3 py-1 text-slate-600 focus:ring-blue-500">
                                <option>30 jours</option>
                                <option>90 jours</option>
                            </select>
                        </div>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats?.chartData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 12, fill: '#64748b' }}
                                        tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' })}
                                        minTickGap={30}
                                        axisLine={false}
                                        tickLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12, fill: '#64748b' }}
                                        axisLine={false}
                                        tickLine={false}
                                        dx={-10}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: 'none',
                                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                                            padding: '12px'
                                        }}
                                        labelStyle={{ color: '#64748b', marginBottom: '8px', fontSize: '12px' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Area
                                        type="monotone"
                                        dataKey="users"
                                        name="Nouveaux Inscrits"
                                        stroke="#4f46e5"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorUsers)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="active"
                                        name="Utilisateurs Actifs"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorActive)"
                                    />
                                </AreaChart>
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
                                    <BarChart data={stats.topCities} layout="vertical" margin={{ left: 0, right: 30, top: 10, bottom: 10 }}>
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
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden relative flex flex-col h-[600px]">
                    {selectedUsers.length > 0 && (
                        <div className="absolute top-0 left-0 right-0 z-10 bg-indigo-600 text-white p-4 flex items-center justify-between animate-fade-in-down shadow-lg">
                            <span className="font-bold flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-indigo-200" />
                                {selectedUsers.length} sélectionné(s)
                            </span>
                            <div className="flex gap-3">
                                <button onClick={() => handleBulkAction('ban')} className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg font-medium text-sm border border-white/10 transition-colors flex items-center gap-2">
                                    <Ban className="w-4 h-4" />
                                    Bannir
                                </button>
                                <button onClick={() => handleBulkAction('unban')} className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg font-medium text-sm border border-white/10 transition-colors flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4" />
                                    Débannir
                                </button>
                                <button onClick={() => handleBulkAction('delete')} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm shadow-sm transition-colors flex items-center gap-2">
                                    <Trash2 className="w-4 h-4" />
                                    Supprimer
                                </button>
                                <button onClick={() => setSelectedUsers([])} className="ml-4 text-white/70 hover:text-white text-sm">Annuler</button>
                            </div>
                        </div>
                    )}

                    <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800 sticky top-0 z-0">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-600" />
                            Utilisateurs
                            <span className="bg-slate-100 text-slate-600 text-xs py-0.5 px-2 rounded-full border border-slate-200">{usersData?.pagination?.total || 0}</span>
                        </h2>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Rechercher un utilisateur..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 dark:bg-slate-700 dark:text-white w-64 transition-all"
                            />
                        </div>
                    </div>


                    <div className="overflow-auto flex-1 relative">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-700/50 sticky top-0 z-0 shadow-sm">
                                <tr>
                                    <th className="px-6 py-4 w-4">
                                        <input
                                            type="checkbox"
                                            checked={usersData?.users?.length > 0 && selectedUsers.length === usersData?.users?.length}
                                            onChange={toggleSelectAll}
                                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                        />
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nom</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email/Tel</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Référence</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rôle</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {usersLoading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin mb-4" />
                                                <p className="text-slate-500 text-sm font-medium">Chargement des données...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : usersData?.users?.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                            <div className="flex flex-col items-center justify-center opacity-60">
                                                <Search className="w-12 h-12 text-slate-300 mb-2" />
                                                <p>Aucun utilisateur trouvé</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    usersData?.users?.map((user: User) => (
                                        <tr key={user.id} className={`group hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors ${selectedUsers.includes(user.id) ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={() => toggleUser(user.id)}
                                                    className="rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-slate-700 w-4 h-4 cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">{user.full_name || "Sans nom"}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">{user.email || user.phone}</td>
                                            <td className="px-6 py-4 text-xs font-mono text-slate-400 dark:text-slate-500 select-all">{user.reference_code}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${user.role === "super_admin" ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300" :
                                                    user.role === "admin" ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300" :
                                                        "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300"
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.is_banned ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300">
                                                        <Ban className="w-3 h-3" /> Banni
                                                    </span>
                                                ) : user.is_verified ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300">
                                                        <CheckCircle className="w-3 h-3" /> Vérifié
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-300">
                                                        <AlertTriangle className="w-3 h-3" /> Non vérifié
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`/admin/users/${user.id}`}
                                                    className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                                    title="Voir détails"
                                                >
                                                    <FileText className="w-5 h-5" />
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
                        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-between sticky bottom-0 z-10">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Page {usersData.pagination.page} sur {usersData.pagination.totalPages} ({usersData.pagination.total} utilisateurs)
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg text-sm disabled:opacity-50 dark:text-slate-300 hover:bg-slate-50 transition-colors font-medium shadow-sm"
                                >
                                    Précédent
                                </button>
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={page >= usersData.pagination.totalPages}
                                    className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg text-sm disabled:opacity-50 dark:text-slate-300 hover:bg-slate-50 transition-colors font-medium shadow-sm"
                                >
                                    Suivant
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </main >
        </div >
    )
}

function StatCard({
    label,
    value,
    loading,
    color = "slate",
    icon: Icon
}: {
    label: string;
    value: number | string;
    loading: boolean;
    color?: "slate" | "green" | "blue" | "purple" | "cyan" | "red" | "amber";
    icon?: any
}) {
    const colorStyles = {
        slate: { text: "text-slate-900 dark:text-slate-100", bg: "bg-white dark:bg-slate-800", icon: "text-slate-500", border: "border-slate-200 dark:border-slate-700" },
        green: { text: "text-green-700 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/10", icon: "text-green-500", border: "border-green-100 dark:border-green-800" },
        blue: { text: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/10", icon: "text-blue-500", border: "border-blue-100 dark:border-blue-800" },
        purple: { text: "text-purple-700 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/10", icon: "text-purple-500", border: "border-purple-100 dark:border-purple-800" },
        cyan: { text: "text-cyan-700 dark:text-cyan-400", bg: "bg-cyan-50 dark:bg-cyan-900/10", icon: "text-cyan-500", border: "border-cyan-100 dark:border-cyan-800" },
        red: { text: "text-red-700 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/10", icon: "text-red-500", border: "border-red-100 dark:border-red-800" },
        amber: { text: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/10", icon: "text-amber-500", border: "border-amber-100 dark:border-amber-800" },
    }[color]

    const isEmpty = !loading && (value === 0 || value === "0" || value === "0%");

    return (
        <div className={`p-5 rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md ${colorStyles.bg} ${colorStyles.border}`}>
            <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
                {Icon && <Icon className={`w-5 h-5 ${colorStyles.icon} opacity-80`} />}
            </div>

            {loading ? (
                <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mt-1" />
            ) : (
                <div className="flex items-baseline gap-2">
                    <p className={`text-3xl font-bold tracking-tight ${isEmpty ? "text-slate-400 dark:text-slate-600" : "text-slate-900 dark:text-white"}`}>
                        {value}
                    </p>
                    {isEmpty && <span className="text-xs text-slate-400 font-medium">Aucune donnée</span>}
                </div>
            )}
        </div>
    )
}