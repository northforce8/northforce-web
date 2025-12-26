import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const Analytics = () => {
  const location = useLocation();

  const initializeGtag = useCallback((GA_MEASUREMENT_ID: string) => {
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID);
  }, []);

  useEffect(() => {
    // Check if user has consented to analytics
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      return;
    }

    try {
      const consentData = JSON.parse(consent);
      if (!consentData.analytics) {
        return;
      }
    } catch (error) {
      return;
    }

    // Initialize Google Analytics 4 with your tracking ID
    const GA_MEASUREMENT_ID = 'G-Q967Z1YDJX';

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    initializeGtag(GA_MEASUREMENT_ID);

    // Add Google Search Console verification meta tag
    let gscScript = document.querySelector('meta[name="google-site-verification"]');
    if (!gscScript) {
      gscScript = document.createElement('meta');
      gscScript.setAttribute('name', 'google-site-verification');
      gscScript.setAttribute('content', 'FeMiGUupHC8AuRWHeTl3OXNb5WMYs-srf9oCi3V_LYY');
      document.head.appendChild(gscScript);
    }

    console.log('✅ Analytics initialized with GA4 ID:', GA_MEASUREMENT_ID);
    console.log('✅ Search Console verification added:', 'FeMiGUupHC8AuRWHeTl3OXNb5WMYs-srf9oCi3V_LYY');
    console.log('✅ Analytics component loaded successfully');

  }, [initializeGtag]);

  useEffect(() => {
    // Track page views on route changes
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) return;

    try {
      const consentData = JSON.parse(consent);
      if (!consentData.analytics || !window.gtag) return;
    } catch (error) {
      console.error('Error parsing cookie consent for page tracking:', error);
      return;
    }

    window.gtag('config', 'G-Q967Z1YDJX', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: location.pathname
    });

    console.log('✅ Page view tracked for:', location.pathname);
  }, [location]);

  return null;
};

export default Analytics;
