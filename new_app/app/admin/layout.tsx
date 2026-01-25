// Developed by Omar Rafik (OMX) - omx001@proton.me

import type React from "react"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="">
            <div className="min-h-screen bg-background text-foreground selection:bg-indigo-500/30">
                {children}
            </div>
        </div>
    )
}