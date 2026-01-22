'use client'

import { DashboardHeader } from '@/components/DashboardHeader'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function ProductsPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleSubscribe = (productId: string) => {
    if (productId === 'free') {
      router.push(session ? '/dashboard' : '/login')
      return
    }
    router.push(`/products/${productId}?billing=${billingCycle}`)
  }

  const monthlyPrice = 4900
  const yearlyPrice = 49000
  const teamMonthlyPrice = 55000
  const teamYearlyPrice = 550000
  const displayPrice = billingCycle === 'yearly' ? Math.round(yearlyPrice / 12) : monthlyPrice
  const teamDisplayPrice = billingCycle === 'yearly' ? Math.round(teamYearlyPrice / 12) : teamMonthlyPrice

  const faqs = [
    {
      q: '무료 플랜으로 충분한가요?',
      a: '가볍게 AI 도구를 정리하고 싶은 분께는 무료 플랜으로도 충분합니다.'
    },
    {
      q: '언제든 취소할 수 있나요?',
      a: '네, 마이페이지에서 언제든 구독을 취소할 수 있습니다.'
    },
    {
      q: '환불이 가능한가요?',
      a: '결제 후 7일 이내 미사용 시 전액 환불이 가능합니다.'
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <DashboardHeader />

      <main className="max-w-5xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            요금제
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            필요한 만큼만 사용하세요
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 text-sm font-medium rounded-full transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              월간
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 text-sm font-medium rounded-full transition-all flex items-center gap-2 ${
                billingCycle === 'yearly'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              연간
              <span className="text-xs text-green-600 dark:text-green-400 font-semibold">-17%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-24">
          {/* Free Plan */}
          <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">무료</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">시작하기 좋은 기본 플랜</p>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">₩0</span>
            </div>

            <button
              onClick={() => handleSubscribe('free')}
              className="w-full py-3 px-4 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors mb-8"
            >
              무료로 시작
            </button>

            <ul className="space-y-3 text-sm">
              {['북마크 30개', '카테고리 3개', '메모 10개', '구독 관리 5개', '다크 모드'].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="border-2 border-gray-900 dark:border-white rounded-2xl p-8 relative">
            <div className="absolute -top-3 left-6">
              <span className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium px-3 py-1 rounded-full">
                추천
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">프로</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">모든 기능을 무제한으로</p>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                ₩{displayPrice.toLocaleString()}
              </span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">/월</span>
              {billingCycle === 'yearly' && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  연 ₩{yearlyPrice.toLocaleString()} 청구
                </p>
              )}
            </div>

            <button
              onClick={() => handleSubscribe('pro')}
              className="w-full py-3 px-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors mb-8"
            >
              프로 시작하기
            </button>

            <ul className="space-y-3 text-sm">
              {[
                '무제한 북마크',
                '무제한 카테고리',
                '무제한 메모',
                '무제한 구독 관리',
                'Google 캘린더 연동',
                'Gmail 구독 스캔',
                '데이터 내보내기',
                '우선 지원'
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Team Plan */}
          <div className="border border-purple-300 dark:border-purple-700 rounded-2xl p-8 relative bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/30 dark:to-gray-900">
            <div className="absolute -top-3 left-6">
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                팀/조직
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">팀</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">10인까지 함께 사용</p>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                ₩{teamDisplayPrice.toLocaleString()}
              </span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">/월</span>
              {billingCycle === 'yearly' && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  연 ₩{teamYearlyPrice.toLocaleString()} 청구
                </p>
              )}
            </div>

            <button
              onClick={() => handleSubscribe('team')}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all mb-8"
            >
              팀 플랜 시작하기
            </button>

            <ul className="space-y-3 text-sm">
              {[
                '최대 10명 멤버',
                '프로 플랜 모든 기능',
                '팀 공유 대시보드',
                '팀 공유 북마크',
                '팀 공유 메모',
                '멤버 권한 관리',
                '팀 활동 분석',
                '전담 지원'
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-24">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-10">
            기능 비교
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-4 gap-4 pb-4 border-b border-gray-200 dark:border-gray-800 text-sm font-medium">
              <div className="text-gray-500 dark:text-gray-400">기능</div>
              <div className="text-center text-gray-500 dark:text-gray-400">무료</div>
              <div className="text-center text-gray-900 dark:text-white">프로</div>
              <div className="text-center text-purple-600 dark:text-purple-400">팀</div>
            </div>
            {[
              { name: '북마크', free: '30개', pro: '무제한', team: '무제한' },
              { name: '카테고리', free: '3개', pro: '무제한', team: '무제한' },
              { name: '메모', free: '10개', pro: '무제한', team: '무제한' },
              { name: '구독 관리', free: '5개', pro: '무제한', team: '무제한' },
              { name: '캘린더 연동', free: '-', pro: '✓', team: '✓' },
              { name: 'Gmail 스캔', free: '-', pro: '✓', team: '✓' },
              { name: '데이터 내보내기', free: '-', pro: '✓', team: '✓' },
              { name: '팀 멤버', free: '-', pro: '-', team: '최대 10명' },
              { name: '공유 대시보드', free: '-', pro: '-', team: '✓' },
              { name: '멤버 권한 관리', free: '-', pro: '-', team: '✓' },
            ].map((row) => (
              <div key={row.name} className="grid grid-cols-4 gap-4 py-4 border-b border-gray-100 dark:border-gray-800 text-sm">
                <div className="text-gray-600 dark:text-gray-400">{row.name}</div>
                <div className="text-center text-gray-400 dark:text-gray-500">{row.free}</div>
                <div className="text-center text-gray-900 dark:text-white font-medium">{row.pro}</div>
                <div className="text-center text-purple-600 dark:text-purple-400 font-medium">{row.team}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-10">
            자주 묻는 질문
          </h2>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full py-5 flex items-center justify-between text-left"
                >
                  <span className="text-gray-900 dark:text-white font-medium">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <p className="pb-5 text-gray-500 dark:text-gray-400 text-sm">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
