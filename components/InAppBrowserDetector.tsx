'use client'

import { useEffect, useState } from 'react'

export function InAppBrowserDetector() {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

    // 인앱 브라우저 감지
    const inAppBrowserPatterns = [
      /KAKAOTALK/i,        // 카카오톡
      /NAVER/i,            // 네이버 앱
      /Instagram/i,        // 인스타그램
      /FBAN|FBAV/i,        // 페이스북
      /Twitter/i,          // 트위터
      /Line\//i,           // 라인
      /SamsungBrowser.*CrossApp/i, // 삼성 인터넷 인앱
      /BAND/i,             // 밴드
      /everytimeApp/i,     // 에브리타임
    ]

    const isInApp = inAppBrowserPatterns.some(pattern => pattern.test(userAgent))

    // WebView 감지 (Android)
    const isWebView = /wv/.test(userAgent) && /Android/.test(userAgent)

    setIsInAppBrowser(isInApp || isWebView)
  }, [])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert('링크가 복사되었습니다. 외부 브라우저에서 붙여넣기 해주세요.')
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = window.location.href
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('링크가 복사되었습니다. 외부 브라우저에서 붙여넣기 해주세요.')
    }
  }

  if (!isInAppBrowser || dismissed) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            외부 브라우저에서 열어주세요
          </h2>

          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            현재 앱 내 브라우저에서는 Google 로그인이 제한됩니다.
            Chrome, Safari 등 외부 브라우저에서 접속해주세요.
          </p>

          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              열기 방법:
            </p>
            <ul className="text-xs text-left text-gray-600 dark:text-gray-300 space-y-1">
              <li>• 카카오톡: 우측 하단 ⋯ → "다른 브라우저로 열기"</li>
              <li>• 인스타그램: 우측 상단 ⋯ → "브라우저에서 열기"</li>
              <li>• 또는 아래 버튼으로 링크 복사 후 브라우저에서 열기</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={copyToClipboard}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              링크 복사하기
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="w-full px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors text-sm"
            >
              그냥 계속하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
