'use client'

import { useState } from 'react'
import { useSortable, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
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
  onDeleteCategory?: () => void
}

export function CategorySection({ id, title, bookmarks, onAddBookmark, onEditBookmark, onDeleteBookmark, onEditCategory, onDeleteCategory }: CategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  // For category sorting (drag handle)
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  // For accepting bookmark drops into this category (separate from sortable)
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `category-drop-${id}`,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 250ms cubic-bezier(0.2, 0, 0, 1)',
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
    willChange: isDragging ? 'transform' : 'auto',
  } as React.CSSProperties

  return (
    <section
      ref={setSortableRef}
      style={style}
      className="mb-8 transform-gpu rounded-lg"
    >
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

          {/* Delete Category Button */}
          {onDeleteCategory && (
            <button
              onClick={onDeleteCategory}
              className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100"
              title="카테고리 삭제"
            >
              <svg className="w-4 h-4 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Droppable Bookmarks Area */}
      {isExpanded && (
        <div
          ref={setDroppableRef}
          className={`min-h-[100px] rounded-lg transition-all duration-200 ${
            isOver ? 'bg-primary/10 ring-2 ring-primary/50 ring-dashed p-2' : ''
          }`}
        >
          {bookmarks.length > 0 ? (
            <SortableContext items={bookmarks.map(b => b.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
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
                    className="flex flex-col items-center justify-center space-y-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-dashed border-primary/30">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center leading-tight">
                      추가
                    </span>
                  </button>
                )}
              </div>
            </SortableContext>
          ) : (
            /* Empty State */
            <div className={`p-8 border-2 border-dashed rounded-lg text-center transition-colors ${
              isOver ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-700'
            }`}>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {isOver ? '여기에 북마크를 놓으세요' : '북마크를 이 카테고리로 드래그하세요'}
              </p>
              {onAddBookmark && (
                <button
                  onClick={onAddBookmark}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  북마크 추가
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
