'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useAlert } from '@/contexts/AlertContext'

interface Address {
  id: string
  name: string
  address: string
  detailAddress: string
  zipCode: string
  isDefault: boolean
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const { success: showSuccess, confirm: showConfirm } = useAlert()
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showAddressModal, setShowAddressModal] = useState(false)

  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    phone: '010-1234-5678',
    birthDate: '1990-01-01'
  })

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      name: '집',
      address: '서울특별시 강남구 테헤란로 123',
      detailAddress: '아파트 101동 1001호',
      zipCode: '06123',
      isDefault: true
    },
    {
      id: '2',
      name: '회사',
      address: '서울특별시 송파구 올림픽로 456',
      detailAddress: '오피스빌딩 5층',
      zipCode: '05551',
      isDefault: false
    }
  ])

  const handleSave = () => {
    // TODO: API 호출하여 프로필 저장
    setIsEditing(false)
    showSuccess('프로필이 저장되었습니다.')
  }

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })))
  }

  const handleDeleteAddress = async (id: string) => {
    const confirmed = await showConfirm('이 주소를 삭제하시겠습니까?')
    if (confirmed) {
      setAddresses(addresses.filter(addr => addr.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          내 정보
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          프로필 정보를 관리합니다
        </p>
      </div>

      {/* Basic Info */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            기본 정보
          </h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              수정
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="text-sm text-gray-600 hover:text-gray-700"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                저장
              </button>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Profile Image */}
          <div className="flex items-center gap-6 mb-6">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="w-20 h-20 rounded-full border-2 border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                {formData.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            {isEditing && (
              <div>
                <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                  이미지 변경
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  JPG, PNG 파일, 최대 5MB
                </p>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                이름
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                전화번호
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                생년월일
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                disabled={!isEditing}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            계정 정보
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              이메일
            </label>
            <input
              type="email"
              value={session?.user?.email || ''}
              disabled
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              이메일은 변경할 수 없습니다
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              비밀번호
            </label>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              비밀번호 변경
            </button>
          </div>
        </div>
      </div>

      {/* Address Management */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            배송지 관리
          </h2>
          <button
            onClick={() => setShowAddressModal(true)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + 새 주소 추가
          </button>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {addresses.map((address) => (
            <div key={address.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {address.name}
                    </span>
                    {address.isDefault && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs rounded">
                        기본 배송지
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ({address.zipCode}) {address.address}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {address.detailAddress}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefaultAddress(address.id)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      기본 배송지 설정
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              비밀번호 변경
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  현재 비밀번호
                </label>
                <input
                  type="password"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  새 비밀번호
                </label>
                <input
                  type="password"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  새 비밀번호 확인
                </label>
                <input
                  type="password"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                취소
              </button>
              <button
                onClick={() => {
                  alert('비밀번호가 변경되었습니다.')
                  setShowPasswordModal(false)
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                변경
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
