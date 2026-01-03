import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'pdf-vendor': ['jspdf', 'jspdf-autotable'],
          'icons-vendor': ['lucide-react'],
          'admin-portal': [
            './src/pages/admin/partner-portal/PartnerDashboard.tsx',
            './src/pages/admin/partner-portal/EnterpriseDashboard.tsx',
            './src/pages/admin/partner-portal/CustomersPage.tsx',
            './src/pages/admin/partner-portal/PartnersPage.tsx',
            './src/pages/admin/partner-portal/ProjectsPage.tsx',
          ],
          'admin-financial': [
            './src/pages/admin/partner-portal/InvoicesPage.tsx',
            './src/pages/admin/partner-portal/ContractsPage.tsx',
            './src/pages/admin/partner-portal/CreditsDashboardPage.tsx',
            './src/pages/admin/partner-portal/BillingPeriodsPage.tsx',
            './src/pages/admin/partner-portal/MarginAnalysisPage.tsx',
          ],
          'admin-frameworks': [
            './src/pages/admin/partner-portal/StrategicFrameworksOverviewPage.tsx',
            './src/pages/admin/partner-portal/OKRPage.tsx',
            './src/pages/admin/partner-portal/SWOTPage.tsx',
            './src/pages/admin/partner-portal/PorterPage.tsx',
            './src/pages/admin/partner-portal/BMCPage.tsx',
            './src/pages/admin/partner-portal/BSCPage.tsx',
            './src/pages/admin/partner-portal/ADKARPage.tsx',
            './src/pages/admin/partner-portal/AgilePage.tsx',
            './src/pages/admin/partner-portal/McKinsey7SPage.tsx',
            './src/pages/admin/partner-portal/LeanStartupPage.tsx',
            './src/pages/admin/partner-portal/DesignThinkingPage.tsx',
          ],
          'admin-growth': [
            './src/pages/admin/partner-portal/GrowthPlansPage.tsx',
            './src/pages/admin/partner-portal/LeadershipAssessmentsPage.tsx',
            './src/pages/admin/partner-portal/MarketingCampaignsPage.tsx',
            './src/pages/admin/partner-portal/EnterprisePlansPage.tsx',
          ],
          'customer-portal': [
            './src/pages/customer/CustomerPortalDashboard.tsx',
            './src/pages/customer/CustomerActivityPage.tsx',
            './src/pages/customer/CustomerBusinessHealthPage.tsx',
            './src/pages/customer/CustomerCampaignsPage.tsx',
            './src/pages/customer/CustomerDocumentsPage.tsx',
            './src/pages/customer/CustomerGrowthJourneyPage.tsx',
            './src/pages/customer/CustomerLeadershipPage.tsx',
          ],
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
