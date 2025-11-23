'use client'

import { useState } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { DashboardHeader } from '@/components/DashboardHeader'
import { CategorySection, Bookmark } from '@/components/CategorySection'
import { AddToolModal } from '@/components/AddToolModal'
import { EditCategoryModal } from '@/components/EditCategoryModal'
import { AddCategoryModal } from '@/components/AddCategoryModal'

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

export default function Home() {
  const [bookmarks, setBookmarks] = useState(sampleBookmarks)
  const [categoryOrder, setCategoryOrder] = useState(Object.keys(sampleBookmarks))
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [editingBookmark, setEditingBookmark] = useState<{ category: string; bookmark: Bookmark } | null>(null)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState('')
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setCategoryOrder((items) => {
        const oldIndex = items.indexOf(active.id as string)
        const newIndex = items.indexOf(over.id as string)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleAddCategory = () => {
    setIsAddCategoryModalOpen(true)
  }

  const handleCategoryAdd = (categoryName: string) => {
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
    setCategoryOrder(prev => [...prev, categoryName])
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

  const handleDeleteBookmark = (category: string, bookmarkId: string) => {
    if (confirm('이 도구를 삭제하시겠습니까?')) {
      setBookmarks(prev => ({
        ...prev,
        [category]: prev[category].filter(b => b.id !== bookmarkId)
      }))
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedCategory('')
    setEditingBookmark(null)
  }

  const handleToolAdd = (tool: { name: string; url: string; icon?: string }) => {
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
    } else {
      // Add new bookmark
      const newId = Date.now().toString()
      const newBookmark: Bookmark = {
        id: newId,
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

  const handleCategoryRename = (newName: string) => {
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
    setCategoryOrder(prev =>
      prev.map(cat => cat === editingCategory ? newName : cat)
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader onAddCategory={handleAddCategory} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-primary via-blue-600 to-purple-600 text-white">
          <h1 className="text-3xl font-bold mb-2">AI 도구 대시보드에 오신 것을 환영합니다! 👋</h1>
          <p className="text-white/90">
            자주 사용하는 AI 도구들을 한곳에서 관리하고 빠르게 접근하세요.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
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
            <a
              href="/landing"
              className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
            >
              랜딩 페이지 보기
            </a>
          </div>
        </div>

        {/* Categories */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
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
        </DndContext>

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
    </div>
  )
}
