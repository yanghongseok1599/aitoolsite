import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// 알려진 구독 서비스 정보
const KNOWN_SERVICES: Record<string, { name: string; category: string; icon: string }> = {
  'chatgpt': { name: 'ChatGPT Plus', category: 'AI Tools', icon: '🤖' },
  'openai': { name: 'OpenAI', category: 'AI Tools', icon: '🤖' },
  'midjourney': { name: 'Midjourney', category: 'AI Tools', icon: '🎨' },
  'copilot': { name: 'GitHub Copilot', category: 'Developer Tools', icon: '👨‍💻' },
  'github': { name: 'GitHub', category: 'Developer Tools', icon: '🐙' },
  'claude': { name: 'Claude Pro', category: 'AI Tools', icon: '🧠' },
  'anthropic': { name: 'Anthropic', category: 'AI Tools', icon: '🧠' },
  'notion': { name: 'Notion', category: 'Productivity', icon: '📝' },
  'figma': { name: 'Figma', category: 'Design', icon: '🎨' },
  'spotify': { name: 'Spotify', category: 'Entertainment', icon: '🎵' },
  'netflix': { name: 'Netflix', category: 'Entertainment', icon: '🎬' },
  'youtube': { name: 'YouTube Premium', category: 'Entertainment', icon: '📺' },
  'disney': { name: 'Disney+', category: 'Entertainment', icon: '🏰' },
  'adobe': { name: 'Adobe Creative Cloud', category: 'Design', icon: '🎨' },
  'microsoft': { name: 'Microsoft 365', category: 'Productivity', icon: '📊' },
  'google one': { name: 'Google One', category: 'Cloud Storage', icon: '☁️' },
  'dropbox': { name: 'Dropbox', category: 'Cloud Storage', icon: '📦' },
  'slack': { name: 'Slack', category: 'Communication', icon: '💬' },
  'zoom': { name: 'Zoom', category: 'Communication', icon: '📹' },
  'canva': { name: 'Canva Pro', category: 'Design', icon: '🖼️' },
  'grammarly': { name: 'Grammarly', category: 'Productivity', icon: '✍️' },
  'vercel': { name: 'Vercel', category: 'Developer Tools', icon: '▲' },
  'aws': { name: 'AWS', category: 'Cloud', icon: '☁️' },
  'heroku': { name: 'Heroku', category: 'Developer Tools', icon: '🟣' },
  'digitalocean': { name: 'DigitalOcean', category: 'Cloud', icon: '🌊' },
  'perplexity': { name: 'Perplexity Pro', category: 'AI Tools', icon: '🔍' },
  'jasper': { name: 'Jasper AI', category: 'AI Tools', icon: '✨' },
  'runway': { name: 'Runway', category: 'AI Tools', icon: '🎬' },
  'elevenlabs': { name: 'ElevenLabs', category: 'AI Tools', icon: '🔊' },
  'cursor': { name: 'Cursor', category: 'Developer Tools', icon: '⌨️' },
}

// 이메일에서 가격 추출
function extractPrice(text: string): { amount: number; currency: string } | null {
  // 다양한 통화 패턴 매칭
  const patterns = [
    /\$(\d+(?:\.\d{2})?)/,           // $20.00
    /USD\s*(\d+(?:\.\d{2})?)/i,       // USD 20.00
    /(\d+(?:\.\d{2})?)\s*USD/i,       // 20.00 USD
    /₩\s*([\d,]+)/,                   // ₩20,000
    /(\d{1,3}(?:,\d{3})*)\s*원/,      // 20,000원
    /€(\d+(?:\.\d{2})?)/,             // €20.00
    /£(\d+(?:\.\d{2})?)/,             // £20.00
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      const amount = parseFloat(match[1].replace(/,/g, ''))
      let currency = 'USD'
      if (text.includes('₩') || text.includes('원')) currency = 'KRW'
      else if (text.includes('€')) currency = 'EUR'
      else if (text.includes('£')) currency = 'GBP'
      return { amount, currency }
    }
  }
  return null
}

// 결제 주기 추출
function extractBillingCycle(text: string): 'monthly' | 'annual' | 'weekly' {
  const lowerText = text.toLowerCase()
  if (lowerText.includes('annual') || lowerText.includes('yearly') || lowerText.includes('year') || lowerText.includes('연간')) {
    return 'annual'
  }
  if (lowerText.includes('weekly') || lowerText.includes('week') || lowerText.includes('주간')) {
    return 'weekly'
  }
  return 'monthly'
}

