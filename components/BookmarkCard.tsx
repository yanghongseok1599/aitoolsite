'use client'

import { useState, useRef } from 'react'
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
    transition: transition || 'transform 200ms cubic-bezier(0.2, 0, 0, 1)',
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
    willChange: isDragging ? 'transform' : 'auto',
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
      // 마우스가 5px 이내로만 움직였으면 클릭으로 간주
      if (dx < 5 && dy < 5) {
        window.open(url, '_blank', 'noopener,noreferrer')
      }
    }
    mouseDownPos.current = null
  }

  // Generate a consistent color based on name
  const getInitialColor = (name: string) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500',
      'bg-teal-500',
      'bg-cyan-500',
    ]

    const hash = name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc)
    }, 0)

    return colors[Math.abs(hash) % colors.length]
  }

  const getInitial = (name: string) => {
    return name.trim().charAt(0).toUpperCase() || '?'
  }

  // If it's in DragOverlay, render static version without drag handlers
  if (isDragOverlay) {
    return (
      <div className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-lg">
        {/* Icon */}
        <div className="w-12 h-12 flex items-center justify-center">
          {icon && !iconError ? (
            <img
              src={icon}
              alt={name}
              className="w-full h-full object-contain rounded-full dark:border-2 dark:border-gray-700"
              onError={() => setIconError(true)}
            />
          ) : (
            <div className={`w-full h-full rounded-full ${getInitialColor(name)} flex items-center justify-center text-white text-base font-bold dark:border-2 dark:border-gray-700`}>
              {getInitial(name)}
            </div>
          )}
        </div>

        {/* Name */}
        <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 text-center w-full break-words leading-tight">
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
        {...attributes}
        {...listeners}
        onContextMenu={handleContextMenu}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="group flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer transform-gpu"
      >
        {/* Icon */}
        <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon && !iconError ? (
            <img
              src={icon}
              alt={name}
              className="w-full h-full object-contain rounded-full dark:border-2 dark:border-gray-700"
              onError={() => setIconError(true)}
            />
          ) : (
            <div className={`w-full h-full rounded-full ${getInitialColor(name)} flex items-center justify-center text-white text-base font-bold dark:border-2 dark:border-gray-700`}>
              {getInitial(name)}
            </div>
          )}
        </div>

        {/* Name */}
        <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 text-center w-full break-words group-hover:text-primary transition-colors leading-tight">
          {name}
        </span>
      </div>

      {/* Context Menu */}
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
