'use client'

import { useState, useEffect } from 'react'
import { DashboardHeader } from '@/components/DashboardHeader'

interface CalendarEvent {
  id: string
  summary: string
  start: string
  end: string
  description?: string
  color?: string
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')

  useEffect(() => {
    // TODO: Google Calendar API 연동
    // 현재는 샘플 데이터 사용
    const sampleEvents: CalendarEvent[] = [
      {
        id: '1',
        summary: '팀 회의',
        start: '2024-01-20T10:00:00',
        end: '2024-01-20T11:00:00',
        description: '주간 팀 미팅',
        color: 'blue'
      },
      {
        id: '2',
        summary: '프로젝트 마감',
        start: '2024-01-20T14:00:00',
        end: '2024-01-20T15:00:00',
        description: '클라이언트 제출',
        color: 'red'
      },
      {
        id: '3',
        summary: '점심 약속',
        start: '2024-01-20T12:30:00',
        end: '2024-01-20T13:30:00',
        description: '거래처 미팅',
        color: 'green'
      },
      {
        id: '4',
        summary: '디자인 리뷰',
        start: '2024-01-21T15:00:00',
        end: '2024-01-21T16:30:00',
        description: 'UI/UX 디자인 검토',
        color: 'purple'
      },
      {
        id: '5',
        summary: '고객 미팅',
        start: '2024-01-22T10:00:00',
        end: '2024-01-22T11:30:00',
        description: '신규 프로젝트 논의',
        color: 'blue'
      },
      {
        id: '6',
        summary: '개발자 회의',
        start: '2024-01-23T14:00:00',
        end: '2024-01-23T15:00:00',
        description: '기술 스택 논의',
        color: 'orange'
      }
    ]

    setTimeout(() => {
      setEvents(sampleEvents)
      setLoading(false)
    }, 500)
  }, [])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    })
  }

  const getColorClass = (color?: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500 border-blue-600'
      case 'red':
        return 'bg-red-500 border-red-600'
      case 'green':
        return 'bg-green-500 border-green-600'
      case 'purple':
        return 'bg-purple-500 border-purple-600'
      case 'orange':
        return 'bg-orange-500 border-orange-600'
      default:
        return 'bg-gray-500 border-gray-600'
    }
  }

  const getEventsByDate = () => {
    const grouped: { [key: string]: CalendarEvent[] } = {}
    events.forEach(event => {
      const dateKey = new Date(event.start).toDateString()
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(event)
    })
    return grouped
  }

  const eventsByDate = getEventsByDate()
  const sortedDates = Object.keys(eventsByDate).sort((a, b) =>
    new Date(a).getTime() - new Date(b).getTime()
  )

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                캘린더
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                일정을 확인하고 관리하세요
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setView('month')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    view === 'month'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  월
                </button>
                <button
                  onClick={() => setView('week')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    view === 'week'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  주
                </button>
                <button
                  onClick={() => setView('day')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    view === 'day'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  일
                </button>
              </div>

              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                새 일정 추가
              </button>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Google Calendar 연동 준비 중
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  현재 샘플 데이터가 표시되고 있습니다. Google Calendar API 연동 후 실제 일정을 확인하실 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              등록된 일정이 없습니다
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              새로운 일정을 추가해보세요
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              일정 추가하기
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedDates.map((dateKey) => (
              <div key={dateKey} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-750 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {formatDate(dateKey)}
                  </h2>
                </div>
                <div className="p-6 space-y-3">
                  {eventsByDate[dateKey].map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-750 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer border-l-4"
                      style={{ borderLeftColor: `var(--${event.color}-500)` }}
                    >
                      <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-1.5 ${getColorClass(event.color)}`}></div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 dark:text-gray-100">
                            {event.summary}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatTime(event.start)} - {formatTime(event.end)}
                          </span>
                        </div>
                        {event.description && (
                          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            {event.description}
                          </p>
                        )}
                      </div>

                      <div className="flex-shrink-0 flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
