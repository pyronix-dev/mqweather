// Developed by Omar Rafik (OMX) - omx001@proton.me
import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Météo Martinique",
  description: "Suivez la météo en temps réel en Martinique",
}

import { ToastProvider } from "@/components/ui/toast-context"
import { ConfirmDialogProvider } from "@/components/ui/confirm-context"



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <head>

        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
      </head>
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        <ToastProvider>
          <ConfirmDialogProvider>
            {children}
          </ConfirmDialogProvider>
        </ToastProvider>
      </body>
    </html>
  )
}