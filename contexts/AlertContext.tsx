'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { AlertModal, AlertType } from '@/components/AlertModal'

interface AlertOptions {
  title?: string
  message: string
  type?: AlertType
  confirmText?: string
  cancelText?: string
}

interface AlertContextType {
  alert: (message: string, options?: Partial<AlertOptions>) => Promise<void>
  confirm: (message: string, options?: Partial<AlertOptions>) => Promise<boolean>
  success: (message: string, options?: Partial<AlertOptions>) => Promise<void>
  error: (message: string, options?: Partial<AlertOptions>) => Promise<void>
  warning: (message: string, options?: Partial<AlertOptions>) => Promise<boolean>
}

const AlertContext = createContext<AlertContextType | null>(null)

export function AlertProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    options: AlertOptions
    resolve: ((value: boolean) => void) | null
  }>({
    isOpen: false,
    options: { message: '' },
    resolve: null
  })

  const showAlert = useCallback((options: AlertOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        options,
        resolve
      })
    })
  }, [])

  const handleClose = useCallback(() => {
    modalState.resolve?.(false)
    setModalState(prev => ({ ...prev, isOpen: false, resolve: null }))
  }, [modalState.resolve])

  const handleConfirm = useCallback(() => {
    modalState.resolve?.(true)
    setModalState(prev => ({ ...prev, isOpen: false, resolve: null }))
  }, [modalState.resolve])

  const alert = useCallback(async (message: string, options?: Partial<AlertOptions>) => {
    await showAlert({ message, type: 'alert', ...options })
  }, [showAlert])

  const confirm = useCallback(async (message: string, options?: Partial<AlertOptions>) => {
    return showAlert({ message, type: 'confirm', ...options })
  }, [showAlert])

  const success = useCallback(async (message: string, options?: Partial<AlertOptions>) => {
    await showAlert({ message, type: 'success', ...options })
  }, [showAlert])

  const error = useCallback(async (message: string, options?: Partial<AlertOptions>) => {
    await showAlert({ message, type: 'error', ...options })
  }, [showAlert])

  const warning = useCallback(async (message: string, options?: Partial<AlertOptions>) => {
    return showAlert({ message, type: 'warning', confirmText: '계속', cancelText: '취소', ...options })
  }, [showAlert])

  return (
    <AlertContext.Provider value={{ alert, confirm, success, error, warning }}>
      {children}
      <AlertModal
        isOpen={modalState.isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={modalState.options.title}
        message={modalState.options.message}
        type={modalState.options.type}
        confirmText={modalState.options.confirmText}
        cancelText={modalState.options.cancelText}
      />
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider')
  }
  return context
}
