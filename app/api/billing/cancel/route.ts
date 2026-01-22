import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAdminFirestore } from '@/lib/firebase-admin'

// 구독 취소
export async function POST() {
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

    // 구독 정보 조회
    const subscriptionDoc = await db.collection('subscriptions').doc(userId as string).get()

    if (!subscriptionDoc.exists) {
      return NextResponse.json(
        { error: '활성화된 구독이 없습니다.' },
        { status: 400 }
      )
    }

    const subscription = subscriptionDoc.data()

    if (subscription?.status !== 'active') {
      return NextResponse.json(
        { error: '이미 취소된 구독입니다.' },
        { status: 400 }
      )
    }

    // 구독 상태를 'cancelled'로 변경
    // 실제로는 nextBillingDate까지 서비스 이용 가능
    await db.collection('subscriptions').doc(userId as string).update({
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: '구독이 취소되었습니다. 현재 결제 기간 종료일까지 서비스를 이용하실 수 있습니다.',
      endDate: subscription?.nextBillingDate
    })

  } catch (error) {
    console.error('Cancel subscription error:', error)
    return NextResponse.json(
      { error: '구독 취소 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
