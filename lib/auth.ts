import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getAdminFirestore } from './firebase-admin'

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

if (!googleClientId || !googleClientSecret) {
  console.error('Missing Google OAuth credentials')
}

// Save user to Firestore on login
async function saveUserToFirestore(user: { id: string; email: string; name?: string | null; image?: string | null }, provider: string) {
  try {
    const db = getAdminFirestore()
    const userRef = db.collection('users').doc(user.id)
    const userDoc = await userRef.get()

    const userData = {
      email: user.email,
      displayName: user.name || null,
      photoURL: user.image || null,
      provider: provider,
      updatedAt: new Date().toISOString(),
    }

    if (!userDoc.exists) {
      // New user
      await userRef.set({
        ...userData,
        role: 'user',
        status: 'active',
        createdAt: new Date().toISOString(),
      })
    } else {
      // Update existing user
      await userRef.update(userData)
    }
  } catch (error) {
    console.error('Failed to save user to Firestore:', error)
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: googleClientId || '',
      clientSecret: googleClientSecret || '',
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile https://www.googleapis.com/auth/calendar"
        }
      }
    }),

    // Credentials Provider (Email/Password)
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" }
      },
      async authorize(credentials) {
        // Trainer Milestone 계정
        if (credentials?.email === 'trainermilestone@gmail.com' && credentials?.password === 'trainer2024!') {
          return {
            id: 'trainermilestone',
            name: 'Trainer Milestone',
            email: 'trainermilestone@gmail.com',
            image: null,
          }
        }

        // 관리자 계정
        if (credentials?.email === 'admin@aitoolsite.com' && credentials?.password === 'admin1234!') {
          return {
            id: 'admin',
            name: '관리자',
            email: 'admin@aitoolsite.com',
            image: null,
          }
        }

        // ccvadmin 관리자 계정
        if (credentials?.email === 'ccvadmin' && credentials?.password === 'seok315477!') {
          return {
            id: 'ccvadmin',
            name: 'CCV 관리자',
            email: 'ccvadmin@admin.local',
            image: null,
          }
        }

        // 데모 계정
        if (credentials?.email === 'demo@example.com' && credentials?.password === 'demo123') {
          return {
            id: '1',
            name: '데모 사용자',
            email: 'demo@example.com',
            image: null,
          }
        }

        return null
      }
    }),
  ],

  pages: {
    signIn: '/login',
  },

  callbacks: {
    async signIn({ user, account }) {
      // Save user to Firestore on every sign in
      if (user.email) {
        const provider = account?.provider === 'google' ? 'Google' :
                        account?.provider === 'credentials' ? 'Email' :
                        account?.provider || 'Unknown'
        await saveUserToFirestore({
          id: user.id || user.email,
          email: user.email,
          name: user.name,
          image: user.image,
        }, provider)
      }
      return true
    },
    async jwt({ token, account }) {
      // 로그인 시 액세스 토큰 저장
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || ''

        // Assign admin role to specific users
        if (session.user.email === 'trainermilestone@gmail.com' ||
            session.user.email === 'admin@aitoolsite.com' ||
            session.user.email === 'ccvadmin@admin.local') {
          session.user.role = 'admin'
        }
      }
      // 세션에 액세스 토큰 추가
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}
