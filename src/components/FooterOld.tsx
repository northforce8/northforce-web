import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Sparkles, MapPin, Mail, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { saveNewsletterSubmission } from '../lib/supabase';
import { sendNewsletterNotification } from '../lib/email-service';

const Footer = () => {
  const { t } = useLanguage();
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email');
    
    if (!email) {
      alert('Please enter your email address.');
      return;
    }
    
    try {
      // Save to Supabase database
      const submission = await saveNewsletterSubmission({
        email: email as string
      });

      // Send email notification
      await sendNewsletterNotification(submission);
      
      // Show success message
      alert('Thank you for subscribing! You\'ll receive our weekly insights.');
      
      // Reset form
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      alert('There was an error with your subscription. Please try again later.');
    }
  };

  return (
    <footer className="footer bg-gradient-to-r from-primary-900 via-primary-800 to-primary-600 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <Sparkles className="h-4 w-4 text-violet-500 absolute -top-1 -right-1" style={{color: '#9B7BFF'}} />
                <Zap className="h-8 w-8" style={{color: '#27D0F6'}} />
              </div>
              <span className="font-heading text-xl font-black text-white">NorthForce</span>
            </Link>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Systems-first automation & AI that save time, build trust, and drive measurable growth.            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-accent-cyan mt-0.5 flex-shrink-0" />
                <div className="text-gray-200 text-sm">
                  <div>Karlavägen 18</div>
                  <div>114 31 Stockholm,</div>
                  <div>Sweden</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-accent-cyan flex-shrink-0" />
                <a href="mailto:support@northforce.io" className="text-gray-200 hover:text-white transition-colors text-sm">
                  support@northforce.io
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-accent-cyan flex-shrink-0" />
                <a href="tel:+46103371334" className="text-gray-200 hover:text-white transition-colors text-sm">
                  +46 10 337 13 34
                </a>
              </div>
            </div>
            
            <div className="flex space-x-4 items-center">
              <a href="https://www.linkedin.com/company/northforce-io/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="https://x.com/NorthForce8" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/@NorthForce" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M2.8 7.1c.2-.7.8-1.3 1.5-1.5C6.8 5 12 5 12 5s5.2 0 7.7.6c.7.2 1.3.8 1.5 1.5.6 2.5.6 5.5.6 5.5s0 3-.6 5.5c-.2.7-.8 1.3-1.5 1.5-2.5.6-7.7.6-7.7.6s-5.2 0-7.7-.6c-.7-.2-1.3-.8-1.5-1.5-.6-2.5-.6-5.5-.6-5.5s0-3 .6-5.5Z"/><path d="m10 15 5-3-5-3z"/></svg>
              </a>
              <a href="https://www.instagram.com/northforce.io/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.5" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://www.facebook.com/northforce.io/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="font-heading text-lg font-bold text-white mb-4">{t('footer.solutions')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/systems" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('footer.core_systems')}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('nav.services')}
                </Link>
              </li>
              <li>
                <Link to="/solutions" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('footer.system_solutions')}
                </Link>
              </li>
              <li>
                <Link to="/industries" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('nav.industries')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-heading text-lg font-bold text-white mb-4">{t('footer.company')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('footer.about')}
                </Link>
              </li>
              <li>
                <Link to="/method" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('footer.our_method')}
                </Link>
              </li>
              <li>
                <Link to="/proof" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('footer.case_studies')}
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('footer.careers')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-heading text-lg font-bold text-white mb-4">{t('footer.resources')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/audit" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('nav.free_audit')}
                </Link>
              </li>
              <li>
                <Link to="/insights" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('footer.insights')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link to="/legal" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('footer.legal')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} NorthForce. {t('footer.rights')}.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex space-x-2">
            <input
              type="email"
              name="email"
              placeholder={t('footer.email_placeholder')}
              required
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              {t('footer.subscribe')}
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;