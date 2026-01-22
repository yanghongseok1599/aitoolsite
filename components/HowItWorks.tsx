'use client'

const steps = [
  {
    number: '01',
    title: 'Google 계정으로 로그인',
    description: 'Google OAuth로 간편하게 로그인하세요. 구글 캘린더 연동을 위해 권한을 허용해주세요.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    gradient: 'from-blue-400 to-indigo-500'
  },
  {
    number: '02',
    title: 'AI 도구 추가',
    description: '자주 사용하는 AI 도구의 URL과 이름을 입력하세요. 카테고리를 만들어 체계적으로 정리할 수 있습니다.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
    gradient: 'from-green-400 to-emerald-500'
  },
  {
    number: '03',
    title: '드래그로 쉽게 정리',
    description: '북마크와 카테고리를 드래그 앤 드롭으로 자유롭게 배치하세요. 위젯 순서도 변경 가능합니다.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    ),
    gradient: 'from-purple-400 to-violet-500'
  },
  {
    number: '04',
    title: '일정과 메모 관리',
    description: '구글 캘린더로 일정을 확인하고, 메모 기능으로 중요한 내용을 기록하세요. 모든 데이터는 클라우드에 자동 저장됩니다.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    gradient: 'from-orange-400 to-red-500'
  }
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-32 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-relaxed">
            간단한 4단계로
            <span className="block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mt-2">
              바로 시작하세요
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            0에서 완벽한 정리까지 2분이면 충분합니다
          </p>
        </div>

        {/* Steps - Updated Style */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="group relative p-6 rounded-2xl bg-white dark:bg-gray-800/60 backdrop-blur-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
                  {/* Step Number Badge */}
                  <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br ${step.gradient} text-white flex items-center justify-center font-bold text-sm shadow-lg`}>
                    {step.number}
                  </div>

                  <div className="flex items-start gap-4">
                    {/* Circular Icon with Gradient */}
                    <div className={`flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 text-white`}>
                      {step.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
