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
  ENGAGEMENT_HUB: '/admin/partner-portal/engagement-hub',
  VALUE_TRACKING: '/admin/partner-portal/value-tracking',
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
  HELP: '/admin/partner-portal/help',

  // Enterprise Management System
  GROWTH_PLANS: '/admin/partner-portal/growth-plans',
  GROWTH_PLAN_DETAIL: '/admin/partner-portal/growth-plans/:planId',
  LEADERSHIP_ASSESSMENTS: '/admin/partner-portal/leadership-assessments',
  MARKETING_CAMPAIGNS: '/admin/partner-portal/marketing-campaigns',
  BUSINESS_MODELS: '/admin/partner-portal/business-models',
  BEST_PRACTICES: '/admin/partner-portal/best-practices',
  METHODOLOGY_TEMPLATES: '/admin/partner-portal/methodology-templates',

  // Strategic Frameworks - 10 Core Models
  FRAMEWORKS: '/admin/partner-portal/strategic-frameworks',
  OKR: '/admin/partner-portal/strategic-frameworks/okr',
  OKR_DETAIL: '/admin/partner-portal/strategic-frameworks/okr/:id',
  SWOT: '/admin/partner-portal/strategic-frameworks/swot',
  SWOT_DETAIL: '/admin/partner-portal/strategic-frameworks/swot/:id',
  PORTER: '/admin/partner-portal/strategic-frameworks/porter',
  PORTER_DETAIL: '/admin/partner-portal/strategic-frameworks/porter/:id',
  BMC: '/admin/partner-portal/strategic-frameworks/bmc',
  BMC_DETAIL: '/admin/partner-portal/strategic-frameworks/bmc/:id',
  BSC: '/admin/partner-portal/strategic-frameworks/bsc',
  BSC_DETAIL: '/admin/partner-portal/strategic-frameworks/bsc/:id',
  ADKAR: '/admin/partner-portal/strategic-frameworks/adkar',
  ADKAR_DETAIL: '/admin/partner-portal/strategic-frameworks/adkar/:id',
  AGILE: '/admin/partner-portal/strategic-frameworks/agile',
  AGILE_DETAIL: '/admin/partner-portal/strategic-frameworks/agile/:id',
  MCKINSEY_7S: '/admin/partner-portal/strategic-frameworks/mckinsey-7s',
  MCKINSEY_7S_DETAIL: '/admin/partner-portal/strategic-frameworks/mckinsey-7s/:id',
  LEAN_STARTUP: '/admin/partner-portal/strategic-frameworks/lean-startup',
  LEAN_STARTUP_DETAIL: '/admin/partner-portal/strategic-frameworks/lean-startup/:id',
  DESIGN_THINKING: '/admin/partner-portal/strategic-frameworks/design-thinking',
  DESIGN_THINKING_DETAIL: '/admin/partner-portal/strategic-frameworks/design-thinking/:id',

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
  ENGAGEMENT_HUB: 'Engagement Hub',
  VALUE_TRACKING: 'Value Tracking',
  LEAD_MANAGEMENT: 'Lead Management',
  ENTERPRISE_INTELLIGENCE: 'Enterprise Dashboard',
  ENTERPRISE_PLANS: 'Capacity Plans',
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
  HELP: 'Help',
  WEBSITE: 'Website',
  GROWTH_PLANS: 'Growth Plans',
  LEADERSHIP_ASSESSMENTS: 'Leadership Assessments',
  MARKETING_CAMPAIGNS: 'Marketing Campaigns',
  BUSINESS_MODELS: 'Business Models',
  BEST_PRACTICES: 'Best Practices',
  METHODOLOGY_TEMPLATES: 'Methodology Templates',
  FRAMEWORKS: 'Strategic Frameworks',
  OKR: 'OKR - Objectives & Key Results',
  SWOT: 'SWOT Analysis',
  PORTER: "Porter's Five Forces",
  BMC: 'Business Model Canvas',
  BSC: 'Balanced Scorecard',
  ADKAR: 'Change Management (ADKAR)',
  AGILE: 'Agile Transformation',
  MCKINSEY_7S: 'McKinsey 7S Framework',
  LEAN_STARTUP: 'Lean Startup',
  DESIGN_THINKING: 'Design Thinking',
} as const;

