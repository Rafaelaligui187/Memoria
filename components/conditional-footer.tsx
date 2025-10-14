"use client"

import { usePathname } from "next/navigation"
import { Footer } from "./footer"

export function ConditionalFooter() {
  const pathname = usePathname()

  if (pathname.startsWith("/admin")) {
    return null
  }

  return <Footer />
}
