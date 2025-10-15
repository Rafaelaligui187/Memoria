import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import { AlbumLikeProvider } from "@/contexts/album-likes-context"
import { ConditionalFooter } from "@/components/conditional-footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Memoria - Consolatrix College Digital Yearbook",
  description: "Digital yearbook for Consolatrix College of Toledo City, Inc.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            <AlbumLikeProvider>
              {children}
              <Toaster />
              <ConditionalFooter />
            </AlbumLikeProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
