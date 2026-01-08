import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Google 파비콘 플레이스홀더 감지
async function isGooglePlaceholder(imageBuffer: Buffer): Promise<boolean> {
  // Google placeholder는 보통 작은 크기 (16x16 또는 비슷한 크기)
  // 회색/파란 계열의 단색에 가까움

  // PNG 시그니처 체크
  const isPNG = imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50 &&
                imageBuffer[2] === 0x4E && imageBuffer[3] === 0x47

  if (!isPNG) {
    // ICO 또는 다른 형식은 일단 유효한 것으로 처리
    return false
  }

  // PNG IHDR 청크에서 크기 추출 (바이트 16-23)
  if (imageBuffer.length < 24) return true

  const width = imageBuffer.readUInt32BE(16)
  const height = imageBuffer.readUInt32BE(18)

  // 16x16 이하의 작은 이미지면 placeholder일 가능성 높음
  // 하지만 실제 favicon도 16x16일 수 있으므로 추가 검사 필요

  // 파일 크기가 너무 작으면 placeholder
  // Google placeholder는 보통 1KB 미만
  if (imageBuffer.length < 500 && width <= 16 && height <= 16) {
    return true
  }

  return false
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL required' }, { status: 400 })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      return NextResponse.json({ isPlaceholder: true })
    }

    const contentType = response.headers.get('content-type') || ''

    // 이미지가 아니면 placeholder
    if (!contentType.includes('image')) {
      return NextResponse.json({ isPlaceholder: true })
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 빈 응답이면 placeholder
    if (buffer.length === 0) {
      return NextResponse.json({ isPlaceholder: true })
    }

    // Google 파비콘 서비스 URL인 경우 추가 검사
    if (url.includes('google.com/s2/favicons') || url.includes('gstatic.com')) {
      const isPlaceholder = await isGooglePlaceholder(buffer)
      return NextResponse.json({ isPlaceholder })
    }

    // 다른 소스는 유효한 것으로 처리
    return NextResponse.json({ isPlaceholder: false })

  } catch (error) {
    console.error('Favicon check error:', error)
    return NextResponse.json({ isPlaceholder: true })
  }
}
