'use client'

import { useState, useRef, useEffect } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { BookmarkContextMenu } from './BookmarkContextMenu'
import { useAlert } from '@/contexts/AlertContext'

interface BookmarkCardProps {
  id: string
  name: string
  url: string
  icon?: string
  description?: string
  onEdit?: () => void
  onDelete?: () => void
  isDragOverlay?: boolean
}

export function BookmarkCard({ id, name, url, icon, onEdit, onDelete, isDragOverlay = false }: BookmarkCardProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [iconError, setIconError] = useState(false)
  const { alert: showAlert } = useAlert()
  const mouseDownPos = useRef<{ x: number; y: number } | null>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 150ms cubic-bezier(0.25, 1, 0.5, 1)',
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 1000 : 'auto',
    willChange: 'transform',
    touchAction: 'none',
  } as React.CSSProperties

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      mouseDownPos.current = { x: e.clientX, y: e.clientY }
    }
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (e.button === 0 && mouseDownPos.current && !isDragging) {
      const dx = Math.abs(e.clientX - mouseDownPos.current.x)
      const dy = Math.abs(e.clientY - mouseDownPos.current.y)
      if (dx < 5 && dy < 5) {
        window.open(url, '_blank', 'noopener,noreferrer')
      }
    }
    mouseDownPos.current = null
  }

  const getInitialGradient = (name: string) => {
    const gradients = [
      'bg-gradient-to-br from-red-400 to-pink-500',
      'bg-gradient-to-br from-blue-400 to-indigo-500',
      'bg-gradient-to-br from-green-400 to-emerald-500',
      'bg-gradient-to-br from-yellow-400 to-orange-500',
      'bg-gradient-to-br from-purple-400 to-violet-500',
      'bg-gradient-to-br from-pink-400 to-rose-500',
      'bg-gradient-to-br from-indigo-400 to-blue-500',
      'bg-gradient-to-br from-orange-400 to-red-500',
      'bg-gradient-to-br from-teal-400 to-cyan-500',
      'bg-gradient-to-br from-cyan-400 to-blue-500',
    ]
    const hash = name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc)
    }, 0)
    return gradients[Math.abs(hash) % gradients.length]
  }

  const getInitial = (name: string) => {
    return name.trim().charAt(0).toUpperCase() || '?'
  }

  // Google 파비콘 서비스 URL인 경우 서버에서 placeholder 체크
  useEffect(() => {
    if (!icon) return

    const isGoogleFavicon = icon.includes('google.com/s2/favicons') || icon.includes('gstatic.com')
    if (!isGoogleFavicon) return

    const checkFavicon = async () => {
      try {
        const res = await fetch(`/api/check-favicon?url=${encodeURIComponent(icon)}`)
        const data = await res.json()
        if (data.isPlaceholder) {
          setIconError(true)
        }
      } catch {
        // 에러 시 그냥 표시
      }
    }

    checkFavicon()
  }, [icon])

  const renderIcon = () => {
    if (icon && !iconError) {
      return (
        <img
          src={icon}
          alt={name}
          className="w-full h-full object-contain rounded-full"
          onError={() => setIconError(true)}
        />
      )
    }
    return (
      <div className={`w-full h-full rounded-full ${getInitialGradient(name)} flex items-center justify-center text-white text-base font-bold shadow-inner`}>
        {getInitial(name)}
      </div>
    )
  }

  if (isDragOverlay) {
    return (
      <div className="flex flex-col items-center space-y-1 p-1 animate-pulse">
        <div className="w-14 h-14 rounded-full shadow-2xl ring-3 ring-primary/50 scale-110
          bg-white dark:bg-gray-800">
          {renderIcon()}
        </div>
        <span className="text-[10px] font-semibold text-gray-800 dark:text-gray-200 text-center w-full break-words leading-tight
          bg-white/80 dark:bg-gray-800/80 px-2 py-0.5 rounded-full backdrop-blur-sm">
          {name}
        </span>
      </div>
    )
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`flex flex-col items-center space-y-1 p-1 transform-gpu ${
          isDragging ? 'opacity-40 scale-95' : ''
        }`}
      >
        {/* 원형 아이콘만 인터랙션 */}
        <div
          {...attributes}
          {...listeners}
          onContextMenu={handleContextMenu}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className={`w-12 h-12 rounded-full cursor-pointer transform-gpu
            transition-all duration-150 ease-out
            ${isDragging
              ? 'scale-90 opacity-50'
              : 'hover:scale-110 hover:shadow-lg hover:shadow-primary/25 active:scale-95'
            }`}
        >
          {renderIcon()}
        </div>
        <span className={`text-[10px] font-medium text-center w-full break-words leading-tight pointer-events-none
          transition-opacity duration-150
          ${isDragging ? 'opacity-50 text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {name}
        </span>
      </div>

      {contextMenu && (
        <BookmarkContextMenu
          isOpen={!!contextMenu}
          onClose={() => setContextMenu(null)}
          position={contextMenu}
          onEdit={() => {
            setContextMenu(null)
            onEdit?.()
          }}
          onDelete={() => {
            setContextMenu(null)
            onDelete?.()
          }}
          onAddSubscription={() => {
            setContextMenu(null)
            showAlert('구독 추가 기능은 곧 구현됩니다!')
          }}
        />
      )}
    </>
  )
}
