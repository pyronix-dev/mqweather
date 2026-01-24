// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import { Header } from "@/components/header"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ObservationsModeration({ initialUser }: { initialUser: any }) {
    const [page, setPage] = useState(1)
    const { data, isLoading, mutate } = useSWR(`/api/admin/observations?page=${page}&limit=20`, fetcher)

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer cette observation ?")) return
        await fetch("/api/admin/observations", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        })
        mutate()
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Header initialUser={initialUser} />
            <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/admin" className="text-slate-500 hover:text-slate-700">← Retour</Link>
                    <h1 className="text-2xl font-black text-slate-800">Modération des Observations</h1>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Position</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Détails</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Utilisateur</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {isLoading ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Chargement...</td></tr>
                            ) : data?.observations?.map((obs: any) => (
                                <tr key={obs.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-800">{obs.type}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">x:{obs.x?.toFixed(1)}, y:{obs.y?.toFixed(1)}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{obs.details || "-"}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{obs.users?.email || obs.users?.full_name || "Anonyme"}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(obs.created_at).toLocaleString("fr-FR")}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleDelete(obs.id)} className="text-red-600 hover:underline text-sm font-medium">
                                            Supprimer
                                        </button>
                                    </td>
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