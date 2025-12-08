import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAdminFirestore } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

// GET - Fetch user's bookmarks
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getAdminFirestore()
    const bookmarksRef = db.collection('bookmarks')
    const snapshot = await bookmarksRef
      .where('userId', '==', session.user.email)
      .orderBy('createdAt', 'desc')
      .get()

    const bookmarks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({ bookmarks })
  } catch (error) {
    console.error('Error fetching bookmarks:', error)
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 })
  }
}

// POST - Add a new bookmark
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { category, name, url, icon, description } = body

    if (!category || !name || !url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let db
    try {
      db = getAdminFirestore()
    } catch (adminError: any) {
      console.error('Firebase Admin initialization error:', adminError)
      return NextResponse.json({
        error: 'Firebase Admin SDK initialization failed',
        details: adminError?.message || 'Unknown error'
      }, { status: 500 })
    }

    const bookmarksRef = db.collection('bookmarks')

    const docRef = await bookmarksRef.add({
      userId: session.user.email,
      category,
      name,
      url,
      icon: icon || null,
      description: description || null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({
      id: docRef.id,
      message: 'Bookmark created successfully'
    })
  } catch (error: any) {
    console.error('Error creating bookmark:', error)
    return NextResponse.json({
      error: 'Failed to create bookmark',
      details: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}

// PUT - Update a bookmark
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, url, icon, category, description } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing bookmark ID' }, { status: 400 })
    }

    const db = getAdminFirestore()
    const bookmarkRef = db.collection('bookmarks').doc(id)
    const bookmarkDoc = await bookmarkRef.get()

    if (!bookmarkDoc.exists) {
      return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 })
    }

    const bookmarkData = bookmarkDoc.data()
    if (bookmarkData?.userId !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const updates: Record<string, any> = {
      updatedAt: FieldValue.serverTimestamp(),
    }

    if (name !== undefined) updates.name = name
    if (url !== undefined) updates.url = url
    if (icon !== undefined) updates.icon = icon
    if (category !== undefined) updates.category = category
    if (description !== undefined) updates.description = description

    await bookmarkRef.update(updates)

    return NextResponse.json({ message: 'Bookmark updated successfully' })
  } catch (error) {
    console.error('Error updating bookmark:', error)
    return NextResponse.json({ error: 'Failed to update bookmark' }, { status: 500 })
  }
}

// DELETE - Delete a bookmark
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing bookmark ID' }, { status: 400 })
    }

    const db = getAdminFirestore()
    const bookmarkRef = db.collection('bookmarks').doc(id)
    const bookmarkDoc = await bookmarkRef.get()

    if (!bookmarkDoc.exists) {
      return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 })
    }

    const bookmarkData = bookmarkDoc.data()
    if (bookmarkData?.userId !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await bookmarkRef.delete()

    return NextResponse.json({ message: 'Bookmark deleted successfully' })
  } catch (error) {
    console.error('Error deleting bookmark:', error)
    return NextResponse.json({ error: 'Failed to delete bookmark' }, { status: 500 })
  }
}
