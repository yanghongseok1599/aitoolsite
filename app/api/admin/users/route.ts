import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAdminFirestore } from '@/lib/firebase-admin'

// Admin email list for authorization
const ADMIN_EMAILS = ['admin@aitoolsite.com', 'ccvadmin@admin.local']

async function isAdmin(session: any): Promise<boolean> {
  if (!session?.user?.email) return false
  return ADMIN_EMAILS.includes(session.user.email) || session.user.role === 'admin'
}

export interface UserData {
  id: string
  email: string
  displayName: string | null
  photoURL: string | null
  role: 'user' | 'admin'
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  lastLoginAt: string | null
  provider: string
}

// GET: Fetch all users
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!await isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getAdminFirestore()

    // Fetch users from Firestore 'users' collection (NextAuth users)
    const usersSnapshot = await db.collection('users').orderBy('createdAt', 'desc').get()

    const users: UserData[] = usersSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        email: data.email || '',
        displayName: data.displayName || null,
        photoURL: data.photoURL || null,
        role: data.role || (ADMIN_EMAILS.includes(data.email || '') ? 'admin' : 'user'),
        status: data.status || 'active',
        createdAt: data.createdAt || new Date().toISOString(),
        lastLoginAt: data.updatedAt || null,
        provider: data.provider || 'Unknown'
      }
    })

    return NextResponse.json({ users, total: users.length })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// PATCH: Update user (role or status)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!await isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, role, status } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const db = getAdminFirestore()

    // Update Firestore user data
    const updateData: any = {}
    if (role) updateData.role = role
    if (status) updateData.status = status
    updateData.updatedAt = new Date().toISOString()

    await db.collection('users').doc(userId).update(updateData)

    return NextResponse.json({ success: true, message: 'User updated successfully' })
  } catch (error: any) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE: Delete user
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!await isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const db = getAdminFirestore()

    // Delete user from Firestore 'users' collection
    await db.collection('users').doc(userId).delete()

    // Optionally delete user's data (bookmarks, notes, etc.)
    const batch = db.batch()

    // Delete bookmarks
    const bookmarksSnapshot = await db.collection('bookmarks').where('userId', '==', userId).get()
    bookmarksSnapshot.forEach(doc => batch.delete(doc.ref))

    // Delete notes
    const notesSnapshot = await db.collection('notes').where('userId', '==', userId).get()
    notesSnapshot.forEach(doc => batch.delete(doc.ref))

    // Delete todos
    const todosSnapshot = await db.collection('todos').where('userId', '==', userId).get()
    todosSnapshot.forEach(doc => batch.delete(doc.ref))

    // Delete events
    const eventsSnapshot = await db.collection('events').where('userId', '==', userId).get()
    eventsSnapshot.forEach(doc => batch.delete(doc.ref))

    // Delete user settings
    await db.collection('userSettings').doc(userId).delete()
    await db.collection('widgetSettings').doc(userId).delete()

    await batch.commit()

    return NextResponse.json({ success: true, message: 'User deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    )
  }
}
