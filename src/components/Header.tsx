import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, Sparkles, Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const headerRef = useRef<HTMLDivElement>(null);

  const navigation = [
    {
      name: language === 'sv' ? 'Erbjudanden' : 'Offerings',
      dropdown: [
        { name: language === 'sv' ? 'Hybridmodellen' : 'Hybrid Model', href: '/hybrid-model' },
        { name: 'NorthForce System', href: '/system' },
        { name: language === 'sv' ? 'Strategiska Webbplatser' : 'Strategic Websites', href: '/strategic-websites' },
        { name: language === 'sv' ? 'Affärsdata' : 'Business Data', href: '/business-data' },
        { name: language === 'sv' ? 'AI & Automation' : 'AI & Automation', href: '/ai-automation' },
      ]
    },
    {
      name: language === 'sv' ? 'Lösningar' : 'Solutions',
      dropdown: [
        { name: language === 'sv' ? 'Lösningar' : 'Solutions', href: '/solutions' },
        { name: language === 'sv' ? 'Branscher' : 'Industries', href: '/industries' },
        { name: language === 'sv' ? 'Kapabiliteter' : 'Capabilities', href: '/capabilities' },
        { name: language === 'sv' ? 'Kundeffekt' : 'Client Impact', href: '/impact' },
      ]
    },
    {
      name: language === 'sv' ? 'Kom Igång' : 'Get Started',
      dropdown: [
        { name: language === 'sv' ? 'Priser & Investering' : 'Pricing & Investment', href: '/pricing' },
        { name: language === 'sv' ? 'Gratis Analys' : 'Free Analysis', href: '/audit' },
        { name: language === 'sv' ? 'Kontakt' : 'Contact', href: '/contact' },
        { name: language === 'sv' ? 'Bli Partner' : 'Become Partner', href: '/partners' },
      ]
    },
    {
      name: language === 'sv' ? 'Företag' : 'Company',
      dropdown: [
        { name: language === 'sv' ? 'Om Oss' : 'About Us', href: '/about' },
        { name: language === 'sv' ? 'Insikter' : 'Insights', href: '/insights' },
        { name: language === 'sv' ? 'Karriär' : 'Careers', href: '/careers' },
        { name: language === 'sv' ? 'Juridik & Integritet' : 'Legal & Privacy', href: '/legal' },
      ]
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on ESC key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <header ref={headerRef} className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-soft">
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
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const isDropdownOpen = openDropdown === item.name;
              const isAnySubItemActive = item.dropdown.some(subItem => isActive(subItem.href));

              return (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`font-body text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-xl ${
                      isAnySubItemActive
                        ? 'text-primary-700 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                    <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-200 py-2 min-w-[240px] animate-fadeIn">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.href}
                          to={subItem.href}
                          className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                            isActive(subItem.href)
                              ? 'text-primary-600 bg-primary-50'
                              : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                          }`}
                          onClick={() => setOpenDropdown(null)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
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
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
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
            <div className="space-y-2">
              {navigation.map((item) => {
                const isDropdownOpen = openDropdown === item.name;

                return (
                  <div key={item.name}>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className="flex items-center justify-between w-full font-body font-semibold py-3 px-4 rounded-xl text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      <span>{item.name}</span>
                      <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                      <div className="pl-6 mt-2 space-y-1 animate-fadeIn">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.href}
                            to={subItem.href}
                            className={`block font-body py-2.5 px-4 rounded-lg text-sm ${
                              isActive(subItem.href)
                                ? 'text-primary-700 bg-primary-50 font-medium'
                                : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                            }`}
                            onClick={() => {
                              setIsMenuOpen(false);
                              setOpenDropdown(null);
                            }}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="pt-4 space-y-2 border-t border-gray-200 mt-4">
                <button
                  onClick={() => setLanguage(language === 'en' ? 'sv' : 'en')}
                  className="flex items-center space-x-2 w-full px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Globe className="h-5 w-5 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">{language === 'en' ? 'English' : 'Svenska'}</span>
                </button>
                <Link
                  to="/audit"
                  className="block text-primary-600 hover:text-accent-cyan font-medium py-2 px-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.free_audit')}
                </Link>
                <Link
                  to="/contact"
                  className="block bg-gradient-to-r from-primary-600 to-accent-cyan text-white px-6 py-3 rounded-2xl font-medium text-center hover:shadow-glow transition-all"
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
