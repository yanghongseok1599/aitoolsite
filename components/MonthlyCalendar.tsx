'use client'

import { useState } from 'react'
import Link from 'next/link'

export function MonthlyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

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

  // 이벤트가 있는 날짜 (샘플 데이터)
  const eventDays = [20, 21, 22, 23]

  const days = []

  // 빈 칸 추가 (이전 달의 날짜들)
  for (let i = 0; i < firstDayWeekday; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square"></div>)
  }

  // 현재 달의 날짜들
  for (let day = 1; day <= daysInMonth; day++) {
    const hasEvent = eventDays.includes(day)
    const isTodayDate = isToday(day)

    days.push(
      <div
        key={day}
        className={`aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer transition-colors ${
          isTodayDate
            ? 'bg-blue-600 text-white font-bold'
            : hasEvent
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/50'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        <span className="text-sm">{day}</span>
        {hasEvent && !isTodayDate && (
          <div className="w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full mt-1"></div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {year}년 {month + 1}월
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="이전 달"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="다음 달"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
          <div
            key={day}
            className={`text-center text-xs font-semibold py-2 ${
              index === 0
                ? 'text-red-600 dark:text-red-400'
                : index === 6
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/calendar"
          className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          <span>전체 일정 보기</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
