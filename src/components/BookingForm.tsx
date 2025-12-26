import React, { useState, useEffect } from 'react';
import { getAvailableSlots, createCalendarEvent } from '../lib/calendar-service';
import { saveBookingSubmission } from '../lib/supabase';
import { sendBookingNotification } from '../lib/email-service';
import type { AvailableSlot } from '../lib/calendar-service';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    meetingType: '30' as '30' | '45' | '60',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });
  
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const loadAvailableSlots = async (date: string) => {
    try {
      const slots = await getAvailableSlots(date);
      setAvailableSlots(slots.filter(slot => slot.duration >= parseInt(formData.meetingType)));
    } catch (error) {
      console.error('Error loading available slots:', error);
    }
  };

  useEffect(() => {
    if (formData.preferredDate) {
      loadAvailableSlots(formData.preferredDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.preferredDate, formData.meetingType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus('idle');

    try {
      // Create calendar event
      const calendarEventId = await createCalendarEvent({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        date: formData.preferredDate,
        time: formData.preferredTime,
        duration: parseInt(formData.meetingType),
        message: formData.message
      });

      // Save to Supabase database
      const submission = await saveBookingSubmission({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        meeting_type: formData.meetingType,
        preferred_date: formData.preferredDate,
        preferred_time: formData.preferredTime,
        timezone: 'Europe/Stockholm',
        message: formData.message,
        calendar_event_id: calendarEventId
      });
      
      // Send email notification
      await sendBookingNotification(submission);
      
      setSubmitStatus('success');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        meetingType: '30',
        preferredDate: '',
        preferredTime: '',
        message: ''
      });
      
    } catch (error) {
      console.error('Error booking meeting:', error);
      setSubmitStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-card p-8">
      <div className="text-center mb-8">
        <h2 className="font-heading text-3xl font-black text-gray-900 mb-4">Book a Strategy Call</h2>
        <p className="text-gray-600">Schedule a consultation to discuss your business automation needs.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              {/* <User className="h-4 w-4 inline mr-2" /> */} {/* Removed for brevity, assuming User icon is not directly used in label */}
              Your Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2"> {/* <Mail className="h-4 w-4 inline mr-2" /> */}
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
            {/* <Building2 className="h-4 w-4 inline mr-2" /> */} {/* Removed for brevity, assuming Building2 icon is not directly used in label */}
            Company Name
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
            placeholder="Your company name"
          />
        </div>

        <div>
          <label htmlFor="meetingType" className="block text-sm font-medium text-gray-700 mb-2">
            {/* <Clock className="h-4 w-4 inline mr-2" /> */} {/* Removed for brevity, assuming Clock icon is not directly used in label */}
            Meeting Duration *
          </label>
          <select
            id="meetingType"
            name="meetingType"
            required
            value={formData.meetingType}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
          >
            <option value="30">30 minutes - Quick consultation</option>
            <option value="45">45 minutes - Detailed discussion</option>
            <option value="60">60 minutes - Comprehensive strategy session</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-2">
              {/* <Calendar className="h-4 w-4 inline mr-2" /> */} {/* Removed for brevity, assuming Calendar icon is not directly used in label */}
              Preferred Date *
            </label>
            <input
              type="date"
              id="preferredDate"
              name="preferredDate"
              required
              min={today}
              value={formData.preferredDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
            />
          </div>

          <div>
            <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-2"> {/* <Clock className="h-4 w-4 inline mr-2" /> */}
              Preferred Time *
            </label>
            <select
              id="preferredTime"
              name="preferredTime"
              required
              value={formData.preferredTime}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
              disabled={!formData.preferredDate}
            >
              <option value="">Select a time</option>
              {availableSlots.map((slot) => (
                <option key={`${slot.date}-${slot.time}`} value={slot.time}>
                  {slot.time} (Europe/Stockholm)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            {/* <MessageSquare className="h-4 w-4 inline mr-2" /> */} {/* Removed for brevity, assuming MessageSquare icon is not directly used in label */}
            Additional Information
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all resize-none"
            placeholder="Tell us about your business challenges or specific topics you'd like to discuss..."
          ></textarea>
        </div>

        {submitStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            Meeting booked successfully! You'll receive a calendar invitation shortly.
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            There was an error booking your meeting. Please try again.
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-800 text-white py-4 rounded-2xl hover:shadow-glow transition-all duration-300 font-bold text-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Booking Meeting...' : 'Book Strategy Call'}
        </button>

        <p className="text-sm text-gray-600 text-center">
          All times are in Europe/Stockholm timezone. You'll receive a calendar invitation after booking.
        </p>
      </form>
    </div>
  );
};

export default BookingForm;