// 서비스 정보 추출
function identifyService(from: string, subject: string, body: string): { name: string; category: string; icon: string } | null {
  const combined = `${from} ${subject} ${body}`.toLowerCase()

  for (const [keyword, info] of Object.entries(KNOWN_SERVICES)) {
    if (combined.includes(keyword)) {
      return info
    }
  }

  // 알려지지 않은 서비스의 경우 이메일 발신자에서 추출 시도
  const emailMatch = from.match(/@([a-z0-9-]+)\./i)
  if (emailMatch) {
    const domain = emailMatch[1]
    return {
      name: domain.charAt(0).toUpperCase() + domain.slice(1),
      category: 'Other',
      icon: '📧'
    }
  }

  return null
}

// POST: Gmail에서 구독 관련 이메일 스캔
export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accessToken = session.accessToken

    if (!accessToken) {
      return NextResponse.json({
        error: 'Gmail access not authorized',
        needsReauth: true,
        message: '구글 계정에 다시 로그인하여 Gmail 권한을 허용해주세요.'
      }, { status: 401 })
    }

    // Gmail API로 구독 관련 이메일 검색
    const searchQuery = encodeURIComponent(
      'subject:(receipt OR invoice OR subscription OR payment OR 결제 OR 구독 OR 영수증 OR 청구) newer_than:6m'
    )

    const listResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${searchQuery}&maxResults=50`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!listResponse.ok) {
      const error = await listResponse.json()
      console.error('Gmail API error:', error)

      if (listResponse.status === 401 || listResponse.status === 403) {
        return NextResponse.json({
          error: 'Gmail access denied',
          needsReauth: true,
          message: '구글 계정에 다시 로그인하여 Gmail 권한을 허용해주세요.'
        }, { status: 401 })
      }

      return NextResponse.json({ error: 'Failed to access Gmail' }, { status: 500 })
    }

    const listData = await listResponse.json()
    const messages = listData.messages || []

    // 각 이메일의 상세 내용 가져오기
    const foundSubscriptions: Array<{
      service: string
      category: string
      icon: string
      price: number
      currency: string
      billingCycle: string
      emailDate: string
      emailSubject: string
      confidence: number
    }> = []

    const processedServices = new Set<string>()

    for (const message of messages.slice(0, 30)) { // 최대 30개 이메일만 처리
      try {
        const msgResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=full`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        if (!msgResponse.ok) continue

        const msgData = await msgResponse.json()

        // 헤더에서 정보 추출
        const headers = msgData.payload?.headers || []
        const from = headers.find((h: { name: string }) => h.name.toLowerCase() === 'from')?.value || ''
        const subject = headers.find((h: { name: string }) => h.name.toLowerCase() === 'subject')?.value || ''
        const date = headers.find((h: { name: string }) => h.name.toLowerCase() === 'date')?.value || ''

        // 본문 추출 (Base64 디코딩)
        let body = ''
        const parts = msgData.payload?.parts || [msgData.payload]
        for (const part of parts) {
          if (part?.body?.data) {
            try {
              body += Buffer.from(part.body.data, 'base64').toString('utf-8')
            } catch {
              // 디코딩 실패 시 무시
            }
          }
        }

        // 서비스 식별
        const serviceInfo = identifyService(from, subject, body)
        if (!serviceInfo) continue

        // 중복 서비스 건너뛰기
        if (processedServices.has(serviceInfo.name)) continue
        processedServices.add(serviceInfo.name)

        // 가격 추출
        const priceInfo = extractPrice(`${subject} ${body}`)
        if (!priceInfo) continue

        // 결제 주기 추출
        const billingCycle = extractBillingCycle(`${subject} ${body}`)

        // 신뢰도 계산 (더 많은 정보가 매칭될수록 높음)
        let confidence = 0.5
        if (subject.toLowerCase().includes('receipt') || subject.includes('영수증')) confidence += 0.2
        if (subject.toLowerCase().includes('subscription') || subject.includes('구독')) confidence += 0.2
        if (priceInfo) confidence += 0.1

        foundSubscriptions.push({
          service: serviceInfo.name,
          category: serviceInfo.category,
          icon: serviceInfo.icon,
          price: priceInfo.amount,
          currency: priceInfo.currency,
          billingCycle,
          emailDate: date,
          emailSubject: subject,
          confidence: Math.min(confidence, 1),
        })
      } catch (err) {
        console.error('Error processing message:', err)
        continue
      }
    }

    // 신뢰도 순으로 정렬
    foundSubscriptions.sort((a, b) => b.confidence - a.confidence)

    return NextResponse.json({
      success: true,
      subscriptions: foundSubscriptions,
      scannedEmails: messages.length,
      message: `${messages.length}개의 이메일을 스캔하여 ${foundSubscriptions.length}개의 구독을 발견했습니다.`
    })
  } catch (error) {
    console.error('Failed to scan Gmail:', error)
    return NextResponse.json({ error: 'Failed to scan Gmail' }, { status: 500 })
  }
}
