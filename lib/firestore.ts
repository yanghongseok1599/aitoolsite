import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  addDoc,
} from 'firebase/firestore'
import { db } from './firebase'

// ============================================
// BOOKMARKS
// ============================================

export interface FirestoreBookmark {
  id: string
  name: string
  url: string
  icon?: string
  description?: string
  category: string
  userId: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Get all bookmarks for a user
export async function getUserBookmarks(userId: string) {
  const bookmarksRef = collection(db, 'bookmarks')
  const q = query(bookmarksRef, where('userId', '==', userId), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirestoreBookmark[]
}

// Add a bookmark
export async function addBookmark(userId: string, category: string, bookmark: {
  name: string
  url: string
  icon?: string
  description?: string
}) {
  const bookmarksRef = collection(db, 'bookmarks')
  const now = Timestamp.now()

  return await addDoc(bookmarksRef, {
    ...bookmark,
    category,
    userId,
    createdAt: now,
    updatedAt: now,
  })
}

// Update a bookmark
export async function updateBookmark(bookmarkId: string, updates: Partial<FirestoreBookmark>) {
  const bookmarkRef = doc(db, 'bookmarks', bookmarkId)
  await updateDoc(bookmarkRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  })
}

// Delete a bookmark
export async function deleteBookmark(bookmarkId: string) {
  const bookmarkRef = doc(db, 'bookmarks', bookmarkId)
  await deleteDoc(bookmarkRef)
}

// ============================================
// USER SETTINGS
// ============================================

export interface UserSettings {
  userId: string
  categoryOrder: string[]
  widgetOrder: string[]
  theme?: 'light' | 'dark' | 'system'
  updatedAt: Timestamp
}

// Get user settings
export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  const settingsRef = doc(db, 'userSettings', userId)
  const snapshot = await getDoc(settingsRef)

  if (snapshot.exists()) {
    return snapshot.data() as UserSettings
  }
  return null
}

// Save user settings
export async function saveUserSettings(userId: string, settings: Partial<UserSettings>) {
  const settingsRef = doc(db, 'userSettings', userId)
  await setDoc(settingsRef, {
    userId,
    ...settings,
    updatedAt: Timestamp.now(),
  }, { merge: true })
}

// ============================================
// NOTES
// ============================================

export interface FirestoreNote {
  id: string
  title: string
  content: string
  color?: string
  isPinned?: boolean
  userId: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Get all notes for a user
export async function getUserNotes(userId: string) {
  const notesRef = collection(db, 'notes')
  const q = query(notesRef, where('userId', '==', userId), orderBy('updatedAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirestoreNote[]
}

// Add a note
export async function addNote(userId: string, note: {
  title: string
  content: string
  color?: string
  isPinned?: boolean
}) {
  const notesRef = collection(db, 'notes')
  const now = Timestamp.now()

  return await addDoc(notesRef, {
    ...note,
    userId,
    createdAt: now,
    updatedAt: now,
  })
}

// Update a note
export async function updateNote(noteId: string, updates: Partial<FirestoreNote>) {
  const noteRef = doc(db, 'notes', noteId)
  await updateDoc(noteRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  })
}

// Delete a note
export async function deleteNote(noteId: string) {
  const noteRef = doc(db, 'notes', noteId)
  await deleteDoc(noteRef)
}

// ============================================
// CALENDAR EVENTS
// ============================================

export interface FirestoreEvent {
  id: string
  summary: string
  description?: string
  start: Timestamp
  end: Timestamp
  color?: string
  userId: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Get all events for a user
export async function getUserEvents(userId: string) {
  const eventsRef = collection(db, 'events')
  const q = query(eventsRef, where('userId', '==', userId), orderBy('start', 'asc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirestoreEvent[]
}

// Add an event
export async function addEvent(userId: string, event: {
  summary: string
  description?: string
  start: Date
  end: Date
  color?: string
}) {
  const eventsRef = collection(db, 'events')
  const now = Timestamp.now()

  return await addDoc(eventsRef, {
    summary: event.summary,
    description: event.description,
    start: Timestamp.fromDate(event.start),
    end: Timestamp.fromDate(event.end),
    color: event.color,
    userId,
    createdAt: now,
    updatedAt: now,
  })
}

// Update an event
export async function updateEvent(eventId: string, updates: Partial<{
  summary: string
  description?: string
  start: Date
  end: Date
  color?: string
}>) {
  const eventRef = doc(db, 'events', eventId)
  const updateData: any = {
    ...updates,
    updatedAt: Timestamp.now(),
  }

  // Convert dates to Timestamps
  if (updates.start) {
    updateData.start = Timestamp.fromDate(updates.start)
  }
  if (updates.end) {
    updateData.end = Timestamp.fromDate(updates.end)
  }

  await updateDoc(eventRef, updateData)
}

// Delete an event
export async function deleteEvent(eventId: string) {
  const eventRef = doc(db, 'events', eventId)
  await deleteDoc(eventRef)
}
