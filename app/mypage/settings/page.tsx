'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState({
    orderEmail: true,
    orderSms: false,
    marketingEmail: false,
    marketingSms: false,
    pushNotification: true
  })

  const [privacy, setPrivacy] = useState({
    privacyPolicy: true,
    marketingConsent: false,
    thirdPartyConsent: false
  })

  const handleSaveNotifications = () => {
    // TODO: API 호출
    alert('알림 설정이 저장되었습니다.')
  }

  const handleSavePrivacy = () => {
    // TODO: API 호출
    alert('개인정보 설정이 저장되었습니다.')
  }

  const handleDeleteAccount = () => {
    if (confirm('정말로 회원 탈퇴하시겠습니까? 이 작업은 취소할 수 없습니다.')) {
      if (confirm('모든 데이터가 삭제됩니다. 계속하시겠습니까?')) {
        // TODO: API 호출하여 회원 탈퇴
        signOut({ callbackUrl: '/' })
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          설정
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          알림 및 계정 설정을 관리합니다
        </p>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            알림 설정
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            수신할 알림을 선택하세요
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Email Notifications */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              이메일 알림
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  주문 및 배송 알림
                </span>
                <input
                  type="checkbox"
                  checked={notifications.orderEmail}
                  onChange={(e) => setNotifications({ ...notifications, orderEmail: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  마케팅 정보 수신
                </span>
                <input
                  type="checkbox"
                  checked={notifications.marketingEmail}
                  onChange={(e) => setNotifications({ ...notifications, marketingEmail: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>
            </div>
          </div>

          {/* SMS Notifications */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              SMS 알림
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  주문 및 배송 알림
                </span>
                <input
                  type="checkbox"
                  checked={notifications.orderSms}
                  onChange={(e) => setNotifications({ ...notifications, orderSms: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  마케팅 정보 수신
                </span>
                <input
                  type="checkbox"
                  checked={notifications.marketingSms}
                  onChange={(e) => setNotifications({ ...notifications, marketingSms: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>
            </div>
          </div>

          {/* Push Notifications */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              푸시 알림
            </h3>
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                브라우저 푸시 알림
              </span>
              <input
                type="checkbox"
                checked={notifications.pushNotification}
                onChange={(e) => setNotifications({ ...notifications, pushNotification: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded"
              />
            </label>
          </div>

          <button
            onClick={handleSaveNotifications}
            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            저장
          </button>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            개인정보 설정
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            개인정보 처리 동의를 관리합니다
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={privacy.privacyPolicy}
                onChange={(e) => setPrivacy({ ...privacy, privacyPolicy: e.target.checked })}
                disabled
                className="mt-1 w-5 h-5 text-blue-600 rounded"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                  개인정보 처리방침 (필수)
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  서비스 이용을 위한 필수 동의 항목입니다
                </p>
                <button className="text-sm text-blue-600 hover:text-blue-700 mt-2">
                  전문 보기
                </button>
              </div>
            </label>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={privacy.marketingConsent}
                onChange={(e) => setPrivacy({ ...privacy, marketingConsent: e.target.checked })}
                className="mt-1 w-5 h-5 text-blue-600 rounded"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                  마케팅 정보 수신 동의 (선택)
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  신규 서비스 및 이벤트 정보를 받아보실 수 있습니다
                </p>
                <button className="text-sm text-blue-600 hover:text-blue-700 mt-2">
                  전문 보기
                </button>
              </div>
            </label>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={privacy.thirdPartyConsent}
                onChange={(e) => setPrivacy({ ...privacy, thirdPartyConsent: e.target.checked })}
                className="mt-1 w-5 h-5 text-blue-600 rounded"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                  제3자 정보제공 동의 (선택)
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  제휴사에 정보를 제공하여 맞춤형 서비스를 받을 수 있습니다
                </p>
                <button className="text-sm text-blue-600 hover:text-blue-700 mt-2">
                  전문 보기
                </button>
              </div>
            </label>
          </div>

          <button
            onClick={handleSavePrivacy}
            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            저장
          </button>
        </div>
      </div>

      {/* Account Management */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            계정 관리
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            계정 보안 및 삭제를 관리합니다
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                비밀번호 변경
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                정기적인 비밀번호 변경으로 계정을 안전하게 보호하세요
              </p>
            </div>
            <button
              onClick={() => router.push('/mypage/profile')}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              변경
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                이메일 변경
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                로그인 이메일 주소를 변경합니다
              </p>
            </div>
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
              변경
            </button>
          </div>

          <div className="p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="font-medium text-red-900 dark:text-red-300 mb-2">
              회원 탈퇴
            </div>
            <p className="text-sm text-red-700 dark:text-red-400 mb-4">
              회원 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다
            </p>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              회원 탈퇴
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
