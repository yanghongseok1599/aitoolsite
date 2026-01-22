'use client'

import { DashboardHeader } from '@/components/DashboardHeader'
import { TossPaymentButton } from '@/components/TossPaymentButton'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface ProductDetail {
  id: string
  name: string
  description: string
  price: number
  yearlyPrice: number
  features: string[]
  detailedFeatures: {
    category: string
    items: string[]
  }[]
  specifications: {
    label: string
    value: string
  }[]
  popular?: boolean
}

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const productId = params?.id as string

  const billingParam = searchParams?.get('billing')
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('monthly')

  useEffect(() => {
    if (billingParam === 'yearly') {
      setSelectedPeriod('yearly')
    }
  }, [billingParam])

  const products: Record<string, ProductDetail> = {
    free: {
      id: 'free',
      name: '무료',
      description: '가볍게 AI 도구를 정리하고 싶은 개인 사용자를 위한 기본 플랜입니다.',
      price: 0,
      yearlyPrice: 0,
      features: [
        'AI 도구 북마크 30개',
        '카테고리 3개',
        '메모 10개',
        '구독 관리 5개',
        '기본 검색',
        '다크 모드'
      ],
      detailedFeatures: [
        {
          category: '북마크 관리',
          items: [
            '최대 30개 AI 도구 북마크 저장',
            '3개 카테고리 생성 및 관리',
            '북마크 제목 및 URL 편집',
            '파비콘 자동 감지'
          ]
        },
        {
          category: '메모 기능',
          items: [
            '최대 10개 메모 작성',
            '간단한 텍스트 메모',
            '메모 검색'
          ]
        },
        {
          category: '구독 관리',
          items: [
            '최대 5개 구독 서비스 등록',
            '월/연간 비용 계산',
            '다음 결제일 알림'
          ]
        },
        {
          category: '사용자 경험',
          items: [
            '다크 모드 지원',
            '반응형 디자인',
            '모바일 웹 접근'
          ]
        }
      ],
      specifications: [
        { label: 'AI 도구 북마크', value: '최대 30개' },
        { label: '카테고리', value: '최대 3개' },
        { label: '메모', value: '최대 10개' },
        { label: '구독 관리', value: '최대 5개' },
        { label: 'Google 캘린더 연동', value: '-' },
        { label: 'Gmail 구독 스캔', value: '-' },
        { label: '데이터 내보내기', value: '-' },
        { label: '고객 지원', value: '커뮤니티' }
      ]
    },
    pro: {
      id: 'pro',
      name: '프로',
      description: 'AI 도구를 본격적으로 활용하는 파워 유저를 위한 프리미엄 플랜입니다. 무제한 저장과 고급 기능으로 생산성을 극대화하세요.',
      price: 4900,
      yearlyPrice: 49000,
      features: [
        '무제한 AI 도구 북마크',
        '무제한 카테고리',
        '무제한 메모',
        '무제한 구독 관리',
        'Google 캘린더 연동',
        'Gmail 구독 스캔',
        '고급 검색 및 필터',
        '데이터 내보내기',
        '우선 이메일 지원'
      ],
      detailedFeatures: [
        {
          category: '북마크 관리',
          items: [
            '무제한 AI 도구 북마크 저장',
            '무제한 카테고리 생성',
            '드래그 앤 드롭으로 순서 변경',
            '북마크 태그 기능',
            '즐겨찾기 표시',
            '고급 검색 및 필터'
          ]
        },
        {
          category: '메모 기능',
          items: [
            '무제한 메모 작성',
            '리치 텍스트 편집',
            '메모 폴더 관리',
            '메모 검색 및 필터'
          ]
        },
        {
          category: '구독 관리',
          items: [
            '무제한 구독 서비스 등록',
            'Gmail 자동 스캔으로 구독 찾기',
            '월/연간 비용 분석',
            '카테고리별 비용 리포트',
            '결제일 알림'
          ]
        },
        {
          category: 'Google 연동',
          items: [
            'Google 캘린더 일정 연동',
            '대시보드에서 일정 확인',
            'Gmail 구독 내역 스캔'
          ]
        },
        {
          category: '데이터 관리',
          items: [
            'CSV/JSON 데이터 내보내기',
            '북마크 일괄 가져오기',
            '데이터 백업'
          ]
        },
        {
          category: '지원',
          items: [
            '우선 이메일 지원',
            '48시간 내 응답 보장',
            '신규 기능 우선 액세스'
          ]
        }
      ],
      specifications: [
        { label: 'AI 도구 북마크', value: '무제한' },
        { label: '카테고리', value: '무제한' },
        { label: '메모', value: '무제한' },
        { label: '구독 관리', value: '무제한' },
        { label: 'Google 캘린더 연동', value: '포함' },
        { label: 'Gmail 구독 스캔', value: '포함' },
        { label: '데이터 내보내기', value: '포함' },
        { label: '고객 지원', value: '우선 이메일 (48시간 내)' }
      ],
      popular: true
    }
  }

  const product = products[productId]

  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <DashboardHeader />
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              상품을 찾을 수 없습니다
            </h1>
            <button
              onClick={() => router.push('/products')}
              className="text-blue-600 hover:text-blue-700"
            >
              요금제 페이지로 돌아가기
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 무료 플랜은 바로 대시보드로
  if (product.id === 'free') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <DashboardHeader />
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            무료 플랜
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            지금 바로 무료로 시작하세요!
          </p>
          <button
            onClick={() => {
              if (session) {
                router.push('/dashboard')
              } else {
                router.push('/login')
              }
            }}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            {session ? '대시보드로 이동' : '로그인하고 시작하기'}
          </button>
        </div>
      </div>
    )
  }

  const displayPrice = selectedPeriod === 'yearly'
    ? Math.round(product.yearlyPrice / 12)
    : product.price
  const totalYearlyPrice = product.yearlyPrice

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            홈
          </button>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <button
            onClick={() => router.push('/products')}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            요금제
          </button>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 dark:text-gray-100">{product.name}</span>
        </nav>

        {/* Product Header */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left - Product Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                {product.name} 플랜
              </h1>
              {product.popular && (
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  추천
                </span>
              )}
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              {product.description}
            </p>

            {/* Key Features */}
            <div className="space-y-3 mb-8">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">포함된 기능</h3>
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Pricing Card */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white dark:bg-gray-800 border-2 border-blue-600 dark:border-blue-500 rounded-2xl p-8 shadow-xl">
              {/* Period Toggle */}
              <div className="flex items-center justify-center gap-2 mb-6 bg-gray-100 dark:bg-gray-700 p-1.5 rounded-xl">
                <button
                  onClick={() => setSelectedPeriod('monthly')}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
                    selectedPeriod === 'monthly'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  월간
                </button>
                <button
                  onClick={() => setSelectedPeriod('yearly')}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    selectedPeriod === 'yearly'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  연간
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                    17% 할인
                  </span>
                </button>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-gray-900 dark:text-gray-100">
                    ₩{displayPrice.toLocaleString()}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">/월</span>
                </div>
                {selectedPeriod === 'yearly' && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    연 ₩{totalYearlyPrice.toLocaleString()} 청구
                  </p>
                )}
                {selectedPeriod === 'monthly' && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                    연간 결제 시 17% 할인
                  </p>
                )}
              </div>

              {/* CTA Button */}
              <TossPaymentButton
                productId={product.id}
                productName={product.name}
                amount={selectedPeriod === 'yearly' ? totalYearlyPrice : product.price}
                period={selectedPeriod}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-bold text-lg mb-4 shadow-lg shadow-blue-500/25"
              />

              <div className="space-y-2 text-center text-sm text-gray-500 dark:text-gray-400">
                <p>7일 무료 체험 포함</p>
                <p>언제든지 취소 가능</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            상세 기능
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.detailedFeatures.map((section, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {section.category}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 text-blue-600 flex-shrink-0 mt-1"
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
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Specifications */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            스펙 비교
          </h2>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <table className="w-full">
              <tbody>
                {product.specifications.map((spec, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700/50' : ''}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 w-1/2">
                      {spec.label}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            자주 묻는 질문
          </h2>
          <div className="space-y-4 max-w-3xl">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                무료 체험은 어떻게 진행되나요?
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                결제 수단을 등록하면 7일 무료 체험이 시작됩니다. 체험 기간 동안 모든 프로 기능을 사용할 수 있으며, 체험 기간 종료 3일 전에 이메일로 알림을 보내드립니다.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                구독을 취소하면 어떻게 되나요?
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                마이페이지에서 언제든 구독을 취소할 수 있습니다. 취소 후에도 결제 기간 종료일까지 프로 기능을 계속 사용할 수 있습니다. 이후 무료 플랜으로 자동 전환됩니다.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                환불이 가능한가요?
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                결제 후 7일 이내이며 서비스를 실질적으로 사용하지 않은 경우 전액 환불이 가능합니다. 마이페이지에서 환불을 요청하실 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            지금 프로 플랜을 시작하세요
          </h2>
          <p className="text-xl text-white/80 mb-8">
            7일 무료 체험으로 모든 기능을 경험해보세요
          </p>
          <TossPaymentButton
            productId={product.id}
            productName={product.name}
            amount={selectedPeriod === 'yearly' ? totalYearlyPrice : product.price}
            period={selectedPeriod}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors font-bold text-lg"
          />
        </div>
      </main>
    </div>
  )
}
