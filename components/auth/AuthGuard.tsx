'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export function AuthGuard({ children, redirectTo = '/login' }: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(redirectTo)
    }
  }, [status, router, redirectTo])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return <>{children}</>
}
