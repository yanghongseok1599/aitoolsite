'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { BookmarkContextMenu } from './BookmarkContextMenu'

interface BookmarkCardProps {
  id: string
  name: string
  url: string
  icon?: string
  description?: string
  onEdit?: () => void
  onDelete?: () => void
}

export function BookmarkCard({ id, name, url, icon, onEdit, onDelete }: BookmarkCardProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }

  const handleClick = (e: React.MouseEvent) => {
    // Only navigate if not right-clicking
    if (e.button === 0) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
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

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onContextMenu={handleContextMenu}
        onClick={handleClick}
        className="group flex flex-col items-center space-y-1.5 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-grab active:cursor-grabbing"
      >
        {/* Icon */}
        <div className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon ? (
            <img src={icon} alt={name} className="w-full h-full object-contain rounded-full border border-white dark:border-gray-700" />
          ) : (
            <div className={`w-full h-full rounded-full ${getInitialColor(name)} flex items-center justify-center text-white text-sm font-bold border border-white dark:border-gray-700`}>
              {getInitial(name)}
            </div>
          )}
        </div>

        {/* Name */}
        <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 text-center line-clamp-2 group-hover:text-primary transition-colors leading-tight pointer-events-none">
          {name}
        </span>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <BookmarkContextMenu
          isOpen={!!contextMenu}
          onClose={() => setContextMenu(null)}
          position={contextMenu}
          onEdit={() => onEdit?.()}
          onDelete={() => onDelete?.()}
          onAddSubscription={() => alert('구독 추가 기능은 곧 구현됩니다!')}
        />
      )}
    </>
  )
}
