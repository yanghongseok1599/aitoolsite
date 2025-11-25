'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { getUserNotes } from '@/lib/firestore'

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  color?: string
}

export function NotesWidget() {
  const { data: session } = useSession()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  // Firestore에서 메모 불러오기
  useEffect(() => {
    const loadNotes = async () => {
      if (!session?.user?.email) {
        setLoading(false)
        return
      }

      try {
        const firestoreNotes = await getUserNotes(session.user.email)
        const formattedNotes = firestoreNotes.map(note => ({
          id: note.id,
          title: note.title,
          content: note.content,
          createdAt: note.createdAt.toDate().toISOString(),
          updatedAt: note.updatedAt.toDate().toISOString(),
          color: note.color,
        }))
        setNotes(formattedNotes)
      } catch (error) {
        console.error('Error loading notes from Firestore:', error)
      } finally {
        setLoading(false)
      }
    }

    loadNotes()
  }, [session])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return '오늘'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '어제'
    } else {
      return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
    }
  }

  const getColorClass = (color?: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'
      case 'yellow':
        return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700'
      case 'green':
        return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700'
      case 'red':
        return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700'
      default:
        return 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            빠른 메모
          </h3>
        </div>
        <Link
          href="/notes"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          전체보기
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <p className="text-gray-600 dark:text-gray-400 text-sm">작성된 메모가 없습니다</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notes.slice(0, 3).map((note) => (
            <div
              key={note.id}
              className={`p-3 rounded-lg border-l-4 hover:shadow-sm transition-shadow cursor-pointer ${getColorClass(note.color)}`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                  {note.title}
                </h4>
                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {formatDate(note.updatedAt)}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                {note.content}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <Link
          href="/notes"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 메모 작성
        </Link>
      </div>
    </div>
  )
}
