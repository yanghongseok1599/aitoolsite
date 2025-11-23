import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(request: NextRequest) {
  try {
    // 세션 확인
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    // 요청 데이터 파싱
    const body = await request.json()
    const { orderId, paymentKey, amount } = body

    // 데이터 검증
    if (!orderId || !paymentKey || !amount) {
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

    // 토스페이먼츠 결제 승인 API 호출
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        paymentKey,
        amount,
      }),
    })

    const paymentData = await response.json()

    if (!response.ok) {
      console.error('Payment confirmation error:', paymentData)

      // 이미 처리된 결제인 경우 성공으로 처리
      if (paymentData.code === 'ALREADY_PROCESSED_PAYMENT') {
        return NextResponse.json({
          success: true,
          payment: paymentData,
          alreadyProcessed: true
        })
      }

      return NextResponse.json(
        { error: paymentData.message || '결제 승인 실패' },
        { status: response.status }
      )
    }

    // TODO: 데이터베이스에 결제 정보 업데이트
    // await db.order.update({
    //   where: { orderId },
    //   data: {
    //     status: 'completed',
    //     paymentKey,
    //     approvedAt: new Date(paymentData.approvedAt),
    //   }
    // })

    // TODO: 사용자 구독 정보 업데이트
    // await db.subscription.create({
    //   data: {
    //     userId: session.user.id,
    //     orderId,
    //     status: 'active',
    //     startDate: new Date(),
    //     endDate: calculateEndDate(paymentData.period),
    //   }
    // })

    return NextResponse.json({
      success: true,
      payment: paymentData,
    })

  } catch (error) {
    console.error('Payment confirmation error:', error)
    return NextResponse.json(
      { error: '결제 승인 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
