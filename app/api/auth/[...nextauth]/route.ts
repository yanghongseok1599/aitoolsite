import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
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
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || ''

        // Assign admin role to specific users
        if (session.user.email === 'trainermilestone@gmail.com' ||
            session.user.email === 'admin@aitoolsite.com') {
          session.user.role = 'admin'
        }
      }
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
