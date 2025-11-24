'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverlay, defaultDropAnimationSideEffects, DragStartEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { DropAnimation } from '@dnd-kit/core'
import { DashboardHeader } from '@/components/DashboardHeader'
import { CategorySection, Bookmark } from '@/components/CategorySection'
import { AddToolModal } from '@/components/AddToolModal'
import { EditCategoryModal } from '@/components/EditCategoryModal'
import { AddCategoryModal } from '@/components/AddCategoryModal'
import { AddWidgetModal } from '@/components/AddWidgetModal'
import { CalendarWidget } from '@/components/CalendarWidget'
import { NotesWidget } from '@/components/NotesWidget'
import { MonthlyCalendar } from '@/components/MonthlyCalendar'
import { WeatherWidget } from '@/components/WeatherWidget'
import { PomodoroWidget } from '@/components/PomodoroWidget'
import { QuoteWidget } from '@/components/QuoteWidget'
import { TodoListWidget } from '@/components/TodoListWidget'
import { SortableWidget } from '@/components/SortableWidget'
import { BookmarkCard } from '@/components/BookmarkCard'
import {
  getUserBookmarks,
  addBookmark,
  updateBookmark,
  deleteBookmark,
  getUserSettings,
  saveUserSettings,
} from '@/lib/firestore'

// 샘플 데이터
const sampleBookmarks: { [key: string]: Bookmark[] } = {
  'AI 에이전트': [
    {
      id: '1',
      name: 'ChatGPT',
      url: 'https://chat.openai.com',
      icon: 'https://www.google.com/s2/favicons?domain=chat.openai.com&sz=128',
      description: 'OpenAI의 대화형 AI'
    },
    {
      id: '2',
      name: 'Claude',
      url: 'https://claude.ai',
      icon: 'https://www.google.com/s2/favicons?domain=claude.ai&sz=128',
      description: 'Anthropic의 AI 어시스턴트'
    },
    {
      id: '3',
      name: 'Gemini',
      url: 'https://gemini.google.com',
      icon: 'https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128',
      description: 'Google의 AI 모델'
    },
    {
      id: '12',
      name: 'Perplexity',
      url: 'https://www.perplexity.ai',
      icon: 'https://www.google.com/s2/favicons?domain=perplexity.ai&sz=128',
      description: 'AI 검색 엔진'
    },
    {
      id: '13',
      name: 'Copilot',
      url: 'https://copilot.microsoft.com',
      icon: 'https://www.google.com/s2/favicons?domain=copilot.microsoft.com&sz=128',
      description: 'Microsoft의 AI 어시스턴트'
    },
  ],
  '검색 포털': [
    {
      id: '4',
      name: '네이버',
      url: 'https://www.naver.com',
      icon: 'https://www.google.com/s2/favicons?domain=naver.com&sz=128',
      description: '네이버 검색'
    },
    {
      id: '14',
      name: '구글',
      url: 'https://www.google.com',
      icon: 'https://www.google.com/s2/favicons?domain=google.com&sz=128',
      description: '구글 검색'
    },
    {
      id: '15',
      name: '다음',
      url: 'https://www.daum.net',
      icon: 'https://www.google.com/s2/favicons?domain=daum.net&sz=128',
      description: '다음 검색'
    },
    {
      id: '16',
      name: '빙',
      url: 'https://www.bing.com',
      icon: 'https://www.google.com/s2/favicons?domain=bing.com&sz=128',
      description: 'Bing 검색'
    },
    {
      id: '17',
      name: '야후',
      url: 'https://www.yahoo.com',
      icon: 'https://www.google.com/s2/favicons?domain=yahoo.com&sz=128',
      description: 'Yahoo 검색'
    },
  ],
  '네이버 블로그 툴': [
    {
      id: '5',
      name: 'Notion',
      url: 'https://notion.so',
      icon: 'https://www.google.com/s2/favicons?domain=notion.so&sz=128',
      description: 'AI 기반 노트 작성'
    },
    {
      id: '6',
      name: 'Grammarly',
      url: 'https://grammarly.com',
      icon: 'https://www.google.com/s2/favicons?domain=grammarly.com&sz=128',
      description: 'AI 문법 검사'
    },
    {
      id: '18',
      name: 'Canva',
      url: 'https://www.canva.com',
      icon: 'https://www.google.com/s2/favicons?domain=canva.com&sz=128',
      description: '디자인 도구'
    },
    {
      id: '19',
      name: 'Hemingway',
      url: 'https://hemingwayapp.com',
      icon: 'https://www.google.com/s2/favicons?domain=hemingwayapp.com&sz=128',
      description: '글쓰기 편집기'
    },
    {
      id: '20',
      name: 'Evernote',
      url: 'https://evernote.com',
      icon: 'https://www.google.com/s2/favicons?domain=evernote.com&sz=128',
      description: '노트 작성 앱'
    },
  ],
  '이미지 생성': [
    {
      id: '7',
      name: 'Midjourney',
      url: 'https://midjourney.com',
      icon: 'https://www.google.com/s2/favicons?domain=midjourney.com&sz=128',
      description: 'AI 이미지 생성 도구'
    },
    {
      id: '8',
      name: 'DALL-E',
      url: 'https://openai.com/dall-e',
      icon: 'https://www.google.com/s2/favicons?domain=openai.com&sz=128',
      description: 'OpenAI의 이미지 생성'
    },
    {
      id: '9',
      name: 'Stable Diffusion',
      url: 'https://stability.ai',
      icon: 'https://www.google.com/s2/favicons?domain=stability.ai&sz=128',
      description: '오픈소스 이미지 생성'
    },
    {
      id: '21',
      name: 'Leonardo AI',
      url: 'https://leonardo.ai',
      icon: 'https://www.google.com/s2/favicons?domain=leonardo.ai&sz=128',
      description: 'AI 아트 생성'
    },
    {
      id: '22',
      name: 'Playground AI',
      url: 'https://playgroundai.com',
      icon: 'https://www.google.com/s2/favicons?domain=playgroundai.com&sz=128',
      description: 'AI 이미지 플레이그라운드'
    },
  ],
  '코딩 도구': [
    {
      id: '10',
      name: 'GitHub Copilot',
      url: 'https://github.com/features/copilot',
      icon: 'https://www.google.com/s2/favicons?domain=github.com&sz=128',
      description: 'AI 코드 어시스턴트'
    },
    {
      id: '11',
      name: 'Cursor',
      url: 'https://cursor.sh',
      icon: 'https://www.google.com/s2/favicons?domain=cursor.sh&sz=128',
      description: 'AI 기반 코드 에디터'
    },
    {
      id: '23',
      name: 'Replit',
      url: 'https://replit.com',
      icon: 'https://www.google.com/s2/favicons?domain=replit.com&sz=128',
      description: '온라인 코딩 환경'
    },
    {
      id: '24',
      name: 'CodePen',
      url: 'https://codepen.io',
      icon: 'https://www.google.com/s2/favicons?domain=codepen.io&sz=128',
      description: '프론트엔드 코드 에디터'
    },
    {
      id: '25',
      name: 'StackBlitz',
      url: 'https://stackblitz.com',
      icon: 'https://www.google.com/s2/favicons?domain=stackblitz.com&sz=128',
      description: '웹 개발 IDE'
    },
  ],
}

