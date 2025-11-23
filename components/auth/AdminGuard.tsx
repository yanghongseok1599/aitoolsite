'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface AdminGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export function AdminGuard({ children, redirectTo = '/' }: AdminGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    // Check if user has admin role
    const userRole = (session?.user as any)?.role
    if (userRole !== 'admin') {
      router.push(redirectTo)
    }
  }, [status, session, router, redirectTo])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  const userRole = (session?.user as any)?.role
  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">접근 권한이 없습니다</h1>
          <p className="text-gray-600 mb-4">관리자만 접근할 수 있는 페이지입니다.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            메인으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
