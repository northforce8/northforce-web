import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, Sparkles, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const navigation = [
    { name: t('nav.hybrid_model'), href: '/hybrid-model' },
    { name: t('nav.systems'), href: '/system' },
    { name: t('nav.capabilities'), href: '/capabilities' },
    { name: t('nav.strategic_websites'), href: '/strategic-websites' },
    { name: t('nav.industries'), href: '/industries' },
    { name: language === 'sv' ? 'Lösningar' : 'Solutions', href: '/solutions' },
    { name: t('nav.ai_automation'), href: '/ai-automation' },
    { name: t('nav.about'), href: '/about' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
            <div className="relative">
              <Sparkles className="h-4 w-4 text-violet-500 absolute -top-1 -right-1" style={{color: '#7B61FF'}} />
              <Zap className="h-8 w-8" style={{color: '#00A8E8'}} />
            </div>
            <span className="font-heading text-xl font-black text-gray-900 whitespace-nowrap">NorthForce</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-body text-sm font-medium transition-colors relative group whitespace-nowrap ${
                  isActive(item.href) 
                    ? 'text-primary-800' 
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-cyan transition-all duration-300 ${
                  isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
            <button
              onClick={() => setLanguage(language === 'en' ? 'sv' : 'en')}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
              title={language === 'en' ? 'Switch to Swedish' : 'Växla till engelska'}
            >
              <Globe className="h-4 w-4 text-gray-700" />
              <span className="text-sm font-medium text-gray-700">{language.toUpperCase()}</span>
            </button>
            <Link
              to="/audit"
              className="text-sm text-primary-600 hover:text-accent-cyan font-medium transition-colors whitespace-nowrap"
            >
              {t('nav.free_audit')}
            </Link>
            <Link
              to="/contact"
              className="bg-gradient-to-r from-primary-600 to-accent-cyan text-white px-4 py-2 rounded-2xl hover:shadow-glow transition-all duration-300 font-medium text-sm transform hover:scale-105 whitespace-nowrap"
            >
              {t('nav.book_meeting')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            {isMenuOpen ? (
              <X className="h-7 w-7 text-gray-700" />
            ) : (
              <Menu className="h-7 w-7 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-gray-200/50 bg-white/95 backdrop-blur-md">
            <div className="space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block font-body font-medium py-2 ${
                    isActive(item.href)
                      ? 'text-primary-800'
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                <button
                  onClick={() => setLanguage(language === 'en' ? 'sv' : 'en')}
                  className="flex items-center space-x-2 w-full px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Globe className="h-5 w-5 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">{language === 'en' ? 'English' : 'Svenska'}</span>
                </button>
                <Link
                  to="/audit"
                  className="block text-primary-600 hover:text-accent-cyan font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.free_audit')}
                </Link>
                <Link
                  to="/contact"
                  className="block bg-gradient-to-r from-primary-600 to-accent-cyan text-white px-6 py-3 rounded-2xl font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.book_meeting')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;