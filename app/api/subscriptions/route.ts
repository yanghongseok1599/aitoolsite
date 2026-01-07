import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAdminFirestore } from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'

// GET: 사용자의 구독 목록 조회
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getAdminFirestore()
    const userId = session.user.id || session.user.email

    const subscriptionsRef = db.collection('users').doc(userId).collection('subscriptions')
    const snapshot = await subscriptionsRef.orderBy('createdAt', 'desc').get()

    const subscriptions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({ subscriptions })
  } catch (error) {
    console.error('Failed to fetch subscriptions:', error)
    return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 })
  }
}

// POST: 새 구독 추가
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { service, plan, price, currency, billingCycle, nextBillingDate, category, icon, url, autoRenew, notes, source } = body

    if (!service || !price) {
      return NextResponse.json({ error: 'Service name and price are required' }, { status: 400 })
    }

    const db = getAdminFirestore()
    const userId = session.user.id || session.user.email

    const subscriptionData = {
      service,
      plan: plan || 'Standard',
      price: Number(price),
      currency: currency || 'USD',
      billingCycle: billingCycle || 'monthly',
      nextBillingDate: nextBillingDate || null,
      startDate: new Date().toISOString(),
      category: category || 'AI Tools',
      icon: icon || null,
      url: url || null,
      autoRenew: autoRenew !== false,
      status: 'active',
      notes: notes || '',
      source: source || 'manual', // 'manual' or 'gmail'
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const docRef = await db.collection('users').doc(userId).collection('subscriptions').add(subscriptionData)

    return NextResponse.json({
      success: true,
      subscription: { id: docRef.id, ...subscriptionData }
    })
  } catch (error) {
    console.error('Failed to create subscription:', error)
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
  }
}

// PUT: 구독 수정
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 })
    }

    const db = getAdminFirestore()
    const userId = session.user.id || session.user.email

    const subscriptionRef = db.collection('users').doc(userId).collection('subscriptions').doc(id)
    const doc = await subscriptionRef.get()

    if (!doc.exists) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    await subscriptionRef.update({
      ...updateData,
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update subscription:', error)
    return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 })
  }
}

// DELETE: 구독 삭제
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 })
    }

    const db = getAdminFirestore()
    const userId = session.user.id || session.user.email

    await db.collection('users').doc(userId).collection('subscriptions').doc(id).delete()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete subscription:', error)
    return NextResponse.json({ error: 'Failed to delete subscription' }, { status: 500 })
  }
}
