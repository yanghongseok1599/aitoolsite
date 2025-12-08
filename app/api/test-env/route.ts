import { NextResponse } from 'next/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET() {
  // Test Base64 decoding
  let privateKeyDecoded = false
  let privateKeyError = null
  if (process.env.FIREBASE_PRIVATE_KEY_BASE64) {
    try {
      const decoded = Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64, 'base64').toString('utf-8')
      privateKeyDecoded = decoded.includes('-----BEGIN PRIVATE KEY-----')
    } catch (e: any) {
      privateKeyError = e.message
    }
  }

  return NextResponse.json({
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET (hidden)' : 'NOT SET',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET (hidden)' : 'NOT SET',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET (hidden)' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV,
    // Firebase Admin
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || 'NOT SET',
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ? 'SET (hidden)' : 'NOT SET',
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? 'SET (hidden)' : 'NOT SET',
    FIREBASE_PRIVATE_KEY_BASE64: process.env.FIREBASE_PRIVATE_KEY_BASE64 ? 'SET (hidden)' : 'NOT SET',
    FIREBASE_PRIVATE_KEY_BASE64_LENGTH: process.env.FIREBASE_PRIVATE_KEY_BASE64?.length || 0,
    FIREBASE_PRIVATE_KEY_DECODED: privateKeyDecoded,
    FIREBASE_PRIVATE_KEY_ERROR: privateKeyError,
  })
}
