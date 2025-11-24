'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ReactNode, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface SortableWidgetProps {
  id: string
  children: ReactNode
  onMoveToBanner?: (id: string) => void
  onRemove?: (id: string) => void
  canMoveToBanner?: boolean
}

export function SortableWidget({ id, children, onMoveToBanner, onRemove, canMoveToBanner = true }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

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

    // 메뉴 크기 예상 (실제 렌더링되는 크기)
    const menuWidth = 180
    const menuHeight = canMoveToBanner && onMoveToBanner ? 100 : 56

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

  const handleDelete = () => {
    if (onRemove) {
      onRemove(id)
    }
    handleCloseContextMenu()
  }

  const handleMoveToBanner = () => {
    if (onMoveToBanner) {
      onMoveToBanner(id)
    }
    handleCloseContextMenu()
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="relative group"
        onContextMenu={handleContextMenu}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 z-10 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity cursor-move shadow-sm"
          title="드래그하여 위치 변경"
        >
          <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>

        {children}
      </div>

      {/* Context Menu Portal */}
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
            {canMoveToBanner && onMoveToBanner && (
              <button
                onClick={handleMoveToBanner}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                배너로 이동
              </button>
            )}
            {onRemove && (
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                삭제
              </button>
            )}
          </div>
        </>,
        document.body
      )}
    </>
  )
}
