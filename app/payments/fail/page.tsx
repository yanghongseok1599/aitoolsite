'use client'

import { DashboardHeader } from '@/components/DashboardHeader'
import { useRouter, useSearchParams } from 'next/navigation'

export default function PaymentFailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const message = searchParams?.get('message') || '결제에 실패했습니다.'
  const code = searchParams?.get('code')

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <DashboardHeader />
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full mb-6">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            결제 실패
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {message}
          </p>

          {code && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">오류 코드: </span>
                <span className="font-mono text-gray-900 dark:text-gray-100">{code}</span>
              </div>
            </div>
          )}

          <div className="space-y-4 mb-8">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              결제 중 문제가 발생했습니다. 다음 사항을 확인해주세요:
            </p>
            <ul className="text-sm text-left max-w-md mx-auto space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                <span>카드 정보가 정확한지 확인해주세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                <span>카드 한도가 충분한지 확인해주세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                <span>인터넷 연결이 안정적인지 확인해주세요</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/products')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              다시 시도하기
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              홈으로 가기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
