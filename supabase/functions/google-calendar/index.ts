import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

interface CalendarEvent {
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees: Array<{
    email: string;
    displayName?: string;
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    // Get Google Calendar configuration
    const GOOGLE_CALENDAR_ID = Deno.env.get('GOOGLE_CALENDAR_ID')
    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY')

    if (!GOOGLE_CALENDAR_ID || !GOOGLE_API_KEY) {
      throw new Error('Google Calendar configuration missing')
    }

    if (action === 'availability') {
      // Get available slots for a specific date
      const date = url.searchParams.get('date')
      if (!date) {
        throw new Error('Date parameter required')
      }

      // Mock available slots - replace with actual Google Calendar API call
      const availableSlots = [
        { time: '09:00', duration: 30 },
        { time: '09:30', duration: 30 },
        { time: '10:00', duration: 60 },
        { time: '11:00', duration: 45 },
        { time: '14:00', duration: 60 },
        { time: '15:00', duration: 30 },
        { time: '16:00', duration: 45 }
      ]

      return new Response(
        JSON.stringify({ slots: availableSlots }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    if (action === 'create' && req.method === 'POST') {
      // Create a new calendar event
      const eventData: CalendarEvent = await req.json()

      // Mock event creation - replace with actual Google Calendar API call
      const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      console.log('Creating calendar event:', eventData)
      console.log('Generated event ID:', eventId)

      return new Response(
        JSON.stringify({ eventId, success: true }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    throw new Error('Invalid action or method')

  } catch (error) {
    console.error('Calendar API error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})