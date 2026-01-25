// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { useRouter } from "next/navigation"

const AlertIcon = () => (
    <svg className="w-12 h-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
)

interface DeleteAccountDialogProps {
    isOpen: boolean
    onClose: () => void
}

export function DeleteAccountDialog({ isOpen, onClose }: DeleteAccountDialogProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [confirmationText, setConfirmationText] = useState("")
    const [error, setError] = useState("")

    const EXPECTED_TEXT = "Supprimer mon compte"

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault()

        if (confirmationText !== EXPECTED_TEXT) {
            setError("Le texte de confirmation est incorrect.")
            return
        }

        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/user/account", {
                method: "DELETE",
            })

            if (!res.ok) throw new Error("Delete failed")

            
            alert("Votre compte a été supprimé.")
            router.push('/login')
            router.refresh()
        } catch (e) {
            setError("Une erreur est survenue lors de la suppression.")
            setLoading(false)
        }
    }

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-red-900/20 backdrop-blur-sm z-50 animate-fade-in" />
                <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 z-50 animate-scale-in focus:outline-none text-center">

                    <div className="flex flex-col items-center">
                        <div className="p-3 bg-red-50 rounded-full mb-4">
                            <AlertIcon />
                        </div>

                        <Dialog.Title className="text-2xl font-black text-slate-800 mb-2">
                            Supprimer votre compte ?
                        </Dialog.Title>

                        <Dialog.Description className="text-slate-500 mb-6">
                            Cette action est <strong>irréversible</strong>. Toutes vos données seront effacées et vous ne pourrez plus vous connecter.
                        </Dialog.Description>

                        <form onSubmit={handleDelete} className="w-full space-y-4">
                            <div className="text-left">
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Tapez "{EXPECTED_TEXT}" pour confirmer
                                </label>
                                <input
                                    type="text"
                                    value={confirmationText}
                                    onChange={(e) => setConfirmationText(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:outline-none transition-colors font-medium placeholder:font-normal"
                                    placeholder={EXPECTED_TEXT}
                                />
                                {error && <p className="text-red-600 text-sm mt-2 font-bold">{error}</p>}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || confirmationText !== EXPECTED_TEXT}
                                    className="flex-1 py-3 font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Suppression..." : "Supprimer"}
                                </button>
                            </div>
                        </form>
                    </div>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}