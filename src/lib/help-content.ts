export interface HelpSection {
  id: string;
  title: { en: string; sv: string };
  content: { en: string; sv: string };
  category: string;
  route?: string;
}

export const helpContent: HelpSection[] = [
  {
    id: 'dashboard_overview',
    title: { en: 'Dashboard Overview', sv: 'Instrumentpanel översikt' },
    content: {
      en: 'The dashboard provides a real-time overview of key metrics including active projects, customer engagement, capacity utilization, and recent activity. Use this as your starting point to monitor business health.',
      sv: 'Instrumentpanelen ger en realtidsöversikt över nyckeltal inklusive aktiva projekt, kundengagemang, kapacitetsutnyttjande och senaste aktivitet. Använd detta som din startpunkt för att övervaka affärshälsa.',
    },
    category: 'dashboard',
    route: '/admin/partner-portal',
  },
  {
    id: 'stats_cards',
    title: { en: 'Statistics Cards', sv: 'Statistikkort' },
    content: {
      en: 'Quick metrics cards show total hours, active customers, projects, and weekly progress. Click any card to view detailed breakdowns and historical trends.',
      sv: 'Snabba måttkort visar totala timmar, aktiva kunder, projekt och veckoframsteg. Klicka på valfritt kort för att visa detaljerade uppdelningar och historiska trender.',
    },
    category: 'dashboard',
    route: '/admin/partner-portal',
  },
  {
    id: 'recent_activity',
    title: { en: 'Recent Activity', sv: 'Senaste aktivitet' },
    content: {
      en: 'View the latest time entries and notes from your team. This section updates in real-time to keep you informed of ongoing work and important updates.',
      sv: 'Visa de senaste tidposterna och anteckningarna från ditt team. Detta avsnitt uppdateras i realtid för att hålla dig informerad om pågående arbete och viktiga uppdateringar.',
    },
    category: 'dashboard',
    route: '/admin/partner-portal',
  },
  {
    id: 'customers_overview',
    title: { en: 'Customers Management', sv: 'Kundhantering' },
    content: {
      en: 'Manage all customer relationships, contracts, and engagement details. Track customer health scores, capacity usage, and project progress from a unified interface.',
      sv: 'Hantera alla kundrelationer, kontrakt och engagemangsdetaljer. Spåra kundhälsopoäng, kapacitetsanvändning och projektframsteg från ett enhetligt gränssnitt.',
    },
    category: 'customers',
    route: '/admin/partner-portal/customers',
  },
  {
    id: 'customer_health',
    title: { en: 'Customer Health Scores', sv: 'Kundhälsopoäng' },
    content: {
      en: 'Health scores are automatically calculated based on engagement frequency, satisfaction indicators, and utilization rates. Green indicates healthy relationships, yellow suggests attention needed, and red requires immediate action.',
      sv: 'Hälsopoäng beräknas automatiskt baserat på engagemangsfrekvens, tillfredsställelseindikatorer och utnyttjandegrader. Grönt indikerar friska relationer, gult föreslår att uppmärksamhet behövs, och rött kräver omedelbar åtgärd.',
    },
    category: 'customers',
    route: '/admin/partner-portal/customers',
  },
  {
    id: 'projects_management',
    title: { en: 'Projects', sv: 'Projekt' },
    content: {
      en: 'Track all active and completed projects. Monitor timelines, deliverables, resource allocation, and budget consumption. Use filters to focus on specific customers or time periods.',
      sv: 'Spåra alla aktiva och slutförda projekt. Övervaka tidslinjer, leveranser, resursallokering och budgetförbrukning. Använd filter för att fokusera på specifika kunder eller tidsperioder.',
    },
    category: 'delivery',
    route: '/admin/partner-portal/projects',
  },
  {
    id: 'time_reporting',
    title: { en: 'Time Reporting', sv: 'Tidsrapportering' },
    content: {
      en: 'Log billable hours, track time across projects and customers, and generate detailed reports. All time entries automatically update capacity calculations and customer invoicing.',
      sv: 'Logga fakturerbara timmar, spåra tid över projekt och kunder, och generera detaljerade rapporter. Alla tidposter uppdaterar automatiskt kapacitetsberäkningar och kundfakturering.',
    },
    category: 'delivery',
    route: '/admin/partner-portal/time',
  },
  {
    id: 'calendar_planning',
    title: { en: 'Calendar & Planning', sv: 'Kalender & planering' },
    content: {
      en: 'Schedule meetings, plan sprints, and coordinate team availability. The calendar integrates with Google Calendar and displays all customer engagements, internal meetings, and deadlines.',
      sv: 'Schemalägg möten, planera sprintar och koordinera teamtillgänglighet. Kalendern integreras med Google Calendar och visar alla kundengagemang, interna möten och deadlines.',
    },
    category: 'delivery',
    route: '/admin/partner-portal/planning',
  },
  {
    id: 'invoices',
    title: { en: 'Invoicing', sv: 'Fakturering' },
    content: {
      en: 'Generate, send, and track customer invoices. Invoices are automatically populated with time entries and project deliverables. Monitor payment status and send reminders for overdue invoices.',
      sv: 'Generera, skicka och spåra kundfakturor. Fakturor fylls automatiskt i med tidposter och projektleveranser. Övervaka betalningsstatus och skicka påminnelser för förfallna fakturor.',
    },
    category: 'finance',
    route: '/admin/partner-portal/invoices',
  },
  {
    id: 'billing_periods',
    title: { en: 'Billing Periods', sv: 'Faktureringsperioder' },
    content: {
      en: 'Define recurring billing cycles for subscription customers. Set up monthly, quarterly, or custom billing schedules. The system automatically generates invoices based on these periods.',
      sv: 'Definiera återkommande faktureringscykler för prenumerationskunder. Ställ in månatliga, kvartalsvisa eller anpassade faktureringsscheman. Systemet genererar automatiskt fakturor baserat på dessa perioder.',
    },
    category: 'finance',
    route: '/admin/partner-portal/billing-periods',
  },
  {
    id: 'credits_forecasts',
    title: { en: 'Credits & Forecasts', sv: 'Krediter & prognoser' },
    content: {
      en: 'Monitor customer credit balances, consumption rates, and revenue forecasts. View burn rate predictions and receive alerts when customers are running low on capacity.',
      sv: 'Övervaka kundkreditsaldon, förbrukningshastigheter och intäktsprognoser. Visa förbränningshastighetsförutsägelser och få varningar när kunder håller på att få slut på kapacitet.',
    },
    category: 'finance',
    route: '/admin/partner-portal/credits',
  },
  {
    id: 'margin_analysis',
    title: { en: 'Margin Analysis', sv: 'Marginalanalys' },
    content: {
      en: 'Analyze profitability across customers, projects, and partners. Compare billable rates against partner costs to optimize margin. Identify high-value engagements and cost optimization opportunities.',
      sv: 'Analysera lönsamhet över kunder, projekt och partners. Jämför fakturerbara priser mot partnerkostnader för att optimera marginal. Identifiera högvärdiga engagemang och kostnadsoptimeringsmöjligheter.',
    },
    category: 'finance',
    route: '/admin/partner-portal/margin-analysis',
  },
  {
    id: 'partner_management',
    title: { en: 'Partner Management', sv: 'Partnerhantering' },
    content: {
      en: 'Manage delivery partners, track their availability, skills, and performance. Assign partners to projects based on expertise and capacity. Monitor partner satisfaction and engagement quality.',
      sv: 'Hantera leveranspartners, spåra deras tillgänglighet, färdigheter och prestanda. Tilldela partners till projekt baserat på expertis och kapacitet. Övervaka partnertillfredsställelse och engagemangskvalitet.',
    },
    category: 'resources',
    route: '/admin/partner-portal/partner-management',
  },
  {
    id: 'capacity_planning',
    title: { en: 'Capacity Planning', sv: 'Kapacitetsplanering' },
    content: {
      en: 'Forecast capacity needs, manage resource allocation, and prevent over-commitment. The system highlights conflicts and suggests optimal partner assignments based on skills and availability.',
      sv: 'Prognostisera kapacitetsbehov, hantera resursallokering och förhindra överengagemang. Systemet markerar konflikter och föreslår optimala partnertilldelningar baserat på färdigheter och tillgänglighet.',
    },
    category: 'resources',
    route: '/admin/partner-portal/capacity',
  },
  {
    id: 'enterprise_dashboard',
    title: { en: 'Enterprise Dashboard', sv: 'Företagsinstrumentpanel' },
    content: {
      en: 'Executive-level view of business performance including revenue trends, customer lifetime value, churn risk, and strategic KPIs. AI-powered insights highlight opportunities and risks.',
      sv: 'Ledningsnivåvy av affärsprestanda inklusive intäktstrender, kundlivstidsvärde, churnrisk och strategiska KPI:er. AI-drivna insikter markerar möjligheter och risker.',
    },
    category: 'analytics',
    route: '/admin/partner-portal/enterprise',
  },
  {
    id: 'reports',
    title: { en: 'Reports', sv: 'Rapporter' },
    content: {
      en: 'Generate comprehensive reports on revenue, utilization, customer satisfaction, and operational efficiency. Export data in multiple formats for board presentations and stakeholder updates.',
      sv: 'Generera omfattande rapporter om intäkter, utnyttjande, kundtillfredsställelse och operativ effektivitet. Exportera data i flera format för styrelsepresentationer och intressentuppdateringar.',
    },
    category: 'analytics',
    route: '/admin/partner-portal/reports',
  },
  {
    id: 'contracts',
    title: { en: 'Contracts', sv: 'Kontrakt' },
    content: {
      en: 'Manage customer contracts including terms, pricing, capacity allocations, and renewal dates. Track contract performance and receive alerts before expiration.',
      sv: 'Hantera kundkontrakt inklusive villkor, prissättning, kapacitetstilldelningar och förnyelsedatum. Spåra kontraktsprestanda och få varningar före utgång.',
    },
    category: 'sales',
    route: '/admin/partner-portal/contracts',
  },
  {
    id: 'notes',
    title: { en: 'Notes & Documentation', sv: 'Anteckningar & dokumentation' },
    content: {
      en: 'Capture meeting notes, customer feedback, and important decisions. Notes are searchable and can be linked to specific customers, projects, or time periods.',
      sv: 'Fånga mötesanteckningar, kundfeedback och viktiga beslut. Anteckningar är sökbara och kan länkas till specifika kunder, projekt eller tidsperioder.',
    },
    category: 'delivery',
    route: '/admin/partner-portal/notes',
  },
  {
    id: 'leads_management',
    title: { en: 'Lead Management', sv: 'Leadhantering' },
    content: {
      en: 'Track incoming leads from website forms, manage lead qualification, and convert opportunities to customers. Monitor lead sources and conversion rates to optimize marketing spend.',
      sv: 'Spåra inkommande leads från webbplatsformulär, hantera leadkvalificering och konvertera möjligheter till kunder. Övervaka leadkällor och konverteringsgrader för att optimera marknadsföringsutgifter.',
    },
    category: 'sales',
    route: '/admin/partner-portal/leads-management',
  },
];

export const getHelpContent = (id: string, language: 'en' | 'sv' = 'en'): HelpSection | undefined => {
  const section = helpContent.find(h => h.id === id);
  if (!section) return undefined;

  return section;
};

export const getHelpByCategory = (category: string): HelpSection[] => {
  return helpContent.filter(h => h.category === category);
};

export const getHelpByRoute = (route: string): HelpSection[] => {
  return helpContent.filter(h => h.route === route);
};
