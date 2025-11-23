import { AuthGuard } from '@/components/auth/AuthGuard'
import { DashboardHeader } from '@/components/DashboardHeader'
import { SidebarNav } from '@/components/mypage/SidebarNav'

export default function MypageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Sidebar - Hidden on mobile */}
            <div className="hidden lg:block lg:col-span-1">
              <SidebarNav />
            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden mb-6">
              <SidebarNav />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {children}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
