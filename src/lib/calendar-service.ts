import { supabase } from './supabase'; // Supabase client

export interface AvailableSlot {
  time: string;
  duration: number;
}

export interface CalendarEventData {
  name: string;
  email: string;
  company?: string;
  date: string;
  time: string;
  duration: number;
  message?: string;
}

export const getAvailableSlots = async (date: string): Promise<AvailableSlot[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('google-calendar', {
      body: null,
      headers: {
        'Content-Type': 'application/json',
      },
    }, {
      method: 'GET',
      query: { action: 'availability', date }
    });

    if (error) {
      console.error('Error fetching available slots:', error);
      // Return default slots as fallback
      return [
        { time: '09:00', duration: 30 },
        { time: '09:30', duration: 30 },
        { time: '10:00', duration: 60 },
        { time: '11:00', duration: 45 },
        { time: '14:00', duration: 60 },
        { time: '15:00', duration: 30 },
        { time: '16:00', duration: 45 }
      ];
    }

    return data.slots || [];
  } catch (error) {
    console.error('Calendar service error:', error);
    // Return default slots as fallback
    return [
      { time: '09:00', duration: 30 },
      { time: '09:30', duration: 30 },
      { time: '10:00', duration: 60 },
      { time: '11:00', duration: 45 },
      { time: '14:00', duration: 60 },
      { time: '15:00', duration: 30 },
      { time: '16:00', duration: 45 }
    ];
  }
};

export const createCalendarEvent = async (eventData: CalendarEventData): Promise<string> => {
  try {
    const startDateTime = `${eventData.date}T${eventData.time}:00`;
    const endTime = new Date(`${eventData.date}T${eventData.time}:00`);
    endTime.setMinutes(endTime.getMinutes() + eventData.duration);
    const endDateTime = endTime.toISOString().slice(0, 19);

    const calendarEvent = {
      summary: `Meeting with ${eventData.name}${eventData.company ? ` (${eventData.company})` : ''}`,
      description: `Meeting with ${eventData.name}\nEmail: ${eventData.email}\n${eventData.company ? `Company: ${eventData.company}\n` : ''}${eventData.message ? `Message: ${eventData.message}` : ''}`,
      start: {
        dateTime: startDateTime,
        timeZone: 'Europe/Stockholm'
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'Europe/Stockholm'
      },
      attendees: [
        {
          email: eventData.email,
          displayName: eventData.name
        }
      ]
    };

    const { data, error } = await supabase.functions.invoke('google-calendar', {
      body: calendarEvent,
      headers: {
        'Content-Type': 'application/json',
      },
    }, {
      method: 'POST',
      query: { action: 'create' }
    });

    if (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }

    return data.eventId;
  } catch (error) {
    console.error('Calendar event creation error:', error);
    // Return mock event ID as fallback
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};