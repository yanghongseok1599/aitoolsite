import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAdminFirestore } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

// GET - Fetch user's settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getAdminFirestore()
    const settingsRef = db.collection('userSettings').doc(session.user.email)
    const snapshot = await settingsRef.get()

    if (snapshot.exists) {
      return NextResponse.json({ settings: snapshot.data() })
    }

    return NextResponse.json({ settings: null })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// PUT - Update user's settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { categoryOrder, widgetOrder, bannerWidgets, welcomeTitle, welcomeDescription, theme } = body

    const db = getAdminFirestore()
    const settingsRef = db.collection('userSettings').doc(session.user.email)

    const updates: Record<string, any> = {
      userId: session.user.email,
      updatedAt: FieldValue.serverTimestamp(),
    }

    if (categoryOrder !== undefined) updates.categoryOrder = categoryOrder
    if (widgetOrder !== undefined) updates.widgetOrder = widgetOrder
    if (bannerWidgets !== undefined) updates.bannerWidgets = bannerWidgets
    if (welcomeTitle !== undefined) updates.welcomeTitle = welcomeTitle
    if (welcomeDescription !== undefined) updates.welcomeDescription = welcomeDescription
    if (theme !== undefined) updates.theme = theme

    await settingsRef.set(updates, { merge: true })

    return NextResponse.json({ message: 'Settings updated successfully' })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
