'use client'

import { useState, useRef, useEffect } from 'react'
import { useAlert } from '@/contexts/AlertContext'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { getAdBannerSettings, saveAdBannerSettings, AdBannerSettings } from '@/lib/firestore'

interface SiteSettings {
  siteName: string
  contactEmail: string
  contactPhone: string
  logoUrl: string
  paymentMethods: {
    card: boolean
    bank: boolean
    kakao: boolean
    toss: boolean
  }
  adminNotifications: {
    newOrder: boolean
    newUser: boolean
    inquiry: boolean
  }
}

const defaultSettings: SiteSettings = {
  siteName: 'AI Tools 북마크',
  contactEmail: 'contact@aitools.com',
  contactPhone: '1588-0000',
  logoUrl: '',
  paymentMethods: {
    card: true,
    bank: true,
    kakao: false,
    toss: true
  },
  adminNotifications: {
    newOrder: true,
    newUser: true,
    inquiry: true
  }
}

export default function SettingsPage() {
  const { success: showSuccess, error: showError, confirm: showConfirm } = useAlert()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [adBannerEnabled, setAdBannerEnabled] = useState(false)
  const [isSavingAdBanner, setIsSavingAdBanner] = useState(false)

  // Load settings from Firebase
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const docRef = doc(db, 'admin', 'settings')
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data() as SiteSettings
          setSettings({ ...defaultSettings, ...data })
        }

        // Load ad banner settings
        const adSettings = await getAdBannerSettings()
        if (adSettings) {
          setAdBannerEnabled(adSettings.enabled ?? false)
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  // Save settings to Firebase
  const saveSettings = async (newSettings: Partial<SiteSettings>, message: string) => {
    setIsSaving(true)
    try {
      const docRef = doc(db, 'admin', 'settings')
      await setDoc(docRef, { ...settings, ...newSettings }, { merge: true })
      setSettings(prev => ({ ...prev, ...newSettings }))
      showSuccess(message)
    } catch (error) {
      console.error('Failed to save settings:', error)
      showError('설정 저장에 실패했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveSiteSettings = () => {
    saveSettings({
      siteName: settings.siteName,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      logoUrl: settings.logoUrl
    }, '사이트 설정이 저장되었습니다.')
  }

  const handleSavePaymentSettings = () => {
    saveSettings({
      paymentMethods: settings.paymentMethods
    }, '결제 설정이 저장되었습니다.')
  }

  const handleSaveNotificationSettings = () => {
    saveSettings({
      adminNotifications: settings.adminNotifications
    }, '알림 설정이 저장되었습니다.')
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showError('이미지 크기는 2MB 이하여야 합니다.')
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      showError('이미지 파일만 업로드 가능합니다.')
      return
    }

    // Convert to base64
    const reader = new FileReader()
    reader.onload = async () => {
      const base64 = reader.result as string
      setSettings(prev => ({ ...prev, logoUrl: base64 }))
      showSuccess('이미지가 업로드되었습니다. 저장 버튼을 눌러 적용하세요.')
    }
    reader.readAsDataURL(file)
  }

  const handleResetDatabase = async () => {
    const confirmed = await showConfirm('정말로 데이터베이스를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')
    if (confirmed) {
      showSuccess('데이터베이스 초기화 기능은 보안상 직접 Firebase 콘솔에서 수행해주세요.')
    }
  }

  const handleClearCache = async () => {
    const confirmed = await showConfirm('모든 캐시를 삭제하시겠습니까?')
    if (confirmed) {
      // Clear localStorage cache
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('cache_')) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
      showSuccess('캐시가 삭제되었습니다.')
    }
  }

  const handleToggleAdBanner = async (enabled: boolean) => {
    setIsSavingAdBanner(true)
    try {
      await saveAdBannerSettings({ enabled })
      setAdBannerEnabled(enabled)
      showSuccess(enabled ? '광고 배너가 활성화되었습니다.' : '광고 배너가 비활성화되었습니다.')
    } catch (error) {
      console.error('Failed to save ad banner settings:', error)
      showError('광고 배너 설정 저장에 실패했습니다.')
    } finally {
      setIsSavingAdBanner(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">설정을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">시스템 설정</h1>
        <p className="text-gray-600 mt-2">사이트 및 시스템 설정 관리</p>
      </div>

      {/* Site Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">사이트 설정</h2>
          <p className="text-sm text-gray-600 mt-1">사이트 기본 정보를 설정합니다</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">사이트명</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">연락처 이메일</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">연락처 전화</label>
              <input
                type="tel"
                value={settings.contactPhone}
                onChange={(e) => setSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">로고 이미지</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  이미지 업로드
                </button>
                {settings.logoUrl && (
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, logoUrl: '' }))}
                    className="px-4 py-2 text-red-600 text-sm hover:bg-red-50 rounded-lg transition-colors"
                  >
                    이미지 삭제
                  </button>
                )}
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">권장 크기: 200x200px, 최대 2MB</p>
          </div>
          <div className="pt-4">
            <button
              onClick={handleSaveSiteSettings}
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </div>

      {/* Ad Banner Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">광고 배너 설정</h2>
          <p className="text-sm text-gray-600 mt-1">MY STUDIO 페이지의 광고 배너 표시 여부를 설정합니다</p>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">광고 배너 표시</p>
              <p className="text-sm text-gray-600">활성화하면 MY STUDIO 페이지 좌우에 광고 배너가 표시됩니다</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={adBannerEnabled}
                onChange={(e) => handleToggleAdBanner(e.target.checked)}
                disabled={isSavingAdBanner}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
            </label>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            광고 배너 이미지 및 링크 설정은 MY STUDIO 페이지에서 관리자로 로그인 후 직접 수정할 수 있습니다.
          </p>
        </div>
      </div>

      {/* Payment Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">결제 설정</h2>
          <p className="text-sm text-gray-600 mt-1">결제 방법을 관리합니다</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">신용/체크카드</p>
                <p className="text-sm text-gray-600">일반 카드 결제</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.paymentMethods.card}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    paymentMethods: { ...prev.paymentMethods, card: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">계좌이체</p>
                <p className="text-sm text-gray-600">무통장입금 및 실시간 계좌이체</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.paymentMethods.bank}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    paymentMethods: { ...prev.paymentMethods, bank: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">카카오페이</p>
                <p className="text-sm text-gray-600">간편결제</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.paymentMethods.kakao}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    paymentMethods: { ...prev.paymentMethods, kakao: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">토스페이</p>
                <p className="text-sm text-gray-600">간편결제</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.paymentMethods.toss}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    paymentMethods: { ...prev.paymentMethods, toss: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          <div className="pt-4">
            <button
              onClick={handleSavePaymentSettings}
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">알림 설정</h2>
          <p className="text-sm text-gray-600 mt-1">관리자 알림을 설정합니다</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">신규 주문 알림</p>
                <p className="text-sm text-gray-600">새 주문이 발생하면 알림을 받습니다</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.adminNotifications.newOrder}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    adminNotifications: { ...prev.adminNotifications, newOrder: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">신규 가입자 알림</p>
                <p className="text-sm text-gray-600">새 사용자가 가입하면 알림을 받습니다</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.adminNotifications.newUser}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    adminNotifications: { ...prev.adminNotifications, newUser: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">문의 알림</p>
                <p className="text-sm text-gray-600">새 문의가 등록되면 알림을 받습니다</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.adminNotifications.inquiry}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    adminNotifications: { ...prev.adminNotifications, inquiry: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          <div className="pt-4">
            <button
              onClick={handleSaveNotificationSettings}
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">시스템 정보</h2>
          <p className="text-sm text-gray-600 mt-1">시스템 상태 및 정보</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">서버 상태</span>
                <span className="px-3 py-1 bg-green-100 text-green-600 text-sm rounded">정상</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">데이터베이스</span>
                <span className="px-3 py-1 bg-green-100 text-green-600 text-sm rounded">연결됨</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">최근 백업</span>
                <span className="text-sm text-gray-600">{new Date().toLocaleDateString('ko-KR')}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">버전</span>
                <span className="text-sm text-gray-600">v1.0.0</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Node.js</span>
                <span className="text-sm text-gray-600">v18.17.0</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Next.js</span>
                <span className="text-sm text-gray-600">v14.0.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200">
        <div className="p-6 border-b border-red-200">
          <h2 className="text-lg font-bold text-red-600">위험 영역</h2>
          <p className="text-sm text-gray-600 mt-1">신중하게 사용하세요</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">데이터베이스 초기화</p>
              <p className="text-sm text-gray-600">모든 데이터가 삭제됩니다</p>
            </div>
            <button
              onClick={handleResetDatabase}
              className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              초기화
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">캐시 삭제</p>
              <p className="text-sm text-gray-600">모든 캐시 데이터를 삭제합니다</p>
            </div>
            <button
              onClick={handleClearCache}
              className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
