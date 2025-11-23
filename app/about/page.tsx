'use client'

import { DashboardHeader } from '@/components/DashboardHeader'

export default function AboutPage() {
  const coreValues = [
    {
      title: '신뢰성',
      description: '검증된 AI 도구만을 엄선하여 사용자에게 제공합니다',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: '효율성',
      description: '업무 생산성 향상을 위한 최적화된 도구 관리 시스템',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: '접근성',
      description: '누구나 쉽게 사용할 수 있는 직관적인 인터페이스',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      title: '지속성',
      description: '끊임없는 업데이트와 개선을 통한 서비스 품질 유지',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    }
  ]

  const timeline = [
    { year: '2019', event: 'AI 도구 허브 설립' },
    { year: '2020', event: '사용자 1만명 돌파' },
    { year: '2021', event: '모바일 앱 출시' },
    { year: '2022', event: '기업용 서비스 런칭' },
    { year: '2023', event: '사용자 10만명 돌파' },
    { year: '2024', event: '글로벌 시장 진출' }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-6">
        {/* Page Header */}
        <div className="py-16 lg:py-24 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            회사소개
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            신뢰할 수 있는 AI 도구 관리 플랫폼
          </p>
        </div>

        {/* Company Overview */}
        <div className="py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              전문적인 AI 도구 관리 솔루션
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              AI 도구 허브는 2019년 설립 이후 개인과 기업에게 최적화된 AI 도구 관리 플랫폼을 제공하고 있습니다.
              50+ 전문가로 구성된 팀이 지속적으로 서비스를 개선하고 있으며, 현재 10만+ 사용자가 활용하고 있습니다.
            </p>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">2019</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">설립연도</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">50+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">전문 인력</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">10만+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">사용자</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-96 flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-600">회사 이미지</span>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="py-16 lg:py-24 grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">미션</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              모든 사용자가 AI 기술을 쉽고 효율적으로 활용할 수 있도록
              신뢰할 수 있는 도구 관리 플랫폼을 제공합니다.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">비전</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              AI 도구 관리 분야의 선도 기업으로 성장하여
              글로벌 시장에서 표준이 되는 플랫폼을 구축합니다.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="py-16 lg:py-24">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-12 text-center">
            핵심 가치
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white mb-4">
                  {value.icon}
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {value.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="py-16 lg:py-24">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-12 text-center">
            연혁
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {item.year.slice(-2)}
                    </div>
                    {index !== timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-2"></div>
                    )}
                  </div>
                  <div className="pb-8">
                    <div className="font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {item.year}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {item.event}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
