'use client'

import { ThemeToggle } from './ThemeToggle'

export function Header() {
  return (
    <header className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              AI 도구 허브
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
              기능
            </a>
            <a href="#how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
              사용방법
            </a>
            <a href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
              요금제
            </a>
          </nav>

          {/* CTA & Theme Toggle */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg bg-primary hover:bg-blue-600 text-white font-medium transition-colors">
              시작하기
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
