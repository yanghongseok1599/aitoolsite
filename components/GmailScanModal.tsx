'use client'

import { useState } from 'react'

interface ScannedSubscription {
  service: string
  category: string
  icon: string
  price: number
  currency: string
  billingCycle: string
  emailDate: string
  emailSubject: string
  confidence: number
}

interface GmailScanModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (subscriptions: ScannedSubscription[]) => Promise<void>
}

export function GmailScanModal({ isOpen, onClose, onImport }: GmailScanModalProps) {
  const [loading, setLoading] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needsReauth, setNeedsReauth] = useState(false)
  const [scannedSubscriptions, setScannedSubscriptions] = useState<ScannedSubscription[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [scanComplete, setScanComplete] = useState(false)

  const handleScan = async () => {
    setScanning(true)
    setError(null)
    setNeedsReauth(false)

    try {
      const response = await fetch('/api/subscriptions/scan-gmail', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.needsReauth) {
          setNeedsReauth(true)
          setError(data.message)
        } else {
          setError(data.error || 'Gmail 스캔에 실패했습니다.')
        }
        return
      }

      setScannedSubscriptions(data.subscriptions)
      // 기본적으로 모두 선택
      setSelectedIds(new Set(data.subscriptions.map((s: ScannedSubscription) => s.service)))
      setScanComplete(true)
    } catch (err) {
      console.error('Scan error:', err)
      setError('Gmail 스캔 중 오류가 발생했습니다.')
    } finally {
      setScanning(false)
    }
  }

  const toggleSelect = (service: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(service)) {
      newSelected.delete(service)
    } else {
      newSelected.add(service)
    }
    setSelectedIds(newSelected)
  }

  const toggleAll = () => {
    if (selectedIds.size === scannedSubscriptions.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(scannedSubscriptions.map(s => s.service)))
    }
  }

  const handleImport = async () => {
    setLoading(true)
    try {
      const toImport = scannedSubscriptions.filter(s => selectedIds.has(s.service))
      await onImport(toImport)
      onClose()
      setScanComplete(false)
      setScannedSubscriptions([])
      setSelectedIds(new Set())
    } catch (err) {
      console.error('Import error:', err)
      setError('구독 가져오기에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
    setScanComplete(false)
    setScannedSubscriptions([])
    setSelectedIds(new Set())
    setError(null)
  }

  const formatCurrency = (price: number, currency: string) => {
    const symbols: Record<string, string> = {
      USD: '$',
      KRW: '₩',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
    }
    return `${symbols[currency] || ''}${price.toLocaleString()}`
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) return { class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: '높음' }
    if (confidence >= 0.5) return { class: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', label: '보통' }
    return { class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: '낮음' }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Gmail에서 구독 찾기
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                이메일에서 구독 정보를 자동으로 추출합니다
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!scanComplete ? (
            <div className="text-center py-8">
              {scanning ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto relative">
                    <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-900 rounded-full" />
                    <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      이메일을 스캔하는 중...
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      최근 6개월간의 결제/구독 관련 이메일을 분석합니다
                    </p>
                  </div>
                </div>
              ) : error ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {error}
                    </p>
                    {needsReauth && (
                      <button
                        onClick={() => window.location.href = '/api/auth/signin/google'}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Google 계정 다시 연결
                      </button>
                    )}
                    {!needsReauth && (
                      <button
                        onClick={handleScan}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        다시 시도
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Gmail에서 구독 정보 찾기
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
                      결제 영수증, 구독 확인 이메일 등을 분석하여<br />
                      구독 중인 서비스를 자동으로 찾아드립니다.
                    </p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-left max-w-md mx-auto">
                    <div className="flex gap-3">
                      <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-sm text-yellow-800 dark:text-yellow-200">
                        <p className="font-medium">알림</p>
                        <p className="mt-1 text-yellow-700 dark:text-yellow-300">
                          이메일 내용은 서버에 저장되지 않으며, 구독 정보 추출에만 사용됩니다.
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleScan}
                    className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                    </svg>
                    Gmail 스캔 시작
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {scannedSubscriptions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    구독 관련 이메일을 찾지 못했습니다.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    수동으로 구독을 추가해보세요.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {scannedSubscriptions.length}개의 구독을 발견했습니다
                    </p>
                    <button
                      onClick={toggleAll}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {selectedIds.size === scannedSubscriptions.length ? '전체 해제' : '전체 선택'}
                    </button>
                  </div>

                  <div className="space-y-2">
                    {scannedSubscriptions.map((sub) => {
                      const confidenceBadge = getConfidenceBadge(sub.confidence)
                      return (
                        <div
                          key={sub.service}
                          onClick={() => toggleSelect(sub.service)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedIds.has(sub.service)
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center w-6 h-6 mt-1">
                              <input
                                type="checkbox"
                                checked={selectedIds.has(sub.service)}
                                onChange={() => {}}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </div>
                            <div className="text-2xl">{sub.icon}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                  {sub.service}
                                </h4>
                                <span className={`px-2 py-0.5 text-xs font-medium rounded ${confidenceBadge.class}`}>
                                  신뢰도: {confidenceBadge.label}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {sub.category} • {sub.billingCycle === 'monthly' ? '월간' : sub.billingCycle === 'annual' ? '연간' : '주간'}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
                                {sub.emailSubject}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900 dark:text-gray-100">
                                {formatCurrency(sub.price, sub.currency)}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                /{sub.billingCycle === 'monthly' ? '월' : sub.billingCycle === 'annual' ? '년' : '주'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {scanComplete && scannedSubscriptions.length > 0 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedIds.size}개 선택됨
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleImport}
                  disabled={loading || selectedIds.size === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      가져오는 중...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      선택한 구독 가져오기
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
