import React, { useState } from 'react';
import { saveContactSubmission } from '../lib/supabase';
import { sendContactNotification } from '../lib/email-service';

interface ContactFormProps {
  variant?: 'default' | 'inline';
  className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ variant = 'default', className = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    industry: '',
    challenge: '',
    timeline: '',
    budget: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Save to Supabase database
      const submission = await saveContactSubmission({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        industry: formData.industry,
        challenge: formData.challenge,
        timeline: formData.timeline,
        budget: formData.budget,
        message: formData.message
      });

      // Send email notification
      await sendContactNotification(submission);
      
      setSubmitStatus('success');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        industry: '',
        challenge: '',
        timeline: '',
        budget: '',
        message: ''
      });
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-cyan transition-all"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-cyan transition-all"
          />
        </div>
        <input
          type="text"
          name="company"
          placeholder="Company & Industry"
          required
          value={formData.company}
          onChange={handleInputChange}
          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-cyan transition-all"
        />
        <textarea
          name="message"
          placeholder="Describe your biggest system challenge..."
          rows={4}
          value={formData.message}
          onChange={handleInputChange}
          className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-cyan transition-all resize-none"
        ></textarea>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple text-white py-5 rounded-2xl hover:shadow-glow transition-all duration-300 font-bold text-lg transform hover:scale-105 disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : 'Book Strategy Call'}
        </button>
      </form>
    );
  }

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all text-base font-normal"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all text-base font-normal"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              id="company"
              name="company"
              required
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all text-base font-normal"
              placeholder="Enter your company name"
            />
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
              Industry *
            </label>
            <select
              id="industry"
              name="industry"
              required
              value={formData.industry}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all text-base font-normal"
            >
              <option value="">Select your industry</option>
              <option value="real-estate">Real Estate</option>
              <option value="legal">Legal Services</option>
              <option value="finance">Finance</option>
              <option value="education">Education</option>
              <option value="healthcare">Healthcare</option>
              <option value="local-services">Local Services</option>
              <option value="ecommerce">E-commerce</option>
              <option value="travel">Travel & Events</option>
              <option value="recruitment">Recruitment</option>
              <option value="creative">Creative Services</option>
              <option value="b2b-agencies">B2B Agencies</option>
              <option value="tech-startups">Tech Startups</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="challenge" className="block text-sm font-medium text-gray-700 mb-2">
            Biggest Challenge *
          </label>
          <select
            id="challenge"
            name="challenge"
            required
            value={formData.challenge}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all text-base font-normal"
          >
            <option value="">What's your biggest challenge?</option>
            <option value="lead-generation">Inconsistent lead generation</option>
            <option value="manual-processes">Too many manual processes</option>
            <option value="scattered-data">Scattered data and systems</option>
            <option value="poor-follow-up">Poor follow-up processes</option>
            <option value="scaling-issues">Difficulty scaling operations</option>
            <option value="customer-service">Customer service inefficiency</option>
            <option value="other">Other (please specify in message)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
              Timeline
            </label>
            <select
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all text-base font-normal"
            >
              <option value="">When do you want to start?</option>
              <option value="asap">As soon as possible</option>
              <option value="1-month">Within 1 month</option>
              <option value="3-months">Within 3 months</option>
              <option value="6-months">Within 6 months</option>
              <option value="planning">Just planning ahead</option>
            </select>
          </div>

          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
              Budget Range
            </label>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all text-base font-normal"
            >
              <option value="">What's your budget range?</option>
              <option value="under-5k">Under $5,000</option>
              <option value="5k-15k">$5,000 - $15,000</option>
              <option value="15k-50k">$15,000 - $50,000</option>
              <option value="50k-plus">$50,000+</option>
              <option value="discuss">Let's discuss</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Additional Details
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all text-base font-normal resize-none"
            placeholder="Tell us more about your specific needs, current systems, or any questions you have..."
          ></textarea>
        </div>

        {submitStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            Thank you for your message! We'll respond within 2 hours during business hours.
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            There was an error submitting your message. Please try again.
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto bg-gradient-to-r from-primary-600 to-accent-cyan text-white px-6 py-3 rounded-xl font-semibold shadow-card hover:shadow-glow transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>

        <p className="font-body text-base text-gray-600 text-center font-medium">
          By submitting this form, you agree to receive communications about your inquiry. 
          We'll respond within 2 hours during business hours.
        </p>
      </form>
    </div>
  );
};

export default ContactForm;