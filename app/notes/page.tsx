'use client'

import { useState, useEffect } from 'react'
import { DashboardHeader } from '@/components/DashboardHeader'
import { useAlert } from '@/contexts/AlertContext'

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  color?: string
  isPinned?: boolean
}

const NOTES_STORAGE_KEY = 'ai-tools-notes'

export default function NotesPage() {
  const { confirm: showConfirm } = useAlert()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // 로컬 스토리지에서 메모 불러오기
  useEffect(() => {
    try {
      const storedNotes = localStorage.getItem(NOTES_STORAGE_KEY)
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes)
        setNotes(parsedNotes)
      } else {
        // 처음 방문시 샘플 데이터 제공
        const sampleNotes: Note[] = [
          {
            id: '1',
            title: '환영합니다! 👋',
            content: '이곳에서 메모를 작성하고 관리할 수 있습니다.\n\n메모는 자동으로 브라우저에 저장되므로 언제든지 다시 확인할 수 있습니다.\n\n- 새 메모 작성하기\n- 메모 검색하기\n- 중요한 메모 고정하기\n\n지금 바로 시작해보세요!',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            color: 'blue',
            isPinned: true
          }
        ]
        setNotes(sampleNotes)
        localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(sampleNotes))
      }
    } catch (error) {
      console.error('Error loading notes from localStorage:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // 메모 변경시 로컬 스토리지에 저장
  useEffect(() => {
    if (!loading && notes.length > 0) {
      try {
        localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes))
      } catch (error) {
        console.error('Error saving notes to localStorage:', error)
      }
    }
  }, [notes, loading])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = diffInMs / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return '방금 전'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}시간 전`
    } else if (diffInHours < 48) {
      return '어제'
    } else {
      return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
    }
  }

  const getColorClass = (color?: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-900/50'
      case 'yellow':
        return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
      case 'green':
        return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/50'
      case 'red':
        return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-900/50'
      case 'purple':
        return 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 hover:bg-purple-200 dark:hover:bg-purple-900/50'
      default:
        return 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
    }
  }

  const handleNewNote = () => {
    setIsEditing(true)
    setEditTitle('')
    setEditContent('')
    setSelectedNote(null)
  }

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note)
    setIsEditing(false)
  }

  const handleEditNote = () => {
    if (selectedNote) {
      setEditTitle(selectedNote.title)
      setEditContent(selectedNote.content)
      setIsEditing(true)
    }
  }

  const handleSaveNote = () => {
    if (selectedNote) {
      // 기존 노트 수정
      setNotes(prev => prev.map(note =>
        note.id === selectedNote.id
          ? { ...note, title: editTitle, content: editContent, updatedAt: new Date().toISOString() }
          : note
      ))
      setSelectedNote({ ...selectedNote, title: editTitle, content: editContent })
    } else {
      // 새 노트 생성
      const newNote: Note = {
        id: Date.now().toString(),
        title: editTitle || '제목 없음',
        content: editContent,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        color: 'yellow',
        isPinned: false
      }
      setNotes(prev => [newNote, ...prev])
      setSelectedNote(newNote)
    }
    setIsEditing(false)
  }

  const handleDeleteNote = async (noteId: string) => {
    const confirmed = await showConfirm('이 메모를 삭제하시겠습니까?')
    if (confirmed) {
      const updatedNotes = notes.filter(note => note.id !== noteId)
      setNotes(updatedNotes)
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updatedNotes))
      if (selectedNote?.id === noteId) {
        setSelectedNote(null)
      }
    }
  }

  const togglePin = (noteId: string) => {
    setNotes(prev => prev.map(note =>
      note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
    ))
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pinnedNotes = filteredNotes.filter(note => note.isPinned)
  const unpinnedNotes = filteredNotes.filter(note => !note.isPinned)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                메모
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                빠르게 메모하고 정리하세요
              </p>
            </div>

            <button
              onClick={handleNewNote}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              새 메모
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="메모 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-11 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
            />
            <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notes List */}
          <div className="lg:col-span-1 space-y-4">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery ? '검색 결과가 없습니다' : '작성된 메모가 없습니다'}
                </p>
              </div>
            ) : (
              <>
                {pinnedNotes.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2">
                      고정된 메모
                    </h3>
                    {pinnedNotes.map((note) => (
                      <div
                        key={note.id}
                        onClick={() => handleSelectNote(note)}
                        className={`p-4 rounded-lg border-l-4 cursor-pointer transition-colors ${getColorClass(note.color)} ${
                          selectedNote?.id === note.id ? 'ring-2 ring-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                            {note.title}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              togglePin(note.id)
                            }}
                            className="flex-shrink-0 text-yellow-600 dark:text-yellow-400"
                          >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M17 4v7l2 3v2h-6v5l-1 1-1-1v-5H5v-2l2-3V4c0-1.1.9-2 2-2h6c1.11 0 2 .89 2 2z" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {note.content}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-500 mt-2 block">
                          {formatDate(note.updatedAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {unpinnedNotes.length > 0 && (
                  <div className="space-y-2">
                    {pinnedNotes.length > 0 && (
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mt-4">
                        모든 메모
                      </h3>
                    )}
                    {unpinnedNotes.map((note) => (
                      <div
                        key={note.id}
                        onClick={() => handleSelectNote(note)}
                        className={`p-4 rounded-lg border-l-4 cursor-pointer transition-colors ${getColorClass(note.color)} ${
                          selectedNote?.id === note.id ? 'ring-2 ring-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                            {note.title}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              togglePin(note.id)
                            }}
                            className="flex-shrink-0 text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {note.content}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-500 mt-2 block">
                          {formatDate(note.updatedAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Note Detail / Editor */}
          <div className="lg:col-span-2">
            {isEditing ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full text-2xl font-bold bg-transparent border-none focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
                  />
                </div>
                <textarea
                  placeholder="메모 내용을 입력하세요..."
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-96 bg-transparent border-none focus:outline-none resize-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
                />
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {editContent.length} 자
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        if (!selectedNote) {
                          setEditTitle('')
                          setEditContent('')
                        }
                      }}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleSaveNote}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      저장
                    </button>
                  </div>
                </div>
              </div>
            ) : selectedNote ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {selectedNote.title}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleEditNote}
                      className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteNote(selectedNote.id)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  마지막 수정: {formatDate(selectedNote.updatedAt)}
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">
                    {selectedNote.content}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  메모를 선택하거나 새로 작성하세요
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  왼쪽에서 메모를 선택하거나 새 메모를 작성해보세요
                </p>
                <button
                  onClick={handleNewNote}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  새 메모 작성
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
