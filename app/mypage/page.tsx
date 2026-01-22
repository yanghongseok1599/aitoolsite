'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface Subscription {
  planId: string
  billingCycle: 'monthly' | 'yearly'
  status: 'active' | 'cancelled' | 'expired'
  amount: number
  startDate: string
  nextBillingDate: string
  trialEndDate: string | null
  cancelledAt?: string
  card?: {
    cardCompany: string
    cardNumber: string
  } | null
}

export default function MyPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [plan, setPlan] = useState<string>('free')
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/billing/subscribe')
        const data = await response.json()
        if (response.ok) {
          setSubscription(data.subscription)
          setPlan(data.plan)
        }
      } catch (error) {
        console.error('Failed to fetch subscription:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchSubscription()
    } else {
      setLoading(false)
    }
  }, [session])

  const handleCancelSubscription = async () => {
    if (!confirm('정말로 구독을 취소하시겠습니까?\n취소 후에도 현재 결제 기간 종료일까지 서비스를 이용하실 수 있습니다.')) {
      return
    }

    setCancelling(true)
    try {
      const response = await fetch('/api/billing/cancel', {
        method: 'POST',
      })
      const data = await response.json()

      if (response.ok) {
        alert(data.message)
        // 구독 상태 새로고침
        const subResponse = await fetch('/api/billing/subscribe')
        const subData = await subResponse.json()
        setSubscription(subData.subscription)
        setPlan(subData.plan)
      } else {
        alert(data.error || '구독 취소에 실패했습니다.')
      }
    } catch (error) {
      console.error('Cancel subscription error:', error)
      alert('구독 취소 중 오류가 발생했습니다.')
    } finally {
      setCancelling(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateStr))
  }

  const quickActions = [
    {
      title: '내 정보 관리',
      description: '프로필 정보를 수정합니다',
      href: '/mypage/profile',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    },
    {
      title: '결제 내역',
      description: '결제 내역을 확인합니다',
      href: '/mypage/orders',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
    },
    {
      title: '설정',
      description: '알림 및 계정 설정',
      href: '/mypage/settings',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
    }
  ]

  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-700"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {session?.user?.name || '사용자'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {session?.user?.email}
            </p>
            <div className="mt-2 flex items-center gap-3">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                plan === 'pro'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}>
                {plan === 'pro' ? 'Pro' : '무료'} 플랜
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Card */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            구독 관리
          </h3>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <div className="w-8 h-8 border-2 border-blue-200 dark:border-blue-900 border-t-blue-600 rounded-full animate-spin mx-auto" />
          </div>
        ) : subscription && subscription.status === 'active' ? (
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    프로 플랜
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded">
                    활성
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {subscription.billingCycle === 'yearly' ? '연간' : '월간'} 구독 · ₩{subscription.amount.toLocaleString()}/{subscription.billingCycle === 'yearly' ? '년' : '월'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">다음 결제일</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {formatDate(subscription.nextBillingDate)}
                </p>
              </div>
            </div>

            {subscription.card && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">결제 수단</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {subscription.card.cardCompany} {subscription.card.cardNumber}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => router.push('/products')}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                플랜 변경
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={cancelling}
                className="px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium disabled:opacity-50"
              >
                {cancelling ? '처리 중...' : '구독 취소'}
              </button>
            </div>
          </div>
        ) : subscription && subscription.status === 'cancelled' ? (
          <div className="p-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">구독이 취소되었습니다</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    {formatDate(subscription.nextBillingDate)}까지 프로 기능을 이용하실 수 있습니다.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push('/products/pro')}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-semibold"
            >
              다시 구독하기
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                무료 플랜 사용 중
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                프로 플랜으로 업그레이드하고 모든 기능을 이용하세요
              </p>
              <button
                onClick={() => router.push('/products')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-semibold"
              >
                프로 플랜 시작하기
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <button
            key={action.href}
            onClick={() => router.push(action.href)}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={action.icon}
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {action.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {action.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
