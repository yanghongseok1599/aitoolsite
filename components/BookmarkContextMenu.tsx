'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface BookmarkContextMenuProps {
  isOpen: boolean
  onClose: () => void
  position: { x: number; y: number }
  onEdit: () => void
  onDelete: () => void
  onAddSubscription?: () => void
}

export function BookmarkContextMenu({
  isOpen,
  onClose,
  position,
  onEdit,
  onDelete,
  onAddSubscription
}: BookmarkContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [adjustedPosition, setAdjustedPosition] = useState(position)
  const [mounted, setMounted] = useState(false)

  // Portal을 위해 클라이언트 사이드에서만 마운트
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    // 메뉴 크기를 기준으로 위치 조정 (메뉴가 렌더링되기 전에 예상 크기로 계산)
    const menuWidth = 160
    const menuHeight = 150
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let { x, y } = position

    // Adjust horizontal position if menu goes off screen
    if (x + menuWidth > viewportWidth) {
      x = viewportWidth - menuWidth - 10
    }

    // Adjust vertical position if menu goes off screen
    if (y + menuHeight > viewportHeight) {
      y = viewportHeight - menuHeight - 10
    }

    // Make sure menu doesn't go off left edge
    if (x < 10) {
      x = 10
    }

    // Make sure menu doesn't go off top edge
    if (y < 10) {
      y = 10
    }

    setAdjustedPosition({ x, y })
  }, [isOpen, position])

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    // 약간의 딜레이를 주어 현재 클릭 이벤트가 완료된 후에 리스너 등록
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }, 0)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen || !mounted) return null

  const menuContent = (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        top: `${adjustedPosition.y}px`,
        left: `${adjustedPosition.x}px`,
        zIndex: 2147483647
      }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 py-1 min-w-[160px] animate-in fade-in zoom-in-95 duration-100"
    >
      {onAddSubscription && (
        <button
          onClick={onAddSubscription}
          className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>구독 추가</span>
        </button>
      )}

      <button
        onClick={onEdit}
        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        <span>수정</span>
      </button>

      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

      <button
        onClick={onDelete}
        className="w-full px-4 py-2.5 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-3 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span>삭제</span>
      </button>
    </div>
  )

  // Portal을 사용하여 document.body에 직접 렌더링
  return createPortal(menuContent, document.body)
}
