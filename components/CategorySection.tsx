'use client'

import { useState } from 'react'
import { useSortable, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { BookmarkCard } from './BookmarkCard'

export interface Bookmark {
  id: string
  name: string
  url: string
  icon?: string
  description?: string
}

interface CategorySectionProps {
  id: string
  title: string
  bookmarks: Bookmark[]
  onAddBookmark?: () => void
  onEditBookmark?: (id: string) => void
  onDeleteBookmark?: (id: string) => void
  onEditCategory?: () => void
}

export function CategorySection({ id, title, bookmarks, onAddBookmark, onEditBookmark, onDeleteBookmark, onEditCategory }: CategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)

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

  return (
    <section ref={setNodeRef} style={style} className="mb-8">
      {/* Category Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 group flex-1">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            title="드래그하여 순서 변경"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </button>

          {/* Expand/Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2"
          >
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
              {title}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({bookmarks.length})
            </span>
          </button>

          {/* Edit Category Button */}
          {onEditCategory && (
            <button
              onClick={onEditCategory}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
              title="카테고리 이름 수정"
            >
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Bookmarks Grid */}
      {isExpanded && (
        <SortableContext items={bookmarks.map(b => b.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
            {bookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                id={bookmark.id}
                name={bookmark.name}
                url={bookmark.url}
                icon={bookmark.icon}
                description={bookmark.description}
                onEdit={() => onEditBookmark?.(bookmark.id)}
                onDelete={() => onDeleteBookmark?.(bookmark.id)}
              />
            ))}

            {/* Add New Card */}
            {onAddBookmark && (
              <button
                onClick={onAddBookmark}
                className="flex flex-col items-center space-y-1.5 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 text-center leading-tight">
                  추가
                </span>
              </button>
            )}
          </div>
        </SortableContext>
      )}

      {/* Empty State */}
      {isExpanded && bookmarks.length === 0 && (
        <div className="text-center py-8 text-gray-400 dark:text-gray-500">
          <p className="text-sm">이 카테고리에 아직 도구가 없습니다</p>
        </div>
      )}
    </section>
  )
}
