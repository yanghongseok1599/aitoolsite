'use client'

import { AdminGuard } from '@/components/auth/AdminGuard'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-100">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  )
}
