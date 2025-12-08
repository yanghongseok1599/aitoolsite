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

interface FirestoreUser {
  email: string
  displayName: string | null
  photoURL: string | null
  role: 'user' | 'vip' | 'admin'
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  updatedAt: string
  provider: string
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!await isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getAdminFirestore()

    // Get all users from Firestore users collection
    const usersSnapshot = await db.collection('users').get()
    const users: (FirestoreUser & { id: string })[] = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as FirestoreUser
    }))

    // Calculate stats
    const totalUsers = users.length
    const activeUsers = users.filter(u => u.status !== 'suspended').length
    const suspendedUsers = users.filter(u => u.status === 'suspended').length

    // Count today's new users
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayNewUsers = users.filter(u => {
      const creationTime = new Date(u.createdAt || 0)
      return creationTime >= today
    }).length

    // Count this week's new users
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekNewUsers = users.filter(u => {
      const creationTime = new Date(u.createdAt || 0)
      return creationTime >= weekAgo
    }).length

    // Count this month's new users
    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    const monthNewUsers = users.filter(u => {
      const creationTime = new Date(u.createdAt || 0)
      return creationTime >= monthAgo
    }).length

    // Count admins and VIPs
    const adminCount = users.filter(u =>
      u.role === 'admin' || ADMIN_EMAILS.includes(u.email)
    ).length
    const vipCount = users.filter(u => u.role === 'vip').length

    // Get recent users (last 5)
    const recentUsers = [...users]
      .sort((a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 5)
      .map(u => ({
        id: u.id,
        name: u.displayName || u.email?.split('@')[0] || 'Unknown',
        email: u.email || '',
        date: u.createdAt || new Date().toISOString(),
        status: u.status || 'active'
      }))

    // Calculate daily signups for the last 7 days
    const dailySignups = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const count = users.filter(u => {
        const creationTime = new Date(u.createdAt || 0)
        return creationTime >= date && creationTime < nextDate
      }).length

      dailySignups.push({
        date: date.toISOString().split('T')[0],
        count
      })
    }

    // Calculate monthly signups for the last 6 months
    const monthlySignups = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      date.setDate(1)
      date.setHours(0, 0, 0, 0)

      const nextDate = new Date(date)
      nextDate.setMonth(nextDate.getMonth() + 1)

      const count = users.filter(u => {
        const creationTime = new Date(u.createdAt || 0)
        return creationTime >= date && creationTime < nextDate
      }).length

      const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
      monthlySignups.push({
        month: monthNames[date.getMonth()],
        count
      })
    }

    // Provider breakdown
    const providerCounts: Record<string, number> = {}
    users.forEach(u => {
      const provider = u.provider || 'Unknown'
      providerCounts[provider] = (providerCounts[provider] || 0) + 1
    })

    const providerStats = Object.entries(providerCounts).map(([name, count]) => ({
      name,
      count
    }))

    return NextResponse.json({
      totalUsers,
      activeUsers,
      suspendedUsers,
      todayNewUsers,
      weekNewUsers,
      monthNewUsers,
      adminCount,
      vipCount,
      recentUsers,
      dailySignups,
      monthlySignups,
      providerStats
    })
  } catch (error: any) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
