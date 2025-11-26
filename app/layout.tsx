import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SessionProvider } from '@/components/SessionProvider'
import { AlertProvider } from '@/contexts/AlertContext'

const inter = Inter({ subsets: ['latin'] })

const siteUrl = "https://myaistudio.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "마이 AI 스튜디오 | 나에게 맞춘 스마트 작업 공간",
    template: "%s | 마이 AI 스튜디오",
  },
  description:
    "AI 도구 관리, 일정, 메모, 작업 시간 추적까지. 생산성을 높이는 모든 기능을 하나의 공간에서. 당신만의 최적화된 작업 환경을 만들어보세요.",
  alternates: {
    canonical: siteUrl,
    languages: { ko: `${siteUrl}/` },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "마이 AI 스튜디오 - 나에게 맞춘 스마트 작업 공간",
    description:
      "AI 도구 관리, 일정, 메모, 작업 시간 추적까지. 생산성을 높이는 모든 기능을 하나의 공간에서. 당신만의 최적화된 작업 환경을 만들어보세요.",
    siteName: "마이 AI 스튜디오",
    images: [
      {
        url: `${siteUrl}/open.png`,
        width: 1200,
        height: 630,
        alt: "마이 AI 스튜디오 - 나에게 맞춘 스마트 작업 공간",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "마이 AI 스튜디오 - 나에게 맞춘 스마트 작업 공간",
    description: "AI 도구 관리, 일정, 메모, 작업 시간 추적까지. 생산성을 높이는 모든 기능을 하나의 공간에서.",
    images: [`${siteUrl}/open.png`],
  },
  keywords: [
    "AI 도구",
    "북마크 관리",
    "AI 에이전트",
    "ChatGPT",
    "Claude",
    "Midjourney",
    "생산성 도구",
    "AI 도구 모음",
    "구글 캘린더 연동",
    "메모 앱",
    "도구 정리",
    "AI 허브"
  ],
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  category: "technology",
  verification: {
    google: "ULrbCZA1O6k1gKttO1b84SmVd_rFYYgGdWa0cPbZAIg",
    other: {
      "naver-site-verification": ["87fe080d0e26d4db862fcedbe706c3a7a65913da"],
    },
  },
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
            <AlertProvider>
              {children}
            </AlertProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
