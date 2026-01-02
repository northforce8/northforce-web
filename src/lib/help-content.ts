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
  {
    id: 'growth_plans',
    title: { en: 'Growth Plans', sv: 'Tillväxtplaner' },
    content: {
      en: 'Create and manage strategic growth plans for customers. Define vision, mission, and time horizons. Track overall progress and link to specific growth objectives. Growth plans provide a structured framework for customer success.',
      sv: 'Skapa och hantera strategiska tillväxtplaner för kunder. Definiera vision, mission och tidshorisonter. Spåra övergripande framsteg och länka till specifika tillväxtmål. Tillväxtplaner ger ett strukturerat ramverk för kundframgång.',
    },
    category: 'growth',
    route: '/admin/partner-portal/growth-plans',
  },
  {
    id: 'growth_objectives',
    title: { en: 'Growth Objectives', sv: 'Tillväxtmål' },
    content: {
      en: 'Define measurable objectives within growth plans. Set baselines, targets, and track progress. Objectives can be categorized by revenue, market share, operational efficiency, and more. Each objective can have multiple initiatives to achieve the goal.',
      sv: 'Definiera mätbara mål inom tillväxtplaner. Ställ in baslinjer, mål och spåra framsteg. Mål kan kategoriseras efter intäkter, marknadsandel, operativ effektivitet och mer. Varje mål kan ha flera initiativ för att uppnå målet.',
    },
    category: 'growth',
    route: '/admin/partner-portal/growth-plans',
  },
  {
    id: 'growth_initiatives',
    title: { en: 'Growth Initiatives', sv: 'Tillväxtinitiativ' },
    content: {
      en: 'Concrete initiatives to achieve growth objectives. Link initiatives to projects, assign partners, and track credit consumption. Monitor deliverables and completion status. Initiatives bridge strategy and execution.',
      sv: 'Konkreta initiativ för att uppnå tillväxtmål. Länka initiativ till projekt, tilldela partners och spåra kreditförbrukning. Övervaka leveranser och slutförandestatus. Initiativ överbryggar strategi och genomförande.',
    },
    category: 'growth',
    route: '/admin/partner-portal/growth-plans',
  },
  {
    id: 'leadership_assessments',
    title: { en: 'Leadership Assessments', sv: 'Ledarskapsbe­dömningar' },
    content: {
      en: 'Launch 360-degree leadership assessment campaigns. Evaluate participants across 10 core competencies using multi-rater feedback. Track completion rates and generate development plans based on assessment results.',
      sv: 'Starta 360-graders ledarskaps­bedömnings­kampanjer. Utvärdera deltagare över 10 kärnkompetenser med hjälp av multi-rater-feedback. Spåra slutförandegrad och generera utvecklingsplaner baserat på bedömningsresultat.',
    },
    category: 'leadership',
    route: '/admin/partner-portal/leadership-assessments',
  },
  {
    id: 'leadership_competencies',
    title: { en: 'Leadership Competencies', sv: 'Ledarskaps­kompetenser' },
    content: {
      en: 'Core competency framework includes Strategic Thinking, Decision Making, Communication, People Development, Change Leadership, Execution Excellence, Innovation, Emotional Intelligence, Collaboration, and Financial Acumen. Each competency has 5 proficiency levels.',
      sv: 'Kärnkompetensramverket inkluderar Strategiskt tänkande, Beslutsfattande, Kommunikation, Människoutveckling, Förändringsledarskap, Genomförandeexcellens, Innovation, Emotionell intelligens, Samarbete och Finansiell förståelse. Varje kompetens har 5 färdighetsnivåer.',
    },
    category: 'leadership',
    route: '/admin/partner-portal/leadership-assessments',
  },
  {
    id: 'development_plans',
    title: { en: 'Development Plans', sv: 'Utvecklingsplaner' },
    content: {
      en: 'Personal Development Plans (PDPs) help leaders grow systematically. Identify key strengths and development areas from assessments. Define development actions with target dates and track progress. Schedule regular reviews to ensure continuous improvement.',
      sv: 'Personliga utvecklingsplaner (PDP:er) hjälper ledare att växa systematiskt. Identifiera nyckelstyrkor och utvecklingsområden från bedömningar. Definiera utvecklingsåtgärder med måldatum och spåra framsteg. Schemalägg regelbundna granskningar för att säkerställa kontinuerlig förbättring.',
    },
    category: 'leadership',
    route: '/admin/partner-portal/leadership-assessments',
  },
  {
    id: 'marketing_campaigns',
    title: { en: 'Marketing Campaigns', sv: 'Marknadsförings­kampanjer' },
    content: {
      en: 'Plan, execute, and track marketing campaigns for customers. Define objectives, target audiences, budgets, and timelines. Monitor leads generated, conversions, and ROI. Link campaigns to projects for seamless delivery tracking.',
      sv: 'Planera, genomför och spåra marknadsföringskampanjer för kunder. Definiera mål, målgrupper, budgetar och tidslinjer. Övervaka genererade leads, konverteringar och ROI. Länka kampanjer till projekt för sömlös leveransspårning.',
    },
    category: 'marketing',
    route: '/admin/partner-portal/marketing-campaigns',
  },
  {
    id: 'campaign_activities',
    title: { en: 'Campaign Activities', sv: 'Kampanjaktiviteter' },
    content: {
      en: 'Break down campaigns into specific activities (content, ads, email, social, events). Assign activities to partners, track credit and budget consumption. Log deliverables and completion dates. Activities provide granular execution tracking.',
      sv: 'Dela upp kampanjer i specifika aktiviteter (innehåll, annonser, e-post, socialt, evenemang). Tilldela aktiviteter till partners, spåra kredit- och budgetförbrukning. Logga leveranser och slutförandedatum. Aktiviteter ger detaljerad genomförandespårning.',
    },
    category: 'marketing',
    route: '/admin/partner-portal/marketing-campaigns',
  },
  {
    id: 'campaign_results',
    title: { en: 'Campaign Results', sv: 'Kampanjresultat' },
    content: {
      en: 'Track campaign performance metrics: impressions, clicks, leads, conversions, engagement rates. Log results at campaign or activity level. Analyze performance trends to optimize future campaigns. Data-driven marketing decisions start here.',
      sv: 'Spåra kampanjprestandamått: visningar, klick, leads, konverteringar, engagemangsgrader. Logga resultat på kampanj- eller aktivitetsnivå. Analysera prestandatrender för att optimera framtida kampanjer. Datadrivna marknadsföringsbeslut börjar här.',
    },
    category: 'marketing',
    route: '/admin/partner-portal/marketing-campaigns',
  },
  {
    id: 'business_models',
    title: { en: 'Business Models', sv: 'Affärsmodeller' },
    content: {
      en: 'Document customer business models using Business Model Canvas framework. Define value proposition, customer segments, channels, revenue streams, cost structure, and more. Version control ensures historical tracking. Strategic alignment starts with understanding the business model.',
      sv: 'Dokumentera kundaffärsmodeller med hjälp av Business Model Canvas-ramverket. Definiera värdeförslag, kundsegment, kanaler, intäktsströmmar, kostnadsstruktur och mer. Versionskontroll säkerställer historisk spårning. Strategisk anpassning börjar med att förstå affärsmodellen.',
    },
    category: 'strategy',
    route: '/admin/partner-portal/business-models',
  },
  {
    id: 'strategic_goals',
    title: { en: 'Strategic Goals', sv: 'Strategiska mål' },
    content: {
      en: 'Set high-level strategic goals for customers: revenue, margin, market share, customer satisfaction, employee engagement, innovation. Track baseline, current, and target values. Link goals to growth plans. Monitor goal achievement status and receive alerts for at-risk goals.',
      sv: 'Ställ in högnivå strategiska mål för kunder: intäkter, marginal, marknadsandel, kundtillfredsställelse, medarbetarengagemang, innovation. Spåra baslinje, nuvarande och målvärden. Länka mål till tillväxtplaner. Övervaka måluppnåendestatus och få varningar för riskabla mål.',
    },
    category: 'strategy',
    route: '/admin/partner-portal/strategic-goals',
  },
  {
    id: 'financial_snapshots',
    title: { en: 'Financial Snapshots', sv: 'Finansiella ögonblicksbilder' },
    content: {
      en: 'Capture periodic financial performance: revenue, costs, margins, EBITDA. Link financial data to projects and campaigns to understand ROI. Monthly, quarterly, and annual snapshots provide trend analysis. Connect operational activities to financial outcomes.',
      sv: 'Fånga periodisk finansiell prestanda: intäkter, kostnader, marginaler, EBITDA. Länka finansiell data till projekt och kampanjer för att förstå ROI. Månatliga, kvartalsvisa och årliga ögonblicksbilder ger trendanalys. Koppla operativa aktiviteter till finansiella resultat.',
    },
    category: 'strategy',
    route: '/admin/partner-portal/financial-snapshots',
  },
  {
    id: 'methodology_templates',
    title: { en: 'Methodology Templates', sv: 'Metodmallar' },
    content: {
      en: 'Reusable project templates for common engagement types: growth strategy, leadership development, marketing excellence, operational transformation. Templates include phases, deliverables, typical duration, and credit estimates. Accelerate project setup and ensure consistent delivery quality.',
      sv: 'Återanvändbara projektmallar för vanliga engagemangstyper: tillväxtstrategi, ledarutveckling, marknadsföringsexcellens, operativ transformation. Mallar inkluderar faser, leveranser, typisk varaktighet och kredituppskattningar. Påskynda projektuppstart och säkerställ konsekvent leveranskvalitet.',
    },
    category: 'knowledge',
    route: '/admin/partner-portal/methodology-templates',
  },
  {
    id: 'best_practices',
    title: { en: 'Best Practices', sv: 'Bästa praxis' },
    content: {
      en: 'Knowledge base of proven approaches and methodologies. Each practice includes description, when to use, tools needed, expected outcomes, and case study references. Organized by category. Capture institutional knowledge and enable rapid skill transfer across the organization.',
      sv: 'Kunskapsbas med beprövade tillvägagångssätt och metoder. Varje praxis inkluderar beskrivning, när den ska användas, verktyg som behövs, förväntade resultat och fallstudiehänvisningar. Organiserad efter kategori. Fånga institutionell kunskap och möjliggör snabb kompetensöverföring över organisationen.',
    },
    category: 'knowledge',
    route: '/admin/partner-portal/best-practices',
  },
  {
    id: 'customer_growth_journey',
    title: { en: 'My Growth Journey', sv: 'Min tillväxtresa' },
    content: {
      en: 'View your strategic growth plan, objectives, and initiatives. Track progress towards goals in real-time. See linked projects and deliverables. Transparent view of consultant activities aligned with your business goals.',
      sv: 'Visa din strategiska tillväxtplan, mål och initiativ. Spåra framsteg mot mål i realtid. Se länkade projekt och leveranser. Transparent vy av konsultaktiviteter anpassade till dina affärsmål.',
    },
    category: 'customer',
    route: '/customer/portal/growth',
  },
  {
    id: 'customer_leadership',
    title: { en: 'Leadership Development', sv: 'Ledarutveckling' },
    content: {
      en: 'Access your leadership assessment results, development plan, and progress tracking. View competency scores across 10 core leadership areas. Track completion of development actions and schedule review meetings.',
      sv: 'Få tillgång till dina ledarskaps­bedömningsresultat, utvecklingsplan och framstegsspårning. Visa kompetenspoäng över 10 ledarskapskärnområden. Spåra slutförande av utvecklingsåtgärder och schemalägg granskningsmöten.',
    },
    category: 'customer',
    route: '/customer/portal/leadership',
  },
  {
    id: 'customer_campaigns',
    title: { en: 'Marketing Performance', sv: 'Marknadsföringsprestanda' },
    content: {
      en: 'Review active and completed marketing campaigns. Approve campaign plans before execution. Track budget consumption, leads generated, and ROI in real-time. Transparent marketing execution with measurable results.',
      sv: 'Granska aktiva och slutförda marknadsföringskampanjer. Godkänn kampanjplaner före genomförande. Spåra budgetförbrukning, genererade leads och ROI i realtid. Transparent marknadsföringsgenomförande med mätbara resultat.',
    },
    category: 'customer',
    route: '/customer/portal/campaigns',
  },
  {
    id: 'customer_business_health',
    title: { en: 'Business Health', sv: 'Affärshälsa' },
    content: {
      en: 'Dashboard view of your business performance: strategic goals progress, financial snapshots, project status. See how consulting engagements connect to business outcomes. Data-driven visibility into ROI and value delivery.',
      sv: 'Instrumentpanelvy av din affärsprestanda: strategiska målframsteg, finansiella ögonblicksbilder, projektstatus. Se hur konsultengagemang kopplar till affärsresultat. Datadriven synlighet i ROI och värdeleverans.',
    },
    category: 'customer',
    route: '/customer/portal/business-health',
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
