'use client'

import { useState } from 'react'
import { DashboardHeader } from '@/components/DashboardHeader'
import { useAlert } from '@/contexts/AlertContext'

interface Automation {
  id: string
  name: string
  description: string
  trigger: string
  action: string
  isActive: boolean
  executionCount: number
  lastRun?: Date
}

export default function AutomationPage() {
  const { alert: showAlert, confirm: showConfirm } = useAlert()
  const [automations, setAutomations] = useState<Automation[]>([
    {
      id: '1',
      name: '일일 AI 리포트 생성',
      description: '매일 오전 9시에 전날 AI 도구 사용 리포트를 이메일로 전송',
      trigger: '매일 오전 9:00',
      action: '리포트 이메일 전송',
      isActive: true,
      executionCount: 45,
      lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '2',
      name: '주간 목표 알림',
      description: '매주 월요일 주간 목표 달성률을 알림',
      trigger: '매주 월요일 오전 10:00',
      action: '목표 알림 전송',
      isActive: true,
      executionCount: 8,
      lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      name: '북마크 자동 정리',
      description: '30일 이상 사용하지 않은 북마크를 자동으로 아카이브',
      trigger: '매월 1일',
      action: '북마크 아카이브',
      isActive: false,
      executionCount: 3,
      lastRun: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    }
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newAutomation, setNewAutomation] = useState({
    name: '',
    description: '',
    trigger: 'daily',
    action: 'email'
  })

  const toggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(auto =>
      auto.id === id ? { ...auto, isActive: !auto.isActive } : auto
    ))
  }

  const deleteAutomation = async (id: string) => {
    const confirmed = await showConfirm('이 자동화를 삭제하시겠습니까?')
    if (confirmed) {
      setAutomations(prev => prev.filter(a => a.id !== id))
    }
  }

  const addAutomation = () => {
    if (!newAutomation.name) {
      showAlert('자동화 이름을 입력해주세요', { type: 'warning' })
      return
    }

    const automation: Automation = {
      id: Date.now().toString(),
      name: newAutomation.name,
      description: newAutomation.description,
      trigger: newAutomation.trigger,
      action: newAutomation.action,
      isActive: true,
      executionCount: 0
    }

    setAutomations(prev => [automation, ...prev])
    setIsModalOpen(false)
    setNewAutomation({ name: '', description: '', trigger: 'daily', action: 'email' })
  }

  const activeCount = automations.filter(a => a.isActive).length
  const totalExecutions = automations.reduce((sum, a) => sum + a.executionCount, 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              작업 자동화
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              반복적인 AI 워크플로우를 자동화하여 시간을 절약하세요
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            새 자동화 추가
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                활성 자동화
              </h3>
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {activeCount}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                총 실행 횟수
              </h3>
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {totalExecutions}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                절약된 시간
              </h3>
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              ~{(totalExecutions * 5 / 60).toFixed(1)}시간
            </div>
          </div>
        </div>

        {/* Automation List */}
        <div className="space-y-4">
          {automations.map((automation) => (
            <div
              key={automation.id}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 p-6 transition-all ${
                automation.isActive
                  ? 'border-green-500'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {automation.name}
                    </h3>
                    {automation.isActive && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-xs font-semibold text-green-600 dark:text-green-400 rounded flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                        활성
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {automation.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">트리거</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{automation.trigger}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">액션</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{automation.action}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">실행 횟수</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{automation.executionCount}회</p>
                      </div>
                    </div>
                  </div>

                  {automation.lastRun && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                      마지막 실행: {automation.lastRun.toLocaleString('ko-KR')}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAutomation(automation.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      automation.isActive ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        automation.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => deleteAutomation(automation.id)}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {automations.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-400">
              아직 설정된 자동화가 없습니다
            </p>
          </div>
        )}
      </div>

      {/* Add Automation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              새 자동화 추가
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  자동화 이름 *
                </label>
                <input
                  type="text"
                  value={newAutomation.name}
                  onChange={(e) => setNewAutomation({ ...newAutomation, name: e.target.value })}
                  placeholder="예: 일일 리포트 전송"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  설명
                </label>
                <textarea
                  value={newAutomation.description}
                  onChange={(e) => setNewAutomation({ ...newAutomation, description: e.target.value })}
                  placeholder="자동화에 대한 설명"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  트리거
                </label>
                <select
                  value={newAutomation.trigger}
                  onChange={(e) => setNewAutomation({ ...newAutomation, trigger: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="daily">매일</option>
                  <option value="weekly">매주</option>
                  <option value="monthly">매월</option>
                  <option value="custom">커스텀</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  액션
                </label>
                <select
                  value={newAutomation.action}
                  onChange={(e) => setNewAutomation({ ...newAutomation, action: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="email">이메일 전송</option>
                  <option value="notification">알림 전송</option>
                  <option value="report">리포트 생성</option>
                  <option value="backup">데이터 백업</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                취소
              </button>
              <button
                onClick={addAutomation}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
