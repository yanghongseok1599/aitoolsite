'use client'

const steps = [
  {
    number: '01',
    title: '계정 생성',
    description: 'Google이나 GitHub으로 몇 초 만에 가입하세요. 신용카드는 필요 없습니다.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  {
    number: '02',
    title: '도구 추가',
    description: 'URL만 붙여넣으면 아이콘과 상세정보를 자동으로 가져옵니다. 직접 업로드도 가능합니다.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    )
  },
  {
    number: '03',
    title: '정리 & 분류',
    description: '카테고리별로 도구를 그룹화하고, 드래그로 순서를 변경하며, 필요 없는 섹션은 접으세요.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    )
  },
  {
    number: '04',
    title: '어디서나 접근',
    description: '모든 기기에서 도구가 동기화됩니다. 어떤 브라우저에서도 클릭 한 번으로 접근하세요.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  }
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-32 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            간단한 4단계로
            <span className="block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              바로 시작하세요
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            0에서 완벽한 정리까지 2분이면 충분합니다
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector Line (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -z-10" />
                )}

                <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:shadow-xl transition-all duration-300">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
