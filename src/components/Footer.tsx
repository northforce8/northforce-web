import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Sparkles, MapPin, Mail, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SocialRow from './SocialIcons';

const Footer = () => {
  const { language } = useLanguage();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <Sparkles className="h-4 w-4 text-brand-violet absolute -top-1 -right-1" />
                <Zap className="h-8 w-8 text-accent-cyan" />
              </div>
              <span className="font-heading text-xl font-black text-white">NorthForce</span>
            </Link>

            <p className="text-gray-300 mb-8 leading-relaxed max-w-md">
              {language === 'sv'
                ? 'Strategisk partner för tillväxt. Expertis, system och flexibel kapacitet i en unik hybridmodell.'
                : 'Strategic growth partner. Expertise, systems and flexible capacity in a unique hybrid model.'}
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-accent-cyan flex-shrink-0" />
                <a href="mailto:contact@northforce.io" className="text-gray-300 hover:text-white transition-colors text-sm">
                  contact@northforce.io
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-accent-cyan flex-shrink-0" />
                <a href="tel:+46103371334" className="text-gray-300 hover:text-white transition-colors text-sm">
                  +46 10 337 13 34
                </a>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-accent-cyan mt-0.5 flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  <div>Karlavägen 18</div>
                  <div>114 31 Stockholm, Sweden</div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="font-heading text-sm font-semibold text-white mb-4 uppercase tracking-wide">
                {language === 'sv' ? 'Följ Oss' : 'Follow Us'}
              </h4>
              <SocialRow variant="footer" />
            </div>
          </div>

          {/* What We Do */}
          <div>
            <h3 className="font-heading text-base font-bold text-white mb-4 uppercase tracking-wide">
              {language === 'sv' ? 'Vad Vi Gör' : 'What We Do'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/hybrid-model" className="text-gray-300 hover:text-white transition-colors text-sm block">
                  {language === 'sv' ? 'Hybridmodellen' : 'The Hybrid Model'}
                </Link>
              </li>
              <li>
                <Link to="/system" className="text-gray-300 hover:text-white transition-colors text-sm block">
                  {language === 'sv' ? 'NorthForce System' : 'NorthForce System'}
                </Link>
              </li>
              <li>
                <Link to="/ai-automation" className="text-gray-300 hover:text-white transition-colors text-sm block">
                  {language === 'sv' ? 'AI & Automation' : 'AI & Automation'}
                </Link>
              </li>
              <li>
                <Link to="/capabilities" className="text-gray-300 hover:text-white transition-colors text-sm block">
                  {language === 'sv' ? 'Kapabiliteter' : 'Capabilities'}
                </Link>
              </li>
              <li>
                <Link to="/industries" className="text-gray-300 hover:text-white transition-colors text-sm block">
                  {language === 'sv' ? 'Branscher' : 'Industries'}
                </Link>
              </li>
              <li>
                <Link to="/impact" className="text-gray-300 hover:text-white transition-colors text-sm block">
                  {language === 'sv' ? 'Kundeffekt' : 'Client Impact'}
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors text-sm block">
                  {language === 'sv' ? 'Investering' : 'Investment'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-heading text-base font-bold text-white mb-4 uppercase tracking-wide">
              {language === 'sv' ? 'Företag' : 'Company'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors text-sm block">
                  {language === 'sv' ? 'Om Oss' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link to="/insights" className="text-gray-300 hover:text-white transition-colors text-sm block">
                  {language === 'sv' ? 'Insikter' : 'Insights'}
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-300 hover:text-white transition-colors text-sm block">
                  {language === 'sv' ? 'Karriär' : 'Careers'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors text-sm block">
                  {language === 'sv' ? 'Kontakt' : 'Contact'}
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-gray-300 hover:text-white transition-colors text-sm block">
                  {language === 'sv' ? 'Bli Partner' : 'Become Partner'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Resources */}
          <div>
            <h3 className="font-heading text-base font-bold text-white mb-4 uppercase tracking-wide">
              {language === 'sv' ? 'Resurser' : 'Resources'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/audit" className="text-gray-300 hover:text-white transition-colors text-sm block">
                  {language === 'sv' ? 'Gratis Analys' : 'Free Analysis'}
                </Link>
              </li>
              <li>
                <Link to="/legal" className="text-gray-300 hover:text-white transition-colors text-sm block">
                  {language === 'sv' ? 'Juridik & Integritet' : 'Legal & Privacy'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8">
          <p className="text-gray-400 text-sm text-center">
            © {new Date().getFullYear()} NorthForce AB. {language === 'sv' ? 'Alla rättigheter förbehållna' : 'All rights reserved'}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
