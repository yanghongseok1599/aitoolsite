import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAdminFirestore } from '@/lib/firebase-admin'

// 구독 시작 (빌링키로 첫 결제)
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
    const { planId, billingCycle } = body

    if (!planId || !billingCycle) {
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

    const db = getAdminFirestore()
    const userId = session.user.id || session.user.email

    // 빌링키 조회
    const billingKeyDoc = await db.collection('billingKeys').doc(userId as string).get()

    if (!billingKeyDoc.exists) {
      return NextResponse.json(
        { error: '등록된 결제 수단이 없습니다.' },
        { status: 400 }
      )
    }

    const billingKeyData = billingKeyDoc.data()
    const billingKey = billingKeyData?.billingKey
    const customerKey = billingKeyData?.customerKey

    // 가격 계산
    const prices: Record<string, { monthly: number; yearly: number }> = {
      pro: { monthly: 4900, yearly: 49000 }
    }

    const planPrices = prices[planId]
    if (!planPrices) {
      return NextResponse.json(
        { error: '유효하지 않은 플랜입니다.' },
        { status: 400 }
      )
    }

    const amount = billingCycle === 'yearly' ? planPrices.yearly : planPrices.monthly
    const orderId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // 토스페이먼츠 자동결제 실행
    const response = await fetch('https://api.tosspayments.com/v1/billing/' + billingKey, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerKey,
        amount,
        orderId,
        orderName: `마이 AI 스튜디오 프로 - ${billingCycle === 'yearly' ? '연간' : '월간'} 구독`,
        customerEmail: session.user.email,
        customerName: session.user.name || '사용자',
      }),
    })

    const paymentData = await response.json()

    if (!response.ok) {
      console.error('Subscription payment error:', paymentData)
      return NextResponse.json(
        { error: paymentData.message || '결제 실패' },
        { status: response.status }
      )
    }

    // 구독 정보 저장
    const now = new Date()
    const nextBillingDate = new Date(now)
    if (billingCycle === 'yearly') {
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1)
    } else {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)
    }

    // 7일 무료 체험 (첫 구독인 경우)
    const existingSubscription = await db.collection('subscriptions')
      .where('userId', '==', userId)
      .where('planId', '==', 'pro')
      .limit(1)
      .get()

    const isFirstSubscription = existingSubscription.empty
    const trialEndDate = isFirstSubscription ? new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) : null

    await db.collection('subscriptions').doc(userId as string).set({
      userId,
      planId,
      billingCycle,
      status: 'active',
      amount,
      startDate: now.toISOString(),
      nextBillingDate: nextBillingDate.toISOString(),
      trialEndDate: trialEndDate?.toISOString() || null,
      lastPaymentId: paymentData.paymentKey,
      lastPaymentDate: now.toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    })

    // 결제 내역 저장
    await db.collection('payments').add({
      userId,
      orderId,
      paymentKey: paymentData.paymentKey,
      amount,
      planId,
      billingCycle,
      status: 'completed',
      method: paymentData.method,
      approvedAt: paymentData.approvedAt,
      createdAt: now.toISOString(),
    })

    // 사용자 플랜 업데이트
    await db.collection('users').doc(userId as string).update({
      plan: 'pro',
      planUpdatedAt: now.toISOString(),
    })

    return NextResponse.json({
      success: true,
      subscription: {
        planId,
        billingCycle,
        nextBillingDate: nextBillingDate.toISOString(),
        trialEndDate: trialEndDate?.toISOString() || null,
      }
    })

  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: '구독 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 구독 정보 조회
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const db = getAdminFirestore()
    const userId = session.user.id || session.user.email

    const subscriptionDoc = await db.collection('subscriptions').doc(userId as string).get()

    if (!subscriptionDoc.exists) {
      return NextResponse.json({
        subscription: null,
        plan: 'free'
      })
    }

    const subscription = subscriptionDoc.data()

    // 등록된 카드 정보 조회
    const billingKeyDoc = await db.collection('billingKeys').doc(userId as string).get()
    const cardInfo = billingKeyDoc.exists ? {
      cardCompany: billingKeyDoc.data()?.cardCompany,
      cardNumber: billingKeyDoc.data()?.cardNumber,
    } : null

    return NextResponse.json({
      subscription: {
        ...subscription,
        card: cardInfo
      },
      plan: subscription?.status === 'active' ? subscription?.planId : 'free'
    })

  } catch (error) {
    console.error('Get subscription error:', error)
    return NextResponse.json(
      { error: '구독 정보 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
