'use client'

import { useState, useEffect } from 'react'
import { useAlert } from '@/contexts/AlertContext'

interface AddToolModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (tool: { name: string; url: string; icon?: string }) => void
  categoryName: string
  initialData?: { name: string; url: string; icon?: string }
}

export function AddToolModal({ isOpen, onClose, onAdd, categoryName, initialData }: AddToolModalProps) {
  const [serviceName, setServiceName] = useState('')
  const [url, setUrl] = useState('')
  const [iconUrl, setIconUrl] = useState('')
  const [iconPreview, setIconPreview] = useState('')
  const [activeTab, setActiveTab] = useState<'auto' | 'upload'>('auto')
  const [isLoading, setIsLoading] = useState(false)
  const { alert: showAlert } = useAlert()

  // Update form when initialData changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setServiceName(initialData.name)
        setUrl(initialData.url)
        setIconUrl(initialData.icon || '')
        setIconPreview(initialData.icon || '')
      } else {
        setServiceName('')
        setUrl('')
        setIconUrl('')
        setIconPreview('')
      }
    }
  }, [initialData, isOpen])

  // Auto-detect icon when URL changes
  useEffect(() => {
    if (url && activeTab === 'auto' && !initialData) {
      const timeoutId = setTimeout(() => {
        detectIcon(url)
      }, 500) // Debounce to avoid too many requests while typing

      return () => clearTimeout(timeoutId)
    }
  }, [url, activeTab, initialData])

  const detectIcon = async (websiteUrl: string) => {
    setIsLoading(true)
    try {
      // Normalize URL
      let normalizedUrl = websiteUrl.trim()
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = 'https://' + normalizedUrl
      }

      const urlObj = new URL(normalizedUrl)
      const domain = urlObj.origin
      const hostname = urlObj.hostname

      // Try multiple favicon sources in order
      const faviconSources = [
        `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`,
        `https://icons.duckduckgo.com/ip3/${hostname}.ico`,
        `${domain}/favicon.ico`,
        `${domain}/favicon.png`,
        `${domain}/apple-touch-icon.png`,
      ]

      let iconFound = false

      for (const faviconUrl of faviconSources) {
        try {
          // Create a promise that resolves when image loads or rejects on error
          await new Promise<void>((resolve, reject) => {
            const img = new Image()

            const timeout = setTimeout(() => {
              reject(new Error('Timeout'))
            }, 3000) // 3 second timeout per source

            img.onload = () => {
              clearTimeout(timeout)
              // Check if the image actually has dimensions (not a placeholder)
              if (img.width > 0 && img.height > 0) {
                setIconPreview(faviconUrl)
                setIconUrl(faviconUrl)
                iconFound = true
                resolve()
              } else {
                reject(new Error('Invalid image'))
              }
            }

            img.onerror = () => {
              clearTimeout(timeout)
              reject(new Error('Failed to load'))
            }

            img.src = faviconUrl
          })

          // If we successfully loaded an icon, break the loop
          if (iconFound) break
        } catch {
          // Continue to next source
          continue
        }
      }

      // If no icon was found, leave it empty (will show initial fallback)
      if (!iconFound) {
        setIconPreview('')
        setIconUrl('')
      }
    } catch (error) {
      console.error('Icon detection failed:', error)
      // Leave empty on failure (will show initial fallback)
      setIconPreview('')
      setIconUrl('')
    } finally {
      setIsLoading(false)
    }
  }

  // Generate a consistent color based on service name
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!serviceName.trim() || !url.trim()) {
      showAlert('서비스 이름과 URL을 모두 입력해주세요.', { type: 'warning' })
      return
    }

    let normalizedUrl = url.trim()
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl
    }

    onAdd({
      name: serviceName.trim(),
      url: normalizedUrl,
      icon: iconUrl || iconPreview
    })

    // Reset form
    setServiceName('')
    setUrl('')
    setIconUrl('')
    setIconPreview('')
    onClose()
  }

  const handleManualIconUrl = () => {
    if (iconUrl) {
      setIconPreview(iconUrl)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {initialData ? '도구 수정' : '도구 추가'} - {categoryName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Service Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              서비스 이름
            </label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="예: My AI Tool"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="예: myaitool.com"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Icon Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              아이콘
            </label>

            {/* Tabs */}
            <div className="flex space-x-2 mb-3">
              <button
                type="button"
                onClick={() => setActiveTab('auto')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'auto'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                자동 감지
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'upload'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                직접 업로드
              </button>
            </div>

            {/* Tab Content */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              {activeTab === 'auto' ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    URL을 입력하면 자동으로 아이콘을 감지합니다
                  </p>
                  {isLoading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  )}
                  {!isLoading && (
                    <div className="flex items-center justify-center py-4">
                      {iconPreview ? (
                        <img
                          src={iconPreview}
                          alt="Icon preview"
                          className="w-16 h-16 object-contain rounded-full border border-white dark:border-gray-600"
                        />
                      ) : serviceName ? (
                        <div className={`w-16 h-16 rounded-full ${getInitialColor(serviceName)} flex items-center justify-center text-white text-2xl font-bold border border-white dark:border-gray-600`}>
                          {getInitial(serviceName)}
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    아이콘 이미지 URL을 입력하세요
                  </p>
                  <input
                    type="text"
                    value={iconUrl}
                    onChange={(e) => setIconUrl(e.target.value)}
                    onBlur={handleManualIconUrl}
                    placeholder="https://example.com/icon.png"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  {iconPreview ? (
                    <div className="flex items-center justify-center py-4">
                      <img
                        src={iconPreview}
                        alt="Icon preview"
                        className="w-16 h-16 object-contain rounded-full border border-white dark:border-gray-600"
                      />
                    </div>
                  ) : serviceName ? (
                    <div className="flex items-center justify-center py-4">
                      <div className={`w-16 h-16 rounded-full ${getInitialColor(serviceName)} flex items-center justify-center text-white text-2xl font-bold border border-white dark:border-gray-600`}>
                        {getInitial(serviceName)}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-primary hover:bg-blue-600 text-white font-medium transition-colors"
            >
              {initialData ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
