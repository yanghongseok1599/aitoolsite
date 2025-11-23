'use client'

import { useState } from 'react'

interface UserTableData {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  lastLoginAt?: string
}

export default function UsersManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserTableData | null>(null)

  const users: UserTableData[] = [
    { id: '1', name: '홍길동', email: 'hong@example.com', role: 'user', status: 'active', createdAt: '2024-01-15', lastLoginAt: '2024-01-20' },
    { id: '2', name: '김철수', email: 'kim@example.com', role: 'admin', status: 'active', createdAt: '2024-01-10', lastLoginAt: '2024-01-20' },
    { id: '3', name: '이영희', email: 'lee@example.com', role: 'user', status: 'active', createdAt: '2024-01-12', lastLoginAt: '2024-01-19' },
    { id: '4', name: '박민수', email: 'park@example.com', role: 'user', status: 'inactive', createdAt: '2024-01-08', lastLoginAt: '2024-01-10' },
    { id: '5', name: '정수진', email: 'jung@example.com', role: 'user', status: 'active', createdAt: '2024-01-18', lastLoginAt: '2024-01-20' },
    { id: '6', name: '최민준', email: 'choi@example.com', role: 'user', status: 'suspended', createdAt: '2024-01-05', lastLoginAt: '2024-01-15' },
    { id: '7', name: '강서연', email: 'kang@example.com', role: 'user', status: 'active', createdAt: '2024-01-16', lastLoginAt: '2024-01-19' },
    { id: '8', name: '윤지호', email: 'yoon@example.com', role: 'user', status: 'active', createdAt: '2024-01-14', lastLoginAt: '2024-01-20' }
  ]

  const getRoleBadge = (role: UserTableData['role']) => {
    return role === 'admin'
      ? { text: '관리자', color: 'bg-purple-100 text-purple-600' }
      : { text: '사용자', color: 'bg-blue-100 text-blue-600' }
  }

  const getStatusBadge = (status: UserTableData['status']) => {
    const badges = {
      active: { text: '활성', color: 'bg-green-100 text-green-600' },
      inactive: { text: '비활성', color: 'bg-gray-100 text-gray-600' },
      suspended: { text: '정지', color: 'bg-red-100 text-red-600' }
    }
    return badges[status]
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleViewDetails = (user: UserTableData) => {
    setSelectedUser(user)
    setShowDetailModal(true)
  }

  const handleChangeRole = (userId: string, newRole: 'user' | 'admin') => {
    alert(`사용자 ${userId}의 역할을 ${newRole}로 변경합니다.`)
  }

  const handleChangeStatus = (userId: string, newStatus: UserTableData['status']) => {
    alert(`사용자 ${userId}의 상태를 ${newStatus}로 변경합니다.`)
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      alert(`사용자 ${userId}를 삭제합니다.`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">사용자 관리</h1>
        <p className="text-gray-600 mt-2">전체 사용자 목록 및 관리</p>
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
                placeholder="이름 또는 이메일 검색"
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

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">역할</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체</option>
              <option value="user">사용자</option>
              <option value="admin">관리자</option>
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
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
              <option value="suspended">정지</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">전체 사용자</p>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">활성 사용자</p>
          <p className="text-2xl font-bold text-green-600">{users.filter(u => u.status === 'active').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">관리자</p>
          <p className="text-2xl font-bold text-purple-600">{users.filter(u => u.role === 'admin').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">정지 사용자</p>
          <p className="text-2xl font-bold text-red-600">{users.filter(u => u.status === 'suspended').length}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">이름</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">이메일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">역할</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">가입일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">마지막 로그인</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded ${getRoleBadge(user.role).color}`}>
                      {getRoleBadge(user.role).text}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded ${getStatusBadge(user.status).color}`}>
                      {getStatusBadge(user.status).text}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.createdAt}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.lastLoginAt || '-'}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewDetails(user)}
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

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            총 {filteredUsers.length}명의 사용자
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              이전
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm">1</button>
            <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">2</button>
            <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">3</button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
            >
              다음
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">사용자 상세 정보</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">이름</label>
                  <p className="text-gray-900">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">이메일</label>
                  <p className="text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">역할</label>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => handleChangeRole(selectedUser.id, e.target.value as 'user' | 'admin')}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="user">사용자</option>
                    <option value="admin">관리자</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">상태</label>
                  <select
                    value={selectedUser.status}
                    onChange={(e) => handleChangeStatus(selectedUser.id, e.target.value as UserTableData['status'])}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="active">활성</option>
                    <option value="inactive">비활성</option>
                    <option value="suspended">정지</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">가입일</label>
                  <p className="text-gray-900">{selectedUser.createdAt}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">마지막 로그인</label>
                  <p className="text-gray-900">{selectedUser.lastLoginAt || '없음'}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex gap-2">
                <button
                  onClick={() => handleDeleteUser(selectedUser.id)}
                  className="flex-1 px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
                >
                  계정 삭제
                </button>
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
