import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAdminFirestore } from '@/lib/firebase-admin'

// GET - 설정 가져오기
export async function GET() {
  try {
    const db = getAdminFirestore()
    const docRef = db.collection('admin').doc('settings')
    const docSnap = await docRef.get()

    if (docSnap.exists) {
      return NextResponse.json(docSnap.data())
    } else {
      return NextResponse.json({})
    }
  } catch (error: any) {
    console.error('Failed to get settings:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to get settings' },
      { status: 500 }
    )
  }
}

// POST - 설정 저장하기
export async function POST(request: NextRequest) {
  try {
    // 세션 확인
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const settings = await request.json()

    const db = getAdminFirestore()
    const docRef = db.collection('admin').doc('settings')
    await docRef.set(settings, { merge: true })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Failed to save settings:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to save settings' },
      { status: 500 }
    )
  }
}
