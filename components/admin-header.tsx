"use client"

import { BookOpen } from "lucide-react"
import { LogoutButton } from "./logout-button"

export function AdminHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Memoria Admin Panel</h1>
            <p className="text-sm text-gray-600">Consolatrix College Yearbook System</p>
          </div>
        </div>

        <LogoutButton variant="outline" size="sm" className="border-red-600 text-red-600 hover:bg-red-100 hover:text-red-800 active:bg-red-300 active:text-red-900 transition-all duration-200" />
      </div>
    </header>
  )
}
