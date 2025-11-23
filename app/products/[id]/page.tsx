'use client'

import { DashboardHeader } from '@/components/DashboardHeader'
import { TossPaymentButton } from '@/components/TossPaymentButton'
import { useRouter, useParams } from 'next/navigation'
import { useState } from 'react'

interface ProductDetail {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
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
  recommended?: boolean
}

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params?.id as string

  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const products: Record<string, ProductDetail> = {
    basic: {
      id: 'basic',
      name: '기본형',
      description: '개인 사용자를 위한 필수 기능을 제공하는 기본 플랜입니다. AI 도구 북마크 관리를 시작하기에 적합합니다.',
      price: 0,
      features: [
        '북마크 20개 저장',
        '카테고리 5개',
        '기본 검색 기능',
        '다크 모드 지원',
        '모바일 앱 접근'
      ],
      detailedFeatures: [
        {
          category: '북마크 관리',
          items: [
            '최대 20개 AI 도구 북마크 저장',
            '5개 카테고리 생성 및 관리',
            '북마크 제목 및 URL 편집',
            '기본 아이콘 자동 감지'
          ]
        },
        {
          category: '검색 및 필터',
          items: [
            '키워드 기반 기본 검색',
            '카테고리별 필터링',
            '최근 추가 순 정렬'
          ]
        },
        {
          category: '사용자 경험',
          items: [
            '다크 모드 지원',
            '반응형 디자인',
            '모바일 웹 접근',
            '기본 사용자 지원'
          ]
        }
      ],
      specifications: [
        { label: '북마크 저장', value: '최대 20개' },
        { label: '카테고리', value: '최대 5개' },
        { label: '저장 용량', value: '10MB' },
        { label: '동시 접속 기기', value: '3대' },
        { label: '고객 지원', value: '이메일 지원' },
        { label: '데이터 백업', value: '주 1회' }
      ]
    },
    premium: {
      id: 'premium',
      name: '프리미엄',
      description: '전문가와 파워유저를 위한 고급 기능을 제공합니다. 무제한 북마크와 고급 검색으로 생산성을 극대화하세요.',
      price: 100,
      originalPrice: 200,
      features: [
        '무제한 북마크',
        '무제한 카테고리',
        '고급 검색 및 필터',
        '팀 협업 기능',
        '우선 고객 지원',
        '데이터 내보내기'
      ],
      detailedFeatures: [
        {
          category: '북마크 관리',
          items: [
            '무제한 AI 도구 북마크 저장',
            '무제한 카테고리 생성',
            '드래그 앤 드롭으로 순서 변경',
            '커스텀 아이콘 업로드',
            '북마크 태그 기능',
            '즐겨찾기 표시'
          ]
        },
        {
          category: '검색 및 필터',
          items: [
            '고급 키워드 검색',
            '다중 필터 조합',
            '태그 기반 검색',
            '날짜별 정렬',
            '사용 빈도 추적',
            '검색 기록 저장'
          ]
        },
        {
          category: '협업 기능',
          items: [
            '팀원 초대 (최대 5명)',
            '북마크 공유',
            '댓글 및 메모',
            '변경 이력 추적'
          ]
        },
        {
          category: '고급 기능',
          items: [
            'CSV/JSON 데이터 내보내기',
            'API 액세스',
            '브라우저 확장 프로그램',
            '우선 고객 지원 (24시간 이내 응답)',
            '일일 자동 백업'
          ]
        }
      ],
      specifications: [
        { label: '북마크 저장', value: '무제한' },
        { label: '카테고리', value: '무제한' },
        { label: '저장 용량', value: '100GB' },
        { label: '동시 접속 기기', value: '무제한' },
        { label: '팀 멤버', value: '최대 5명' },
        { label: '고객 지원', value: '우선 지원 (24시간 내)' },
        { label: '데이터 백업', value: '일 1회 자동' },
        { label: 'API 액세스', value: '포함' }
      ],
      popular: true
    },
    enterprise: {
      id: 'enterprise',
      name: '엔터프라이즈',
      description: '대규모 조직을 위한 완벽한 맞춤형 솔루션입니다. 전담 지원팀과 고급 보안 기능으로 안심하고 사용하세요.',
      price: 49900,
      features: [
        '프리미엄 모든 기능',
        '전담 계정 관리자',
        '맞춤형 통합 지원',
        '보안 강화 옵션',
        '온프레미스 배포',
        'SLA 보장',
        '교육 및 온보딩'
      ],
      detailedFeatures: [
        {
          category: '프리미엄 기능 포함',
          items: [
            '프리미엄 플랜의 모든 기능',
            '무제한 팀 멤버',
            '무제한 저장 용량'
          ]
        },
        {
          category: '엔터프라이즈 전용',
          items: [
            '전담 계정 관리자 배정',
            '맞춤형 온보딩 및 교육',
            '정기 비즈니스 리뷰',
            '우선 기능 요청 처리',
            '베타 기능 우선 액세스'
          ]
        },
        {
          category: '보안 및 규정 준수',
          items: [
            'SSO (Single Sign-On) 통합',
            'SAML 2.0 지원',
            '고급 권한 관리',
            '감사 로그',
            'GDPR 및 ISO 27001 준수',
            '데이터 암호화 (전송 및 저장)'
          ]
        },
        {
          category: '통합 및 배포',
          items: [
            'API 무제한 사용',
            '맞춤형 통합 개발',
            '온프레미스 배포 옵션',
            '전용 서버 호스팅',
            'Webhook 지원',
            'Slack/Teams 통합'
          ]
        },
        {
          category: '지원 및 SLA',
          items: [
            '24/7 전화 및 이메일 지원',
            '99.9% 가동 시간 SLA 보장',
            '1시간 이내 응답 시간',
            '월별 성능 리포트',
            '재해 복구 계획'
          ]
        }
      ],
      specifications: [
        { label: '북마크 저장', value: '무제한' },
        { label: '카테고리', value: '무제한' },
        { label: '저장 용량', value: '무제한' },
        { label: '동시 접속 기기', value: '무제한' },
        { label: '팀 멤버', value: '무제한' },
        { label: '고객 지원', value: '24/7 전담 지원' },
        { label: 'SLA', value: '99.9% 보장' },
        { label: '데이터 백업', value: '실시간 백업' },
        { label: 'API 액세스', value: '무제한' },
        { label: 'SSO', value: '포함' },
        { label: '온프레미스', value: '옵션 제공' }
      ],
      recommended: true
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
              상품 목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    )
  }

  const yearlyPrice = product.price * 12 * 0.8 // 20% 할인
  const displayPrice = selectedPeriod === 'monthly' ? product.price : Math.floor(yearlyPrice / 12)

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
            상품
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
                {product.name}
              </h1>
              {product.popular && (
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  인기
                </span>
              )}
              {product.recommended && (
                <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  추천
                </span>
              )}
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              {product.description}
            </p>

            {/* Key Features */}
            <div className="space-y-3 mb-8">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">주요 기능</h3>
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Pricing Card */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 shadow-lg">
              {/* Period Toggle */}
              {product.price > 0 && (
                <div className="flex items-center justify-center gap-3 mb-6">
                  <button
                    onClick={() => setSelectedPeriod('monthly')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedPeriod === 'monthly'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    월간
                  </button>
                  <button
                    onClick={() => setSelectedPeriod('yearly')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedPeriod === 'yearly'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    연간 <span className="text-xs">(20% 할인)</span>
                  </button>
                </div>
              )}

              {/* Price */}
              <div className="text-center mb-6">
                {product.originalPrice && (
                  <div className="text-gray-400 line-through text-lg mb-1">
                    ₩{product.originalPrice.toLocaleString()}
                  </div>
                )}
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-gray-900 dark:text-gray-100">
                    {displayPrice === 0 ? '무료' : `₩${displayPrice.toLocaleString()}`}
                  </span>
                  {displayPrice > 0 && (
                    <span className="text-gray-600 dark:text-gray-400">/월</span>
                  )}
                </div>
                {selectedPeriod === 'yearly' && product.price > 0 && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    연간 ₩{Math.floor(yearlyPrice).toLocaleString()} (월 ₩{Math.floor(yearlyPrice / 12).toLocaleString()})
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <TossPaymentButton
                productId={product.id}
                productName={product.name}
                amount={displayPrice}
                period={selectedPeriod}
                className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors font-bold text-lg mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              />

              {product.price > 0 && (
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  14일 무료 체험 • 언제든지 취소 가능
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            상세 기능
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {product.detailedFeatures.map((section, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {section.category}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
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
            상세 스펙
          </h2>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <table className="w-full">
              <tbody>
                {product.specifications.map((spec, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700/50' : ''}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 w-1/3">
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
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                플랜 변경은 언제든지 가능한가요?
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                네, 언제든지 플랜을 업그레이드하거나 다운그레이드할 수 있습니다. 변경 시 일할 계산되어 청구됩니다.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                환불 정책은 어떻게 되나요?
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                구매 후 7일 이내 전액 환불이 가능합니다. 단, 서비스를 실제로 사용한 경우 일할 계산되어 환불됩니다.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                무료 체험 기간이 끝나면 자동으로 결제되나요?
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                무료 체험 기간이 끝나기 3일 전에 이메일로 알림을 보내드립니다. 체험 기간 중 언제든지 취소할 수 있으며, 취소하지 않으면 자동으로 유료 플랜으로 전환됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {product.name} 플랜으로 시작하세요
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            {product.price === 0
              ? '지금 바로 무료로 시작하고 AI 도구를 체계적으로 관리하세요'
              : '14일 무료 체험으로 모든 기능을 경험해보세요'
            }
          </p>
          <TossPaymentButton
            productId={product.id}
            productName={product.name}
            amount={displayPrice}
            period={selectedPeriod}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </main>
    </div>
  )
}
