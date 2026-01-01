/**
 * SINGLE SOURCE OF TRUTH FOR ALL ADMIN ROUTES
 *
 * This file defines ALL admin routes in the application.
 * NO admin routes should be defined anywhere else.
 * If a route is added/changed here, TypeScript will catch navigation errors.
 *
 * ALL ADMIN FUNCTIONALITY IS NOW UNDER: /admin/partner-portal/*
 */

export const ADMIN_ROUTES = {
  // Standard login route
  LOGIN: '/admin-login',

  // Partner Portal - BASE route (with AdminLayout)
  BASE: '/admin/partner-portal',

  // All routes under partner portal
  DASHBOARD: '/admin/partner-portal',
  LEADS: '/admin/partner-portal/leads',
  LEAD_DETAIL: '/admin/partner-portal/leads/:type/:id',
  ENTERPRISE: '/admin/partner-portal/enterprise',
  ENTERPRISE_PLANS: '/admin/partner-portal/enterprise-plans',
  CREDITS: '/admin/partner-portal/credits',
  PARTNERS: '/admin/partner-portal/partners',
  PARTNER_DETAIL: '/admin/partner-portal/partners/:id',
  PARTNER_MANAGEMENT: '/admin/partner-portal/partner-management',
  CAPACITY: '/admin/partner-portal/capacity',
  PLANNING: '/admin/partner-portal/planning',
  CUSTOMERS: '/admin/partner-portal/customers',
  CUSTOMER_DETAIL: '/admin/partner-portal/customers/:customerId',
  PROJECTS: '/admin/partner-portal/projects',
  TIME: '/admin/partner-portal/time',
  NOTES: '/admin/partner-portal/notes',
  INVOICES: '/admin/partner-portal/invoices',
  INVOICE_DETAIL: '/admin/partner-portal/invoices/:invoiceId',
  CONTRACTS: '/admin/partner-portal/contracts',
  CONTRACT_DETAIL: '/admin/partner-portal/contracts/:contractId',
  REPORTS: '/admin/partner-portal/reports',
  SUPPORT: '/admin/partner-portal/support',
  BILLING_PERIODS: '/admin/partner-portal/billing-periods',
  MARGIN_ANALYSIS: '/admin/partner-portal/margin-analysis',
  LEADS_MANAGEMENT: '/admin/partner-portal/leads-management',
  SETTINGS: '/admin/partner-portal/settings',
  HEALTH: '/admin/partner-portal/health',

  // Legacy redirects (for backwards compatibility)
  LEGACY_LEAD_DASHBOARD: '/admin-northforce',
  LEGACY_LEAD_DETAIL: '/admin-northforce/lead/:type/:id',
} as const;

// Helper to build dynamic routes
export const buildLeadDetailRoute = (type: string, id: string) =>
  `/admin/partner-portal/leads/${type}/${id}`;

export const buildCustomerDetailRoute = (customerId: string) =>
  `/admin/partner-portal/customers/${customerId}`;

export const buildPartnerDetailRoute = (partnerId: string) =>
  `/admin/partner-portal/partners/${partnerId}`;

export const buildInvoiceDetailRoute = (invoiceId: string) =>
  `/admin/partner-portal/invoices/${invoiceId}`;

export const buildContractDetailRoute = (contractId: string) =>
  `/admin/partner-portal/contracts/${contractId}`;

// Navigation labels (used in menus)
export const ADMIN_NAV_LABELS = {
  DASHBOARD: 'Dashboard',
  LEAD_MANAGEMENT: 'Lead Management',
  ENTERPRISE_INTELLIGENCE: 'Enterprise Dashboard',
  ENTERPRISE_PLANS: 'Enterprise Plans',
  CREDITS: 'Credits & Forecasts',
  PARTNERS: 'Partners Overview',
  PARTNER_MANAGEMENT: 'Partner Management',
  CAPACITY: 'Capacity Planning',
  PLANNING: 'Calendar & Planning',
  CUSTOMERS: 'Customers',
  PROJECTS: 'Projects',
  TIME_REPORTING: 'Time Reporting',
  NOTES: 'Notes',
  INVOICES: 'Invoices',
  CONTRACTS: 'Contracts',
  REPORTS: 'Reports Overview',
  SUPPORT: 'Support',
  BILLING_PERIODS: 'Billing Periods',
  MARGIN_ANALYSIS: 'Margin Analysis',
  LEADS_MANAGEMENT: 'All Leads',
  SETTINGS: 'Settings',
  HEALTH: 'Health',
} as const;

