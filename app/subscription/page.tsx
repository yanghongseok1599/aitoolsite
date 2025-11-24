'use client'

import { useState } from 'react'
import { DashboardHeader } from '@/components/DashboardHeader'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Subscription {
  id: string
  service: string
  plan: string
  price: number
  billingCycle: 'monthly' | 'annual'
  nextBillingDate: Date
  status: 'active' | 'cancelled' | 'expired'
  autoRenew: boolean
}

export default function SubscriptionPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'annual'>('monthly')

  const subscriptions: Subscription[] = [
    {
      id: '1',
      service: 'ChatGPT Plus',
      plan: 'Plus',
      price: 20,
      billingCycle: 'monthly',
      nextBillingDate: new Date('2025-12-24'),
      status: 'active',
      autoRenew: true
    },
    {
      id: '2',
      service: 'Midjourney',
      plan: 'Basic',
      price: 10,
      billingCycle: 'monthly',
      nextBillingDate: new Date('2025-12-15'),
      status: 'active',
      autoRenew: true
    },
    {
      id: '3',
      service: 'GitHub Copilot',
      plan: 'Individual',
      price: 10,
      billingCycle: 'monthly',
      nextBillingDate: new Date('2025-12-20'),
      status: 'active',
      autoRenew: false
    }
  ]

  const monthlyTotal = subscriptions
    .filter(s => s.status === 'active' && s.billingCycle === 'monthly')
    .reduce((sum, s) => sum + s.price, 0)

  const annualTotal = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + (s.billingCycle === 'monthly' ? s.price * 12 : s.price), 0)

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      expired: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
    }
    const labels = {
      active: '활성',
      cancelled: '해지됨',
      expired: '만료됨'
    }
    return { class: badges[status as keyof typeof badges], label: labels[status as keyof typeof labels] }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            AI 구독 관리
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            모든 AI 도구 구독을 한 곳에서 관리하세요
          </p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Monthly Balance */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold opacity-90">월간 구독료</h3>
              <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-4xl font-bold mb-2">
              ${session ? monthlyTotal : 0}
            </div>
            <p className="text-sm text-white/80">
              {session ? `${subscriptions.filter(s => s.status === 'active' && s.billingCycle === 'monthly').length}개의 월간 구독` : '로그인하여 구독을 확인하세요'}
            </p>
          </div>

          {/* Annual Balance */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold opacity-90">연간 예상 비용</h3>
              <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-4xl font-bold mb-2">
              ${session ? annualTotal : 0}
            </div>
            <p className="text-sm text-white/80">
              {session ? `현재 활성 구독 기준` : '로그인하여 구독을 확인하세요'}
            </p>
          </div>
        </div>

        {/* Main Content */}
        {!session ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                구독 관리를 시작하세요
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                로그인하고 모든 AI 도구 구독을 한눈에 관리하세요.<br />
                비용 절감과 효율적인 구독 관리가 가능합니다.
              </p>
              <button
                onClick={() => router.push('/login')}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                로그인해서 구독관리 시작하기
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    활성 구독
                  </h3>
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {subscriptions.filter(s => s.status === 'active').length}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    다음 결제일
                  </h3>
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {new Date(Math.min(...subscriptions.filter(s => s.status === 'active').map(s => s.nextBillingDate.getTime()))).getDate()}일
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    자동 갱신
                  </h3>
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {subscriptions.filter(s => s.status === 'active' && s.autoRenew).length}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    월 평균 비용
                  </h3>
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  ${monthlyTotal}
                </div>
              </div>
            </div>

            {/* Subscriptions List */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  구독 목록
                </h2>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {subscriptions.map(sub => {
                  const statusBadge = getStatusBadge(sub.status)
                  return (
                    <div key={sub.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              {sub.service}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-semibold rounded ${statusBadge.class}`}>
                              {statusBadge.label}
                            </span>
                            {sub.autoRenew && (
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-xs font-semibold text-blue-600 dark:text-blue-400 rounded flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                자동갱신
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {sub.plan} 플랜 • {sub.billingCycle === 'monthly' ? '월간' : '연간'} 구독
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            ${sub.price}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            / {sub.billingCycle === 'monthly' ? '월' : '년'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            다음 결제: {formatDate(sub.nextBillingDate)}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                            상세보기
                          </button>
                          <button className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                            구독 취소
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Add New Subscription */}
            <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">새로운 구독 추가하기</h3>
                  <p className="text-white/90">
                    AI 도구 구독을 추가하고 한눈에 관리하세요
                  </p>
                </div>
                <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  구독 추가
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
