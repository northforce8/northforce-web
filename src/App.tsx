import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Analytics from './components/Analytics';
import Breadcrumbs from './components/Breadcrumbs';
import CookieBanner from './components/CookieBanner';
import AdminErrorBoundary from './components/admin/AdminErrorBoundary';
import AdminLayout from './components/admin/AdminLayout';
import { ADMIN_ROUTES, isAdminRoute } from './lib/admin-routes';
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

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import { SetupWizard } from './pages/admin/SetupWizard';
import AdminDashboard from './pages/admin/AdminDashboard';
import LeadDetailPage from './pages/admin/LeadDetailPage';
import AdminHealthPage from './pages/admin/AdminHealthPage';
import PartnerDashboard from './pages/admin/partner-portal/PartnerDashboard';
import EnterpriseDashboard from './pages/admin/partner-portal/EnterpriseDashboard';
import EnterprisePlansPage from './pages/admin/partner-portal/EnterprisePlansPage';
import CreditsDashboardPage from './pages/admin/partner-portal/CreditsDashboardPage';
import PartnersPageAdmin from './pages/admin/partner-portal/PartnersPage';
import PartnerDetailPage from './pages/admin/partner-portal/PartnerDetailPage';
import CapacityOverviewPage from './pages/admin/partner-portal/CapacityOverviewPage';
import PlanningPage from './pages/admin/partner-portal/PlanningPage';
import PartnerManagementPage from './pages/admin/partner-portal/PartnerManagementPage';
import CustomersPage from './pages/admin/partner-portal/CustomersPage';
import CustomerDetailPage from './pages/admin/partner-portal/CustomerDetailPage';
import ProjectsPage from './pages/admin/partner-portal/ProjectsPage';
import TimeReportingPage from './pages/admin/partner-portal/TimeReportingPage';
import NotesPage from './pages/admin/partner-portal/NotesPage';
import ReportsPage from './pages/admin/partner-portal/ReportsPage';
import SupportPage from './pages/admin/partner-portal/SupportPage';
import SettingsPage from './pages/admin/partner-portal/SettingsPage';
import InvoicesPage from './pages/admin/partner-portal/InvoicesPage';
import InvoiceDetailPage from './pages/admin/partner-portal/InvoiceDetailPage';
import ContractsPage from './pages/admin/partner-portal/ContractsPage';
import ContractDetailPage from './pages/admin/partner-portal/ContractDetailPage';
import BillingPeriodsPage from './pages/admin/partner-portal/BillingPeriodsPage';
import MarginAnalysisPage from './pages/admin/partner-portal/MarginAnalysisPage';
import LeadManagementPage from './pages/admin/partner-portal/LeadManagementPage';
import HelpCenterPage from './pages/admin/HelpCenterPage';

// Customer Portal Pages
import CustomerLogin from './pages/customer/CustomerLogin';
import CustomerLayout from './components/customer/CustomerLayout';
import CustomerPortalDashboard from './pages/customer/CustomerPortalDashboard';
import CustomerActivityPage from './pages/customer/CustomerActivityPage';
import CustomerDocumentsPage from './pages/customer/CustomerDocumentsPage';
import CustomerHelpPage from './pages/customer/CustomerHelpPage';

function App() {
  const location = useLocation();
  const isAdmin = isAdminRoute(location.pathname);

  return (
    <ToastProvider>
      <div className="App">
        <Analytics />
        <ScrollToTop />
        {!isAdmin && <Header />}
        {!isAdmin && <Breadcrumbs />}

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

        {/* Admin Login & Setup (outside AdminLayout) */}
        <Route path={ADMIN_ROUTES.LOGIN} element={<AdminLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/setup" element={<SetupWizard />} />

        {/* Standard Admin Redirects */}
        <Route path="/admin" element={<Navigate to={ADMIN_ROUTES.LOGIN} replace />} />

        {/* Legacy Redirects - Backwards compatibility */}
        <Route path={ADMIN_ROUTES.LEGACY_LEAD_DASHBOARD} element={<Navigate to={ADMIN_ROUTES.LEADS} replace />} />
        <Route path="/admin-northforce/lead/:type/:id" element={<Navigate to="/admin/partner-portal/leads/:type/:id" replace />} />

        {/* ALL ADMIN ROUTES UNDER ONE PARENT WITH ADMINLAYOUT */}
        <Route path={ADMIN_ROUTES.BASE} element={
          <AdminErrorBoundary>
            <AdminLayout />
          </AdminErrorBoundary>
        }>
          {/* Index route - Dashboard */}
          <Route index element={<PartnerDashboard />} />

          {/* All admin pages as child routes */}
          <Route path="leads" element={<AdminDashboard />} />
          <Route path="leads/:type/:id" element={<LeadDetailPage />} />
          <Route path="enterprise" element={<EnterpriseDashboard />} />
          <Route path="enterprise-plans" element={<EnterprisePlansPage />} />
          <Route path="credits" element={<CreditsDashboardPage />} />
          <Route path="partners" element={<PartnersPageAdmin />} />
          <Route path="partners/:id" element={<PartnerDetailPage />} />
          <Route path="capacity" element={<CapacityOverviewPage />} />
          <Route path="planning" element={<PlanningPage />} />
          <Route path="partner-management" element={<PartnerManagementPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/:customerId" element={<CustomerDetailPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="time" element={<TimeReportingPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="invoices/:invoiceId" element={<InvoiceDetailPage />} />
          <Route path="contracts" element={<ContractsPage />} />
          <Route path="contracts/:contractId" element={<ContractDetailPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="billing-periods" element={<BillingPeriodsPage />} />
          <Route path="margin-analysis" element={<MarginAnalysisPage />} />
          <Route path="leads-management" element={<LeadManagementPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="health" element={<AdminHealthPage />} />
          <Route path="help" element={<HelpCenterPage />} />
        </Route>

        {/* Customer Portal Routes - Under Admin */}
        <Route path="/admin/customer/login" element={<CustomerLogin />} />
        <Route path="/admin/customer/portal" element={<CustomerLayout />}>
          <Route index element={<CustomerPortalDashboard />} />
          <Route path="activity" element={<CustomerActivityPage />} />
          <Route path="documents" element={<CustomerDocumentsPage />} />
          <Route path="help" element={<CustomerHelpPage />} />
        </Route>

        {/* Legacy Customer Portal Redirects */}
        <Route path="/customer/login" element={<Navigate to="/admin/customer/login" replace />} />
        <Route path="/customer/portal" element={<Navigate to="/admin/customer/portal" replace />} />
      </Routes>

        {!isAdmin && <Footer />}
        {!isAdmin && <CookieBanner />}
      </div>
    </ToastProvider>
  );
}

export default App;