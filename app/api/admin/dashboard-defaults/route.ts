import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAdminFirestore } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

const ADMIN_EMAILS = ['admin@aitoolsite.com', 'ccv1599@gmail.com', 'ccvadmin']

// GET - Fetch default dashboard settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getAdminFirestore()
    const settingsDoc = await db.collection('admin').doc('dashboardDefaults').get()

    if (!settingsDoc.exists) {
      // Return default settings
      return NextResponse.json({
        categories: [
          { name: 'AI 에이전트', order: 0 },
          { name: 'AI 생산성', order: 1 },
          { name: 'AI 콘텐츠', order: 2 },
          { name: '즐겨찾기', order: 3 },
        ],
        bookmarks: [
          { category: 'AI 에이전트', name: 'ChatGPT', url: 'https://chat.openai.com', icon: 'https://www.google.com/s2/favicons?domain=openai.com&sz=128' },
          { category: 'AI 에이전트', name: 'Claude', url: 'https://claude.ai', icon: 'https://www.google.com/s2/favicons?domain=claude.ai&sz=128' },
          { category: 'AI 에이전트', name: 'Gemini', url: 'https://gemini.google.com', icon: 'https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128' },
          { category: 'AI 생산성', name: 'Notion AI', url: 'https://notion.so', icon: 'https://www.google.com/s2/favicons?domain=notion.so&sz=128' },
          { category: 'AI 콘텐츠', name: 'Midjourney', url: 'https://midjourney.com', icon: 'https://www.google.com/s2/favicons?domain=midjourney.com&sz=128' },
        ]
      })
    }

    return NextResponse.json(settingsDoc.data())
  } catch (error) {
    console.error('Error fetching dashboard defaults:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// POST - Save default dashboard settings
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { categories, bookmarks } = body

    const db = getAdminFirestore()
    await db.collection('admin').doc('dashboardDefaults').set({
      categories: categories || [],
      bookmarks: bookmarks || [],
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: session.user.email,
    })

    return NextResponse.json({ message: 'Settings saved successfully' })
  } catch (error) {
    console.error('Error saving dashboard defaults:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}

// PUT - Apply defaults to a new user (or reset user's dashboard)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { userId } = body

    // Only admins can reset other users, users can only reset themselves
    const targetUserId = ADMIN_EMAILS.includes(session.user.email) && userId
      ? userId
      : session.user.email

    const db = getAdminFirestore()

    // Get default settings
    const settingsDoc = await db.collection('admin').doc('dashboardDefaults').get()
    const defaults = settingsDoc.exists ? settingsDoc.data() : null

    if (!defaults) {
      return NextResponse.json({ error: 'No default settings found' }, { status: 404 })
    }

    // Delete existing bookmarks for the user
    const existingBookmarks = await db.collection('bookmarks')
      .where('userId', '==', targetUserId)
      .get()

    const batch = db.batch()
    existingBookmarks.docs.forEach(doc => {
      batch.delete(doc.ref)
    })

    // Add default bookmarks for the user
    const now = FieldValue.serverTimestamp()
    for (const bookmark of defaults.bookmarks || []) {
      const newBookmarkRef = db.collection('bookmarks').doc()
      batch.set(newBookmarkRef, {
        ...bookmark,
        userId: targetUserId,
        createdAt: now,
        updatedAt: now,
      })
    }

    // Save category order
    const userSettingsRef = db.collection('userSettings').doc(targetUserId)
    batch.set(userSettingsRef, {
      categoryOrder: (defaults.categories || []).map((c: any) => c.name),
      updatedAt: now,
    }, { merge: true })

    await batch.commit()

    return NextResponse.json({ message: 'Dashboard reset to defaults successfully' })
  } catch (error) {
    console.error('Error applying dashboard defaults:', error)
    return NextResponse.json({ error: 'Failed to apply defaults' }, { status: 500 })
  }
}
