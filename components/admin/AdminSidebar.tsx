'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarItem {
  title: string
  href: string
  icon: string
}

const sidebarItems: SidebarItem[] = [
  {
    title: '대시보드',
    href: '/admin',
    icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z'
  },
  {
    title: '사용자 관리',
    href: '/admin/users',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
  },
  {
    title: '상품 관리',
    href: '/admin/products',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
  },
  {
    title: '주문 관리',
    href: '/admin/orders',
    icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
  },
  {
    title: '시스템 설정',
    href: '/admin/settings',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
  }
]

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900">관리자</h2>
        <p className="text-sm text-gray-600 mt-1">시스템 관리</p>
      </div>

      <nav className="px-3">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-colors ${
              isActive(item.href)
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={item.icon}
              />
            </svg>
            <span className="font-medium">{item.title}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          사이트로 돌아가기
        </Link>
      </div>
    </div>
  )
}
