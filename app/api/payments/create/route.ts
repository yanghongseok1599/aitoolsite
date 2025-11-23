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
    const { amount, orderId, orderName, customerName, customerEmail, productId, period } = body

    // 데이터 검증
    if (!amount || !orderId || !orderName || !productId || !period) {
      return NextResponse.json(
        { error: '필수 데이터가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // TODO: 데이터베이스에 주문 정보 저장
    // const order = await db.order.create({
    //   data: {
    //     orderId,
    //     userId: session.user.id,
    //     productId,
    //     amount,
    //     period,
    //     status: 'pending',
    //     orderName,
    //   }
    // })

    // 현재는 주문 ID만 반환 (실제로는 DB에 저장된 정보 반환)
    return NextResponse.json({
      success: true,
      orderId,
      amount,
      orderName,
    })

  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: '결제 요청 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
