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
    if (amount === 0) {
      router.push('/')
      return
    }

    setIsLoading(true)

    try {
      // 주문 ID 생성
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // 결제 데이터 준비
      const paymentData = {
        amount,
        orderId,
        orderName: `${productName} - ${period === 'monthly' ? '월간' : '연간'} 구독`,
        customerName: session.user?.name || '데모 사용자',
        customerEmail: session.user?.email || 'demo@example.com',
        productId,
        period
      }

      // 토스페이먼츠 SDK 동적 로드
      const script = document.createElement('script')
      script.src = 'https://js.tosspayments.com/v1/payment'
      script.async = true

      script.onload = () => {
        // 데모용 클라이언트 키 (토스페이먼츠 공개 테스트 키)
        const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq'

        const tossPayments = (window as any).TossPayments(clientKey)

        // 결제창 호출
        tossPayments.requestPayment('카드', {
          amount: amount,
          orderId: orderId,
          orderName: paymentData.orderName,
          customerName: paymentData.customerName,
          customerEmail: paymentData.customerEmail,
          successUrl: `${window.location.origin}/payments/success`,
          failUrl: `${window.location.origin}/payments/fail`,
        }).catch((error: any) => {
          if (error.code === 'USER_CANCEL') {
            alert('결제를 취소하셨습니다.')
          } else if (error.code === 'INVALID_CARD_COMPANY') {
            alert('유효하지 않은 카드입니다.')
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

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? '처리 중...' : (amount === 0 ? '무료로 시작하기' : '구매하기')}
    </button>
  )
}
