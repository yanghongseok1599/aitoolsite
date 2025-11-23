'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function MyPage() {
  const { data: session } = useSession()
  const router = useRouter()

  const quickActions = [
    {
      title: '내 정보 관리',
      description: '프로필 정보를 수정합니다',
      href: '/mypage/profile',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    },
    {
      title: '주문/배송 조회',
      description: '주문 내역을 확인합니다',
      href: '/mypage/orders',
      icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
    },
    {
      title: '설정',
      description: '알림 및 계정 설정',
      href: '/mypage/settings',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
    }
  ]

  const recentOrders = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      orderDate: '2024-01-15',
      productName: '프리미엄 플랜',
      status: '배송완료',
      amount: 100
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      orderDate: '2024-01-10',
      productName: '기본형 플랜',
      status: '배송중',
      amount: 0
    }
  ]

  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-700"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {session?.user?.name || '사용자'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {session?.user?.email}
            </p>
            <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span>가입일: 2024-01-01</span>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded">
                일반 회원
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Widgets */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              총 주문
            </h3>
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            2
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            이번 달 주문
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              포인트
            </h3>
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            1,500
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            사용 가능 포인트
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              알림
            </h3>
            <svg
              className="w-8 h-8 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            3
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            읽지 않은 알림
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            최근 주문
          </h3>
          <button
            onClick={() => router.push('/mypage/orders')}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            전체보기
          </button>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentOrders.map((order) => (
            <div key={order.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {order.productName}
                    </span>
                    <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded">
                      {order.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    주문번호: {order.orderNumber} · {order.orderDate}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {order.amount === 0 ? '무료' : `₩${order.amount.toLocaleString()}`}
                  </div>
                  <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">
                    상세보기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <button
            key={action.href}
            onClick={() => router.push(action.href)}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={action.icon}
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {action.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {action.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
