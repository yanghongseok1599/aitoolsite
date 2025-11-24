'use client'

import { useState, useEffect } from 'react'
import { DashboardHeader } from '@/components/DashboardHeader'
import { useSession } from 'next-auth/react'

interface ToolUsage {
  toolName: string
  category: string
  usageCount: number
  totalTime: number
  lastUsed: Date
}

export default function AnalyticsPage() {
  const { data: session } = useSession()
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week')
  const [toolUsage, setToolUsage] = useState<ToolUsage[]>([
    {
      toolName: 'ChatGPT',
      category: 'AI 대화',
      usageCount: 45,
      totalTime: 180 * 60 * 1000, // 3 hours
      lastUsed: new Date()
    },
    {
      toolName: 'Claude',
      category: 'AI 대화',
      usageCount: 32,
      totalTime: 120 * 60 * 1000, // 2 hours
      lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      toolName: 'Midjourney',
      category: '이미지 생성',
      usageCount: 15,
      totalTime: 90 * 60 * 1000, // 1.5 hours
      lastUsed: new Date(Date.now() - 5 * 60 * 60 * 1000)
    },
    {
      toolName: 'GitHub Copilot',
      category: '코드 작성',
      usageCount: 67,
      totalTime: 240 * 60 * 1000, // 4 hours
      lastUsed: new Date(Date.now() - 1 * 60 * 60 * 1000)
    }
  ])

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}시간 ${minutes}분`
    }
    return `${minutes}분`
  }

  const getTotalUsageCount = () => {
    return toolUsage.reduce((sum, tool) => sum + tool.usageCount, 0)
  }

  const getTotalTime = () => {
    return toolUsage.reduce((sum, tool) => sum + tool.totalTime, 0)
  }

  const getMostUsedTool = () => {
    if (toolUsage.length === 0) return null
    return toolUsage.reduce((prev, current) =>
      current.usageCount > prev.usageCount ? current : prev
    )
  }

  const getCategoryStats = () => {
    const stats: { [key: string]: { count: number; time: number } } = {}
    toolUsage.forEach(tool => {
      if (!stats[tool.category]) {
        stats[tool.category] = { count: 0, time: 0 }
      }
      stats[tool.category].count += tool.usageCount
      stats[tool.category].time += tool.totalTime
    })
    return Object.entries(stats).map(([category, data]) => ({
      category,
      ...data
    }))
  }

  const getTopTools = () => {
    return [...toolUsage].sort((a, b) => b.usageCount - a.usageCount).slice(0, 5)
  }

  const categoryColors: { [key: string]: string } = {
    'AI 대화': 'bg-blue-500',
    '이미지 생성': 'bg-purple-500',
    '코드 작성': 'bg-green-500',
    '음성 변환': 'bg-yellow-500',
    '비디오 편집': 'bg-red-500',
  }

  const mostUsed = getMostUsedTool()
  const categoryStats = getCategoryStats()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              AI 사용 통계
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              AI 도구 사용 패턴을 분석하고 생산성 인사이트를 확인하세요
            </p>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2">
            {['week', 'month', 'year'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  period === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {p === 'week' ? '주간' : p === 'month' ? '월간' : '연간'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                총 사용 횟수
              </h3>
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {getTotalUsageCount()}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              +12% vs 지난 주
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                총 사용 시간
              </h3>
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {formatDuration(getTotalTime())}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              +8% vs 지난 주
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                가장 많이 사용
              </h3>
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {mostUsed?.toolName || '-'}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {mostUsed?.usageCount}회 사용
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                평균 사용 시간
              </h3>
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {formatDuration(getTotalTime() / getTotalUsageCount())}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              per session
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Tools Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              상위 AI 도구
            </h2>
            <div className="space-y-4">
              {getTopTools().map((tool, index) => (
                <div key={tool.toolName}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {tool.toolName}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {tool.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-gray-100">
                        {tool.usageCount}회
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {formatDuration(tool.totalTime)}
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(tool.usageCount / getTopTools()[0].usageCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              카테고리별 사용 분포
            </h2>
            <div className="space-y-4">
              {categoryStats.map((stat) => {
                const percentage = (stat.count / getTotalUsageCount()) * 100
                return (
                  <div key={stat.category}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded ${categoryColors[stat.category] || 'bg-gray-500'}`} />
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {stat.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-gray-100">
                          {percentage.toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {stat.count}회
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${categoryColors[stat.category] || 'bg-gray-500'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Detailed Usage Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              상세 사용 기록
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    도구명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    카테고리
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    사용 횟수
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    총 시간
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    마지막 사용
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {toolUsage.map((tool) => (
                  <tr key={tool.toolName} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {tool.toolName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded">
                        {tool.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                      {tool.usageCount}회
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                      {formatDuration(tool.totalTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400 text-sm">
                      {tool.lastUsed.toLocaleString('ko-KR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
