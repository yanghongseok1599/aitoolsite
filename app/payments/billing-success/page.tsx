'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

function BillingSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()

  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [errorMessage, setErrorMessage] = useState('')

  const authKey = searchParams?.get('authKey')
  const customerKey = searchParams?.get('customerKey')
  const planId = searchParams?.get('planId')
  const period = searchParams?.get('period') as 'monthly' | 'yearly'

  useEffect(() => {
    if (!authKey || !customerKey || !session) return

    const processSubscription = async () => {
      try {
        // 1. 빌링키 발급
        const billingResponse = await fetch('/api/billing/issue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ authKey, customerKey }),
        })

        const billingData = await billingResponse.json()

        if (!billingResponse.ok) {
          throw new Error(billingData.error || '빌링키 발급 실패')
        }

        // 2. 구독 시작 (첫 결제)
        const subscribeResponse = await fetch('/api/billing/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId: planId || 'pro',
            billingCycle: period || 'monthly',
          }),
        })

        const subscribeData = await subscribeResponse.json()

        if (!subscribeResponse.ok) {
          throw new Error(subscribeData.error || '구독 처리 실패')
        }

        setStatus('success')

        // 3초 후 대시보드로 이동
        setTimeout(() => {
          router.push('/dashboard')
        }, 3000)

      } catch (error) {
        console.error('Subscription error:', error)
        setStatus('error')
        setErrorMessage(error instanceof Error ? error.message : '구독 처리 중 오류가 발생했습니다.')
      }
    }

    processSubscription()
  }, [authKey, customerKey, planId, period, session, router])

  if (status === 'processing') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 rounded-full animate-spin mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            구독 처리 중...
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            잠시만 기다려주세요.
          </p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            구독 처리 실패
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {errorMessage}
          </p>
          <button
            onClick={() => router.push('/products')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            다시 시도하기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          구독이 시작되었습니다!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          프로 플랜의 모든 기능을 이용하실 수 있습니다.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
          잠시 후 대시보드로 이동합니다...
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          대시보드로 이동
        </button>
      </div>
    </div>
  )
}

export default function BillingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 rounded-full animate-spin" />
      </div>
    }>
      <BillingSuccessContent />
    </Suspense>
  )
}
