'use client'

import { useState } from 'react'
import { DashboardHeader } from '@/components/DashboardHeader'

interface Tool {
  id: string
  name: string
  category: string
  description: string
  rating: number
  users: string
  price: string
  matchScore: number
  tags: string[]
  image: string
}

export default function RecommendationsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const recommendations: Tool[] = [
    {
      id: '1',
      name: 'ChatGPT Plus',
      category: 'AI 대화',
      description: '가장 강력한 대화형 AI로 글쓰기, 코딩, 분석 등 다양한 작업을 지원합니다.',
      rating: 4.8,
      users: '100M+',
      price: '$20/월',
      matchScore: 95,
      tags: ['글쓰기', '코딩', '분석', '번역'],
      image: '🤖'
    },
    {
      id: '2',
      name: 'Midjourney',
      category: '이미지 생성',
      description: '고품질 AI 이미지 생성 도구로 텍스트만으로 놀라운 이미지를 만들 수 있습니다.',
      rating: 4.7,
      users: '15M+',
      price: '$10/월',
      matchScore: 92,
      tags: ['디자인', '아트', '마케팅'],
      image: '🎨'
    },
    {
      id: '3',
      name: 'GitHub Copilot',
      category: '코드 작성',
      description: 'AI 기반 코드 자동완성으로 개발 생산성을 극대화합니다.',
      rating: 4.6,
      users: '5M+',
      price: '$10/월',
      matchScore: 88,
      tags: ['개발', '코딩', '자동화'],
      image: '💻'
    },
    {
      id: '4',
      name: 'Notion AI',
      category: '생산성',
      description: '노션 내에서 AI를 활용한 글쓰기, 요약, 번역 기능을 제공합니다.',
      rating: 4.5,
      users: '30M+',
      price: '$10/월',
      matchScore: 85,
      tags: ['생산성', '글쓰기', '정리'],
      image: '📝'
    },
    {
      id: '5',
      name: 'ElevenLabs',
      category: '음성 생성',
      description: '자연스러운 AI 음성 생성 및 음성 복제 기술을 제공합니다.',
      rating: 4.7,
      users: '2M+',
      price: '$5/월',
      matchScore: 82,
      tags: ['음성', '오디오', '더빙'],
      image: '🎙️'
    },
    {
      id: '6',
      name: 'Runway',
      category: '비디오 편집',
      description: 'AI 기반 비디오 편집 및 생성 도구로 전문가 수준의 영상을 만들 수 있습니다.',
      rating: 4.6,
      users: '3M+',
      price: '$12/월',
      matchScore: 80,
      tags: ['비디오', '편집', '특수효과'],
      image: '🎬'
    }
  ]

  const categories = ['all', 'AI 대화', '이미지 생성', '코드 작성', '생산성', '음성 생성', '비디오 편집']

  const filteredTools = selectedCategory === 'all'
    ? recommendations
    : recommendations.filter(tool => tool.category === selectedCategory)

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'AI 대화': '💬',
      '이미지 생성': '🎨',
      '코드 작성': '💻',
      '생산성': '📊',
      '음성 생성': '🎙️',
      '비디오 편집': '🎬'
    }
    return icons[category] || '⭐'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            AI 도구 추천
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            사용 패턴을 기반으로 맞춤형 AI 도구를 추천받으세요
          </p>
        </div>

        {/* Match Score Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-6 text-white">
          <h2 className="text-2xl font-bold mb-2">
            당신에게 딱 맞는 AI 도구를 찾았습니다
          </h2>
          <p className="text-white/90 mb-4">
            사용 패턴과 선호도를 분석하여 {filteredTools.length}개의 추천 도구를 찾았습니다
          </p>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <div className="text-sm text-white/80">평균 매칭률</div>
              <div className="text-2xl font-bold">
                {(filteredTools.reduce((sum, t) => sum + t.matchScore, 0) / filteredTools.length).toFixed(0)}%
              </div>
            </div>
            <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <div className="text-sm text-white/80">추천 도구</div>
              <div className="text-2xl font-bold">{filteredTools.length}개</div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {cat === 'all' ? '전체' : `${getCategoryIcon(cat)} ${cat}`}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTools.map(tool => (
            <div
              key={tool.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center text-3xl">
                  {tool.image}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {tool.name}
                    </h3>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-xs font-semibold text-green-600 dark:text-green-400 rounded">
                      {tool.matchScore}% 매칭
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tool.category}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {tool.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {tool.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-1">평점</p>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {tool.rating}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-1">사용자</p>
                  <p className="font-bold text-gray-900 dark:text-gray-100">{tool.users}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-1">가격</p>
                  <p className="font-bold text-gray-900 dark:text-gray-100">{tool.price}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  자세히 보기
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  북마크 추가
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Popular Categories */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            인기 카테고리
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.filter(c => c !== 'all').map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors text-center"
              >
                <div className="text-4xl mb-2">{getCategoryIcon(cat)}</div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {cat}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
