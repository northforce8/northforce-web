import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Analytics from './components/Analytics';
import Breadcrumbs from './components/Breadcrumbs';
import CookieBanner from './components/CookieBanner';
import { ToastProvider } from './contexts/ToastContext';

// Public Pages
import HomePage from './pages/HomePage';
import HybridModelPage from './pages/HybridModelPage';
import SystemOnlyPage from './pages/SystemOnlyPage';
import AIAutomationPage from './pages/AIAutomationPage';
import CapabilitiesPage from './pages/CapabilitiesPage';
import IndustriesPage from './pages/IndustriesPage';
import ImpactPage from './pages/ImpactPage';
import InsightsPage from './pages/InsightsPage';
import AboutPage from './pages/AboutPage';
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';
import AuditPage from './pages/AuditPage';
import LegalPage from './pages/LegalPage';
import PartnersPage from './pages/PartnersPage';
import SystemsPage from './pages/SystemsPage';
import ServicesPage from './pages/ServicesPage';
import SolutionsPage from './pages/SolutionsPage';
import CMOPlusSystemPage from './pages/CMOPlusSystemPage';
import MethodPage from './pages/MethodPage';
import PricingPage from './pages/PricingPage';
import TokensPage from './pages/TokensPage';
import StrategicWebsitesPage from './pages/StrategicWebsitesPage';
import BusinessDataPage from './pages/BusinessDataPage';

function App() {
  return (
    <ToastProvider>
      <div className="App">
        <Analytics />
        <ScrollToTop />
        <Header />
        <Breadcrumbs />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/hybrid-model" element={<HybridModelPage />} />
          <Route path="/system" element={<SystemOnlyPage />} />
          <Route path="/ai-automation" element={<AIAutomationPage />} />
          <Route path="/capabilities" element={<CapabilitiesPage />} />
          <Route path="/industries" element={<IndustriesPage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/audit" element={<AuditPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/systems" element={<SystemsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/cmo-plus-system" element={<CMOPlusSystemPage />} />
          <Route path="/method" element={<MethodPage />} />
          <Route path="/proof" element={<ImpactPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/tokens" element={<TokensPage />} />
          <Route path="/strategic-websites" element={<StrategicWebsitesPage />} />
          <Route path="/business-data" element={<BusinessDataPage />} />
        </Routes>

        <Footer />
        <CookieBanner />
      </div>
    </ToastProvider>
  );
}

export default App;
