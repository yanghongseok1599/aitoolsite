'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [siteName, setSiteName] = useState('AI Tools 북마크')
  const [contactEmail, setContactEmail] = useState('contact@aitools.com')
  const [contactPhone, setContactPhone] = useState('1588-0000')

  const [paymentMethods, setPaymentMethods] = useState({
    card: true,
    bank: true,
    kakao: false,
    toss: true
  })

  const [adminNotifications, setAdminNotifications] = useState({
    newOrder: true,
    newUser: true,
    inquiry: true
  })

  const handleSaveSiteSettings = () => {
    alert('사이트 설정이 저장되었습니다.')
  }

  const handleSavePaymentSettings = () => {
    alert('결제 설정이 저장되었습니다.')
  }

  const handleSaveNotificationSettings = () => {
    alert('알림 설정이 저장되었습니다.')
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
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">연락처 이메일</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">연락처 전화</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">로고 이미지</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                이미지 업로드
              </button>
            </div>
          </div>
          <div className="pt-4">
            <button
              onClick={handleSaveSiteSettings}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              저장
            </button>
          </div>
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
                  checked={paymentMethods.card}
                  onChange={(e) => setPaymentMethods({ ...paymentMethods, card: e.target.checked })}
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
                  checked={paymentMethods.bank}
                  onChange={(e) => setPaymentMethods({ ...paymentMethods, bank: e.target.checked })}
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
                  checked={paymentMethods.kakao}
                  onChange={(e) => setPaymentMethods({ ...paymentMethods, kakao: e.target.checked })}
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
                  checked={paymentMethods.toss}
                  onChange={(e) => setPaymentMethods({ ...paymentMethods, toss: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          <div className="pt-4">
            <button
              onClick={handleSavePaymentSettings}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              저장
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
                  checked={adminNotifications.newOrder}
                  onChange={(e) => setAdminNotifications({ ...adminNotifications, newOrder: e.target.checked })}
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
                  checked={adminNotifications.newUser}
                  onChange={(e) => setAdminNotifications({ ...adminNotifications, newUser: e.target.checked })}
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
                  checked={adminNotifications.inquiry}
                  onChange={(e) => setAdminNotifications({ ...adminNotifications, inquiry: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          <div className="pt-4">
            <button
              onClick={handleSaveNotificationSettings}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              저장
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
                <span className="text-sm text-gray-600">2024-01-20 02:00</span>
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
            <button className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50">
              초기화
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">캐시 삭제</p>
              <p className="text-sm text-gray-600">모든 캐시 데이터를 삭제합니다</p>
            </div>
            <button className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50">
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
