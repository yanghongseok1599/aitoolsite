'use client'

import { ThemeToggle } from './ThemeToggle'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'

interface DashboardHeaderProps {
  onAddCategory?: () => void
}

export function DashboardHeader({ onAddCategory }: DashboardHeaderProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const baseNavigationItems = [
    { name: '홈', href: '/' },
    { name: 'MY STUDIO', href: '/dashboard' },
    {
      name: '기능',
      href: '#',
      submenu: [
        { name: '스마트 캘린더', href: '/calendar' },
        { name: '메모 & 노트', href: '/notes' },
        { name: '포모도로 타이머', href: '/pomodoro' },
        { name: '투두 리스트', href: '/todolist' },
      ]
    },
    { name: '요금제', href: '/products' }
  ]

  const navigationItems = session
    ? [...baseNavigationItems, { name: '마이페이지', href: '/mypage' }]
    : baseNavigationItems

  const [showSubmenu, setShowSubmenu] = useState<string | null>(null)

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-800/20 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              마이 AI 스튜디오
            </span>
          </a>

          {/* Navigation - Center */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              const hasSubmenu = 'submenu' in item && item.submenu

              if (hasSubmenu) {
                return (
                  <div
                    key={item.name}
                    className="relative group/submenu"
                    onMouseEnter={() => setShowSubmenu(item.name)}
                    onMouseLeave={() => setShowSubmenu(null)}
                  >
                    <button
                      className="font-medium transition-colors text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary flex items-center gap-1"
                    >
                      {item.name}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Submenu Dropdown */}
                    {showSubmenu === item.name && (
                      <>
                        {/* Invisible bridge to prevent menu from closing */}
                        <div className="absolute top-full left-0 w-56 h-2" />

                        <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                          {item.submenu.map((subItem: any) => (
                            <button
                              key={subItem.name}
                              onClick={() => {
                                router.push(subItem.href)
                                setShowSubmenu(null)
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              {subItem.name}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )
              }

              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.href)}
                  className={`font-medium transition-colors ${
                    isActive
                      ? 'text-primary dark:text-primary'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary'
                  }`}
                >
                  {item.name}
                </button>
              )
            })}
          </nav>

          {/* Actions - Right */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {/* User Menu */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold hover:scale-110 transition-transform"
                >
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span>{session.user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                  )}
                </button>

                {/* Dropdown Menu - Glassmorphism */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 backdrop-blur-xl bg-white/95 dark:bg-gray-800/95 rounded-lg shadow-xl border border-white/20 dark:border-gray-700/20 py-2 z-20">
                      <div className="px-4 py-2 border-b border-gray-200/50 dark:border-gray-700/50">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {session.user?.email}
                        </p>
                      </div>
                      <button
                        onClick={() => router.push('/mypage/profile')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        내 정보
                      </button>
                      <button
                        onClick={() => router.push('/mypage/orders')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        주문내역
                      </button>
                      <button
                        onClick={() => router.push('/mypage/settings')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        설정
                      </button>
                      <button
                        onClick={async () => {
                          setShowUserMenu(false)
                          await signOut({ callbackUrl: '/login', redirect: true })
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        로그아웃
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                >
                  로그인
                </button>
                <button
                  onClick={() => router.push('/signup')}
                  className="bg-white/20 hover:bg-white/30 dark:bg-gray-800/30 dark:hover:bg-gray-800/40 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 text-gray-900 dark:text-gray-100 font-medium px-4 py-2 rounded-lg transition-all shadow-sm"
                >
                  회원가입
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="도구 검색..."
              className="w-full px-4 py-2 pl-10 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  )
}
