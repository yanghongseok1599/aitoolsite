'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { getUserEvents } from '@/lib/firestore'

interface CalendarEvent {
  id: string
  summary: string
  start: string
  end: string
  description?: string
}

export function CalendarWidget() {
  const { data: session } = useSession()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEvents = async () => {
      if (!session?.user?.email) {
        console.log('CalendarWidget - No session, skipping load')
        setLoading(false)
        return
      }

      try {
        console.log('CalendarWidget - Loading events, hasAccessToken:', !!session.accessToken)

        // Try to load from Google Calendar first
        if (session.accessToken) {
          console.log('CalendarWidget - Fetching from Google Calendar API')
          const response = await fetch('/api/calendar/events?type=upcoming')
          const data = await response.json()

          console.log('CalendarWidget - API response:', {
            status: response.status,
            success: data.success,
            eventsCount: data.events?.length || 0
          })

          if (response.ok && data.success) {
            console.log('CalendarWidget - Using Google Calendar events:', data.events.length)
            // Show up to 5 upcoming events
            setEvents(data.events?.slice(0, 5) || [])
            setLoading(false)
            return
          }
        } else {
          console.log('CalendarWidget - No access token, skipping Google Calendar')
        }

        // Fallback to Firestore
        console.log('CalendarWidget - Falling back to Firestore')
        const firestoreEvents = await getUserEvents(session.user.email)

        // Filter today's events
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const todayEvents = firestoreEvents.filter(event => {
          const eventDate = event.start.toDate()
          return eventDate >= today && eventDate < tomorrow
        })

        const formattedEvents = todayEvents.map(event => ({
          id: event.id,
          summary: event.summary,
          start: event.start.toDate().toISOString(),
          end: event.end.toDate().toISOString(),
          description: event.description,
        }))

        console.log('CalendarWidget - Using Firestore events:', formattedEvents.length)
        setEvents(formattedEvents)
      } catch (error) {
        console.error('CalendarWidget - Error loading events:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [session])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return '오늘'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return '내일'
    } else {
      return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            다가오는 일정
          </h3>
        </div>
        <Link
          href="/calendar"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          전체보기
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-600 dark:text-gray-400 text-sm">예정된 일정이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-2">
          {events.slice(0, 5).map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <div className="flex-shrink-0 w-12 text-center">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {formatDate(event.start)}
                </div>
                <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {formatTime(event.start)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {event.summary}
                </p>
                {event.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {event.description}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {events.length > 5 && (
        <div className="mt-4 text-center">
          <Link
            href="/calendar"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            +{events.length - 5}개 더보기
          </Link>
        </div>
      )}
    </div>
  )
}
