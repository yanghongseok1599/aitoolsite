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
  Firestore,
} from 'firebase/firestore'
import { db, getFirebaseDb } from './firebase'

// Helper to get db with null check
function getDb(): Firestore {
  const firestore = db || getFirebaseDb()
  if (!firestore) {
    throw new Error('Firestore is not initialized. Please check your Firebase configuration.')
  }
  return firestore
}

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
  const bookmarksRef = collection(getDb(), 'bookmarks')
  // Remove orderBy to avoid composite index requirement
  const q = query(bookmarksRef, where('userId', '==', userId))
  const snapshot = await getDocs(q)
  // Sort on client side instead
  const bookmarks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirestoreBookmark[]
  return bookmarks.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
}

// Add a bookmark
export async function addBookmark(userId: string, category: string, bookmark: {
  name: string
  url: string
  icon?: string
  description?: string
}) {
  const bookmarksRef = collection(getDb(), 'bookmarks')
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
  try {
    const bookmarkRef = doc(getDb(), 'bookmarks', bookmarkId)
    const bookmarkDoc = await getDoc(bookmarkRef)

    if (!bookmarkDoc.exists()) {
      console.warn(`Bookmark ${bookmarkId} does not exist, skipping update`)
      return
    }

    await updateDoc(bookmarkRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error updating bookmark:', error)
  }
}

// Delete a bookmark
export async function deleteBookmark(bookmarkId: string) {
  const bookmarkRef = doc(getDb(), 'bookmarks', bookmarkId)
  await deleteDoc(bookmarkRef)
}

// ============================================
// USER SETTINGS
// ============================================

export interface UserSettings {
  userId: string
  categoryOrder: string[]
  widgetOrder: string[]
  bannerWidgets?: string[]
  welcomeTitle?: string
  welcomeDescription?: string
  theme?: 'light' | 'dark' | 'system'
  updatedAt: Timestamp
}

// Get user settings
export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  const settingsRef = doc(getDb(), 'userSettings', userId)
  const snapshot = await getDoc(settingsRef)

  if (snapshot.exists()) {
    return snapshot.data() as UserSettings
  }
  return null
}

// Save user settings
export async function saveUserSettings(userId: string, settings: Partial<UserSettings>) {
  const settingsRef = doc(getDb(), 'userSettings', userId)
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
  const notesRef = collection(getDb(), 'notes')
  // Remove orderBy to avoid composite index requirement
  const q = query(notesRef, where('userId', '==', userId))
  const snapshot = await getDocs(q)
  // Sort on client side instead
  const notes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirestoreNote[]
  return notes.sort((a, b) => b.updatedAt.toMillis() - a.updatedAt.toMillis())
}

// Add a note
export async function addNote(userId: string, note: {
  title: string
  content: string
  color?: string
  isPinned?: boolean
}) {
  const notesRef = collection(getDb(), 'notes')
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
  const noteRef = doc(getDb(), 'notes', noteId)
  await updateDoc(noteRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  })
}

// Delete a note
export async function deleteNote(noteId: string) {
  const noteRef = doc(getDb(), 'notes', noteId)
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
  const eventsRef = collection(getDb(), 'events')
  // Remove orderBy to avoid composite index requirement
  const q = query(eventsRef, where('userId', '==', userId))
  const snapshot = await getDocs(q)
  // Sort on client side instead
  const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirestoreEvent[]
  return events.sort((a, b) => a.start.toMillis() - b.start.toMillis())
}

// Add an event
export async function addEvent(userId: string, event: {
  summary: string
  description?: string
  start: Date
  end: Date
  color?: string
}) {
  const eventsRef = collection(getDb(), 'events')
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
  const eventRef = doc(getDb(), 'events', eventId)
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
  const eventRef = doc(getDb(), 'events', eventId)
  await deleteDoc(eventRef)
}

// ============================================
// AD BANNERS (Global Settings)
// ============================================

export interface AdBannerSettings {
  enabled: boolean
  leftBanner?: {
    imageUrl: string
    linkUrl: string
  }
  rightBanner?: {
    imageUrl: string
    linkUrl: string
  }
  updatedAt: Timestamp
}

// Get ad banner settings
export async function getAdBannerSettings(): Promise<AdBannerSettings | null> {
  const settingsRef = doc(getDb(), 'siteSettings', 'adBanners')
  const snapshot = await getDoc(settingsRef)

  if (snapshot.exists()) {
    return snapshot.data() as AdBannerSettings
  }
  return null
}

// Save ad banner settings
export async function saveAdBannerSettings(settings: Partial<AdBannerSettings>) {
  const settingsRef = doc(getDb(), 'siteSettings', 'adBanners')
  await setDoc(settingsRef, {
    ...settings,
    updatedAt: Timestamp.now(),
  }, { merge: true })
}

// ============================================
// WIDGET SETTINGS
// ============================================

export interface WidgetSettings {
  [widgetId: string]: {
    [key: string]: any
  }
}

// Get widget settings for a user
export async function getUserWidgetSettings(userId: string): Promise<WidgetSettings | null> {
  const settingsRef = doc(getDb(), 'widgetSettings', userId)
  const snapshot = await getDoc(settingsRef)

  if (snapshot.exists()) {
    return snapshot.data() as WidgetSettings
  }
  return null
}

// Save widget settings for a user
export async function saveUserWidgetSettings(userId: string, widgetId: string, settings: any) {
  const settingsRef = doc(getDb(), 'widgetSettings', userId)
  await setDoc(settingsRef, {
    [widgetId]: settings,
    updatedAt: Timestamp.now(),
  }, { merge: true })
}

// ============================================
// TODO ITEMS
// ============================================

export interface FirestoreTodo {
  id: string
  text: string
  completed: boolean
  userId: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Get all todos for a user
export async function getUserTodos(userId: string) {
  const todosRef = collection(getDb(), 'todos')
  const q = query(todosRef, where('userId', '==', userId))
  const snapshot = await getDocs(q)
  const todos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirestoreTodo[]
  return todos.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis())
}

// Add a todo
export async function addTodo(userId: string, text: string) {
  const todosRef = collection(getDb(), 'todos')
  const now = Timestamp.now()

  return await addDoc(todosRef, {
    text,
    completed: false,
    userId,
    createdAt: now,
    updatedAt: now,
  })
}

// Update a todo
export async function updateTodo(todoId: string, updates: Partial<{ text: string; completed: boolean }>) {
  const todoRef = doc(getDb(), 'todos', todoId)
  await updateDoc(todoRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  })
}

// Delete a todo
export async function deleteTodo(todoId: string) {
  const todoRef = doc(getDb(), 'todos', todoId)
  await deleteDoc(todoRef)
}
