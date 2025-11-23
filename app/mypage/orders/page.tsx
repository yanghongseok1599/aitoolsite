'use client'

import { useState } from 'react'

interface OrderItem {
  productId: string
  productName: string
  productImage?: string
  quantity: number
  price: number
}

interface Order {
  id: string
  orderNumber: string
  orderDate: string
  status: 'pending' | 'paid' | 'shipping' | 'delivered' | 'cancelled'
  items: OrderItem[]
  totalAmount: number
}

export default function OrdersPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('3months')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const orders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      orderDate: '2024-01-15',
      status: 'delivered',
      items: [
        {
          productId: 'premium',
          productName: '프리미엄 플랜 - 월간 구독',
          quantity: 1,
          price: 100
        }
      ],
      totalAmount: 100
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      orderDate: '2024-01-10',
      status: 'shipping',
      items: [
        {
          productId: 'basic',
          productName: '기본형 플랜',
          quantity: 1,
          price: 0
        }
      ],
      totalAmount: 0
    },
    {
      id: '3',
      orderNumber: 'ORD-2023-045',
      orderDate: '2023-12-20',
      status: 'delivered',
      items: [
        {
          productId: 'enterprise',
          productName: '엔터프라이즈 플랜 - 연간 구독',
          quantity: 1,
          price: 479520
        }
      ],
      totalAmount: 479520
    }
  ]

  const getStatusBadge = (status: Order['status']) => {
    const badges = {
      pending: { text: '결제대기', color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400' },
      paid: { text: '결제완료', color: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' },
      shipping: { text: '배송중', color: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300' },
      delivered: { text: '배송완료', color: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300' },
      cancelled: { text: '취소', color: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300' }
    }
    return badges[status]
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          주문내역
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          주문 및 배송 정보를 확인합니다
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Period Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              기간
            </label>
            <div className="flex gap-2">
              {[
                { value: '1month', label: '1개월' },
                { value: '3months', label: '3개월' },
                { value: '6months', label: '6개월' },
                { value: '1year', label: '1년' }
              ].map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedPeriod === period.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              주문 상태
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">전체</option>
              <option value="pending">결제대기</option>
              <option value="paid">결제완료</option>
              <option value="shipping">배송중</option>
              <option value="delivered">배송완료</option>
              <option value="cancelled">취소</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden"
          >
            {/* Order Header */}
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    주문번호: <span className="font-medium text-gray-900 dark:text-gray-100">{order.orderNumber}</span>
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {order.orderDate}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded ${getStatusBadge(order.status).color}`}>
                    {getStatusBadge(order.status).text}
                  </span>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  상세보기
                </button>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-400"
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
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {item.productName}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        수량: {item.quantity}개
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900 dark:text-gray-100">
                      {item.price === 0 ? '무료' : `₩${item.price.toLocaleString()}`}
                    </div>
                  </div>
                </div>
              ))}

              {/* Order Total */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  총 결제금액
                </span>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {order.totalAmount === 0 ? '무료' : `₩${order.totalAmount.toLocaleString()}`}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-2">
                {order.status === 'delivered' && (
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    리뷰 작성
                  </button>
                )}
                {order.status === 'shipping' && (
                  <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                    배송 조회
                  </button>
                )}
                {(order.status === 'pending' || order.status === 'paid') && (
                  <button className="flex-1 px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20">
                    주문 취소
                  </button>
                )}
                <button className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                  영수증 출력
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          이전
        </button>
        {[1, 2, 3].map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-md ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          다음
        </button>
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-12 text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
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
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            주문 내역이 없습니다
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            상품을 구매하시면 주문 내역을 확인할 수 있습니다
          </p>
        </div>
      )}
    </div>
  )
}
