'use client'

import { useState } from 'react'

type OrderStatus = 'pending' | 'paid' | 'preparing' | 'shipping' | 'delivered' | 'cancelled' | 'refunded'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  productName: string
  amount: number
  status: OrderStatus
  orderDate: string
  shippingAddress?: string
}

export default function OrdersManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const orders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-156',
      customerName: '홍길동',
      customerEmail: 'hong@example.com',
      productName: '프리미엄 플랜 - 월간 구독',
      amount: 100,
      status: 'paid',
      orderDate: '2024-01-20',
      shippingAddress: '서울특별시 강남구 테헤란로 123'
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-155',
      customerName: '김철수',
      customerEmail: 'kim@example.com',
      productName: '기본형 플랜',
      amount: 0,
      status: 'delivered',
      orderDate: '2024-01-19',
      shippingAddress: '서울특별시 송파구 올림픽로 456'
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-154',
      customerName: '이영희',
      customerEmail: 'lee@example.com',
      productName: '엔터프라이즈 플랜 - 연간 구독',
      amount: 479520,
      status: 'shipping',
      orderDate: '2024-01-18',
      shippingAddress: '부산광역시 해운대구 센텀로 789'
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-153',
      customerName: '박민수',
      customerEmail: 'park@example.com',
      productName: '프리미엄 플랜 - 월간 구독',
      amount: 100,
      status: 'preparing',
      orderDate: '2024-01-18',
      shippingAddress: '대구광역시 중구 동성로 321'
    },
    {
      id: '5',
      orderNumber: 'ORD-2024-152',
      customerName: '정수진',
      customerEmail: 'jung@example.com',
      productName: '기본형 플랜',
      amount: 0,
      status: 'cancelled',
      orderDate: '2024-01-17'
    }
  ]

  const getStatusBadge = (status: OrderStatus) => {
    const badges = {
      pending: { text: '결제대기', color: 'bg-gray-100 text-gray-600' },
      paid: { text: '결제완료', color: 'bg-blue-100 text-blue-600' },
      preparing: { text: '배송준비', color: 'bg-yellow-100 text-yellow-600' },
      shipping: { text: '배송중', color: 'bg-purple-100 text-purple-600' },
      delivered: { text: '배송완료', color: 'bg-green-100 text-green-600' },
      cancelled: { text: '취소', color: 'bg-red-100 text-red-600' },
      refunded: { text: '환불', color: 'bg-orange-100 text-orange-600' }
    }
    return badges[status]
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setShowDetailModal(true)
  }

  const handleChangeStatus = (orderId: string, newStatus: OrderStatus) => {
    alert(`주문 ${orderId}의 상태를 ${getStatusBadge(newStatus).text}(으)로 변경합니다.`)
  }

  const handleRefund = (orderId: string) => {
    if (confirm('이 주문을 환불 처리하시겠습니까?')) {
      alert(`주문 ${orderId}를 환불 처리합니다.`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">주문 관리</h1>
        <p className="text-gray-600 mt-2">전체 주문 내역 및 배송 관리</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">검색</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="주문번호 또는 고객명 검색"
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">주문 상태</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체</option>
              <option value="pending">결제대기</option>
              <option value="paid">결제완료</option>
              <option value="preparing">배송준비</option>
              <option value="shipping">배송중</option>
              <option value="delivered">배송완료</option>
              <option value="cancelled">취소</option>
              <option value="refunded">환불</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">기간</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체</option>
              <option value="today">오늘</option>
              <option value="week">최근 7일</option>
              <option value="month">최근 30일</option>
              <option value="3months">최근 3개월</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">전체 주문</p>
          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">결제완료</p>
          <p className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'paid').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">배송중</p>
          <p className="text-2xl font-bold text-purple-600">{orders.filter(o => o.status === 'shipping').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">배송완료</p>
          <p className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'delivered').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">취소/환불</p>
          <p className="text-2xl font-bold text-red-600">
            {orders.filter(o => o.status === 'cancelled' || o.status === 'refunded').length}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">주문번호</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">고객명</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">상품</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">금액</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">주문일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.orderNumber}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-600">{order.customerEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.productName}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {order.amount === 0 ? '무료' : `₩${order.amount.toLocaleString()}`}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded ${getStatusBadge(order.status).color}`}>
                      {getStatusBadge(order.status).text}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.orderDate}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      상세보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">주문 상세 정보</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Order Info */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">주문 정보</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">주문번호</label>
                    <p className="text-gray-900">{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">주문일</label>
                    <p className="text-gray-900">{selectedOrder.orderDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">주문 상태</label>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleChangeStatus(selectedOrder.id, e.target.value as OrderStatus)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="pending">결제대기</option>
                      <option value="paid">결제완료</option>
                      <option value="preparing">배송준비</option>
                      <option value="shipping">배송중</option>
                      <option value="delivered">배송완료</option>
                      <option value="cancelled">취소</option>
                      <option value="refunded">환불</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">결제 금액</label>
                    <p className="text-gray-900 font-bold">
                      {selectedOrder.amount === 0 ? '무료' : `₩${selectedOrder.amount.toLocaleString()}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">고객 정보</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">고객명</label>
                    <p className="text-gray-900">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">이메일</label>
                    <p className="text-gray-900">{selectedOrder.customerEmail}</p>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">상품 정보</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{selectedOrder.productName}</p>
                      <p className="text-sm text-gray-600 mt-1">수량: 1개</p>
                    </div>
                    <p className="font-bold text-gray-900">
                      {selectedOrder.amount === 0 ? '무료' : `₩${selectedOrder.amount.toLocaleString()}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              {selectedOrder.shippingAddress && (
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">배송 정보</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">배송지 주소</label>
                    <p className="text-gray-900">{selectedOrder.shippingAddress}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="border-t border-gray-200 pt-6 flex gap-2">
                {(selectedOrder.status === 'paid' || selectedOrder.status === 'preparing') && (
                  <button
                    onClick={() => handleRefund(selectedOrder.id)}
                    className="flex-1 px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
                  >
                    환불 처리
                  </button>
                )}
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
