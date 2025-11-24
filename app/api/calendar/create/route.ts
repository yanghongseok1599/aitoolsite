import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createCalendarEvent } from '@/lib/googleCalendar'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    console.log('Calendar Create API - Session:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      email: session?.user?.email,
      hasAccessToken: !!session?.accessToken
    })

    if (!session || !session.user) {
      console.log('Calendar Create API - No session, returning 401')
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    if (!session.accessToken) {
      console.log('Calendar Create API - No access token, returning error')
      return NextResponse.json(
        { error: 'Google 계정으로 로그인이 필요합니다.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { summary, description, start, end, location } = body

    if (!summary || !start || !end) {
      return NextResponse.json(
        { error: '제목, 시작 시간, 종료 시간은 필수 항목입니다.' },
        { status: 400 }
      )
    }

    console.log('Calendar Create API - Creating event:', { summary, start, end })

    const event = await createCalendarEvent({
      summary,
      description,
      start: new Date(start),
      end: new Date(end),
      location,
    })

    console.log('Calendar Create API - Event created successfully:', event.id)

    return NextResponse.json({
      success: true,
      event: {
        id: event.id,
        summary: event.summary,
        description: event.description,
        start: event.start?.dateTime || event.start?.date,
        end: event.end?.dateTime || event.end?.date,
        location: event.location,
        htmlLink: event.htmlLink,
      },
    })
  } catch (error: any) {
    console.error('Calendar Create API error:', error)
    console.error('Calendar Create API error stack:', error.stack)
    return NextResponse.json(
      { success: false, error: error.message || '일정 추가 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
