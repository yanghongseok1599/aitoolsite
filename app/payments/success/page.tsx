'use client'

import { Suspense } from 'react'
import { DashboardHeader } from '@/components/DashboardHeader'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isVerifying, setIsVerifying] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const orderId = searchParams?.get('orderId')
  const paymentKey = searchParams?.get('paymentKey')
  const amount = searchParams?.get('amount')

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderId || !paymentKey || !amount) {
        setError('결제 정보가 올바르지 않습니다.')
        setIsVerifying(false)
        return
      }

      // 이미 처리 중이면 중복 실행 방지
      if (isProcessing) {
        return
      }

      // localStorage에서 이미 처리된 결제인지 확인
      const processedPayments = JSON.parse(localStorage.getItem('processedPayments') || '[]')

      if (processedPayments.includes(paymentKey)) {
        // 이미 처리된 결제는 바로 성공 처리
        setIsVerifying(false)
        return
      }

      setIsProcessing(true)

      try {
        // 결제 승인 API 호출
        const response = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId,
            paymentKey,
            amount: parseInt(amount),
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          // 이미 처리된 결제 오류인 경우 성공으로 처리
          if (data.error && data.error.includes('기존 요청을 처리중')) {
            // localStorage에 처리 완료 표시
            processedPayments.push(paymentKey)
            localStorage.setItem('processedPayments', JSON.stringify(processedPayments))
            setIsVerifying(false)
            return
          }
          throw new Error(data.error || '결제 승인 실패')
        }

        // 성공한 경우 localStorage에 저장
        processedPayments.push(paymentKey)
        localStorage.setItem('processedPayments', JSON.stringify(processedPayments))

        setIsVerifying(false)
      } catch (error: any) {
        console.error('Payment verification error:', error)
        setError(error.message || '결제 승인 중 오류가 발생했습니다.')
        setIsVerifying(false)
      }
    }

    verifyPayment()
  }, [])

  if (isVerifying) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-6">
            <svg
              className="animate-spin w-8 h-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            결제 확인 중...
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            잠시만 기다려주세요.
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            결제 확인 실패
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {error}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/products')}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              상품 목록으로
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              홈으로 가기
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-6">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          결제가 완료되었습니다!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          구매해주셔서 감사합니다. 이제 모든 프리미엄 기능을 사용하실 수 있습니다.
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
          <div className="space-y-3 text-left">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">주문번호</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">결제금액</span>
              <span className="font-bold text-gray-900 dark:text-gray-100">
                ₩{parseInt(amount || '0').toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            대시보드로 이동
          </button>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-6">
          <svg
            className="animate-spin w-8 h-8 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          로딩 중...
        </h1>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <DashboardHeader />
      <Suspense fallback={<LoadingFallback />}>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  )
}
