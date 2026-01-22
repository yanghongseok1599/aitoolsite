'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface TossPaymentButtonProps {
  productId: string
  productName: string
  amount: number
  period: 'monthly' | 'yearly'
  className?: string
}

declare global {
  interface Window {
    TossPayments: (clientKey: string) => {
      requestBillingAuth: (method: string, options: {
        customerKey: string
        successUrl: string
        failUrl: string
      }) => Promise<void>
      requestPayment: (method: string, options: {
        amount: number
        orderId: string
        orderName: string
        customerName: string
        customerEmail: string
        successUrl: string
        failUrl: string
      }) => Promise<void>
    }
  }
}

export function TossPaymentButton({
  productId,
  productName,
  amount,
  period,
  className = ''
}: TossPaymentButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handlePayment = async () => {
    // 로그인 확인
    if (!session) {
      alert('로그인이 필요합니다.')
      router.push('/login')
      return
    }

    // 무료 플랜인 경우
    if (amount === 0 || productId === 'free') {
      router.push('/dashboard')
      return
    }

    setIsLoading(true)

    try {
      // 고객 키 생성 (사용자 ID 기반)
      const customerKey = `customer_${session.user?.id || session.user?.email?.replace(/[^a-zA-Z0-9]/g, '_')}`

      // 토스페이먼츠 SDK 동적 로드
      const script = document.createElement('script')
      script.src = 'https://js.tosspayments.com/v1/payment'
      script.async = true

      script.onload = () => {
        const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq'
        const tossPayments = window.TossPayments(clientKey)

        // 빌링키 발급을 위한 카드 등록 요청
        tossPayments.requestBillingAuth('카드', {
          customerKey,
          successUrl: `${window.location.origin}/payments/billing-success?planId=${productId}&period=${period}`,
          failUrl: `${window.location.origin}/payments/fail`,
        }).catch((error: { code: string; message: string }) => {
          if (error.code === 'USER_CANCEL') {
            alert('결제를 취소하셨습니다.')
          } else {
            alert('결제 중 오류가 발생했습니다: ' + error.message)
          }
          setIsLoading(false)
        })
      }

      script.onerror = () => {
        alert('결제 시스템을 불러오는데 실패했습니다.')
        setIsLoading(false)
      }

      document.body.appendChild(script)

    } catch (error) {
      console.error('Payment error:', error)
      alert('결제 요청 중 오류가 발생했습니다.')
      setIsLoading(false)
    }
  }

  const getButtonText = () => {
    if (isLoading) return '처리 중...'
    if (amount === 0 || productId === 'free') return '무료로 시작하기'
    return '구독 시작하기'
  }

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className={className}
    >
      {getButtonText()}
    </button>
  )
}
