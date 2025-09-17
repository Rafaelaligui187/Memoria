import type React from "react"
import { Header } from "@/components/header"

interface LegalLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
}

export function LegalLayout({ children, title, description }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          {description && <p className="text-xl opacity-90">{description}</p>}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">{children}</div>
      </div>
    </div>
  )
}
