import React, { useState } from 'react';
import { saveContactSubmission } from '../lib/supabase';
import { sendContactNotification } from '../lib/email-service';
import { useLanguage } from '../contexts/LanguageContext';

interface ContactFormProps {
  variant?: 'default' | 'inline';
  className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ variant = 'default', className = '' }) => {
  const { language } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    revenue: '',
    challenge: '',
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
      const submission = await saveContactSubmission({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        industry: formData.role,
        challenge: formData.challenge,
        timeline: '',
        budget: formData.revenue,
        message: formData.message
      });

      await sendContactNotification(submission);

      setSubmitStatus('success');

      setFormData({
        name: '',
        email: '',
        company: '',
        role: '',
        revenue: '',
        challenge: '',
        message: ''
      });
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all text-base bg-white";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <div className={`max-w-3xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Information */}
        <div>
          <h3 className="font-heading text-lg font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            {language === 'sv' ? 'Kontaktinformation' : 'Contact Information'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className={labelClass}>
                {language === 'sv' ? 'Namn' : 'Name'} *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className={inputClass}
                placeholder={language === 'sv' ? 'Förnamn Efternamn' : 'First Last'}
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                {language === 'sv' ? 'E-post' : 'Email'} *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={inputClass}
                placeholder={language === 'sv' ? 'namn@företag.se' : 'name@company.com'}
              />
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div>
          <h3 className="font-heading text-lg font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            {language === 'sv' ? 'Företagsinformation' : 'Company Information'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="company" className={labelClass}>
                {language === 'sv' ? 'Företag' : 'Company'} *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                required
                value={formData.company}
                onChange={handleInputChange}
                className={inputClass}
                placeholder={language === 'sv' ? 'Företagsnamn' : 'Company name'}
              />
            </div>

            <div>
              <label htmlFor="role" className={labelClass}>
                {language === 'sv' ? 'Din Roll' : 'Your Role'} *
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleInputChange}
                className={inputClass}
              >
                <option value="">{language === 'sv' ? 'Välj roll' : 'Select role'}</option>
                <option value="ceo">{language === 'sv' ? 'VD / CEO' : 'CEO / Managing Director'}</option>
                <option value="cfo">{language === 'sv' ? 'CFO / Ekonomichef' : 'CFO / Finance Director'}</option>
                <option value="cmo">{language === 'sv' ? 'CMO / Marknadschef' : 'CMO / Marketing Director'}</option>
                <option value="coo">{language === 'sv' ? 'COO / Driftchef' : 'COO / Operations Director'}</option>
                <option value="founder">{language === 'sv' ? 'Grundare / Ägare' : 'Founder / Owner'}</option>
                <option value="vp">{language === 'sv' ? 'VP / Vice President' : 'VP / Vice President'}</option>
                <option value="director">{language === 'sv' ? 'Direktör / Head of' : 'Director / Head of'}</option>
                <option value="other">{language === 'sv' ? 'Annan ledande position' : 'Other leadership position'}</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="revenue" className={labelClass}>
              {language === 'sv' ? 'Årlig omsättning (ungefär)' : 'Annual Revenue (approximate)'}
            </label>
            <select
              id="revenue"
              name="revenue"
              value={formData.revenue}
              onChange={handleInputChange}
              className={inputClass}
            >
              <option value="">{language === 'sv' ? 'Välj intervall' : 'Select range'}</option>
              <option value="0-10m">{language === 'sv' ? '0-10 MSEK' : '0-10M SEK'}</option>
              <option value="10-50m">{language === 'sv' ? '10-50 MSEK' : '10-50M SEK'}</option>
              <option value="50-100m">{language === 'sv' ? '50-100 MSEK' : '50-100M SEK'}</option>
              <option value="100-500m">{language === 'sv' ? '100-500 MSEK' : '100-500M SEK'}</option>
              <option value="500m+">{language === 'sv' ? '500+ MSEK' : '500M+ SEK'}</option>
            </select>
          </div>
        </div>

        {/* Challenge & Context */}
        <div>
          <h3 className="font-heading text-lg font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            {language === 'sv' ? 'Er Situation' : 'Your Situation'}
          </h3>

          <div className="mb-6">
            <label htmlFor="challenge" className={labelClass}>
              {language === 'sv' ? 'Primär Utmaning' : 'Primary Challenge'} *
            </label>
            <select
              id="challenge"
              name="challenge"
              required
              value={formData.challenge}
              onChange={handleInputChange}
              className={inputClass}
            >
              <option value="">{language === 'sv' ? 'Välj huvudutmaning' : 'Select main challenge'}</option>
              <option value="growth-stagnation">{language === 'sv' ? 'Tillväxt har planat ut' : 'Growth has plateaued'}</option>
              <option value="scaling">{language === 'sv' ? 'Skalningsutmaningar' : 'Scaling challenges'}</option>
              <option value="go-to-market">{language === 'sv' ? 'Go-to-market ineffektivitet' : 'Go-to-market inefficiency'}</option>
              <option value="capacity">{language === 'sv' ? 'Kapacitetsbegränsningar i teamet' : 'Team capacity constraints'}</option>
              <option value="fragmentation">{language === 'sv' ? 'Fragmenterade leverantörer/system' : 'Fragmented vendors/systems'}</option>
              <option value="profitability">{language === 'sv' ? 'Lönsamhetsutmaningar' : 'Profitability challenges'}</option>
              <option value="organization">{language === 'sv' ? 'Organisatoriska problem' : 'Organizational issues'}</option>
              <option value="other">{language === 'sv' ? 'Annat / Flera områden' : 'Other / Multiple areas'}</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className={labelClass}>
              {language === 'sv' ? 'Beskriv Er Situation' : 'Describe Your Situation'}
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleInputChange}
              className={inputClass + ' resize-none'}
              placeholder={language === 'sv'
                ? 'Vad är er viktigaste utmaning just nu? Vad har ni provat tidigare? Vad är målet på 12-24 månaders sikt?'
                : 'What is your most important challenge right now? What have you tried before? What is the goal in 12-24 months?'}
            ></textarea>
          </div>
        </div>

        {submitStatus === 'success' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
            <p className="font-heading text-emerald-800 font-semibold mb-2">
              {language === 'sv' ? 'Tack för ditt meddelande!' : 'Thank you for your message!'}
            </p>
            <p className="text-emerald-700 text-sm">
              {language === 'sv'
                ? 'Vi återkommer inom 24 timmar för att schemalägga en strategidialog.'
                : 'We will get back to you within 24 hours to schedule a strategy discussion.'}
            </p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-700 text-sm">
              {language === 'sv'
                ? 'Ett fel uppstod. Vänligen försök igen eller kontakta oss direkt på contact@northforce.io'
                : 'An error occurred. Please try again or contact us directly at contact@northforce.io'}
            </p>
          </div>
        )}

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center sm:text-left">
            {language === 'sv'
              ? 'Vi behandlar dina uppgifter konfidentiellt enligt GDPR.'
              : 'We handle your information confidentially according to GDPR.'}
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-accent-cyan text-white px-10 py-4 rounded-lg font-bold text-base hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting
              ? (language === 'sv' ? 'Skickar...' : 'Sending...')
              : (language === 'sv' ? 'Skicka Förfrågan' : 'Submit Inquiry')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
