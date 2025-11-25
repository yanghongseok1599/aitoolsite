'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface CalendarEvent {
  id: string
  summary: string
  start: string
  end: string
  description?: string
  location?: string
}

export function MonthlyCalendar() {
  const { data: session } = useSession()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [eventDays, setEventDays] = useState<number[]>([])
  const [monthEvents, setMonthEvents] = useState<CalendarEvent[]>([])
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  // Load events for current month
  useEffect(() => {
    const loadMonthEvents = async () => {
      if (!session?.user) {
        console.log('MonthlyCalendar - No session user')
        setEventDays([])
        return
      }

      try {
        console.log('MonthlyCalendar - Fetching events for', year, month + 1)

        const response = await fetch('/api/calendar/events?type=all')
        const data = await response.json()

        console.log('MonthlyCalendar - API response:', {
          status: response.status,
          success: data.success,
          eventsCount: data.events?.length || 0,
          events: data.events
        })

        if (response.ok && data.success && data.events && data.events.length > 0) {
          // Extract days with events in current month
          const days = new Set<number>()
          const eventsInMonth: CalendarEvent[] = []

          data.events.forEach((event: any) => {
            const eventDate = new Date(event.start)
            console.log('MonthlyCalendar - Processing event:', {
              summary: event.summary,
              start: event.start,
              eventDate: eventDate,
              eventYear: eventDate.getFullYear(),
              eventMonth: eventDate.getMonth(),
              eventDay: eventDate.getDate(),
              currentYear: year,
              currentMonth: month
            })

            if (
              eventDate.getFullYear() === year &&
              eventDate.getMonth() === month
            ) {
              days.add(eventDate.getDate())
              eventsInMonth.push(event)
              console.log('MonthlyCalendar - Added day:', eventDate.getDate())
            }
          })
          console.log('MonthlyCalendar - Event days in month:', Array.from(days))
          console.log('MonthlyCalendar - Events in month:', eventsInMonth)
          setEventDays(Array.from(days))
          setMonthEvents(eventsInMonth)
        } else {
          console.log('MonthlyCalendar - No events found or API error')
          setEventDays([])
          setMonthEvents([])
        }
      } catch (error) {
        console.error('MonthlyCalendar - Error loading events:', error)
        setEventDays([])
      }
    }

    loadMonthEvents()
  }, [session, year, month])

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const today = new Date()
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    )
  }

  const days = []

  // 빈 칸 추가 (이전 달의 날짜들)
  for (let i = 0; i < firstDayWeekday; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square"></div>)
  }

  // Helper function to get events for a specific day
  const getEventsForDay = (day: number) => {
    return monthEvents.filter(event => {
      const eventDate = new Date(event.start)
      return eventDate.getDate() === day
    })
  }

  // Helper function to get event color (for text)
  const getEventColor = (event: CalendarEvent) => {
    const summary = event.summary.toLowerCase()

    // 공휴일 체크 (빨간색)
    if (summary.includes('공휴일') || summary.includes('holiday') ||
        summary.includes('설날') || summary.includes('추석') ||
        summary.includes('크리스마스') || summary.includes('어린이날') ||
        summary.includes('현충일') || summary.includes('광복절') ||
        summary.includes('개천절') || summary.includes('한글날')) {
      return 'text-red-600 dark:text-red-400'
    }

    // 더블유 주식회사 (자주색) - summary나 description에 포함되어 있을 수 있음
    if (summary.includes('더블유') || summary.includes('doubleyou')) {
      return 'text-purple-600 dark:text-purple-400'
    }

    // 일반 일정 (파란색)
    return 'text-blue-600 dark:text-blue-400'
  }

  // Helper function to get dot color (for compact view)
  const getDotColor = (event: CalendarEvent) => {
    const summary = event.summary.toLowerCase()

    // 공휴일 체크 (빨간색)
    if (summary.includes('공휴일') || summary.includes('holiday') ||
        summary.includes('설날') || summary.includes('추석') ||
        summary.includes('크리스마스') || summary.includes('어린이날') ||
        summary.includes('현충일') || summary.includes('광복절') ||
        summary.includes('개천절') || summary.includes('한글날')) {
      return 'bg-red-500'
    }

    // 더블유 주식회사 (자주색)
    if (summary.includes('더블유') || summary.includes('doubleyou')) {
      return 'bg-purple-500'
    }

    // 일반 일정 (파란색)
    return 'bg-blue-500'
  }

  // 현재 달의 날짜들 (컴팩트 뷰 - 도형으로 일정 표시)
  for (let day = 1; day <= daysInMonth; day++) {
    const hasEvent = eventDays.includes(day)
    const isTodayDate = isToday(day)
    const dayEvents = getEventsForDay(day)
    const isSelected = selectedDay === day

    // Get unique dot colors for this day's events (max 3)
    const uniqueColors = [...new Set(dayEvents.map(e => getDotColor(e)))].slice(0, 3)

    days.push(
      <div
        key={day}
        onClick={(e) => {
          e.preventDefault()
          setSelectedDay(isSelected ? null : day)
        }}
        className={`aspect-square flex flex-col items-center justify-center p-1 rounded-lg cursor-pointer transition-all ${
          isSelected
            ? 'bg-blue-100 dark:bg-blue-900/50 ring-2 ring-blue-500'
            : isTodayDate
            ? 'bg-red-50 dark:bg-red-900/30 ring-2 ring-red-500'
            : hasEvent
            ? 'hover:bg-gray-100 dark:hover:bg-gray-700'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
      >
        <div className={`text-sm font-medium ${
          isSelected
            ? 'text-blue-700 dark:text-blue-300'
            : isTodayDate
            ? 'text-red-600 dark:text-red-400'
            : 'text-gray-700 dark:text-gray-300'
        }`}>
          {day}
        </div>
        {/* 일정 표시 도형 */}
        {dayEvents.length > 0 && (
          <div className="flex items-center gap-0.5 mt-1">
            {uniqueColors.map((color, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full ${color}`}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
            {year}년 {month + 1}월
          </h3>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={prevMonth}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="이전 달"
          >
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextMonth}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="다음 달"
          >
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
          <div
            key={day}
            className={`text-center text-xs font-medium py-1 ${
              index === 0
                ? 'text-red-500 dark:text-red-400'
                : index === 6
                ? 'text-blue-500 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-0.5">
        {days}
      </div>

      {/* 선택된 날짜의 일정 목록 */}
      {selectedDay && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {month + 1}월 {selectedDay}일 일정
            </h4>
            <button
              onClick={() => setSelectedDay(null)}
              className="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {getEventsForDay(selectedDay).length === 0 ? (
            <div className="text-center py-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">일정이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {getEventsForDay(selectedDay).map((event) => {
                const eventDate = new Date(event.start)
                return (
                  <div
                    key={event.id}
                    className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getDotColor(event)}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium truncate ${getEventColor(event)}`}>
                        {event.summary}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">
                        {eventDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/calendar"
          className="flex items-center justify-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          <span>전체 일정 보기</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
