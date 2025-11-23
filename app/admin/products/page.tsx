'use client'

import { useState } from 'react'

interface ProductAdmin {
  id: string
  name: string
  price: number
  stock: number
  category: string
  status: 'active' | 'inactive' | 'discontinued'
  isVisible: boolean
  createdAt: string
  updatedAt: string
}

export default function ProductsManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductAdmin | null>(null)

  const products: ProductAdmin[] = [
    {
      id: 'basic',
      name: '기본형 플랜',
      price: 0,
      stock: 999,
      category: '개인용',
      status: 'active',
      isVisible: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: 'premium',
      name: '프리미엄 플랜',
      price: 100,
      stock: 999,
      category: '개인용',
      status: 'active',
      isVisible: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-18'
    },
    {
      id: 'enterprise',
      name: '엔터프라이즈 플랜',
      price: 49900,
      stock: 999,
      category: '비즈니스용',
      status: 'active',
      isVisible: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-20'
    }
  ]

  const getStatusBadge = (status: ProductAdmin['status']) => {
    const badges = {
      active: { text: '판매중', color: 'bg-green-100 text-green-600' },
      inactive: { text: '품절', color: 'bg-gray-100 text-gray-600' },
      discontinued: { text: '단종', color: 'bg-red-100 text-red-600' }
    }
    return badges[status]
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleEditProduct = (product: ProductAdmin) => {
    setSelectedProduct(product)
    setShowEditModal(true)
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      alert(`상품 ${productId}를 삭제합니다.`)
    }
  }

  const handleToggleVisibility = (productId: string, isVisible: boolean) => {
    alert(`상품 ${productId}의 노출 상태를 ${isVisible ? '숨김' : '노출'}로 변경합니다.`)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">상품 관리</h1>
          <p className="text-gray-600 mt-2">상품 목록 및 재고 관리</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          + 새 상품 추가
        </button>
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
                placeholder="상품명 검색"
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

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체</option>
              <option value="개인용">개인용</option>
              <option value="비즈니스용">비즈니스용</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체</option>
              <option value="active">판매중</option>
              <option value="inactive">품절</option>
              <option value="discontinued">단종</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">전체 상품</p>
          <p className="text-2xl font-bold text-gray-900">{products.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">판매중</p>
          <p className="text-2xl font-bold text-green-600">{products.filter(p => p.status === 'active').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">품절</p>
          <p className="text-2xl font-bold text-gray-600">{products.filter(p => p.status === 'inactive').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">단종</p>
          <p className="text-2xl font-bold text-red-600">{products.filter(p => p.status === 'discontinued').length}</p>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">상품명</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">카테고리</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">가격</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">재고</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">노출</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">수정일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-600">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {product.price === 0 ? '무료' : `₩${product.price.toLocaleString()}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded ${getStatusBadge(product.status).color}`}>
                      {getStatusBadge(product.status).text}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleVisibility(product.id, product.isVisible)}
                      className={`px-2 py-1 text-xs rounded ${
                        product.isVisible
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {product.isVisible ? '노출' : '숨김'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.updatedAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">새 상품 추가</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">상품명</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="상품명 입력"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option value="개인용">개인용</option>
                    <option value="비즈니스용">비즈니스용</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">가격</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">재고</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="999"
                />
              </div>

              <div className="pt-4 border-t border-gray-200 flex gap-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    alert('상품이 추가되었습니다.')
                    setShowAddModal(false)
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  추가
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">상품 수정</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">상품명</label>
                <input
                  type="text"
                  defaultValue={selectedProduct.name}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                  <select
                    defaultValue={selectedProduct.category}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="개인용">개인용</option>
                    <option value="비즈니스용">비즈니스용</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">가격</label>
                  <input
                    type="number"
                    defaultValue={selectedProduct.price}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">재고</label>
                  <input
                    type="number"
                    defaultValue={selectedProduct.stock}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
                  <select
                    defaultValue={selectedProduct.status}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="active">판매중</option>
                    <option value="inactive">품절</option>
                    <option value="discontinued">단종</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex gap-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    alert('상품이 수정되었습니다.')
                    setShowEditModal(false)
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
