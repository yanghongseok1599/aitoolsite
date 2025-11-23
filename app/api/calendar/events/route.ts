import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getTodaysEvents, getWeekEvents, getCalendarEvents } from '@/lib/googleCalendar'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'today'

    let events

    if (type === 'today') {
      events = await getTodaysEvents()
    } else if (type === 'week') {
      events = await getWeekEvents()
    } else {
      events = await getCalendarEvents()
    }

    // Format events for frontend
    const formattedEvents = events.map(event => ({
      id: event.id,
      summary: event.summary || '제목 없음',
      description: event.description,
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      location: event.location,
      htmlLink: event.htmlLink,
    }))

    return NextResponse.json({
      success: true,
      events: formattedEvents,
    })
  } catch (error: any) {
    console.error('Calendar API error:', error)
    return NextResponse.json(
      { error: error.message || '일정을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
