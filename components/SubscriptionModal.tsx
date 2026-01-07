'use client'

import { useState, useEffect } from 'react'

interface Subscription {
  id?: string
  service: string
  plan: string
  price: number
  currency: string
  billingCycle: 'monthly' | 'annual' | 'weekly'
  nextBillingDate: string | null
  category: string
  icon: string | null
  url: string | null
  autoRenew: boolean
  notes: string
  status?: 'active' | 'cancelled' | 'expired'
  startDate?: string
  source?: 'manual' | 'gmail'
  createdAt?: string
  updatedAt?: string
}

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (subscription: Partial<Subscription>) => Promise<void>
  subscription?: Subscription | null
  mode: 'add' | 'edit'
}

const CATEGORIES = [
  'AI Tools',
  'Developer Tools',
  'Design',
  'Productivity',
  'Entertainment',
  'Cloud Storage',
  'Communication',
  'Cloud',
  'Other'
]

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: '미국 달러' },
  { code: 'KRW', symbol: '₩', name: '한국 원' },
  { code: 'EUR', symbol: '€', name: '유로' },
  { code: 'GBP', symbol: '£', name: '영국 파운드' },
  { code: 'JPY', symbol: '¥', name: '일본 엔' },
]

const POPULAR_SERVICES = [
  { name: 'ChatGPT Plus', icon: '🤖', category: 'AI Tools', defaultPrice: 20 },
  { name: 'Claude Pro', icon: '🧠', category: 'AI Tools', defaultPrice: 20 },
  { name: 'Midjourney', icon: '🎨', category: 'AI Tools', defaultPrice: 10 },
  { name: 'GitHub Copilot', icon: '👨‍💻', category: 'Developer Tools', defaultPrice: 10 },
  { name: 'Notion', icon: '📝', category: 'Productivity', defaultPrice: 10 },
  { name: 'Figma', icon: '🎨', category: 'Design', defaultPrice: 15 },
  { name: 'Spotify', icon: '🎵', category: 'Entertainment', defaultPrice: 11 },
  { name: 'Netflix', icon: '🎬', category: 'Entertainment', defaultPrice: 15 },
  { name: 'YouTube Premium', icon: '📺', category: 'Entertainment', defaultPrice: 14 },
  { name: 'Adobe Creative Cloud', icon: '🎨', category: 'Design', defaultPrice: 55 },
  { name: 'Cursor', icon: '⌨️', category: 'Developer Tools', defaultPrice: 20 },
  { name: 'Perplexity Pro', icon: '🔍', category: 'AI Tools', defaultPrice: 20 },
]

export function SubscriptionModal({ isOpen, onClose, onSave, subscription, mode }: SubscriptionModalProps) {
  const [formData, setFormData] = useState<Partial<Subscription>>({
    service: '',
    plan: 'Standard',
    price: 0,
    currency: 'USD',
    billingCycle: 'monthly',
    nextBillingDate: '',
    category: 'AI Tools',
    icon: '📦',
    url: '',
    autoRenew: true,
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [showQuickSelect, setShowQuickSelect] = useState(false)

  useEffect(() => {
    if (subscription && mode === 'edit') {
      setFormData({
        ...subscription,
        nextBillingDate: subscription.nextBillingDate
          ? new Date(subscription.nextBillingDate).toISOString().split('T')[0]
          : '',
      })
    } else {
      setFormData({
        service: '',
        plan: 'Standard',
        price: 0,
        currency: 'USD',
        billingCycle: 'monthly',
        nextBillingDate: '',
        category: 'AI Tools',
        icon: '📦',
        url: '',
        autoRenew: true,
        notes: '',
      })
    }
  }, [subscription, mode, isOpen])

  const handleQuickSelect = (service: typeof POPULAR_SERVICES[0]) => {
    setFormData(prev => ({
      ...prev,
      service: service.name,
      icon: service.icon,
      category: service.category,
      price: service.defaultPrice,
    }))
    setShowQuickSelect(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Failed to save subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {mode === 'add' ? '구독 추가' : '구독 수정'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Quick Select */}
        {mode === 'add' && (
          <div className="px-6 pt-4">
            <button
              type="button"
              onClick={() => setShowQuickSelect(!showQuickSelect)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              빠른 선택: 인기 서비스
            </button>
            {showQuickSelect && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {POPULAR_SERVICES.map((service) => (
                  <button
                    key={service.name}
                    type="button"
                    onClick={() => handleQuickSelect(service)}
                    className="p-2 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <span className="text-lg">{service.icon}</span>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate mt-1">
                      {service.name}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Service Name & Icon */}
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                아이콘
              </label>
              <input
                type="text"
                value={formData.icon || ''}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-16 h-10 text-center text-xl border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                maxLength={2}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                서비스 이름 *
              </label>
              <input
                type="text"
                required
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                placeholder="예: ChatGPT Plus"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Plan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              플랜
            </label>
            <input
              type="text"
              value={formData.plan}
              onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
              placeholder="예: Pro, Plus, Basic"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Price & Currency */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                가격 *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                통화
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Billing Cycle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              결제 주기
            </label>
            <div className="flex gap-2">
              {[
                { value: 'weekly', label: '주간' },
                { value: 'monthly', label: '월간' },
                { value: 'annual', label: '연간' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, billingCycle: option.value as 'weekly' | 'monthly' | 'annual' })}
                  className={`flex-1 py-2 px-3 rounded-lg border transition-colors ${
                    formData.billingCycle === option.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Next Billing Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              다음 결제일
            </label>
            <input
              type="date"
              value={formData.nextBillingDate || ''}
              onChange={(e) => setFormData({ ...formData, nextBillingDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              카테고리
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              서비스 URL
            </label>
            <input
              type="url"
              value={formData.url || ''}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Auto Renew */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              자동 갱신
            </span>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, autoRenew: !formData.autoRenew })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                formData.autoRenew ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  formData.autoRenew ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              메모
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="추가 메모..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading || !formData.service || !formData.price}
              className="flex-1 py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  저장 중...
                </>
              ) : (
                mode === 'add' ? '추가' : '저장'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
