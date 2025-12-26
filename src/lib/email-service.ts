import { supabase } from './supabase';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    if (!supabase) {
      console.warn('Supabase not configured. Email not sent.');
      return false;
    }
    
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: emailData
    });

    if (error) {
      console.error('Email sending error:', error);
      return false;
    }

    console.log('Email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Email service error:', error);
    return false;
  }
};

export const sendContactNotification = async (submission: Record<string, unknown>): Promise<boolean> => {
  try {
    const emailData: EmailData = {
      to: 'support@northforce.io',
      subject: 'New Lead — Contact Form',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #161f64;">New Contact Form Submission</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${submission.name}</p>
            <p><strong>Email:</strong> ${submission.email}</p>
            <p><strong>Company:</strong> ${submission.company}</p>
            <p><strong>Industry:</strong> ${submission.industry}</p>
            <p><strong>Challenge:</strong> ${submission.challenge}</p>
            ${submission.timeline ? `<p><strong>Timeline:</strong> ${submission.timeline}</p>` : ''}
            ${submission.budget ? `<p><strong>Budget:</strong> ${submission.budget}</p>` : ''}
            ${submission.message ? `<p><strong>Message:</strong> ${submission.message}</p>` : ''}
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
      text: `New Contact Form Submission\n\nName: ${submission.name}\nEmail: ${submission.email}\nCompany: ${submission.company}\nIndustry: ${submission.industry}\nChallenge: ${submission.challenge}\n${submission.timeline ? `Timeline: ${submission.timeline}\n` : ''}${submission.budget ? `Budget: ${submission.budget}\n` : ''}${submission.message ? `Message: ${submission.message}\n` : ''}Submitted: ${new Date().toLocaleString()}`
    };
    
    return await sendEmail(emailData);
  } catch (error) {
    console.error('Error sending contact notification:', error);
    return false;
  }
};

export const sendBookingNotification = async (submission: Record<string, unknown>): Promise<boolean> => {
  try {
    const emailData: EmailData = {
      to: 'support@northforce.io',
      subject: 'New Lead — Booking',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #161f64;">New Meeting Booking</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${submission.name}</p>
            <p><strong>Email:</strong> ${submission.email}</p>
            ${submission.company ? `<p><strong>Company:</strong> ${submission.company}</p>` : ''}
            <p><strong>Meeting Type:</strong> ${submission.meeting_type} minutes</p>
            <p><strong>Preferred Date:</strong> ${submission.preferred_date}</p>
            <p><strong>Preferred Time:</strong> ${submission.preferred_time}</p>
            <p><strong>Timezone:</strong> ${submission.timezone}</p>
            ${submission.message ? `<p><strong>Message:</strong> ${submission.message}</p>` : ''}
            ${submission.calendar_event_id ? `<p><strong>Calendar Event ID:</strong> ${submission.calendar_event_id}</p>` : ''}
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
      text: `New Meeting Booking\n\nName: ${submission.name}\nEmail: ${submission.email}\n${submission.company ? `Company: ${submission.company}\n` : ''}Meeting Type: ${submission.meeting_type} minutes\nPreferred Date: ${submission.preferred_date}\nPreferred Time: ${submission.preferred_time}\nTimezone: ${submission.timezone}\n${submission.message ? `Message: ${submission.message}\n` : ''}${submission.calendar_event_id ? `Calendar Event ID: ${submission.calendar_event_id}\n` : ''}Submitted: ${new Date().toLocaleString()}`
    };
    
    return await sendEmail(emailData);
  } catch (error) {
    console.error('Error sending booking notification:', error);
    return false;
  }
};

export const sendNewsletterNotification = async (submission: Record<string, unknown>): Promise<boolean> => {
  try {
    const emailData: EmailData = {
      to: 'support@northforce.io',
      subject: 'New Lead — Newsletter',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #161f64;">New Newsletter Subscription</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Email:</strong> ${submission.email}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
      text: `New Newsletter Subscription\n\nEmail: ${submission.email}\nSubmitted: ${new Date().toLocaleString()}`
    };
    
    return await sendEmail(emailData);
  } catch (error) {
    console.error('Error sending newsletter notification:', error);
    return false;
  }
};