// Type-safe navigation items
export interface AdminNavItem {
  label: string;
  path: string;
  icon?: string;
  roles: string[];
  external?: boolean;
}

export interface AdminNavGroup {
  label: string;
  roles: string[];
  items: AdminNavItem[];
}

export const ADMIN_NAVIGATION_GROUPED: AdminNavGroup[] = [
  {
    label: 'DASHBOARD',
    roles: ['admin', 'partner'],
    items: [
      { label: 'Partner Portal Dashboard', path: ADMIN_ROUTES.DASHBOARD, roles: ['admin', 'partner'] },
      { label: ADMIN_NAV_LABELS.ENGAGEMENT_HUB, path: ADMIN_ROUTES.ENGAGEMENT_HUB, roles: ['admin', 'partner'] },
    ]
  },
  {
    label: 'SALES & CUSTOMERS',
    roles: ['admin', 'partner'],
    items: [
      { label: ADMIN_NAV_LABELS.LEADS_MANAGEMENT, path: ADMIN_ROUTES.LEADS_MANAGEMENT, roles: ['admin'] },
      { label: ADMIN_NAV_LABELS.CUSTOMERS, path: ADMIN_ROUTES.CUSTOMERS, roles: ['admin', 'partner'] },
      { label: ADMIN_NAV_LABELS.CONTRACTS, path: ADMIN_ROUTES.CONTRACTS, roles: ['admin'] },
    ]
  },
  {
    label: 'DELIVERY',
    roles: ['admin', 'partner'],
    items: [
      { label: ADMIN_NAV_LABELS.PROJECTS, path: ADMIN_ROUTES.PROJECTS, roles: ['admin', 'partner'] },
      { label: ADMIN_NAV_LABELS.TIME_REPORTING, path: ADMIN_ROUTES.TIME, roles: ['admin', 'partner'] },
      { label: ADMIN_NAV_LABELS.PLANNING, path: ADMIN_ROUTES.PLANNING, roles: ['admin'] },
      { label: ADMIN_NAV_LABELS.NOTES, path: ADMIN_ROUTES.NOTES, roles: ['admin', 'partner'] },
    ]
  },
  {
    label: 'FINANCE',
    roles: ['admin'],
    items: [
      { label: ADMIN_NAV_LABELS.INVOICES, path: ADMIN_ROUTES.INVOICES, roles: ['admin'] },
      { label: ADMIN_NAV_LABELS.BILLING_PERIODS, path: ADMIN_ROUTES.BILLING_PERIODS, roles: ['admin'] },
      { label: ADMIN_NAV_LABELS.CREDITS, path: ADMIN_ROUTES.CREDITS, roles: ['admin'] },
      { label: ADMIN_NAV_LABELS.MARGIN_ANALYSIS, path: ADMIN_ROUTES.MARGIN_ANALYSIS, roles: ['admin'] },
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
    label: 'ANALYTICS',
    roles: ['admin'],
    items: [
      { label: ADMIN_NAV_LABELS.ENTERPRISE_INTELLIGENCE, path: ADMIN_ROUTES.ENTERPRISE, roles: ['admin'] },
      { label: ADMIN_NAV_LABELS.REPORTS, path: ADMIN_ROUTES.REPORTS, roles: ['admin'] },
      { label: ADMIN_NAV_LABELS.HEALTH, path: ADMIN_ROUTES.HEALTH, roles: ['admin'] },
    ]
  },
  {
    label: 'GROWTH & STRATEGY',
    roles: ['admin'],
    items: [
      { label: ADMIN_NAV_LABELS.VALUE_TRACKING, path: ADMIN_ROUTES.VALUE_TRACKING, roles: ['admin'] },
      { label: ADMIN_NAV_LABELS.GROWTH_PLANS, path: ADMIN_ROUTES.GROWTH_PLANS, roles: ['admin'] },
      { label: ADMIN_NAV_LABELS.BUSINESS_MODELS, path: ADMIN_ROUTES.BUSINESS_MODELS, roles: ['admin'] },
    ]
  },
  {
    label: 'LEADERSHIP & MARKETING',
    roles: ['admin'],
    items: [
      { label: ADMIN_NAV_LABELS.LEADERSHIP_ASSESSMENTS, path: ADMIN_ROUTES.LEADERSHIP_ASSESSMENTS, roles: ['admin'] },
      { label: ADMIN_NAV_LABELS.MARKETING_CAMPAIGNS, path: ADMIN_ROUTES.MARKETING_CAMPAIGNS, roles: ['admin'] },
    ]
  },
  {
    label: 'STRATEGIC FRAMEWORKS',
    roles: ['admin', 'partner'],
    items: [
      { label: ADMIN_NAV_LABELS.FRAMEWORKS, path: ADMIN_ROUTES.FRAMEWORKS, roles: ['admin', 'partner'] },
      { label: ADMIN_NAV_LABELS.OKR, path: ADMIN_ROUTES.OKR, roles: ['admin', 'partner'] },
      { label: ADMIN_NAV_LABELS.SWOT, path: ADMIN_ROUTES.SWOT, roles: ['admin', 'partner'] },
      { label: ADMIN_NAV_LABELS.PORTER, path: ADMIN_ROUTES.PORTER, roles: ['admin', 'partner'] },
      { label: ADMIN_NAV_LABELS.BMC, path: ADMIN_ROUTES.BMC, roles: ['admin', 'partner'] },
      { label: ADMIN_NAV_LABELS.BSC, path: ADMIN_ROUTES.BSC, roles: ['admin', 'partner'] },
      { label: ADMIN_NAV_LABELS.ADKAR, path: ADMIN_ROUTES.ADKAR, roles: ['admin', 'partner'] },
      { label: ADMIN_NAV_LABELS.AGILE, path: ADMIN_ROUTES.AGILE, roles: ['admin', 'partner'] },
      { label: ADMIN_NAV_LABELS.MCKINSEY_7S, path: ADMIN_ROUTES.MCKINSEY_7S, roles: ['admin', 'partner'] },
      { label: ADMIN_NAV_LABELS.LEAN_STARTUP, path: ADMIN_ROUTES.LEAN_STARTUP, roles: ['admin', 'partner'] },
      { label: ADMIN_NAV_LABELS.DESIGN_THINKING, path: ADMIN_ROUTES.DESIGN_THINKING, roles: ['admin', 'partner'] },
    ]
  },
  {
    label: 'KNOWLEDGE BASE',
    roles: ['admin', 'partner'],
    items: [
      { label: ADMIN_NAV_LABELS.METHODOLOGY_TEMPLATES, path: ADMIN_ROUTES.METHODOLOGY_TEMPLATES, roles: ['admin', 'partner'] },
      { label: ADMIN_NAV_LABELS.BEST_PRACTICES, path: ADMIN_ROUTES.BEST_PRACTICES, roles: ['admin', 'partner'] },
    ]
  },
  {
    label: 'SYSTEM',
    roles: ['admin', 'partner'],
    items: [
      { label: ADMIN_NAV_LABELS.HELP, path: ADMIN_ROUTES.HELP, roles: ['admin', 'partner'] },
      { label: ADMIN_NAV_LABELS.SETTINGS, path: ADMIN_ROUTES.SETTINGS, roles: ['admin'] },
      { label: ADMIN_NAV_LABELS.SUPPORT, path: ADMIN_ROUTES.SUPPORT, roles: ['admin'] },
      { label: ADMIN_NAV_LABELS.WEBSITE, path: 'https://northforce.io', roles: ['admin'], external: true },
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