// Compact Widget for Banner Area
function BannerWidgetContent({
  widgetId,
  onSettings
}: {
  widgetId: string
  onSettings: () => void
}) {
  const [weather, setWeather] = useState<any>(null)
  const [quote, setQuote] = useState<any>(null)
  const [pomodoroTime, setPomodoroTime] = useState({ minutes: 25, seconds: 0 })
  const [pomodoroRunning, setPomodoroRunning] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem(`widget-${widgetId}-settings`)

    // Weather data
    if (widgetId === 'weather') {
      const settings = savedSettings ? JSON.parse(savedSettings) : { city: '서울' }
      const mockWeather = { city: settings.city, temp: 18, condition: '맑음' }
      setTimeout(() => setWeather(mockWeather), 500)
    }

    // Quote data
    if (widgetId === 'quote') {
      const quotes = [
        { text: '위대한 일을 하려면 자신이 하는 일을 사랑해야 합니다.', author: '스티브 잡스' },
        { text: '성공은 최종적인 것이 아니며, 실패는 치명적인 것이 아니다.', author: '윈스턴 처칠' },
        { text: '미래를 예측하는 가장 좋은 방법은 그것을 창조하는 것이다.', author: '피터 드러커' },
        { text: '당신이 할 수 있다고 믿든, 할 수 없다고 믿든, 당신이 옳다.', author: '헨리 포드' },
        { text: '오늘 할 수 있는 일을 내일로 미루지 마라.', author: '벤저민 프랭클린' },
        { text: '성공의 비결은 시작하는 것이다.', author: '마크 트웨인' },
        { text: '행동이 모든 성공의 기본 열쇠다.', author: '파블로 피카소' },
        { text: '한계는 두려움이 대부분이고, 나머지는 환상이다.', author: '마이클 조던' }
      ]
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
      setQuote(randomQuote)
    }

    // Pomodoro data
    if (widgetId === 'pomodoro') {
      const settings = savedSettings ? JSON.parse(savedSettings) : { minutes: 25 }
      setPomodoroTime({ minutes: settings.minutes, seconds: 0 })
    }

    // Listen for storage changes to update widget when settings change
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `widget-${widgetId}-settings`) {
        setRefreshKey(prev => prev + 1)
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Custom event for same-window updates
    const handleCustomUpdate = () => {
      setRefreshKey(prev => prev + 1)
    }

    window.addEventListener(`widget-${widgetId}-updated`, handleCustomUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener(`widget-${widgetId}-updated`, handleCustomUpdate)
    }
  }, [widgetId, refreshKey])

  // Pomodoro timer countdown effect
  useEffect(() => {
    if (widgetId === 'pomodoro' && pomodoroRunning) {
      const interval = setInterval(() => {
        setPomodoroTime(prev => {
          if (prev.seconds === 0) {
            if (prev.minutes === 0) {
              // Timer finished
              setPomodoroRunning(false)
              setAlertMessage('포모도로 타이머 완료! 잠시 휴식하세요.')
              setShowAlert(true)
              // Reset to initial time
              const savedSettings = localStorage.getItem(`widget-${widgetId}-settings`)
              const settings = savedSettings ? JSON.parse(savedSettings) : { minutes: 25 }
              return { minutes: settings.minutes, seconds: 0 }
            } else {
              return { minutes: prev.minutes - 1, seconds: 59 }
            }
          } else {
            return { ...prev, seconds: prev.seconds - 1 }
          }
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [widgetId, pomodoroRunning])

  const togglePomodoro = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPomodoroRunning(prev => !prev)
  }

  const resetPomodoro = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPomodoroRunning(false)
    const savedSettings = localStorage.getItem(`widget-${widgetId}-settings`)
    const settings = savedSettings ? JSON.parse(savedSettings) : { minutes: 25 }
    setPomodoroTime({ minutes: settings.minutes, seconds: 0 })
  }

  const refreshQuote = (e: React.MouseEvent) => {
    e.stopPropagation()
    const quotes = [
      { text: '위대한 일을 하려면 자신이 하는 일을 사랑해야 합니다.', author: '스티브 잡스' },
      { text: '성공은 최종적인 것이 아니며, 실패는 치명적인 것이 아니다.', author: '윈스턴 처칠' },
      { text: '미래를 예측하는 가장 좋은 방법은 그것을 창조하는 것이다.', author: '피터 드러커' },
      { text: '당신이 할 수 있다고 믿든, 할 수 없다고 믿든, 당신이 옳다.', author: '헨리 포드' },
      { text: '오늘 할 수 있는 일을 내일로 미루지 마라.', author: '벤저민 프랭클린' },
      { text: '성공의 비결은 시작하는 것이다.', author: '마크 트웨인' },
      { text: '행동이 모든 성공의 기본 열쇠다.', author: '파블로 피카소' },
      { text: '한계는 두려움이 대부분이고, 나머지는 환상이다.', author: '마이클 조던' }
    ]
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
    setQuote(randomQuote)
  }

  if (widgetId === 'weather' && weather) {
    return (
      <div className="flex items-center justify-center gap-2 w-full">
        <div className="text-2xl">☀️</div>
        <div className="flex-1 text-center">
          <div className="text-xs opacity-80">{weather.city}</div>
          <div className="text-lg font-bold">{weather.temp}°C</div>
          <div className="text-xs opacity-80">{weather.condition}</div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onSettings()
          }}
          className="p-1 rounded hover:bg-white/20 transition-colors"
          title="설정"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    )
  }

  if (widgetId === 'quote' && quote) {
    return (
      <div className="flex items-center justify-center gap-2 w-full">
        <div className="text-xl">💭</div>
        <div className="flex-1 min-w-0 text-center">
          <div className="text-xs leading-relaxed line-clamp-2">{quote.text}</div>
          <div className="text-xs opacity-70 mt-1">- {quote.author}</div>
        </div>
        <button
          onClick={refreshQuote}
          className="p-1 rounded hover:bg-white/20 transition-colors flex-shrink-0"
          title="새로운 명언"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    )
  }

  if (widgetId === 'pomodoro') {
    return (
      <>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-center gap-2">
            <div className="text-2xl">⏱️</div>
            <div className="flex-1 text-center">
              <div className="text-xs opacity-80">집중 시간</div>
              <div className="text-lg font-bold font-mono">
                {String(pomodoroTime.minutes).padStart(2, '0')}:{String(pomodoroTime.seconds).padStart(2, '0')}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onSettings()
              }}
              className="p-1 rounded hover:bg-white/20 transition-colors"
              title="설정"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          <div className="flex justify-center gap-1">
            <button
              onClick={togglePomodoro}
              className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-all ${
                pomodoroRunning
                  ? 'bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white shadow-sm'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-sm'
              }`}
              title={pomodoroRunning ? '일시정지' : '시작'}
            >
              {pomodoroRunning ? '⏸' : '▶'}
            </button>
            <button
              onClick={resetPomodoro}
              className="px-2 py-1 rounded text-xs font-medium bg-white/20 hover:bg-white/30 transition-colors"
              title="초기화"
            >
              ↻
            </button>
          </div>
        </div>
        {showAlert && (
          <CustomAlert
            message={alertMessage}
            onClose={() => setShowAlert(false)}
          />
        )}
      </>
    )
  }

  return null
}

// Banner Widget Component with Context Menu and Drag Support
function BannerWidget({
  widgetId,
  widgetName,
  widgetEmoji,
  onMoveToMain,
  onRemove,
  onSettings
}: {
  widgetId: string
  widgetName: string
  widgetEmoji: string
  onMoveToMain: (id: string) => void
  onRemove: (id: string) => void
  onSettings: (widgetId: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widgetId })

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 250ms cubic-bezier(0.2, 0, 0, 1)',
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 1000 : 'auto',
    willChange: isDragging ? 'transform' : 'auto',
  } as React.CSSProperties

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // 메뉴 크기 예상
    const menuWidth = 180
    const menuHeight = 100

    // 뷰포트 크기
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // 클릭 위치
    let x = e.clientX
    let y = e.clientY

    // 오른쪽 경계를 넘는 경우 커서 왼쪽에 표시
    if (x + menuWidth > viewportWidth) {
      x = Math.max(10, x - menuWidth)
    }

    // 아래쪽 경계를 넘는 경우 커서 위에 표시
    if (y + menuHeight > viewportHeight) {
      y = Math.max(10, y - menuHeight)
    }

    setContextMenu({ x, y })
  }

  const handleCloseContextMenu = () => {
    setContextMenu(null)
  }

  const handleMoveToMain = () => {
    onMoveToMain(widgetId)
    handleCloseContextMenu()
  }

  const handleDelete = () => {
    onRemove(widgetId)
    handleCloseContextMenu()
  }

  // Render actual widget content for weather, quote, and pomodoro
  const shouldRenderContent = ['weather', 'quote', 'pomodoro'].includes(widgetId)

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 group relative text-white"
        onContextMenu={handleContextMenu}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-1 left-1 z-10 p-1 rounded bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
          title="드래그하여 위치 변경"
        >
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>

        {shouldRenderContent ? (
          <BannerWidgetContent widgetId={widgetId} onSettings={() => onSettings(widgetId)} />
        ) : (
          <>
            <div className="text-xs font-medium mb-1">{widgetName}</div>
            <div className="text-2xl">{widgetEmoji}</div>
          </>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && mounted && createPortal(
        <>
          {/* Backdrop to close menu */}
          <div
            className="fixed inset-0"
            style={{ zIndex: 2147483646 }}
            onClick={handleCloseContextMenu}
          />

          {/* Context Menu */}
          <div
            className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 py-1 min-w-[180px]"
            style={{
              top: `${contextMenu.y}px`,
              left: `${contextMenu.x}px`,
              zIndex: 2147483647,
              position: 'fixed',
            }}
          >
            <button
              onClick={handleMoveToMain}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              하단으로 이동
            </button>
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              삭제
            </button>
          </div>
        </>,
        document.body
      )}
    </>
  )
}

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()
  const [bookmarks, setBookmarks] = useState<{ [key: string]: Bookmark[] }>(sampleBookmarks)
  const [categoryOrder, setCategoryOrder] = useState(Object.keys(sampleBookmarks))
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [editingBookmark, setEditingBookmark] = useState<{ category: string; bookmark: Bookmark } | null>(null)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState('')
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false)
  const [isAddWidgetModalOpen, setIsAddWidgetModalOpen] = useState(false)
  const [widgetOrder, setWidgetOrder] = useState(['monthly-calendar', 'notes', 'calendar'])
  const [bannerWidgets, setBannerWidgets] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [welcomeTitle, setWelcomeTitle] = useState('AI 도구 대시보드에 오신 것을 환영합니다! 👋')
  const [welcomeDescription, setWelcomeDescription] = useState('자주 사용하는 AI 도구들을 한곳에서 관리하고 빠르게 접근하세요.')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [tempTitle, setTempTitle] = useState('')
  const [tempDescription, setTempDescription] = useState('')
  const [widgetSettingsModal, setWidgetSettingsModal] = useState<{ isOpen: boolean; widgetId: string | null }>({ isOpen: false, widgetId: null })
  const [widgetSettings, setWidgetSettings] = useState<{ [key: string]: any }>({})

  // Load widget settings
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSettings: { [key: string]: any } = {}
      const widgetIds = ['weather', 'pomodoro']
      widgetIds.forEach(id => {
        const settings = localStorage.getItem(`widget-${id}-settings`)
        if (settings) {
          savedSettings[id] = JSON.parse(settings)
        }
      })
      setWidgetSettings(savedSettings)
    }
  }, [])

  // Load user data from Firebase
  useEffect(() => {
    const loadUserData = async () => {
      if (!session?.user?.email) {
        setLoading(false)
        return
      }

      try {
        const userId = session.user.email

        // Load bookmarks
        const firestoreBookmarks = await getUserBookmarks(userId)
        const bookmarksByCategory: { [key: string]: Bookmark[] } = {}

        firestoreBookmarks.forEach((bookmark) => {
          if (!bookmarksByCategory[bookmark.category]) {
            bookmarksByCategory[bookmark.category] = []
          }
          bookmarksByCategory[bookmark.category].push({
            id: bookmark.id,
            name: bookmark.name,
            url: bookmark.url,
            icon: bookmark.icon,
            description: bookmark.description,
          })
        })

        // Load user settings
        const settings = await getUserSettings(userId)

        if (Object.keys(bookmarksByCategory).length > 0) {
          setBookmarks(bookmarksByCategory)
          setCategoryOrder(
            settings?.categoryOrder || Object.keys(bookmarksByCategory)
          )
        }

        if (settings?.widgetOrder) {
          setWidgetOrder(settings.widgetOrder)
        }

        if (settings?.bannerWidgets) {
          setBannerWidgets(settings.bannerWidgets)
        }

        if (settings?.welcomeTitle) {
          setWelcomeTitle(settings.welcomeTitle)
        }

        if (settings?.welcomeDescription) {
          setWelcomeDescription(settings.welcomeDescription)
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [session])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px로 줄여서 더 반응성 좋게
        tolerance: 5,
        delay: 0,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
    duration: 200,
    easing: 'cubic-bezier(0.2, 0, 0, 1)',
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  // Get the currently dragged bookmark
  const getActiveBookmark = () => {
    if (!activeId) return null

    for (const [category, items] of Object.entries(bookmarks)) {
      const bookmark = items.find(b => b.id === activeId)
      if (bookmark) return bookmark
    }
    return null
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (over && active.id !== over.id) {
      const activeId = active.id as string
      const overId = over.id as string

      // Check if dragging banner widgets
      if (bannerWidgets.includes(activeId) && bannerWidgets.includes(overId)) {
        const newOrder = arrayMove(bannerWidgets, bannerWidgets.indexOf(activeId), bannerWidgets.indexOf(overId))
        setBannerWidgets(newOrder)

        // Save to Firebase
        if (session?.user?.email) {
          await saveUserSettings(session.user.email, { bannerWidgets: newOrder })
        }
      } else if (widgetOrder.includes(activeId) && widgetOrder.includes(overId)) {
        // Check if dragging main widgets
        const newOrder = arrayMove(widgetOrder, widgetOrder.indexOf(activeId), widgetOrder.indexOf(overId))
        setWidgetOrder(newOrder)

        // Save to Firebase
        if (session?.user?.email) {
          await saveUserSettings(session.user.email, { widgetOrder: newOrder })
        }
      } else if (categoryOrder.includes(activeId) && categoryOrder.includes(overId)) {
        // Dragging categories
        const newOrder = arrayMove(categoryOrder, categoryOrder.indexOf(activeId), categoryOrder.indexOf(overId))
        setCategoryOrder(newOrder)

        // Save to Firebase
        if (session?.user?.email) {
          await saveUserSettings(session.user.email, { categoryOrder: newOrder })
        }
      } else {
        // Dragging bookmarks - find which category the bookmark belongs to
        let sourceCategory = ''
        let targetCategory = ''

        // Find the source category
        for (const [category, items] of Object.entries(bookmarks)) {
          if (items.some(b => b.id === activeId)) {
            sourceCategory = category
          }
          if (items.some(b => b.id === overId)) {
            targetCategory = category
          }
        }

        if (sourceCategory) {
          if (targetCategory && sourceCategory !== targetCategory) {
            // Moving bookmark to a different category
            const sourceBookmarks = [...bookmarks[sourceCategory]]
            const targetBookmarks = [...bookmarks[targetCategory]]

            const movedBookmark = sourceBookmarks.find(b => b.id === activeId)
            if (movedBookmark) {
              // Remove from source
              const newSourceBookmarks = sourceBookmarks.filter(b => b.id !== activeId)

              // Add to target at the position of overId
              const targetIndex = targetBookmarks.findIndex(b => b.id === overId)
              const newTargetBookmarks = [...targetBookmarks]
              newTargetBookmarks.splice(targetIndex, 0, movedBookmark)

              // Update state
              setBookmarks(prev => ({
                ...prev,
                [sourceCategory]: newSourceBookmarks,
                [targetCategory]: newTargetBookmarks
              }))

              // Update in Firebase
              if (session?.user?.email) {
                await updateBookmark(activeId, {
                  category: targetCategory,
                  name: movedBookmark.name,
                  url: movedBookmark.url,
                  icon: movedBookmark.icon,
                  userId: session.user.email,
                })
              }
            }
          } else if (sourceCategory === targetCategory) {
            // Reordering within the same category
            const categoryBookmarks = [...bookmarks[sourceCategory]]
            const oldIndex = categoryBookmarks.findIndex(b => b.id === activeId)
            const newIndex = categoryBookmarks.findIndex(b => b.id === overId)

            const reorderedBookmarks = arrayMove(categoryBookmarks, oldIndex, newIndex)

            setBookmarks(prev => ({
              ...prev,
              [sourceCategory]: reorderedBookmarks
            }))
          }
        }
      }
    }
  }

  const handleAddCategory = () => {
    setIsAddCategoryModalOpen(true)
  }

  const handleCategoryAdd = async (categoryName: string) => {
    // Check if category already exists
    if (bookmarks[categoryName]) {
      alert('이미 존재하는 카테고리 이름입니다.')
      return
    }

    // Add new category
    setBookmarks(prev => ({
      ...prev,
      [categoryName]: []
    }))

    // Add to category order
    const newOrder = [...categoryOrder, categoryName]
    setCategoryOrder(newOrder)

    // Save to Firebase
    if (session?.user?.email) {
      await saveUserSettings(session.user.email, { categoryOrder: newOrder })
    }
  }

  const handleAddBookmark = (category: string) => {
    setSelectedCategory(category)
    setEditingBookmark(null)
    setIsModalOpen(true)
  }

  const handleEditBookmark = (category: string, bookmarkId: string) => {
    const bookmark = bookmarks[category]?.find(b => b.id === bookmarkId)
    if (bookmark) {
      setSelectedCategory(category)
      setEditingBookmark({ category, bookmark })
      setIsModalOpen(true)
    }
  }

  const handleDeleteBookmark = async (category: string, bookmarkId: string) => {
    if (confirm('이 도구를 삭제하시겠습니까?')) {
      setBookmarks(prev => ({
        ...prev,
        [category]: prev[category].filter(b => b.id !== bookmarkId)
      }))

      // Delete from Firebase
      if (session?.user?.email) {
        await deleteBookmark(bookmarkId)
      }
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedCategory('')
    setEditingBookmark(null)
  }

  const handleToolAdd = async (tool: { name: string; url: string; icon?: string }) => {
    if (!session?.user?.email) return

    if (editingBookmark) {
      // Update existing bookmark
      setBookmarks(prev => ({
        ...prev,
        [selectedCategory]: prev[selectedCategory].map(b =>
          b.id === editingBookmark.bookmark.id
            ? { ...b, name: tool.name, url: tool.url, icon: tool.icon }
            : b
        )
      }))

      // Update in Firebase
      await updateBookmark(editingBookmark.bookmark.id, {
        name: tool.name,
        url: tool.url,
        icon: tool.icon,
        category: selectedCategory,
        userId: session.user.email,
      })
    } else {
      // Add new bookmark to Firebase
      const docRef = await addBookmark(session.user.email, selectedCategory, {
        name: tool.name,
        url: tool.url,
        icon: tool.icon,
      })

      const newBookmark: Bookmark = {
        id: docRef.id,
        name: tool.name,
        url: tool.url,
        icon: tool.icon
      }

      setBookmarks(prev => ({
        ...prev,
        [selectedCategory]: [...(prev[selectedCategory] || []), newBookmark]
      }))
    }
  }

  const handleEditCategory = (category: string) => {
    setEditingCategory(category)
    setIsCategoryModalOpen(true)
  }

  const handleCategoryRename = async (newName: string) => {
    if (newName === editingCategory) return

    // Check if new name already exists
    if (bookmarks[newName]) {
      alert('이미 존재하는 카테고리 이름입니다.')
      return
    }

    // Rename category
    setBookmarks(prev => {
      const newBookmarks = { ...prev }
      newBookmarks[newName] = newBookmarks[editingCategory]
      delete newBookmarks[editingCategory]
      return newBookmarks
    })

    // Update category order
    const newOrder = categoryOrder.map(cat => cat === editingCategory ? newName : cat)
    setCategoryOrder(newOrder)

    // Update all bookmarks in this category in Firebase
    if (session?.user?.email) {
      const bookmarksToUpdate = bookmarks[editingCategory] || []
      for (const bookmark of bookmarksToUpdate) {
        await updateBookmark(bookmark.id, {
          category: newName,
          name: bookmark.name,
          url: bookmark.url,
          icon: bookmark.icon,
          userId: session.user.email,
        })
      }

      // Save new category order
      await saveUserSettings(session.user.email, { categoryOrder: newOrder })
    }
  }

  const handleAddWidget = async (widgetId: string) => {
    // Add to banner if less than 4 widgets
    if (bannerWidgets.length < 4 && !bannerWidgets.includes(widgetId)) {
      const newBannerWidgets = [...bannerWidgets, widgetId]
      setBannerWidgets(newBannerWidgets)

      // Save to Firebase
      if (session?.user?.email) {
        await saveUserSettings(session.user.email, { bannerWidgets: newBannerWidgets })
      }
    } else {
      // Otherwise add to widget order
      const newOrder = [...widgetOrder, widgetId]
      setWidgetOrder(newOrder)

      // Save to Firebase
      if (session?.user?.email) {
        await saveUserSettings(session.user.email, { widgetOrder: newOrder })
      }
    }
  }

  const handleEditTitle = () => {
    setTempTitle(welcomeTitle)
    setIsEditingTitle(true)
  }

  const handleSaveTitle = async () => {
    if (tempTitle.trim()) {
      setWelcomeTitle(tempTitle)
      setIsEditingTitle(false)

      // Save to Firebase
      if (session?.user?.email) {
        await saveUserSettings(session.user.email, { welcomeTitle: tempTitle })
      }
    }
  }

  const handleCancelEdit = () => {
    setIsEditingTitle(false)
    setTempTitle('')
  }

  const handleEditDescription = () => {
    setTempDescription(welcomeDescription)
    setIsEditingDescription(true)
  }

  const handleSaveDescription = async () => {
    if (tempDescription.trim()) {
      setWelcomeDescription(tempDescription)
      setIsEditingDescription(false)

      // Save to Firebase
      if (session?.user?.email) {
        await saveUserSettings(session.user.email, { welcomeDescription: tempDescription })
      }
    }
  }

  const handleCancelEditDescription = () => {
    setIsEditingDescription(false)
    setTempDescription('')
  }

  const handleRemoveWidget = async (widgetId: string) => {
    const newOrder = widgetOrder.filter(id => id !== widgetId)
    setWidgetOrder(newOrder)

    // Save to Firebase
    if (session?.user?.email) {
      await saveUserSettings(session.user.email, { widgetOrder: newOrder })
    }
  }

  const handleRemoveBannerWidget = async (widgetId: string) => {
    const newBannerWidgets = bannerWidgets.filter(id => id !== widgetId)
    setBannerWidgets(newBannerWidgets)

    // Save to Firebase
    if (session?.user?.email) {
      await saveUserSettings(session.user.email, { bannerWidgets: newBannerWidgets })
    }
  }

  const handleMoveToBanner = async (widgetId: string) => {
    if (!bannerWidgets.includes(widgetId) && bannerWidgets.length < 4) {
      // Add to banner
      const newBannerWidgets = [...bannerWidgets, widgetId]
      setBannerWidgets(newBannerWidgets)

      // Remove from widget order
      const newOrder = widgetOrder.filter(id => id !== widgetId)
      setWidgetOrder(newOrder)

      // Save to Firebase
      if (session?.user?.email) {
        await saveUserSettings(session.user.email, {
          bannerWidgets: newBannerWidgets,
          widgetOrder: newOrder
        })
      }
    }
  }

  const handleMoveToMain = async (widgetId: string) => {
    // Remove from banner
    const newBannerWidgets = bannerWidgets.filter(id => id !== widgetId)
    setBannerWidgets(newBannerWidgets)

    // Add to widget order
    const newOrder = [...widgetOrder, widgetId]
    setWidgetOrder(newOrder)

    // Save to Firebase
    if (session?.user?.email) {
      await saveUserSettings(session.user.email, {
        bannerWidgets: newBannerWidgets,
        widgetOrder: newOrder
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader onAddCategory={handleAddCategory} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          {/* Welcome Banner */}
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-primary via-blue-600 to-purple-600 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Section - Title and Buttons */}
            <div>
              <div className="flex items-start justify-between mb-2 group">
                {isEditingTitle ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/50 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="제목을 입력하세요..."
                      autoFocus
                    />
                    <button
                      onClick={handleSaveTitle}
                      className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                      title="저장"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                      title="취소"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold flex-1">{welcomeTitle}</h1>
                    <button
                      onClick={handleEditTitle}
                      className="p-2 rounded-lg hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
                      title="제목 수정"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
              <div className="mb-4 group/desc">
                {isEditingDescription ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempDescription}
                      onChange={(e) => setTempDescription(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="설명을 입력하세요..."
                      autoFocus
                    />
                    <button
                      onClick={handleSaveDescription}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                      title="저장"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={handleCancelEditDescription}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                      title="취소"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-white/90 flex-1">{welcomeDescription}</p>
                    <button
                      onClick={handleEditDescription}
                      className="p-1.5 rounded-lg hover:bg-white/20 transition-colors opacity-0 group-hover/desc:opacity-100"
                      title="설명 수정"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>카테고리 추가</span>
                  </span>
                </button>
                <button
                  onClick={() => setIsAddWidgetModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>위젯 추가</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Right Section - Widget Preview Area */}
            <SortableContext items={bannerWidgets}>
              <div className="grid grid-cols-2 gap-3">
                {bannerWidgets.map((widgetId) => {
                const widgetName = {
                  'monthly-calendar': '월간 캘린더',
                  'notes': '메모',
                  'calendar': '일정 목록',
                  'weather': '날씨',
                  'pomodoro': '포모도로',
                  'quote': '명언',
                  'todolist': '할 일'
                }[widgetId] || widgetId

                const widgetEmoji = {
                  'monthly-calendar': '📅',
                  'notes': '📝',
                  'calendar': '📋',
                  'weather': '☀️',
                  'pomodoro': '⏰',
                  'quote': '💡',
                  'todolist': '✅'
                }[widgetId] || '📦'

                return (
                  <BannerWidget
                    key={widgetId}
                    widgetId={widgetId}
                    widgetName={widgetName}
                    widgetEmoji={widgetEmoji}
                    onMoveToMain={handleMoveToMain}
                    onRemove={handleRemoveBannerWidget}
                    onSettings={(id) => setWidgetSettingsModal({ isOpen: true, widgetId: id })}
                  />
                )
              })}

                {/* Add Widget to Banner Button */}
                {bannerWidgets.length < 4 && (
                  <button
                    onClick={() => setIsAddWidgetModalOpen(true)}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-dashed border-white/30 hover:border-white/50 hover:bg-white/20 transition-all group"
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <svg className="w-6 h-6 text-white/60 group-hover:text-white/80 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-xs text-white/60 group-hover:text-white/80">위젯 추가</span>
                    </div>
                  </button>
                )}
              </div>
            </SortableContext>
          </div>
        </div>

        {/* Main Content - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - AI Tools (Categories) */}
            <div className="lg:col-span-8">
              <SortableContext items={categoryOrder} strategy={verticalListSortingStrategy}>
                {categoryOrder.map((category) => (
                  <CategorySection
                    key={category}
                    id={category}
                    title={category}
                    bookmarks={bookmarks[category] || []}
                    onAddBookmark={() => handleAddBookmark(category)}
                    onEditBookmark={(bookmarkId) => handleEditBookmark(category, bookmarkId)}
                    onDeleteBookmark={(bookmarkId) => handleDeleteBookmark(category, bookmarkId)}
                    onEditCategory={() => handleEditCategory(category)}
                  />
                ))}
              </SortableContext>

              {/* Empty State - if no categories */}
              {Object.keys(bookmarks).length === 0 && (
                <div className="text-center py-20">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    첫 번째 도구를 추가해보세요
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    자주 사용하는 AI 도구들을 카테고리별로 정리할 수 있습니다
                  </p>
                  <button
                    onClick={handleAddCategory}
                    className="px-6 py-3 rounded-lg bg-primary hover:bg-blue-600 text-white font-semibold transition-colors"
                  >
                    카테고리 만들기
                  </button>
                </div>
              )}
            </div>

            {/* Right Column - Widgets (Monthly Calendar, Notes & Calendar) */}
            <div className="lg:col-span-4">
              <SortableContext items={widgetOrder} strategy={verticalListSortingStrategy}>
                <div className="space-y-6">
                  {widgetOrder.map((widgetId) => (
                    <SortableWidget
                      key={widgetId}
                      id={widgetId}
                      onMoveToBanner={handleMoveToBanner}
                      onRemove={handleRemoveWidget}
                      canMoveToBanner={bannerWidgets.length < 4}
                    >
                      {widgetId === 'monthly-calendar' && <MonthlyCalendar />}
                      {widgetId === 'notes' && <NotesWidget />}
                      {widgetId === 'calendar' && <CalendarWidget />}
                      {widgetId === 'weather' && <WeatherWidget />}
                      {widgetId === 'pomodoro' && <PomodoroWidget />}
                      {widgetId === 'quote' && <QuoteWidget />}
                      {widgetId === 'todolist' && <TodoListWidget />}
                    </SortableWidget>
                  ))}

                  {/* Add Widget Button */}
                  <button
                    onClick={() => setIsAddWidgetModalOpen(true)}
                    className="w-full p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-primary transition-colors">
                        위젯 추가
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        새로운 위젯을 추가하세요
                      </span>
                    </div>
                  </button>
                </div>
              </SortableContext>
            </div>
          </div>

          {/* DragOverlay for smooth dragging visuals */}
          <DragOverlay dropAnimation={dropAnimation}>
            {activeId ? (
              bannerWidgets.includes(activeId) ? (
                <div className="cursor-grabbing transform scale-110 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="text-xs font-medium mb-1">
                    {{
                      'monthly-calendar': '월간 캘린더',
                      'notes': '메모',
                      'calendar': '일정 목록',
                      'weather': '날씨',
                      'pomodoro': '포모도로',
                      'quote': '명언',
                      'todolist': '할 일'
                    }[activeId] || activeId}
                  </div>
                  <div className="text-2xl">
                    {{
                      'monthly-calendar': '📅',
                      'notes': '📝',
                      'calendar': '📋',
                      'weather': '☀️',
                      'pomodoro': '⏰',
                      'quote': '💡',
                      'todolist': '✅'
                    }[activeId] || '📦'}
                  </div>
                </div>
              ) : getActiveBookmark() ? (
                <div className="cursor-grabbing transform rotate-3 scale-110">
                  <BookmarkCard
                    id={activeId}
                    name={getActiveBookmark()!.name}
                    url={getActiveBookmark()!.url}
                    icon={getActiveBookmark()?.icon}
                    description={getActiveBookmark()?.description}
                    isDragOverlay={true}
                  />
                </div>
              ) : null
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      {/* Add Tool Modal */}
      <AddToolModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onAdd={handleToolAdd}
        categoryName={selectedCategory}
        initialData={editingBookmark ? editingBookmark.bookmark : undefined}
      />

      {/* Edit Category Modal */}
      <EditCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleCategoryRename}
        currentName={editingCategory}
      />

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onAdd={handleCategoryAdd}
      />

      {/* Add Widget Modal */}
      <AddWidgetModal
        isOpen={isAddWidgetModalOpen}
        onClose={() => setIsAddWidgetModalOpen(false)}
        onAdd={handleAddWidget}
        existingWidgets={widgetOrder}
      />

      {/* Widget Settings Modal */}
      {widgetSettingsModal.isOpen && widgetSettingsModal.widgetId && (
        <WidgetSettingsModal
          widgetId={widgetSettingsModal.widgetId}
          onClose={() => setWidgetSettingsModal({ isOpen: false, widgetId: null })}
          onSave={(settings) => {
            if (widgetSettingsModal.widgetId) {
              const widgetId = widgetSettingsModal.widgetId
              localStorage.setItem(`widget-${widgetId}-settings`, JSON.stringify(settings))
              setWidgetSettings(prev => ({ ...prev, [widgetId]: settings }))

              // Trigger custom event to update widgets without page reload
              window.dispatchEvent(new Event(`widget-${widgetId}-updated`))
            }
          }}
          currentSettings={widgetSettings[widgetSettingsModal.widgetId] || {}}
        />
      )}
    </div>
  )
}

// Custom Alert Component
function CustomAlert({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-sm w-full p-6">
        <div className="mb-4">
          <p className="text-base text-gray-900 dark:text-gray-100">{message}</p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  )
}

// Widget Settings Modal Component
function WidgetSettingsModal({
  widgetId,
  onClose,
  onSave,
  currentSettings
}: {
  widgetId: string
  onClose: () => void
  onSave: (settings: any) => void
  currentSettings: any
}) {
  const [settings, setSettings] = useState(currentSettings)
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [citySearchQuery, setCitySearchQuery] = useState('')

  const cities = [
    // 특별시/광역시
    '서울', '부산', '대구', '인천', '광주', '대전', '울산',
    // 특별자치시/도
    '세종', '제주',
    // 경기도
    '수원', '성남', '고양', '용인', '부천', '안산', '안양', '남양주', '화성', '평택',
    '의정부', '시흥', '파주', '김포', '광명', '광주(경기)', '군포', '하남', '오산',
    '양주', '이천', '구리', '안성', '포천', '의왕', '양평', '여주', '동두천', '과천', '가평', '연천',
    // 강원도
    '춘천', '원주', '강릉', '동해', '태백', '속초', '삼척', '홍천', '횡성', '영월',
    '평창', '정선', '철원', '화천', '양구', '인제', '고성(강원)', '양양',
    // 충청북도
    '청주', '충주', '제천', '보은', '옥천', '영동', '증평', '진천', '괴산', '음성', '단양',
    // 충청남도
    '천안', '공주', '보령', '아산', '서산', '논산', '계룡', '당진', '금산', '부여',
    '서천', '청양', '홍성', '예산', '태안',
    // 전라북도
    '전주', '군산', '익산', '정읍', '남원', '김제', '완주', '진안', '무주', '장수',
    '임실', '순창', '고창', '부안',
    // 전라남도
    '목포', '여수', '순천', '나주', '광양', '담양', '곡성', '구례', '고흥', '보성',
    '화순', '장흥', '강진', '해남', '영암', '무안', '함평', '영광', '장성', '완도', '진도', '신안',
    // 경상북도
    '포항', '경주', '김천', '안동', '구미', '영주', '영천', '상주', '문경', '경산',
    '의성', '청송', '영양', '영덕', '청도', '고령', '성주', '칠곡', '예천', '봉화', '울진', '울릉',
    // 경상남도
    '창원', '진주', '통영', '사천', '김해', '밀양', '거제', '양산', '의령', '함안',
    '창녕', '고성(경남)', '남해', '하동', '산청', '함양', '거창', '합천'
  ]

  const filteredCities = cities.filter(city =>
    city.toLowerCase().includes(citySearchQuery.toLowerCase())
  )

  useEffect(() => {
    // Initialize settings based on widget type
    if (widgetId === 'weather' && !settings.city) {
      setSettings({ city: '서울' })
    } else if (widgetId === 'pomodoro' && !settings.minutes) {
      setSettings({ minutes: 25 })
    }
  }, [widgetId, settings])

  const handleSave = () => {
    onSave(settings)
    onClose()
  }

  const handleCitySelect = (city: string) => {
    setSettings({ ...settings, city })
    setShowCityDropdown(false)
    setCitySearchQuery('')
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {widgetId === 'weather' && '날씨 위젯 설정'}
            {widgetId === 'pomodoro' && '포모도로 타이머 설정'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Weather Settings */}
        {widgetId === 'weather' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                도시 선택
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 text-left flex items-center justify-between"
                >
                  <span>{settings.city || '서울'}</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showCityDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => {
                        setShowCityDropdown(false)
                        setCitySearchQuery('')
                      }}
                    />
                    <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {/* Search Input */}
                      <div className="sticky top-0 p-2 bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                        <div className="relative">
                          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <input
                            type="text"
                            value={citySearchQuery}
                            onChange={(e) => setCitySearchQuery(e.target.value)}
                            placeholder="도시 검색..."
                            className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>

                      {/* City List */}
                      <div className="max-h-48 overflow-y-auto">
                        {filteredCities.length > 0 ? (
                          filteredCities.map((city) => (
                            <button
                              key={city}
                              onClick={() => handleCitySelect(city)}
                              className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
                                settings.city === city ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
                              }`}
                            >
                              {city}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                            검색 결과가 없습니다
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                현재 위치의 도시를 선택하세요
              </p>
            </div>
          </div>
        )}

        {/* Pomodoro Settings */}
        {widgetId === 'pomodoro' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                집중 시간 (분)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.minutes || 25}
                onChange={(e) => setSettings({ ...settings, minutes: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                1분에서 60분 사이로 설정할 수 있습니다
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                포모도로 기법이란?
              </h4>
              <p className="text-xs text-blue-800 dark:text-blue-400">
                25분 집중 + 5분 휴식을 반복하는 시간 관리 기법입니다.
                집중력을 높이고 생산성을 향상시킬 수 있습니다.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  )
}
