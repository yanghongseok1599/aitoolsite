import { google } from 'googleapis'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Get OAuth2 client
export async function getGoogleCalendarClient() {
  const session = await getServerSession(authOptions)

  console.log('getGoogleCalendarClient - Session check:', {
    hasSession: !!session,
    hasAccessToken: !!session?.accessToken
  })

  if (!session?.accessToken) {
    throw new Error('No access token available')
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NEXTAUTH_URL + '/api/auth/callback/google'
  )

  oauth2Client.setCredentials({
    access_token: session.accessToken as string,
  })

  console.log('getGoogleCalendarClient - OAuth2 client created successfully')

  return google.calendar({ version: 'v3', auth: oauth2Client })
}

// Get calendar events from all calendars (including shared ones)
export async function getCalendarEvents(timeMin?: Date, timeMax?: Date) {
  try {
    // 전체 일정을 가져오기 위해 과거 6개월부터 미래 6개월까지 설정
    const defaultTimeMin = new Date()
    defaultTimeMin.setMonth(defaultTimeMin.getMonth() - 6)

    const defaultTimeMax = new Date()
    defaultTimeMax.setMonth(defaultTimeMax.getMonth() + 6)

    const startTime = timeMin ? timeMin.toISOString() : defaultTimeMin.toISOString()
    const endTime = timeMax ? timeMax.toISOString() : defaultTimeMax.toISOString()

    console.log('getCalendarEvents - Fetching with params:', {
      timeMin: startTime,
      timeMax: endTime
    })

    const calendar = await getGoogleCalendarClient()

    // Get all calendars
    const calendarListResponse = await calendar.calendarList.list()
    const calendars = calendarListResponse.data.items || []

    console.log('getCalendarEvents - Found calendars:', calendars.length)
    calendars.forEach(cal => {
      console.log('Calendar:', { id: cal.id, summary: cal.summary, description: cal.description })
    })

    // Fetch events from all calendars
    const allEvents: any[] = []

    for (const cal of calendars) {
      if (!cal.id) continue

      try {
        const response = await calendar.events.list({
          calendarId: cal.id,
          timeMin: startTime,
          timeMax: endTime,
          maxResults: 250,
          singleEvents: true,
          orderBy: 'startTime',
        })

        if (response.data.items) {
          console.log(`getCalendarEvents - Calendar "${cal.summary}": ${response.data.items.length} events`)
          allEvents.push(...response.data.items)
        }
      } catch (error: any) {
        console.error(`Error fetching events from calendar ${cal.summary}:`, error.message)
        // Continue with other calendars even if one fails
      }
    }

    // Sort all events by start time
    allEvents.sort((a, b) => {
      const aTime = new Date(a.start?.dateTime || a.start?.date || 0).getTime()
      const bTime = new Date(b.start?.dateTime || b.start?.date || 0).getTime()
      return aTime - bTime
    })

    console.log('getCalendarEvents - Total events from all calendars:', allEvents.length)

    return allEvents
  } catch (error: any) {
    console.error('Error fetching calendar events:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      status: error.status
    })
    return []
  }
}

// Get today's events
export async function getTodaysEvents() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return getCalendarEvents(today, tomorrow)
}

// Get this week's events
export async function getWeekEvents() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)

  return getCalendarEvents(today, nextWeek)
}

// Get upcoming events (next 30 days)
export async function getUpcomingEvents() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const future = new Date(today)
  future.setDate(future.getDate() + 30)

  return getCalendarEvents(today, future)
}

// Create a calendar event
export async function createCalendarEvent(event: {
  summary: string
  description?: string
  start: Date
  end: Date
  location?: string
}) {
  try {
    const calendar = await getGoogleCalendarClient()

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: event.summary,
        description: event.description,
        location: event.location,
        start: {
          dateTime: event.start.toISOString(),
          timeZone: 'Asia/Seoul',
        },
        end: {
          dateTime: event.end.toISOString(),
          timeZone: 'Asia/Seoul',
        },
      },
    })

    return response.data
  } catch (error) {
    console.error('Error creating calendar event:', error)
    throw error
  }
}

// Update a calendar event
export async function updateCalendarEvent(
  eventId: string,
  updates: {
    summary?: string
    description?: string
    start?: Date
    end?: Date
    location?: string
  }
) {
  try {
    const calendar = await getGoogleCalendarClient()

    const requestBody: any = {}

    if (updates.summary) requestBody.summary = updates.summary
    if (updates.description) requestBody.description = updates.description
    if (updates.location) requestBody.location = updates.location

    if (updates.start) {
      requestBody.start = {
        dateTime: updates.start.toISOString(),
        timeZone: 'Asia/Seoul',
      }
    }

    if (updates.end) {
      requestBody.end = {
        dateTime: updates.end.toISOString(),
        timeZone: 'Asia/Seoul',
      }
    }

    const response = await calendar.events.patch({
      calendarId: 'primary',
      eventId,
      requestBody,
    })

    return response.data
  } catch (error) {
    console.error('Error updating calendar event:', error)
    throw error
  }
}

// Delete a calendar event
export async function deleteCalendarEvent(eventId: string) {
  try {
    const calendar = await getGoogleCalendarClient()

    await calendar.events.delete({
      calendarId: 'primary',
      eventId,
    })

    return true
  } catch (error) {
    console.error('Error deleting calendar event:', error)
    throw error
  }
}
