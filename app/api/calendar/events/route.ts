import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getTodaysEvents, getWeekEvents, getCalendarEvents, getUpcomingEvents } from '@/lib/googleCalendar'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    console.log('Calendar API - Session:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      email: session?.user?.email,
      hasAccessToken: !!session?.accessToken
    })

    if (!session || !session.user) {
      console.log('Calendar API - No session, returning 401')
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    if (!session.accessToken) {
      console.log('Calendar API - No access token, returning error')
      return NextResponse.json(
        { error: 'Google 계정으로 로그인이 필요합니다.' },
        { status: 403 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'today'

    console.log('Calendar API - Fetching events, type:', type)

    let events

    if (type === 'today') {
      events = await getTodaysEvents()
    } else if (type === 'week') {
      events = await getWeekEvents()
    } else if (type === 'upcoming') {
      events = await getUpcomingEvents()
    } else {
      events = await getCalendarEvents()
    }

    console.log('Calendar API - Raw events count:', events.length)

    // Format events for frontend
    const formattedEvents = events.map(event => ({
      id: event.id,
      summary: event.summary || '제목 없음',
      description: event.description,
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      location: event.location,
      htmlLink: event.htmlLink,
      calendarId: event.organizer?.email || 'primary',
      colorId: event.colorId,
    }))

    console.log('Calendar API - Formatted events:', formattedEvents.length)
    // Log first few events with their calendar info
    formattedEvents.slice(0, 3).forEach(event => {
      console.log('Event:', { summary: event.summary, calendarId: event.calendarId, start: event.start })
    })

    return NextResponse.json({
      success: true,
      events: formattedEvents,
    })
  } catch (error: any) {
    console.error('Calendar API error:', error)
    console.error('Calendar API error stack:', error.stack)
    return NextResponse.json(
      { success: false, error: error.message || '일정을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
