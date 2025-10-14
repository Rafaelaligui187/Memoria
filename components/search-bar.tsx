"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SearchBar({ className = "" }: { className?: string }) {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className={`relative flex items-center ${className}`}>
      <Search className="absolute left-3 text-gray-500 h-4 w-4" />
      <Input
        type="text"
        placeholder="Search yearbook..."
        className="pl-10 pr-16 h-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button
        type="submit"
        className="absolute right-0 h-10 rounded-l-none bg-blue-600 hover:bg-blue-700"
        disabled={!searchQuery.trim()}
      >
        Search
      </Button>
    </form>
  )
}
