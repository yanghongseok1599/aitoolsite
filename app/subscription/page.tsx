'use client'

import { useState, useEffect, useCallback } from 'react'
import { DashboardHeader } from '@/components/DashboardHeader'
import { SubscriptionModal } from '@/components/SubscriptionModal'
import { GmailScanModal } from '@/components/GmailScanModal'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Subscription {
  id: string
  service: string
  plan: string
  price: number
  currency: string
  billingCycle: 'monthly' | 'annual' | 'weekly'
  nextBillingDate: string | null
  startDate: string
  category: string
  icon: string | null
  url: string | null
  autoRenew: boolean
  status: 'active' | 'cancelled' | 'expired'
  notes: string
  source: 'manual' | 'gmail'
  createdAt: string
  updatedAt: string
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  KRW: '₩',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
}

export default function SubscriptionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showGmailModal, setShowGmailModal] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'cancelled'>('all')
  const [sortBy, setSortBy] = useState<'price' | 'date' | 'name'>('date')

  // Fetch subscriptions
  const fetchSubscriptions = useCallback(async () => {
    if (!session?.user) return

    try {
      const response = await fetch('/api/subscriptions')
      const data = await response.json()

      if (response.ok) {
        setSubscriptions(data.subscriptions || [])
      }
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error)
    } finally {
      setLoading(false)
    }
  }, [session?.user])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSubscriptions()
    } else if (status === 'unauthenticated') {
      setLoading(false)
    }
  }, [status, fetchSubscriptions])

  // Add subscription
  const handleAddSubscription = async (data: Partial<Subscription>) => {
    const response = await fetch('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      await fetchSubscriptions()
    } else {
      throw new Error('Failed to add subscription')
    }
  }

  // Edit subscription
  const handleEditSubscription = async (data: Partial<Subscription>) => {
    if (!editingSubscription) return

    const response = await fetch('/api/subscriptions', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingSubscription.id, ...data }),
    })

    if (response.ok) {
      await fetchSubscriptions()
    } else {
      throw new Error('Failed to update subscription')
    }
  }

  // Delete subscription
  const handleDeleteSubscription = async (id: string) => {
    if (!confirm('정말로 이 구독을 삭제하시겠습니까?')) return

    const response = await fetch(`/api/subscriptions?id=${id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      await fetchSubscriptions()
    }
  }

  // Toggle status
  const handleToggleStatus = async (subscription: Subscription) => {
    const newStatus = subscription.status === 'active' ? 'cancelled' : 'active'

    const response = await fetch('/api/subscriptions', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: subscription.id, status: newStatus }),
    })

    if (response.ok) {
      await fetchSubscriptions()
    }
  }

  // Import from Gmail
  const handleImportFromGmail = async (scannedSubs: Array<{
    service: string
    category: string
    icon: string
    price: number
    currency: string
    billingCycle: string
  }>) => {
    for (const sub of scannedSubs) {
      await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: sub.service,
          category: sub.category,
          icon: sub.icon,
          price: sub.price,
          currency: sub.currency,
          billingCycle: sub.billingCycle,
          source: 'gmail',
        }),
      })
    }
    await fetchSubscriptions()
  }

  // Calculate totals
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active')

  const monthlyTotal = activeSubscriptions.reduce((sum, s) => {
    let monthlyPrice = s.price
    if (s.billingCycle === 'annual') monthlyPrice = s.price / 12
    if (s.billingCycle === 'weekly') monthlyPrice = s.price * 4

    // Convert to USD for display (simplified)
    if (s.currency === 'KRW') monthlyPrice = monthlyPrice / 1300
    if (s.currency === 'EUR') monthlyPrice = monthlyPrice * 1.1
    if (s.currency === 'GBP') monthlyPrice = monthlyPrice * 1.27

    return sum + monthlyPrice
  }, 0)

  const annualTotal = monthlyTotal * 12

  // Filter and sort
  const filteredSubscriptions = subscriptions
    .filter(s => filter === 'all' || s.status === filter)
    .sort((a, b) => {
      if (sortBy === 'price') return b.price - a.price
      if (sortBy === 'name') return a.service.localeCompare(b.service)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const formatCurrency = (price: number, currency: string) => {
    const symbol = CURRENCY_SYMBOLS[currency] || ''
    if (currency === 'KRW' || currency === 'JPY') {
      return `${symbol}${Math.round(price).toLocaleString()}`
    }
    return `${symbol}${price.toFixed(2)}`
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateStr))
  }

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

  const getDaysUntilBilling = (dateStr: string | null) => {
    if (!dateStr) return null
    const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return diff
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              구독 관리
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              모든 AI 도구 및 서비스 구독을 한 곳에서 관리하세요
            </p>
          </div>
          {session && (
            <div className="flex gap-3">
              <button
                onClick={() => setShowGmailModal(true)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                </svg>
                Gmail에서 찾기
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                수동 추가
              </button>
            </div>
          )}
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Monthly Balance */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold opacity-90">월간 구독료</h3>
              <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-4xl font-bold mb-2">
              ${session ? monthlyTotal.toFixed(0) : 0}
            </div>
            <p className="text-sm text-white/80">
              {session ? `${activeSubscriptions.length}개의 활성 구독` : '로그인하여 구독을 확인하세요'}
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
              ${session ? annualTotal.toFixed(0) : 0}
            </div>
            <p className="text-sm text-white/80">
              {session ? '현재 활성 구독 기준' : '로그인하여 구독을 확인하세요'}
            </p>
          </div>

          {/* Next Payment */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold opacity-90">다음 결제</h3>
              <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            {session && activeSubscriptions.length > 0 ? (
              <>
                {(() => {
                  const upcoming = activeSubscriptions
                    .filter(s => s.nextBillingDate)
                    .sort((a, b) => new Date(a.nextBillingDate!).getTime() - new Date(b.nextBillingDate!).getTime())[0]

                  if (!upcoming) return <p className="text-sm text-white/80">결제 예정 없음</p>

                  const days = getDaysUntilBilling(upcoming.nextBillingDate)
                  return (
                    <>
                      <div className="text-4xl font-bold mb-2">
                        {days !== null ? (days <= 0 ? '오늘' : `${days}일`) : '-'}
                      </div>
                      <p className="text-sm text-white/80">
                        {upcoming.service} - {formatCurrency(upcoming.price, upcoming.currency)}
                      </p>
                    </>
                  )
                })()}
              </>
            ) : (
              <>
                <div className="text-4xl font-bold mb-2">-</div>
                <p className="text-sm text-white/80">
                  {session ? '구독 정보 없음' : '로그인하여 확인하세요'}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        {status === 'loading' || loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 rounded-full animate-spin" />
              <p className="mt-4 text-gray-500 dark:text-gray-400">로딩 중...</p>
            </div>
          </div>
        ) : !session ? (
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
                Gmail 연동으로 구독을 자동으로 찾아드립니다.
              </p>
              <button
                onClick={() => router.push('/login')}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                로그인해서 시작하기
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex gap-2">
                {[
                  { value: 'all', label: '전체' },
                  { value: 'active', label: '활성' },
                  { value: 'cancelled', label: '해지됨' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value as typeof filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === option.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {option.label}
                    {option.value === 'all' && ` (${subscriptions.length})`}
                    {option.value === 'active' && ` (${subscriptions.filter(s => s.status === 'active').length})`}
                    {option.value === 'cancelled' && ` (${subscriptions.filter(s => s.status === 'cancelled').length})`}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">정렬:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm"
                >
                  <option value="date">최근 추가순</option>
                  <option value="price">가격순</option>
                  <option value="name">이름순</option>
                </select>
              </div>
            </div>

            {/* Subscriptions List */}
            {filteredSubscriptions.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {filter === 'all' ? '아직 구독이 없습니다' : '해당하는 구독이 없습니다'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {filter === 'all' ? 'Gmail에서 자동으로 찾거나 수동으로 추가해보세요.' : '다른 필터를 선택해보세요.'}
                </p>
                {filter === 'all' && (
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => setShowGmailModal(true)}
                      className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                      </svg>
                      Gmail에서 찾기
                    </button>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      수동 추가
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredSubscriptions.map(sub => {
                    const statusBadge = getStatusBadge(sub.status)
                    const daysUntil = getDaysUntilBilling(sub.nextBillingDate)

                    return (
                      <div key={sub.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                            {sub.icon || '📦'}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                {sub.service}
                              </h3>
                              <span className={`px-2 py-0.5 text-xs font-semibold rounded ${statusBadge.class}`}>
                                {statusBadge.label}
                              </span>
                              {sub.source === 'gmail' && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded flex items-center gap-1">
                                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                                  </svg>
                                  Gmail
                                </span>
                              )}
                              {sub.autoRenew && sub.status === 'active' && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                  </svg>
                                  자동갱신
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {sub.plan} 플랜 • {sub.category} • {sub.billingCycle === 'monthly' ? '월간' : sub.billingCycle === 'annual' ? '연간' : '주간'}
                            </p>
                            {sub.nextBillingDate && sub.status === 'active' && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                다음 결제: {formatDate(sub.nextBillingDate)}
                                {daysUntil !== null && daysUntil <= 7 && daysUntil >= 0 && (
                                  <span className="ml-1 text-orange-600 dark:text-orange-400 font-medium">
                                    ({daysUntil === 0 ? '오늘' : `${daysUntil}일 후`})
                                  </span>
                                )}
                              </p>
                            )}
                            {sub.notes && (
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
                                {sub.notes}
                              </p>
                            )}
                          </div>

                          {/* Price */}
                          <div className="text-right flex-shrink-0">
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                              {formatCurrency(sub.price, sub.currency)}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              / {sub.billingCycle === 'monthly' ? '월' : sub.billingCycle === 'annual' ? '년' : '주'}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => {
                                setEditingSubscription(sub)
                                setShowEditModal(true)
                              }}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                              title="수정"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleToggleStatus(sub)}
                              className={`p-2 rounded-lg transition-colors ${
                                sub.status === 'active'
                                  ? 'text-gray-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/30'
                                  : 'text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30'
                              }`}
                              title={sub.status === 'active' ? '해지' : '재활성화'}
                            >
                              {sub.status === 'active' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteSubscription(sub.id)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                              title="삭제"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Category Summary */}
            {activeSubscriptions.length > 0 && (
              <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                  카테고리별 비용
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {Object.entries(
                    activeSubscriptions.reduce((acc, sub) => {
                      const cat = sub.category || 'Other'
                      if (!acc[cat]) acc[cat] = { count: 0, total: 0 }
                      acc[cat].count++
                      let monthlyPrice = sub.price
                      if (sub.billingCycle === 'annual') monthlyPrice = sub.price / 12
                      if (sub.billingCycle === 'weekly') monthlyPrice = sub.price * 4
                      if (sub.currency === 'KRW') monthlyPrice = monthlyPrice / 1300
                      acc[cat].total += monthlyPrice
                      return acc
                    }, {} as Record<string, { count: number; total: number }>)
                  ).map(([category, data]) => (
                    <div key={category} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {category}
                      </p>
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                        ${data.total.toFixed(0)}/월
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {data.count}개 구독
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <SubscriptionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddSubscription}
        mode="add"
      />

      <SubscriptionModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingSubscription(null)
        }}
        onSave={handleEditSubscription}
        subscription={editingSubscription}
        mode="edit"
      />

      <GmailScanModal
        isOpen={showGmailModal}
        onClose={() => setShowGmailModal(false)}
        onImport={handleImportFromGmail}
      />
    </div>
  )
}
