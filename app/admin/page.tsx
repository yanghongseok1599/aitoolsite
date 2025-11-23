'use client'

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useRouter } from 'next/navigation'

interface DashboardMetric {
  title: string
  value: number | string
  change?: number
  icon: string
  color: 'blue' | 'green' | 'purple' | 'orange'
}

export default function AdminDashboard() {
  const router = useRouter()

  const metrics: DashboardMetric[] = [
    {
      title: '총 사용자 수',
      value: '1,234',
      change: 12.5,
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      color: 'blue'
    },
    {
      title: '오늘 신규 가입자',
      value: '24',
      change: 8.2,
      icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
      color: 'green'
    },
    {
      title: '총 주문 수',
      value: '567',
      change: 5.3,
      icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
      color: 'purple'
    },
    {
      title: '총 매출액',
      value: '₩5,620,000',
      change: 15.8,
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'orange'
    }
  ]

  const salesData = [
    { month: '1월', sales: 450000 },
    { month: '2월', sales: 520000 },
    { month: '3월', sales: 480000 },
    { month: '4월', sales: 620000 },
    { month: '5월', sales: 580000 },
    { month: '6월', sales: 720000 }
  ]

  const productData = [
    { name: '기본형', count: 245 },
    { name: '프리미엄', count: 189 },
    { name: '엔터프라이즈', count: 67 }
  ]

  const recentUsers = [
    { id: '1', name: '홍길동', email: 'hong@example.com', date: '2024-01-20', status: 'active' },
    { id: '2', name: '김철수', email: 'kim@example.com', date: '2024-01-20', status: 'active' },
    { id: '3', name: '이영희', email: 'lee@example.com', date: '2024-01-19', status: 'active' },
    { id: '4', name: '박민수', email: 'park@example.com', date: '2024-01-19', status: 'active' },
    { id: '5', name: '정수진', email: 'jung@example.com', date: '2024-01-18', status: 'active' }
  ]

  const recentOrders = [
    { id: '1', orderNumber: 'ORD-2024-156', customer: '홍길동', product: '프리미엄', amount: 100, status: 'paid', date: '2024-01-20' },
    { id: '2', orderNumber: 'ORD-2024-155', customer: '김철수', product: '기본형', amount: 0, status: 'paid', date: '2024-01-20' },
    { id: '3', orderNumber: 'ORD-2024-154', customer: '이영희', product: '엔터프라이즈', amount: 49900, status: 'shipping', date: '2024-01-19' },
    { id: '4', orderNumber: 'ORD-2024-153', customer: '박민수', product: '프리미엄', amount: 100, status: 'delivered', date: '2024-01-19' },
    { id: '5', orderNumber: 'ORD-2024-152', customer: '정수진', product: '기본형', amount: 0, status: 'delivered', date: '2024-01-18' }
  ]

  const getColorClasses = (color: DashboardMetric['color']) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    }
    return colors[color]
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { text: string; color: string }> = {
      active: { text: '활성', color: 'bg-green-100 text-green-600' },
      pending: { text: '대기', color: 'bg-yellow-100 text-yellow-600' },
      paid: { text: '결제완료', color: 'bg-blue-100 text-blue-600' },
      shipping: { text: '배송중', color: 'bg-purple-100 text-purple-600' },
      delivered: { text: '배송완료', color: 'bg-green-100 text-green-600' }
    }
    return badges[status] || { text: status, color: 'bg-gray-100 text-gray-600' }
  }

  const quickActions = [
    { title: '사용자 관리', href: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { title: '상품 관리', href: '/admin/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { title: '주문 관리', href: '/admin/orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { title: '시스템 설정', href: '/admin/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
  ]

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600 mt-2">시스템 현황 및 주요 지표를 확인하세요</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.title} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(metric.color)}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={metric.icon} />
                </svg>
              </div>
              {metric.change && (
                <span className="text-sm text-green-600 font-medium">+{metric.change}%</span>
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">월별 매출 추이</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Product Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">상품별 판매량</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">최근 가입자</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">이름</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">이메일</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">가입일</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded ${getStatusBadge(user.status).color}`}>
                        {getStatusBadge(user.status).text}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">최근 주문</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">주문번호</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">고객명</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">금액</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.amount === 0 ? '무료' : `₩${order.amount.toLocaleString()}`}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded ${getStatusBadge(order.status).color}`}>
                        {getStatusBadge(order.status).text}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">빠른 액션</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.href}
              onClick={() => router.push(action.href)}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-left"
            >
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900">{action.title}</h4>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
