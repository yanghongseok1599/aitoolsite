'use client'

import { useState, useEffect } from 'react'

export function WeatherWidget() {
  const [weather, setWeather] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 임시 데이터 (실제로는 날씨 API 연동 필요)
    const mockWeather = {
      city: '서울',
      temp: 18,
      condition: '맑음',
      humidity: 60,
      windSpeed: 3.5
    }

    setTimeout(() => {
      setWeather(mockWeather)
      setLoading(false)
    }, 500)
  }, [])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">날씨</h3>
        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{weather.city}</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">{weather.temp}°C</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{weather.condition}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">습도</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{weather.humidity}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">풍속</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{weather.windSpeed}m/s</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
