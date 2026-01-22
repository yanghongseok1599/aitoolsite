import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAdminFirestore } from '@/lib/firebase-admin'

// 빌링키 발급 후 처리 (토스페이먼츠에서 리다이렉트)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { authKey, customerKey } = body

    if (!authKey || !customerKey) {
      return NextResponse.json(
        { error: '필수 데이터가 누락되었습니다.' },
        { status: 400 }
      )
    }

    const secretKey = process.env.TOSS_SECRET_KEY

    if (!secretKey) {
      return NextResponse.json(
        { error: '결제 시스템 설정이 완료되지 않았습니다.' },
        { status: 500 }
      )
    }

    // 토스페이먼츠 빌링키 발급 API 호출
    const response = await fetch('https://api.tosspayments.com/v1/billing/authorizations/issue', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        authKey,
        customerKey,
      }),
    })

    const billingData = await response.json()

    if (!response.ok) {
      console.error('Billing key issue error:', billingData)
      return NextResponse.json(
        { error: billingData.message || '빌링키 발급 실패' },
        { status: response.status }
      )
    }

    // Firestore에 빌링키 저장
    const db = getAdminFirestore()
    const userId = session.user.id || session.user.email

    await db.collection('billingKeys').doc(userId as string).set({
      billingKey: billingData.billingKey,
      customerKey: customerKey,
      cardCompany: billingData.card?.company || null,
      cardNumber: billingData.card?.number || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      cardCompany: billingData.card?.company,
      cardNumber: billingData.card?.number,
    })

  } catch (error) {
    console.error('Billing key issue error:', error)
    return NextResponse.json(
      { error: '빌링키 발급 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
