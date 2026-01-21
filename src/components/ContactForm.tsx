import React, { useState } from 'react';
import { saveContactSubmission } from '../lib/supabase';
import { sendContactNotification } from '../lib/email-service';
import { useLanguage } from '../contexts/LanguageContext';

interface ContactFormProps {
  variant?: 'default' | 'inline';
  className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ variant = 'default', className = '' }) => {
  const { t } = useLanguage();

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
            {t('form.contact.title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className={labelClass}>
                {t('form.label.name')} *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className={inputClass}
                placeholder={t('form.placeholder.name')}
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                {t('form.label.email')} *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={inputClass}
                placeholder={t('form.placeholder.email')}
              />
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div>
          <h3 className="font-heading text-lg font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            {t('form.contact.business_info')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="company" className={labelClass}>
                {t('form.label.company')} *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                required
                value={formData.company}
                onChange={handleInputChange}
                className={inputClass}
                placeholder={t('form.placeholder.company')}
              />
            </div>

            <div>
              <label htmlFor="role" className={labelClass}>
                {t('form.label.role')} *
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleInputChange}
                className={inputClass}
              >
                <option value="">{t('form.role.select')}</option>
                <option value="ceo">{t('form.role.ceo')}</option>
                <option value="cmo">{t('form.role.cmo')}</option>
                <option value="coo">{t('form.role.coo')}</option>
                <option value="cfo">{t('form.role.cfo')}</option>
                <option value="sales">{t('form.role.sales')}</option>
                <option value="other">{t('form.role.other')}</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="revenue" className={labelClass}>
              {t('form.label.revenue')}
            </label>
            <select
              id="revenue"
              name="revenue"
              value={formData.revenue}
              onChange={handleInputChange}
              className={inputClass}
            >
              <option value="">{t('form.revenue.select')}</option>
              <option value="0-10m">{t('form.revenue.0_10')}</option>
              <option value="10-50m">{t('form.revenue.10_50')}</option>
              <option value="50-100m">{t('form.revenue.50_100')}</option>
              <option value="100-500m">{t('form.revenue.100_500')}</option>
              <option value="500m+">{t('form.revenue.500+')}</option>
            </select>
          </div>
        </div>

        {/* Challenge & Context */}
        <div>
          <h3 className="font-heading text-lg font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            {t('form.contact.needs')}
          </h3>

          <div className="mb-6">
            <label htmlFor="challenge" className={labelClass}>
              {t('form.label.challenge')} *
            </label>
            <select
              id="challenge"
              name="challenge"
              required
              value={formData.challenge}
              onChange={handleInputChange}
              className={inputClass}
            >
              <option value="">{t('form.challenge.select')}</option>
              <option value="growth">{t('form.challenge.growth')}</option>
              <option value="sales">{t('form.challenge.sales')}</option>
              <option value="marketing">{t('form.challenge.marketing')}</option>
              <option value="operations">{t('form.challenge.operations')}</option>
              <option value="scaling">{t('form.challenge.scaling')}</option>
              <option value="competition">{t('form.challenge.competition')}</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className={labelClass}>
              {t('form.label.message')}
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleInputChange}
              className={inputClass + ' resize-none'}
              placeholder={t('form.placeholder.message')}
            ></textarea>
          </div>
        </div>

        {submitStatus === 'success' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
            <p className="font-heading text-emerald-800 font-semibold mb-2">
              {t('form.success.contact.title')}
            </p>
            <p className="text-emerald-700 text-sm">
              {t('form.success.contact.message')}
            </p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-700 text-sm">
              {t('form.error.submit')}
            </p>
          </div>
        )}

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center sm:text-left">
            {t('contact.gdpr')}
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-accent-cyan text-white px-10 py-4 rounded-lg font-bold text-base hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? t('form.button.submitting') : t('form.button.submit')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
