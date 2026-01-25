// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import { Header } from "@/components/header"

import { useToast } from "@/components/ui/toast-context"
import { useConfirm } from "@/components/ui/confirm-context"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AuditLogsPage({ initialUser }: { initialUser: any }) {
    const [page, setPage] = useState(1)
    const { data, isLoading, mutate } = useSWR(`/api/admin/logs?page=${page}&limit=50`, fetcher)
    const { showToast } = useToast()
    const { confirm } = useConfirm()

    return (
        <div className="min-h-screen bg-slate-50">
            <Header initialUser={initialUser} />
            <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="text-slate-500 hover:text-slate-700">← Retour</Link>
                        <h1 className="text-2xl font-black text-slate-800">Audit Logs</h1>
                    </div>
                    <button
                        onClick={async () => {
                            if (!(await confirm({
                                title: "Vider l'historique ?",
                                message: "Attention : Cette action est irréversible. Voulez-vous vraiment supprimer TOUS les logs ?",
                                confirmText: "Tout supprimer",
                                variant: "danger"
                            }))) return

                            try {
                                const res = await fetch('/api/admin/logs', { method: 'DELETE' })
                                if (res.ok) {
                                    showToast("Logs supprimés avec succès", "success")
                                    mutate()
                                } else {
                                    const data = await res.json()
                                    showToast(data.error || "Erreur lors de la suppression", "error")
                                }
                            } catch (e) {
                                showToast("Erreur serveur", "error")
                            }
                        }}
                        className="px-4 py-2 bg-red-50 text-red-600 text-sm font-bold rounded-lg border border-red-100 hover:bg-red-100 transition-colors"
                    >
                        🗑️ Vider l'historique
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Admin</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Action</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Cible</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">IP</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {isLoading ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Chargement...</td></tr>
                            ) : data?.logs?.map((log: any) => (
                                <tr key={log.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-sm text-slate-800">{log.users?.email || log.users?.full_name || "Inconnu"}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${log.action.includes("delete") ? "bg-red-100 text-red-700" :
                                            log.action.includes("update") ? "bg-blue-100 text-blue-700" :
                                                "bg-slate-100 text-slate-700"
                                            }`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{log.target_type}: {log.target_id?.slice(0, 8)}...</td>
                                    <td className="px-6 py-4 text-sm font-mono text-slate-500">{log.ip_address || "-"}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(log.created_at).toLocaleString("fr-FR")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {data?.pagination && (
                        <div className="p-4 border-t border-slate-200 flex items-center justify-between">
                            <span className="text-sm text-slate-500">Page {data.pagination.page} sur {data.pagination.totalPages}</span>
                            <div className="flex gap-2">
                                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border border-slate-200 rounded-lg text-sm disabled:opacity-50">Précédent</button>
                                <button onClick={() => setPage(p => p + 1)} disabled={page >= data.pagination.totalPages} className="px-3 py-1 border border-slate-200 rounded-lg text-sm disabled:opacity-50">Suivant</button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}