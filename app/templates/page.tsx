'use client'

import { useState } from 'react'
import { DashboardHeader } from '@/components/DashboardHeader'
import { useAlert } from '@/contexts/AlertContext'

interface Template {
  id: string
  title: string
  description: string
  category: string
  content: string
  tags: string[]
  usageCount: number
  createdAt: Date
  isFavorite: boolean
  keyFeatures?: string[]
}

export default function TemplatesPage() {
  const { confirm: showConfirm } = useAlert()
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      title: 'AI SaaS 랜딩페이지',
      description: '인공지능 서비스를 위한 현대적인 랜딩페이지',
      category: 'SaaS',
      content: 'NextJS와 TypeScript, Tailwind CSS를 사용해서 AI SaaS 서비스를 위한 랜딩페이지를 만들어줘.\n\n구조:\n- AI 챗봇 인터페이스\n- 실시간 데모\n- 통계 대시보드\n\n주요 기능:\n- 가격 플랜\n- 통계 데모 기능 (자동, 문서 통계)\n- FAQ\n\n기술 스택: React, TypeScript, Tailwind CSS, Framer Motion',
      tags: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      keyFeatures: ['AI 챗봇 인터페이스', '실시간 데모', '통계 대시보드'],
      usageCount: 1847,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      isFavorite: true
    },
    {
      id: '2',
      title: 'CRM 대시보드',
      description: '고객 관리를 위한 종합 대시보드',
      category: '대시보드',
      content: 'NextJS와 TypeScript, Tailwind CSS를 사용해서 CRM 대시보드를 만들어줘.\n\n레이아웃:\n1. 사이드바 네비게이션 (대시보드, 고객, 영업, 작업, 보고서, 설정)\n2. 상단 헤더 (검색, 알림, 프로필)\n3. 메인 콘텐츠 영역\n\n주요 기능:\n- 고객 데이터 관리\n- 메종 분석 차트\n- 팀 협업\n\n기술 스택: React, TypeScript, Tailwind CSS, Chart.js, Zustand',
      tags: ['React', 'TypeScript', 'Tailwind CSS', 'Chart.js', 'Zustand'],
      keyFeatures: ['고객 데이터 관리', '메종 분석 차트', '팀 협업'],
      usageCount: 1235,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      isFavorite: false
    },
    {
      id: '3',
      title: 'HR 관리 플랫폼',
      description: '인사 관리 및 직원 셀프서비스 포털',
      category: 'SaaS',
      content: 'NextJS와 TypeScript, Tailwind CSS를 사용해서 HR 관리 플랫폼을 만들어줘.\n\n관리자 영역:\n1. 직원 관리\n   - 직원 목록 및 검색\n   - 개인정보 관리\n2. 휴가 신청\n   - 휴가 캘린더\n   - 승인 워크플로우\n3. 성과 평가\n   - 평가 템플릿\n   - 피드백 시스템\n\n기술 스택: React, TypeScript, Tailwind CSS, React Hook Form',
      tags: ['React', 'TypeScript', 'Tailwind CSS', 'React Hook Form'],
      keyFeatures: ['직원 관리', '급여 계산', '성과 평가'],
      usageCount: 445,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      isFavorite: true
    },
    {
      id: '4',
      title: 'E-commerce 쇼핑몰',
      description: '온라인 쇼핑몰 웹사이트',
      category: 'E-commerce',
      content: 'NextJS와 TypeScript를 사용해서 E-commerce 쇼핑몰을 만들어줘.\n\n페이지 구성:\n- 홈페이지 (상품 목록)\n- 상품 상세\n- 장바구니\n- 결제\n- 주문 내역\n\n기능:\n- 상품 검색 및 필터링\n- 장바구니 관리\n- 결제 시스템\n- 사용자 인증',
      tags: ['React', 'TypeScript', 'Stripe', 'Next.js'],
      keyFeatures: ['상품 검색', '장바구니', '결제 시스템'],
      usageCount: 756,
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      isFavorite: false
    },
    {
      id: '5',
      title: '프로플로우 관리 시스템',
      description: '기업을 위한 워크플로우 자동화',
      category: '기업',
      content: '기업용 워크플로우 관리 시스템을 만들어줘.\n\n주요 기능:\n- 태스크 관리\n- 팀 협업\n- 프로젝트 타임라인\n- 리포트 생성\n\n기술 스택: React, TypeScript, Node.js, MongoDB',
      tags: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
      keyFeatures: ['태스크 관리', '팀 협업', '프로젝트 타임라인'],
      usageCount: 634,
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      isFavorite: false
    },
    {
      id: '6',
      title: '스타트업 랜딩페이지',
      description: '스타트업을 위한 모던한 랜딩페이지',
      category: '스타트업',
      content: '스타트업을 위한 랜딩페이지를 만들어줘.\n\n섹션:\n- Hero 섹션\n- 기능 소개\n- 팀 소개\n- 가격 플랜\n- CTA\n\n디자인: 모던하고 깔끔한 디자인',
      tags: ['React', 'Tailwind CSS', 'Framer Motion'],
      keyFeatures: ['Hero 섹션', '기능 소개', '가격 플랜'],
      usageCount: 523,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      isFavorite: true
    }
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    description: '',
    category: 'SaaS',
    content: '',
    tags: '',
    keyFeatures: ''
  })
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ['all', 'SaaS', '프로플로우', 'E-commerce', '블로그', '기업', '스타트업', '대시보드']

  const filteredTemplates = templates.filter(t => {
    const categoryMatch = selectedCategory === 'all' || t.category === selectedCategory
    const searchMatch = searchQuery === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return categoryMatch && searchMatch
  })

  const addTemplate = () => {
    if (!newTemplate.title || !newTemplate.content) {
      alert('제목과 내용을 입력해주세요')
      return
    }

    const template: Template = {
      id: Date.now().toString(),
      title: newTemplate.title,
      description: newTemplate.description,
      category: newTemplate.category,
      content: newTemplate.content,
      tags: newTemplate.tags.split(',').map(t => t.trim()).filter(t => t),
      keyFeatures: newTemplate.keyFeatures ? newTemplate.keyFeatures.split(',').map(t => t.trim()).filter(t => t) : [],
      usageCount: 0,
      createdAt: new Date(),
      isFavorite: false
    }

    setTemplates(prev => [template, ...prev])
    setIsModalOpen(false)
    setNewTemplate({
      title: '',
      description: '',
      category: 'SaaS',
      content: '',
      tags: '',
      keyFeatures: ''
    })
  }

  const openEditModal = (template: Template) => {
    setEditingTemplate(template)
    setNewTemplate({
      title: template.title,
      description: template.description,
      category: template.category,
      content: template.content,
      tags: template.tags.join(', '),
      keyFeatures: template.keyFeatures?.join(', ') || ''
    })
    setIsEditMode(true)
    setIsModalOpen(true)
  }

  const updateTemplate = () => {
    if (!editingTemplate || !newTemplate.title || !newTemplate.content) {
      alert('제목과 내용을 입력해주세요')
      return
    }

    const updatedTemplate: Template = {
      ...editingTemplate,
      title: newTemplate.title,
      description: newTemplate.description,
      category: newTemplate.category,
      content: newTemplate.content,
      tags: newTemplate.tags.split(',').map(t => t.trim()).filter(t => t),
      keyFeatures: newTemplate.keyFeatures ? newTemplate.keyFeatures.split(',').map(t => t.trim()).filter(t => t) : []
    }

    setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? updatedTemplate : t))
    setIsModalOpen(false)
    setIsEditMode(false)
    setEditingTemplate(null)
    setNewTemplate({
      title: '',
      description: '',
      category: 'SaaS',
      content: '',
      tags: '',
      keyFeatures: ''
    })
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setIsEditMode(false)
    setEditingTemplate(null)
    setNewTemplate({
      title: '',
      description: '',
      category: 'SaaS',
      content: '',
      tags: '',
      keyFeatures: ''
    })
  }

  const toggleFavorite = (id: string) => {
    setTemplates(prev => prev.map(t =>
      t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
    ))
  }

  const deleteTemplate = async (id: string) => {
    const confirmed = await showConfirm('이 템플릿을 삭제하시겠습니까?')
    if (confirmed) {
      setTemplates(prev => prev.filter(t => t.id !== id))
      if (selectedTemplate?.id === id) {
        setSelectedTemplate(null)
      }
    }
  }

  const useTemplate = (template: Template) => {
    setTemplates(prev => prev.map(t =>
      t.id === template.id ? { ...t, usageCount: t.usageCount + 1 } : t
    ))
    navigator.clipboard.writeText(template.content)
    alert('템플릿이 클립보드에 복사되었습니다!')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                템플릿 모음
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {filteredTemplates.length}개의 템플릿을 찾았습니다
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              새 템플릿
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="템플릿 검색... (제목, 설명, 기술스택)"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {cat === 'all' ? '전체' : cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-xs font-medium text-blue-600 dark:text-blue-400 rounded-full">
                      {template.category}
                    </span>
                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-xs font-medium text-yellow-600 dark:text-yellow-400 rounded-full">
                      intermediate
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(template.id)
                    }}
                    className="flex-shrink-0"
                  >
                    {template.isFavorite ? (
                      <svg className="w-6 h-6 text-yellow-500 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    )}
                  </button>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {template.title}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {template.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {template.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Key Features Section */}
                {template.keyFeatures && template.keyFeatures.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">주요 기능:</h4>
                    <ul className="space-y-1">
                      {template.keyFeatures.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                          <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prompt Preview Section */}
                <div className="mb-4 bg-gray-900 dark:bg-gray-950 rounded-lg p-4 relative">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">프롬프트 미리보기</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigator.clipboard.writeText(template.content)
                        alert('프롬프트가 클립보드에 복사되었습니다!')
                      }}
                      className="text-gray-400 hover:text-gray-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <textarea
                    onClick={(e) => e.stopPropagation()}
                    value={template.content}
                    onChange={(e) => {
                      e.stopPropagation()
                      const updatedTemplate = { ...template, content: e.target.value }
                      setTemplates(prev => prev.map(t => t.id === template.id ? updatedTemplate : t))
                    }}
                    className="w-full text-xs text-gray-300 font-mono leading-relaxed bg-transparent border-none outline-none resize-none max-h-24 overflow-y-auto custom-scrollbar"
                    rows={4}
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>{template.usageCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{Math.floor(template.usageCount / 10)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-yellow-500">
                    <span className="text-yellow-500">★</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {(4.5 + Math.random() * 0.5).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    useTemplate(template)
                  }}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  프롬프트 복사
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-400">
              검색 결과가 없습니다
            </p>
          </div>
        )}
      </div>

      {/* Add Template Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {isEditMode ? '템플릿 수정' : '새 템플릿 추가'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  제목 *
                </label>
                <input
                  type="text"
                  value={newTemplate.title}
                  onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                  placeholder="템플릿 제목"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  설명
                </label>
                <input
                  type="text"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  placeholder="템플릿 설명"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  카테고리
                </label>
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                >
                  {categories.filter(c => c !== 'all').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  태그 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  value={newTemplate.tags}
                  onChange={(e) => setNewTemplate({ ...newTemplate, tags: e.target.value })}
                  placeholder="React, TypeScript, Tailwind CSS"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  주요 기능 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  value={newTemplate.keyFeatures}
                  onChange={(e) => setNewTemplate({ ...newTemplate, keyFeatures: e.target.value })}
                  placeholder="기능1, 기능2, 기능3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  템플릿 내용 *
                </label>
                <textarea
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                  placeholder="템플릿 내용을 입력하세요"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 font-mono text-sm"
                  rows={10}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                취소
              </button>
              <button
                onClick={isEditMode ? updateTemplate : addTemplate}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {isEditMode ? '수정' : '추가'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
