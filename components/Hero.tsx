'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function Hero() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleStartClick = () => {
    if (session) {
      router.push('/dashboard')
    } else {
      router.push('/signup')
    }
  }

  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-6 py-3 mb-8 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20">
            <span className="text-base sm:text-lg font-semibold text-primary dark:text-blue-400">
              🎨 일잘러를 위한 나만의 작업실
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-relaxed">
            마이 AI 스튜디오
            <span className="block bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              나에게 맞춘 스마트 작업 공간
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto">
            AI 도구 관리, 일정, 메모, 작업 시간 추적까지. 생산성을 높이는 모든 기능을 하나의 공간에서.
            당신만의 최적화된 작업 환경을 만들어보세요.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={handleStartClick}
              className="w-full sm:w-auto px-8 py-4 rounded-lg bg-primary hover:bg-blue-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 text-center cursor-pointer"
            >
              {session ? 'MY STUDIO 시작하기' : '무료로 시작하기'}
            </button>
            <a
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold text-lg border border-gray-200 dark:border-gray-700 transition-all text-center"
            >
              대시보드 둘러보기
            </a>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium">영구 무료</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-700"></div>
            <div className="flex items-center">
              <span className="font-medium">카드 등록 불필요</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-700"></div>
            <div className="flex items-center">
              <span className="font-medium">2분 안에 시작</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
