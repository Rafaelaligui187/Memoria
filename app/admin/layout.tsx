import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminRouteGuard } from "@/components/admin-route-guard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminRouteGuard>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AdminSidebar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </SidebarProvider>
    </AdminRouteGuard>
  )
}
