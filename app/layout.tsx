import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SessionProvider } from '@/components/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI 도구 허브 - 스마트한 AI 도구 관리',
  description: '자주 사용하는 AI 도구들을 카테고리별로 정리하고 언제 어디서나 빠르게 접근하세요. 영구 무료.',
  keywords: 'AI 도구, 북마크 관리, 생산성, 정리, AI 에이전트, 도구 관리',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider defaultTheme="light">
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
