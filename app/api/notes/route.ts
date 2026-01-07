import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAdminFirestore } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

// GET - Fetch user's notes
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getAdminFirestore()
    const notesRef = db.collection('notes')
    const snapshot = await notesRef
      .where('userId', '==', session.user.email)
      .orderBy('updatedAt', 'desc')
      .get()

    const notes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
    }))

    return NextResponse.json({ notes })
  } catch (error: any) {
    console.error('Error fetching notes:', error)
    // If index error, try without ordering
    if (error?.code === 9 || error?.message?.includes('index')) {
      try {
        const session = await getServerSession(authOptions)
        const db = getAdminFirestore()
        const snapshot = await db.collection('notes')
          .where('userId', '==', session?.user?.email)
          .get()

        const notes = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
            updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
          }))
          .sort((a: any, b: any) => {
            const aTime = new Date(a.updatedAt || 0).getTime()
            const bTime = new Date(b.updatedAt || 0).getTime()
            return bTime - aTime
          })

        return NextResponse.json({ notes })
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError)
      }
    }
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  }
}

// POST - Create a new note
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const db = getAdminFirestore()
    const notesRef = db.collection('notes')

    const docRef = await notesRef.add({
      userId: session.user.email,
      title,
      content: content || '',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({
      id: docRef.id,
      message: 'Note created successfully'
    })
  } catch (error: any) {
    console.error('Error creating note:', error)
    return NextResponse.json({
      error: 'Failed to create note',
      details: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}

// PUT - Update a note
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, title, content, isPinned, color } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing note ID' }, { status: 400 })
    }

    const db = getAdminFirestore()
    const noteRef = db.collection('notes').doc(id)
    const noteDoc = await noteRef.get()

    if (!noteDoc.exists) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    const noteData = noteDoc.data()
    if (noteData?.userId !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const updates: Record<string, any> = {
      updatedAt: FieldValue.serverTimestamp(),
    }

    if (title !== undefined) updates.title = title
    if (content !== undefined) updates.content = content
    if (isPinned !== undefined) updates.isPinned = isPinned
    if (color !== undefined) updates.color = color

    await noteRef.update(updates)

    return NextResponse.json({ message: 'Note updated successfully' })
  } catch (error) {
    console.error('Error updating note:', error)
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 })
  }
}

// DELETE - Delete a note
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing note ID' }, { status: 400 })
    }

    const db = getAdminFirestore()
    const noteRef = db.collection('notes').doc(id)
    const noteDoc = await noteRef.get()

    if (!noteDoc.exists) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    const noteData = noteDoc.data()
    if (noteData?.userId !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await noteRef.delete()

    return NextResponse.json({ message: 'Note deleted successfully' })
  } catch (error) {
    console.error('Error deleting note:', error)
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 })
  }
}
