'use client'

import { useState } from 'react'
import { DashboardHeader } from '@/components/DashboardHeader'

interface Resource {
  id: string
  title: string
  type: 'video' | 'article' | 'course' | 'tutorial'
  category: string
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  description: string
  thumbnail: string
  views: string
  rating: number
}

export default function LearningPage() {
  const [selectedType, setSelectedType] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  const resources: Resource[] = [
    {
      id: '1',
      title: 'ChatGPT 완벽 가이드 - 초보자편',
      type: 'video',
      category: 'AI 대화',
      duration: '45분',
      difficulty: 'beginner',
      description: 'ChatGPT의 기본 사용법부터 고급 프롬프트 기법까지 배울 수 있는 완벽한 가이드',
      thumbnail: '🎥',
      views: '125K',
      rating: 4.8
    },
    {
      id: '2',
      title: '효과적인 AI 프롬프트 작성법',
      type: 'article',
      category: 'AI 대화',
      duration: '15분',
      difficulty: 'intermediate',
      description: 'AI로부터 원하는 답변을 얻기 위한 프롬프트 엔지니어링 기법',
      thumbnail: '📄',
      views: '89K',
      rating: 4.7
    },
    {
      id: '3',
      title: 'Midjourney 마스터 클래스',
      type: 'course',
      category: '이미지 생성',
      duration: '3시간',
      difficulty: 'intermediate',
      description: '전문가 수준의 AI 이미지를 생성하는 방법을 단계별로 학습',
      thumbnail: '🎓',
      views: '67K',
      rating: 4.9
    },
    {
      id: '4',
      title: 'GitHub Copilot으로 생산성 10배 높이기',
      type: 'tutorial',
      category: '코드 작성',
      duration: '30분',
      difficulty: 'intermediate',
      description: 'AI 코딩 어시스턴트를 활용한 효율적인 개발 방법',
      thumbnail: '💡',
      views: '145K',
      rating: 4.6
    },
    {
      id: '5',
      title: 'AI 도구 활용한 마케팅 자동화',
      type: 'course',
      category: '비즈니스',
      duration: '2시간',
      difficulty: 'advanced',
      description: '다양한 AI 도구를 활용하여 마케팅 업무를 자동화하는 전략',
      thumbnail: '🎓',
      views: '54K',
      rating: 4.7
    },
    {
      id: '6',
      title: 'Stable Diffusion 설치 및 사용법',
      type: 'tutorial',
      category: '이미지 생성',
      duration: '1시간',
      difficulty: 'beginner',
      description: '로컬에서 Stable Diffusion을 설치하고 사용하는 방법',
      thumbnail: '💡',
      views: '98K',
      rating: 4.5
    }
  ]

  const types = ['all', 'video', 'article', 'course', 'tutorial']
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced']

  const filteredResources = resources.filter(resource => {
    const typeMatch = selectedType === 'all' || resource.type === selectedType
    const difficultyMatch = selectedDifficulty === 'all' || resource.difficulty === selectedDifficulty
    return typeMatch && difficultyMatch
  })

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'video': '동영상',
      'article': '아티클',
      'course': '강의',
      'tutorial': '튜토리얼'
    }
    return labels[type] || type
  }

  const getDifficultyLabel = (difficulty: string) => {
    const labels: { [key: string]: string } = {
      'beginner': '초급',
      'intermediate': '중급',
      'advanced': '고급'
    }
    return labels[difficulty] || difficulty
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors: { [key: string]: string } = {
      'beginner': 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      'intermediate': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      'advanced': 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
    }
    return colors[difficulty] || ''
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            학습 리소스
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            AI 도구 활용법과 최신 트렌드를 학습하세요
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                전체 리소스
              </h3>
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {resources.length}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                동영상 강의
              </h3>
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {resources.filter(r => r.type === 'video').length}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                코스
              </h3>
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {resources.filter(r => r.type === 'course').length}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                평균 평점
              </h3>
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {(resources.reduce((sum, r) => sum + r.rating, 0) / resources.length).toFixed(1)}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                유형
              </label>
              <div className="flex flex-wrap gap-2">
                {types.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedType === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {type === 'all' ? '전체' : getTypeLabel(type)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                난이도
              </label>
              <div className="flex flex-wrap gap-2">
                {difficulties.map(difficulty => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedDifficulty === difficulty
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {difficulty === 'all' ? '전체' : getDifficultyLabel(difficulty)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => (
            <div
              key={resource.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center text-6xl">
                {resource.thumbnail}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-xs font-medium text-blue-600 dark:text-blue-400 rounded">
                    {getTypeLabel(resource.type)}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(resource.difficulty)}`}>
                    {getDifficultyLabel(resource.difficulty)}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {resource.title}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {resource.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span>{resource.duration}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium">{resource.rating}</span>
                  </div>
                  <span>{resource.views} views</span>
                </div>

                <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  학습 시작
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-gray-600 dark:text-gray-400">
              선택한 조건에 맞는 리소스가 없습니다
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