// Type-safe navigation items
export interface AdminNavItem {
  label: string;
  path: string;
  icon?: string;
  roles: string[];
}

export interface AdminNavGroup {
  label: string;
  roles: string[];
  items: AdminNavItem[];
}

export const ADMIN_NAVIGATION_GROUPED: AdminNavGroup[] = [
  {
    label: 'BUSINESS INTELLIGENCE',
    roles: ['admin'],
    items: [
      { label: ADMIN_NAV_LABELS.ENTERPRISE_INTELLIGENCE, path: ADMIN_ROUTES.ENTERPRISE, roles: ['admin'] },
      { label: ADMIN_NAV_LABELS.CREDITS, path: ADMIN_ROUTES.CREDITS, roles: ['admin'] },
      { label: ADMIN_NAV_LABELS.MARGIN_ANALYSIS, path: ADMIN_ROUTES.MARGIN_ANALYSIS, roles: ['admin'] },
    ]
  },
  {
    label: 'SALES & DELIVERY',
    roles: ['admin', 'partner'],
    items: [
      { label: ADMIN_NAV_LABELS.LEADS_MANAGEMENT, path: ADMIN_ROUTES.LEADS_MANAGEMENT, roles: ['admin'] },
      { label: ADMIN_NAV_LABELS.CUSTOMERS, path: ADMIN_ROUTES.CUSTOMERS, roles: ['admin', 'partner'] },
      { label: ADMIN_NAV_LABELS.PROJECTS, path: ADMIN_ROUTES.PROJECTS, roles: ['admin', 'partner'] },
    ]
  },
  {
    label: 'OPERATIONS',
    roles: ['admin', 'partner'],
    items: [
      { label: ADMIN_NAV_LABELS.TIME_REPORTING, path: ADMIN_ROUTES.TIME, roles: ['admin', 'partner'] },
      { label: ADMIN_NAV_LABELS.NOTES, path: ADMIN_ROUTES.NOTES, roles: ['admin', 'partner'] },
      { label: ADMIN_NAV_LABELS.PLANNING, path: ADMIN_ROUTES.PLANNING, roles: ['admin'] },
    ]
  },
  {
    label: 'FINANCE & CONTRACTS',
    roles: ['admin'],
    items: [
      { label: ADMIN_NAV_LABELS.INVOICES, path: ADMIN_ROUTES.INVOICES, roles: ['admin'] },
      { label: ADMIN_NAV_LABELS.CONTRACTS, path: ADMIN_ROUTES.CONTRACTS, roles: ['admin'] },
      { label: ADMIN_NAV_LABELS.BILLING_PERIODS, path: ADMIN_ROUTES.BILLING_PERIODS, roles: ['admin'] },
    ]
  },
  {
    label: 'RESOURCES',
    roles: ['admin'],
    items: [
      { label: ADMIN_NAV_LABELS.PARTNER_MANAGEMENT, path: ADMIN_ROUTES.PARTNER_MANAGEMENT, roles: ['admin'] },
      { label: ADMIN_NAV_LABELS.CAPACITY, path: ADMIN_ROUTES.CAPACITY, roles: ['admin'] },
      { label: ADMIN_NAV_LABELS.ENTERPRISE_PLANS, path: ADMIN_ROUTES.ENTERPRISE_PLANS, roles: ['admin'] },
    ]
  },
  {
    label: 'REPORTS & ANALYTICS',
    roles: ['admin'],
    items: [
      { label: ADMIN_NAV_LABELS.REPORTS, path: ADMIN_ROUTES.REPORTS, roles: ['admin'] },
    ]
  },
  {
    label: 'SYSTEM',
    roles: ['admin'],
    items: [
      { label: ADMIN_NAV_LABELS.SETTINGS, path: ADMIN_ROUTES.SETTINGS, roles: ['admin'] },
      { label: ADMIN_NAV_LABELS.SUPPORT, path: ADMIN_ROUTES.SUPPORT, roles: ['admin'] },
      { label: ADMIN_NAV_LABELS.HEALTH, path: ADMIN_ROUTES.HEALTH, roles: ['admin'] },
    ]
  },
];

// Check if a path is an admin route
export const isAdminRoute = (pathname: string): boolean => {
  return pathname.startsWith('/admin');
};

// Get current build info
export const BUILD_INFO = {
  timestamp: new Date().toISOString(),
  version: '2.0.0',
  environment: import.meta.env.MODE || 'production',
} as const;
