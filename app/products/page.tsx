'use client'

import { DashboardHeader } from '@/components/DashboardHeader'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  features: string[]
  popular?: boolean
}

export default function ProductsPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const products: Product[] = [
    {
      id: 'basic',
      name: '기본형',
      description: '개인 사용자를 위한 필수 기능',
      price: 0,
      features: [
        '북마크 20개 저장',
        '카테고리 5개',
        '기본 검색 기능',
        '다크 모드 지원',
        '모바일 앱 접근'
      ]
    },
    {
      id: 'premium',
      name: '프리미엄',
      description: '고급 기능이 필요한 전문가용',
      price: 100,
      features: [
        '무제한 북마크',
        '무제한 카테고리',
        '고급 검색 및 필터',
        '팀 협업 기능',
        '우선 고객 지원',
        '데이터 내보내기'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: '엔터프라이즈',
      description: '대규모 조직을 위한 맞춤형 솔루션',
      price: 49900,
      features: [
        '프리미엄 모든 기능',
        '전담 계정 관리자',
        '맞춤형 통합 지원',
        '보안 강화 옵션',
        '온프레미스 배포',
        'SLA 보장',
        '교육 및 온보딩'
      ]
    }
  ]

  const comparisonFeatures = [
    { name: '북마크 저장', basic: '20개', premium: '무제한', enterprise: '무제한' },
    { name: '카테고리', basic: '5개', premium: '무제한', enterprise: '무제한' },
    { name: '검색 기능', basic: '기본', premium: '고급', enterprise: '고급' },
    { name: '팀 협업', basic: '', premium: '✓', enterprise: '✓' },
    { name: '우선 지원', basic: '', premium: '✓', enterprise: '✓' },
    { name: '데이터 내보내기', basic: '', premium: '✓', enterprise: '✓' },
    { name: '전담 관리자', basic: '', premium: '', enterprise: '✓' },
    { name: 'SLA 보장', basic: '', premium: '', enterprise: '✓' }
  ]

  const faqs = [
    {
      question: '무료 체험이 가능한가요?',
      answer: '프리미엄 플랜은 14일 무료 체험이 가능합니다. 신용카드 등록 없이 바로 시작할 수 있습니다.'
    },
    {
      question: '플랜 변경은 언제든지 가능한가요?',
      answer: '네, 언제든지 플랜을 업그레이드하거나 다운그레이드할 수 있습니다. 변경 시 일할 계산되어 청구됩니다.'
    },
    {
      question: '결제 방법은 무엇이 있나요?',
      answer: '신용카드, 체크카드, 계좌이체, 무통장입금을 지원합니다. 기업 고객은 별도 견적 문의가 가능합니다.'
    },
    {
      question: '환불 정책은 어떻게 되나요?',
      answer: '구매 후 7일 이내 전액 환불이 가능합니다. 단, 서비스를 실제로 사용한 경우 일할 계산되어 환불됩니다.'
    },
    {
      question: '엔터프라이즈 플랜은 어떻게 시작하나요?',
      answer: '엔터프라이즈 플랜은 맞춤형 견적이 필요합니다. 영업팀에 문의하시면 상세한 상담을 받으실 수 있습니다.'
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-6">
        {/* Page Header */}
        <div className="py-16 lg:py-24 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            상품 소개
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            사용 목적에 맞는 최적의 플랜을 선택하세요
          </p>
        </div>

        {/* Product Category Tabs */}
        <div className="py-8 border-b border-gray-200 dark:border-gray-800">
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setSelectedCategory('individual')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === 'individual'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              개인용
            </button>
            <button
              onClick={() => setSelectedCategory('business')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === 'business'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              비즈니스용
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="py-16 lg:py-24 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className={`bg-white dark:bg-gray-800 border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative ${
                product.popular
                  ? 'border-blue-600 dark:border-blue-500'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {product.popular && (
                <div className="absolute -top-3 right-6">
                  <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    인기
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {product.description}
              </p>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                    {product.price === 0 ? '무료' : `₩${product.price.toLocaleString()}`}
                  </span>
                  {product.price > 0 && (
                    <span className="text-gray-600 dark:text-gray-400">/월</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
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
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => router.push(`/products/${product.id}`)}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                자세히 보기
              </button>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="py-16 lg:py-24">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-12 text-center">
            플랜 비교
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-4 px-6 font-bold text-gray-900 dark:text-gray-100">
                    기능
                  </th>
                  <th className="text-center py-4 px-6 font-bold text-gray-900 dark:text-gray-100">
                    기본형
                  </th>
                  <th className="text-center py-4 px-6 font-bold text-gray-900 dark:text-gray-100">
                    프리미엄
                  </th>
                  <th className="text-center py-4 px-6 font-bold text-gray-900 dark:text-gray-100">
                    엔터프라이즈
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="py-4 px-6 text-gray-900 dark:text-gray-100">
                      {feature.name}
                    </td>
                    <td className="py-4 px-6 text-center text-gray-600 dark:text-gray-400">
                      {feature.basic || '-'}
                    </td>
                    <td className="py-4 px-6 text-center text-gray-600 dark:text-gray-400">
                      {feature.premium || '-'}
                    </td>
                    <td className="py-4 px-6 text-center text-gray-600 dark:text-gray-400">
                      {feature.enterprise || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-16 lg:py-24">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-12 text-center">
            자주 묻는 질문
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <p className="text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
