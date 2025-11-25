'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  getUserTodos,
  addTodo as addTodoToFirestore,
  updateTodo as updateTodoInFirestore,
  deleteTodo as deleteTodoFromFirestore
} from '@/lib/firestore'

interface Todo {
  id: string
  text: string
  completed: boolean
}

export function TodoListWidget() {
  const { data: session } = useSession()
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(true)

  // Firestore에서 할 일 목록 불러오기
  useEffect(() => {
    const loadTodos = async () => {
      if (!session?.user?.email) {
        setLoading(false)
        return
      }

      try {
        const firestoreTodos = await getUserTodos(session.user.email)
        const formattedTodos = firestoreTodos.map(todo => ({
          id: todo.id,
          text: todo.text,
          completed: todo.completed,
        }))
        setTodos(formattedTodos)
      } catch (error) {
        console.error('Error loading todos from Firestore:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTodos()
  }, [session])

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim() || !session?.user?.email) return

    try {
      const docRef = await addTodoToFirestore(session.user.email, newTodo.trim())
      setTodos([...todos, {
        id: docRef.id,
        text: newTodo.trim(),
        completed: false
      }])
      setNewTodo('')
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    try {
      await updateTodoInFirestore(id, { completed: !todo.completed })
      setTodos(todos.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ))
    } catch (error) {
      console.error('Error toggling todo:', error)
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      await deleteTodoFromFirestore(id)
      setTodos(todos.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const incompleteTodos = todos.filter(t => !t.completed).length

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">할 일 목록</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {incompleteTodos}개 남음
          </p>
        </div>
        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>

      {/* Add Todo Form */}
      <form onSubmit={addTodo} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="새 할 일 추가..."
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="p-2 rounded-lg bg-primary hover:bg-blue-600 text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </form>

      {/* Todo List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : todos.length === 0 ? (
          <p className="text-center text-gray-400 dark:text-gray-500 py-8 text-sm">
            할 일을 추가해보세요
          </p>
        ) : (
          todos.map(todo => (
            <div
              key={todo.id}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span
                className={`flex-1 text-sm ${
                  todo.completed
                    ? 'line-through text-gray-400 dark:text-gray-500'
                    : 'text-gray-900 dark:text-gray-100'
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
