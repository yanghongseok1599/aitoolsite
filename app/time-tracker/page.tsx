'use client'

import { useState, useEffect } from 'react'
import { DashboardHeader } from '@/components/DashboardHeader'
import { useSession } from 'next-auth/react'

interface TimeEntry {
  id: string
  taskName: string
  category: string
  startTime: Date
  endTime?: Date
  duration: number
  isRunning: boolean
}

export default function TimeTrackerPage() {
  const { data: session } = useSession()
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [currentTask, setCurrentTask] = useState<TimeEntry | null>(null)
  const [newTaskName, setNewTaskName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('AI 도구 사용')
  const [currentTime, setCurrentTime] = useState(Date.now())

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('time-tracker-entries')
    if (saved) {
      const parsed = JSON.parse(saved)
      setEntries(parsed.map((e: any) => ({
        ...e,
        startTime: new Date(e.startTime),
        endTime: e.endTime ? new Date(e.endTime) : undefined
      })))
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('time-tracker-entries', JSON.stringify(entries))
    }
  }, [entries])

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}시간 ${minutes % 60}분`
    } else if (minutes > 0) {
      return `${minutes}분 ${seconds % 60}초`
    } else {
      return `${seconds}초`
    }
  }

  const startTracking = () => {
    if (!newTaskName.trim()) {
      alert('작업 이름을 입력해주세요')
      return
    }

    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      taskName: newTaskName,
      category: selectedCategory,
      startTime: new Date(),
      duration: 0,
      isRunning: true
    }

    setCurrentTask(newEntry)
    setEntries(prev => [newEntry, ...prev])
    setNewTaskName('')
  }

  const stopTracking = () => {
    if (!currentTask) return

    const endTime = new Date()
    const duration = endTime.getTime() - currentTask.startTime.getTime()

    setEntries(prev => prev.map(entry =>
      entry.id === currentTask.id
        ? { ...entry, endTime, duration, isRunning: false }
        : entry
    ))
    setCurrentTask(null)
  }

  const deleteEntry = (id: string) => {
    if (confirm('이 기록을 삭제하시겠습니까?')) {
      setEntries(prev => prev.filter(e => e.id !== id))
      if (currentTask?.id === id) {
        setCurrentTask(null)
      }
    }
  }

  const getCurrentDuration = () => {
    if (!currentTask) return 0
    return currentTime - currentTask.startTime.getTime()
  }

  const getTotalDuration = () => {
    return entries.reduce((total, entry) => {
      if (entry.isRunning && entry.id === currentTask?.id) {
        return total + getCurrentDuration()
      }
      return total + entry.duration
    }, 0)
  }

  const getTodayDuration = () => {
    const today = new Date().setHours(0, 0, 0, 0)
    return entries
      .filter(e => new Date(e.startTime).setHours(0, 0, 0, 0) === today)
      .reduce((total, entry) => {
        if (entry.isRunning && entry.id === currentTask?.id) {
          return total + getCurrentDuration()
        }
        return total + entry.duration
      }, 0)
  }

  const categories = ['AI 도구 사용', '회의', '개발', '학습', '기획', '기타']

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            작업 시간 추적
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            AI 도구 사용 시간을 자동으로 추적하고 생산성을 분석하세요
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                오늘 작업 시간
              </h3>
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {formatDuration(getTodayDuration())}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                총 작업 시간
              </h3>
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {formatDuration(getTotalDuration())}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                총 작업 수
              </h3>
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {entries.length}
            </div>
          </div>
        </div>

        {/* Timer Control */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {currentTask ? '진행 중인 작업' : '새 작업 시작'}
          </h2>

          {currentTask ? (
            <div className="space-y-4">
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {currentTask.taskName}
                  </h3>
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                    {currentTask.category}
                  </span>
                </div>
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {formatDuration(getCurrentDuration())}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  시작: {currentTask.startTime.toLocaleTimeString('ko-KR')}
                </p>
              </div>
              <button
                onClick={stopTracking}
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                중지
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  작업 이름
                </label>
                <input
                  type="text"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="예: ChatGPT로 블로그 글 작성"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  onKeyPress={(e) => e.key === 'Enter' && startTracking()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  카테고리
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={startTracking}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                시작
              </button>
            </div>
          )}
        </div>

        {/* Recent Entries */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              작업 기록
            </h2>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {entries.length === 0 ? (
              <div className="p-12 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400">
                  아직 기록된 작업이 없습니다
                </p>
              </div>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {entry.taskName}
                        </h3>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-xs font-medium text-gray-700 dark:text-gray-300 rounded">
                          {entry.category}
                        </span>
                        {entry.isRunning && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-xs font-medium text-blue-600 dark:text-blue-400 rounded">
                            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                            진행 중
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <p>
                          시작: {new Date(entry.startTime).toLocaleString('ko-KR')}
                        </p>
                        {entry.endTime && (
                          <p>
                            종료: {new Date(entry.endTime).toLocaleString('ko-KR')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {entry.isRunning && entry.id === currentTask?.id
                          ? formatDuration(getCurrentDuration())
                          : formatDuration(entry.duration)
                        }
                      </div>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
