import type { ReactNode } from "react"
import { Header } from "@/components/header"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
