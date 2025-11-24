'use client'

import { useState, useEffect } from 'react'

const quotes = [
  {
    text: '위대한 일을 하려면 자신이 하는 일을 사랑해야 합니다.',
    author: '스티브 잡스'
  },
  {
    text: '성공은 최종적인 것이 아니며, 실패는 치명적인 것이 아니다. 중요한 것은 계속할 용기다.',
    author: '윈스턴 처칠'
  },
  {
    text: '미래를 예측하는 가장 좋은 방법은 그것을 창조하는 것이다.',
    author: '피터 드러커'
  },
  {
    text: '당신이 할 수 있다고 믿든, 할 수 없다고 믿든, 당신이 옳다.',
    author: '헨리 포드'
  },
  {
    text: '오늘 할 수 있는 일을 내일로 미루지 마라.',
    author: '벤저민 프랭클린'
  },
  {
    text: '성공의 비결은 시작하는 것이다.',
    author: '마크 트웨인'
  },
  {
    text: '행동이 모든 성공의 기본 열쇠다.',
    author: '파블로 피카소'
  },
  {
    text: '한계는 두려움이 대부분이고, 나머지는 환상이다.',
    author: '마이클 조던'
  }
]

export function QuoteWidget() {
  const [quote, setQuote] = useState(quotes[0])

  useEffect(() => {
    // 랜덤 명언 선택
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
    setQuote(randomQuote)
  }, [])

  const getNewQuote = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
    setQuote(randomQuote)
  }

  return (
    <div className="bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-xl p-6 shadow-sm text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">오늘의 명언</h3>
        <button
          onClick={getNewQuote}
          className="p-1 rounded-lg hover:bg-white/20 transition-colors"
          title="새로운 명언"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <div className="mb-4">
        <svg className="w-8 h-8 mb-3 opacity-50" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <p className="text-lg mb-4 leading-relaxed">{quote.text}</p>
        <p className="text-sm opacity-90">- {quote.author}</p>
      </div>
    </div>
  )
}
