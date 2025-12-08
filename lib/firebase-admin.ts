import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getAuth, Auth } from 'firebase-admin/auth'
import { getFirestore, Firestore } from 'firebase-admin/firestore'
import * as path from 'path'
import * as fs from 'fs'

let adminApp: App | undefined
let adminAuth: Auth | undefined
let adminDb: Firestore | undefined

function getAdminApp(): App {
  if (adminApp) {
    return adminApp
  }

  const apps = getApps()
  if (apps.length > 0) {
    adminApp = apps[0]
    return adminApp
  }

  // Try to load from JSON file first
  const serviceAccountPath = path.join(process.cwd(), 'firebase-service-account.json')

  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'))

    adminApp = initializeApp({
      credential: cert(serviceAccount),
    })

    return adminApp
  }

  // Fallback to environment variables
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Firebase Admin SDK credentials are not configured. Please add firebase-service-account.json or set environment variables.')
  }

  adminApp = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  })

  return adminApp
}

export function getAdminAuth(): Auth {
  if (adminAuth) {
    return adminAuth
  }
  adminAuth = getAuth(getAdminApp())
  return adminAuth
}

export function getAdminFirestore(): Firestore {
  if (adminDb) {
    return adminDb
  }
  adminDb = getFirestore(getAdminApp())
  return adminDb
}
