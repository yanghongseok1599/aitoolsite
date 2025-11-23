import { google } from 'googleapis'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// Get OAuth2 client
export async function getGoogleCalendarClient() {
  const session = await getServerSession(authOptions)

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

  return google.calendar({ version: 'v3', auth: oauth2Client })
}

// Get calendar events
export async function getCalendarEvents(timeMin?: Date, timeMax?: Date) {
  try {
    const calendar = await getGoogleCalendarClient()

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin ? timeMin.toISOString() : new Date().toISOString(),
      timeMax: timeMax?.toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: 'startTime',
    })

    return response.data.items || []
  } catch (error) {
    console.error('Error fetching calendar events:', error)
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
