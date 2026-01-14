import React, { useState, useEffect } from 'react'; // Removed useCallback as it's not strictly necessary here

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const initializeAnalytics = () => {
    // Initialize Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  };
  const acceptAll = () => {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    setIsVisible(false);
    
    // Initialize analytics if accepted
    if (consent.analytics) {
      initializeAnalytics();
    }
  };

  const acceptSelected = () => {
    const consent = {
      ...preferences,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    setIsVisible(false);

    // Initialize analytics if accepted
    if (preferences.analytics) {
      initializeAnalytics();
    }
  };

  const rejectAll = () => {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    setIsVisible(false);
  };

  if (!isVisible) return null; // Only render if banner is visible

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary-600"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16.5 15.5v.01"/><path d="M10 16c.8.8 2 1.5 3.5 1.5 1.7 0 3-1 4-2.5"/><path d="M7 14c1.5 1 3 2 4.5 2 1.8 0 3.4-1 4.5-2.5"/></svg>
              <h3 className="font-heading text-xl font-bold text-gray-900">Cookie Preferences</h3>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              We use cookies to enhance your experience, analyze site usage, and assist in marketing efforts. 
              You can customize your preferences or accept all cookies.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={rejectAll}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Reject All
            </button>
            <button
              onClick={acceptSelected}
              className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Accept Selected
            </button>
            <button
              onClick={acceptAll}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-cyan text-white rounded-lg hover:shadow-glow transition-all duration-300 font-bold"
            >
              Accept All
            </button>
          </div>
        </div>
        
        {/* Cookie Categories */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={preferences.necessary}
              disabled
              className="rounded border-gray-300"
            />
            <div>
              <span className="font-semibold text-gray-900">Necessary</span>
              <p className="text-gray-600">Required for basic site functionality</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={preferences.analytics}
              onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-600"
            />
            <div>
              <span className="font-semibold text-gray-900">Analytics</span>
              <p className="text-gray-600">Help us improve our website</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={preferences.marketing}
              onChange={(e) => setPreferences({...preferences, marketing: e.target.checked})}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-600"
            />
            <div>
              <span className="font-semibold text-gray-900">Marketing</span>
              <p className="text-gray-600">Personalized content and ads</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;