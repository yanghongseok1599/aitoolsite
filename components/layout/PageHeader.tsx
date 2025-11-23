'use client'

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumb?: { name: string; href: string }[]
}

export function PageHeader({ title, subtitle, breadcrumb }: PageHeaderProps) {
  return (
    <div className="py-16 lg:py-24 border-b border-gray-200 dark:border-gray-800">
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="flex items-center space-x-2 text-sm mb-4">
          {breadcrumb.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  className="w-4 h-4 mx-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              <a
                href={item.href}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                {item.name}
              </a>
            </div>
          ))}
        </nav>
      )}
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        {title}
      </h1>
      {subtitle && (
        <p className="text-xl text-gray-600 dark:text-gray-400">
          {subtitle}
        </p>
      )}
    </div>
  )
}
