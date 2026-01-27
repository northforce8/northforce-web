import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Target,
  TrendingUp,
  Users,
  Zap,
  Search,
  LineChart,
  CheckCircle,
  AlertCircle,
  Layers,
  Code,
  Sparkles,
  BarChart3,
  Globe,
  Lock,
  Rocket,
  CreditCard,
  Calendar,
  Mail,
  ShoppingCart,
  Package,
  Star,
  Smartphone,
  Database,
  Shield,
  Gauge
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SEOHead from '../components/SEOHead';

const StrategicWebsitesPage = () => {
  const { language } = useLanguage();

  const challenges = [
    {
      icon: <AlertCircle className="h-8 w-8" />,
      title: language === 'sv' ? 'Statiska skyltfönster' : 'Static Showpieces',
      description: language === 'sv'
        ? 'Vackra men passiva webbplatser som inte aktivt driver affär eller genererar leads.'
        : 'Beautiful but passive websites that don\'t actively drive business or generate leads.',
    },
    {
      icon: <AlertCircle className="h-8 w-8" />,
      title: language === 'sv' ? 'Mallbaserade begränsningar' : 'Template Limitations',
      description: language === 'sv'
        ? 'Generiska lösningar som inte differentierar eller speglar er unika affärsstrategi.'
        : 'Generic solutions that don\'t differentiate or reflect your unique business strategy.',
    },
    {
      icon: <AlertCircle className="h-8 w-8" />,
      title: language === 'sv' ? 'Saknad affärslogik' : 'Missing Business Logic',
      description: language === 'sv'
        ? 'Design utan strategi – ingen koppling mellan innehåll, UX och faktiska affärsmål.'
        : 'Design without strategy – no connection between content, UX and actual business goals.',
    },
  ];

  const approach = [
    {
      icon: <Target className="h-10 w-10" />,
      title: language === 'sv' ? 'Affärsstrategi först' : 'Business Strategy First',
      description: language === 'sv'
        ? 'Vi börjar med era affärsmål, målgrupper och konkurrenssituation. Varje beslut kopplas till mätbara affärsresultat.'
        : 'We start with your business goals, target audiences and competitive landscape. Every decision ties to measurable business outcomes.',
      details: language === 'sv'
        ? [
            'Målgruppsanalys och buyer personas',
            'Konkurrensintelligens och positionering',
            'Värdeerbjudande och messaging framework',
            'Konverteringsmål och KPI-struktur',
          ]
        : [
            'Target audience analysis and buyer personas',
            'Competitive intelligence and positioning',
            'Value proposition and messaging framework',
            'Conversion goals and KPI structure',
          ],
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: language === 'sv' ? 'Konverteringsfokuserad UX' : 'Conversion-Focused UX',
      description: language === 'sv'
        ? 'Användarvänlighet designad för att leda besökare mot beslutspunkter. Varje element har en strategisk funktion.'
        : 'User experience designed to guide visitors toward decision points. Every element serves a strategic function.',
      details: language === 'sv'
        ? [
            'Informationsarkitektur för köpbeslut',
            'Conversion-optimerade user flows',
            'Trust-building och social proof',
            'Clear calls-to-action i varje fas',
          ]
        : [
            'Information architecture for purchase decisions',
            'Conversion-optimized user flows',
            'Trust-building and social proof',
            'Clear calls-to-action at every stage',
          ],
    },
    {
      icon: <Search className="h-10 w-10" />,
      title: language === 'sv' ? 'SEO & EEAT-anpassning' : 'SEO & EEAT Optimization',
      description: language === 'sv'
        ? 'Byggd för synlighet och trovärdighet. Teknisk SEO, innehållsstrategi och expertis-signaler från grunden.'
        : 'Built for visibility and credibility. Technical SEO, content strategy and expertise signals from the ground up.',
      details: language === 'sv'
        ? [
            'Teknisk SEO-arkitektur',
            'EEAT-signaler (Experience, Expertise, Authority, Trust)',
            'Semantisk innehållsstruktur',
            'Schema markup och rich snippets',
          ]
        : [
            'Technical SEO architecture',
            'EEAT signals (Experience, Expertise, Authority, Trust)',
            'Semantic content structure',
            'Schema markup and rich snippets',
          ],
    },
    {
      icon: <Code className="h-10 w-10" />,
      title: language === 'sv' ? 'Custom-byggd grund' : 'Custom-Built Foundation',
      description: language === 'sv'
        ? 'Ingen mallar eller teman. Varje webbplats byggs från grunden för optimal prestanda, flexibilitet och skalbarhet.'
        : 'No templates or themes. Every website built from scratch for optimal performance, flexibility and scalability.',
      details: language === 'sv'
        ? [
            'Headless CMS för maximal flexibilitet',
            'Modern stack (React, TypeScript, Next.js)',
            'Prestanda-optimerad (Core Web Vitals)',
            'Säkerhet och GDPR by design',
          ]
        : [
            'Headless CMS for maximum flexibility',
            'Modern stack (React, TypeScript, Next.js)',
            'Performance-optimized (Core Web Vitals)',
            'Security and GDPR by design',
          ],
    },
  ];

  const outcomes = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: language === 'sv' ? 'Högre konvertering' : 'Higher Conversion',
      description: language === 'sv'
        ? 'Strategisk UX och tydliga värdeerbjudanden som leder till fler leads och affärer.'
        : 'Strategic UX and clear value propositions leading to more leads and deals.',
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: language === 'sv' ? 'Starkare synlighet' : 'Stronger Visibility',
      description: language === 'sv'
        ? 'SEO-optimerad struktur som rankar för relevanta söktermer och attraherar rätt målgrupp.'
        : 'SEO-optimized structure that ranks for relevant search terms and attracts the right audience.',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: language === 'sv' ? 'Byggd trovärdighet' : 'Built Credibility',
      description: language === 'sv'
        ? 'EEAT-signaler och professionell presentation som stärker förtroende och expertposition.'
        : 'EEAT signals and professional presentation strengthening trust and expert positioning.',
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: language === 'sv' ? 'Snabbare time-to-market' : 'Faster Time-to-Market',
      description: language === 'sv'
        ? 'Effektiv process med tydliga milstolpar – från koncept till live på veckor, inte månader.'
        : 'Efficient process with clear milestones – from concept to live in weeks, not months.',
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: language === 'sv' ? 'Skalbar plattform' : 'Scalable Platform',
      description: language === 'sv'
        ? 'Flexibel arkitektur som växer med er affär och enkelt integreras med andra system.'
        : 'Flexible architecture that grows with your business and easily integrates with other systems.',
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: language === 'sv' ? 'Mätbar ROI' : 'Measurable ROI',
      description: language === 'sv'
        ? 'Inbyggd analytics och tracking för att kontinuerligt optimera prestanda och affärsresultat.'
        : 'Built-in analytics and tracking to continuously optimize performance and business results.',
    },
  ];

  const capabilities = [
    {
      title: language === 'sv' ? 'B2B Enterprise' : 'B2B Enterprise',
      description: language === 'sv'
        ? 'Komplexa säljcykler, multiple buyer personas, och fokus på lead nurturing och trust-building.'
        : 'Complex sales cycles, multiple buyer personas, and focus on lead nurturing and trust-building.',
    },
    {
      title: language === 'sv' ? 'B2C E-commerce' : 'B2C E-commerce',
      description: language === 'sv'
        ? 'Konverteringsoptimerad shopping experience med personalisering och seamless checkout.'
        : 'Conversion-optimized shopping experience with personalization and seamless checkout.',
    },
    {
      title: language === 'sv' ? 'Professional Services' : 'Professional Services',
      description: language === 'sv'
        ? 'Expertis-signaler, case studies, och content marketing för att bygga auktoritet och attrahera klienter.'
        : 'Expertise signals, case studies, and content marketing to build authority and attract clients.',
    },
    {
      title: language === 'sv' ? 'SaaS & Tech' : 'SaaS & Tech',
      description: language === 'sv'
        ? 'Produktfokuserade webbplatser med demos, trials och self-service onboarding.'
        : 'Product-focused websites with demos, trials and self-service onboarding.',
    },
  ];

  const differentiators = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: language === 'sv' ? 'Strategisk integration' : 'Strategic Integration',
      description: language === 'sv'
        ? 'Webbplatsen är en del av er totala go-to-market strategi – inte ett isolerat projekt.'
        : 'The website is part of your total go-to-market strategy – not an isolated project.',
    },
    {
      icon: <LineChart className="h-6 w-6" />,
      title: language === 'sv' ? 'Kontinuerlig optimering' : 'Continuous Optimization',
      description: language === 'sv'
        ? 'Data-driven förbättringar baserat på user behavior, A/B-testing och affärsresultat.'
        : 'Data-driven improvements based on user behavior, A/B testing and business results.',
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: language === 'sv' ? 'Enterprise-grade säkerhet' : 'Enterprise-Grade Security',
      description: language === 'sv'
        ? 'GDPR-compliance, säkerhetsstandarder och uptime-garantier som stödjer mission-critical operations.'
        : 'GDPR compliance, security standards and uptime guarantees supporting mission-critical operations.',
    },
  ];

  const technicalCapabilities = [
    {
      icon: <Gauge className="h-8 w-8" />,
      title: language === 'sv' ? 'Modern & Framtidssäkrad' : 'Modern & Future-Proof',
      description: language === 'sv'
        ? 'Byggd på senaste teknologi för snabbast möjliga laddningstider och optimal användarupplevelse.'
        : 'Built on latest technology for fastest possible load times and optimal user experience.',
    },
    {
      icon: <Layers className="h-8 w-8" />,
      title: language === 'sv' ? 'Dynamiska Sidor' : 'Dynamic Pages',
      description: language === 'sv'
        ? 'Flexibel struktur som växer med er affär – enkelt att lägga till nya sidor, produkter och innehåll.'
        : 'Flexible structure that grows with your business – easy to add new pages, products and content.',
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: language === 'sv' ? 'Kalenderbokning' : 'Calendar Booking',
      description: language === 'sv'
        ? 'Direktintegrerad bokningsfunktion som automatiskt synkar med ert kalendersystem.'
        : 'Direct integrated booking functionality that automatically syncs with your calendar system.',
    },
    {
      icon: <Mail className="h-8 w-8" />,
      title: language === 'sv' ? 'Nyhetsbrev & CRM' : 'Newsletter & CRM',
      description: language === 'sv'
        ? 'Lead capture och automatisk synkning med ert CRM-system för seamless försäljningsprocess.'
        : 'Lead capture and automatic CRM sync for seamless sales process.',
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: language === 'sv' ? 'Direktförsäljning' : 'Direct Sales',
      description: language === 'sv'
        ? 'Säker kortbetalning via Stripe standard på hela webbplatsen – ta betalt direkt för tjänster eller produkter.'
        : 'Secure card payments via Stripe standard across the entire website – accept payments directly for services or products.',
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: language === 'sv' ? 'Mobil-först' : 'Mobile-First',
      description: language === 'sv'
        ? 'Perfekt anpassad för alla enheter – från smartphone till desktop.'
        : 'Perfectly adapted for all devices – from smartphone to desktop.',
    },
  ];

  const pricingPackages = [
    {
      name: language === 'sv' ? 'Foundation' : 'Foundation',
      tagline: language === 'sv' ? 'Snabb lansering' : 'Quick Launch',
      price: language === 'sv' ? 'från 89 000 kr' : 'from €7,900',
      description: language === 'sv'
        ? 'Perfekt för mindre bolag som vill etablera professionell närvaro och börja generera leads online.'
        : 'Perfect for smaller companies wanting to establish professional presence and start generating leads online.',
      features: language === 'sv'
        ? [
            'Upp till 8 sidor',
            'Strategisk struktur & UX-design',
            'SEO-grundoptimering',
            'Mobil-responsiv design',
            'Kontaktformulär & lead capture',
            'Google Analytics integration',
            'CMS för enkel redigering',
            ' 30 dagars support efter lansering',
          ]
        : [
            'Up to 8 pages',
            'Strategic structure & UX design',
            'Basic SEO optimization',
            'Mobile-responsive design',
            'Contact forms & lead capture',
            'Google Analytics integration',
            'CMS for easy editing',
            '30 days post-launch support',
          ],
      ideal: language === 'sv' ? 'Startups, lokala företag, konsulter' : 'Startups, local businesses, consultants',
      cta: language === 'sv' ? 'Boka Möte' : 'Book Meeting',
    },
    {
      name: language === 'sv' ? 'Growth' : 'Growth',
      tagline: language === 'sv' ? 'Skalbar tillväxt' : 'Scalable Growth',
      price: language === 'sv' ? 'från 189 000 kr' : 'from €16,900',
      description: language === 'sv'
        ? 'För växande bolag som behöver avancerad funktionalitet, integrationer och aktiv leadgenerering.'
        : 'For growing companies needing advanced functionality, integrations and active lead generation.',
      features: language === 'sv'
        ? [
            'Upp till 20 sidor',
            'Avancerad UX & konverteringsoptimering',
            'Omfattande SEO & EEAT-optimering',
            'Kalenderbokning-integration',
            'CRM/Marketing automation-integration',
            'Stripe-betalningar för direktförsäljning',
            'A/B-testing setup',
            'Multi-språkstöd',
            '3 månaders support & optimering',
          ]
        : [
            'Up to 20 pages',
            'Advanced UX & conversion optimization',
            'Comprehensive SEO & EEAT optimization',
            'Calendar booking integration',
            'CRM/Marketing automation integration',
            'Stripe payments for direct sales',
            'A/B testing setup',
            'Multi-language support',
            '3 months support & optimization',
          ],
      ideal: language === 'sv' ? 'SMB, B2B-bolag, professionella tjänster' : 'SMB, B2B companies, professional services',
      cta: language === 'sv' ? 'Boka Möte' : 'Book Meeting',
      popular: true,
    },
    {
      name: language === 'sv' ? 'Scale / Enterprise' : 'Scale / Enterprise',
      tagline: language === 'sv' ? 'Skräddarsytt' : 'Custom Built',
      price: language === 'sv' ? 'Offert' : 'Quote',
      description: language === 'sv'
        ? 'Fullständigt skräddarsydd lösning för enterprise-bolag med komplexa krav och integrationer.'
        : 'Fully custom solution for enterprise companies with complex requirements and integrations.',
      features: language === 'sv'
        ? [
            'Obegränsat antal sidor',
            'Custom funktionalitet & affärslogik',
            'Enterprise SEO-strategi',
            'Avancerade integrationer (ERP, CRM, etc)',
            'Multi-site & internationalisering',
            'Headless architecture',
            'Dedicerad projektledning',
            'API-utveckling',
            'SLA & continuous support',
          ]
        : [
            'Unlimited pages',
            'Custom functionality & business logic',
            'Enterprise SEO strategy',
            'Advanced integrations (ERP, CRM, etc)',
            'Multi-site & internationalization',
            'Headless architecture',
            'Dedicated project management',
            'API development',
            'SLA & continuous support',
          ],
      ideal: language === 'sv' ? 'Enterprise, multinationella bolag' : 'Enterprise, multinational companies',
      cta: language === 'sv' ? 'Begär Offert' : 'Request Quote',
    },
  ];

  const webshopFeatures = [
    {
      icon: <ShoppingCart className="h-8 w-8" />,
      title: language === 'sv' ? 'Konverteringsoptimerad Checkout' : 'Conversion-Optimized Checkout',
      description: language === 'sv'
        ? 'Friktionsfri köpprocess som minimerar cart abandonment och maximerar försäljning.'
        : 'Frictionless purchase process minimizing cart abandonment and maximizing sales.',
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: language === 'sv' ? 'Produkthantering' : 'Product Management',
      description: language === 'sv'
        ? 'Enkelt att lägga till, redigera och organisera produkter med varianter, priser och lagerstatus.'
        : 'Easy to add, edit and organize products with variants, pricing and inventory status.',
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: language === 'sv' ? 'Stripe-betalningar' : 'Stripe Payments',
      description: language === 'sv'
        ? 'Säkra kortbetalningar, prenumerationer och internationella transaktioner helt integrerat.'
        : 'Secure card payments, subscriptions and international transactions fully integrated.',
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: language === 'sv' ? 'Försäljningsanalys' : 'Sales Analytics',
      description: language === 'sv'
        ? 'Real-time insikter om försäljning, kundvärde och produktprestanda.'
        : 'Real-time insights on sales, customer value and product performance.',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: language === 'sv' ? 'Kundkonton' : 'Customer Accounts',
      description: language === 'sv'
        ? 'Personaliserad upplevelse med orderhistorik, sparade adresser och önskelistor.'
        : 'Personalized experience with order history, saved addresses and wishlists.',
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: language === 'sv' ? 'Mobil Shopping' : 'Mobile Shopping',
      description: language === 'sv'
        ? 'Optimerad för mobilhandel där majoriteten av försäljningen sker.'
        : 'Optimized for mobile commerce where majority of sales happen.',
    },
  ];

  return (
    <>
      <SEOHead
        title={language === 'sv' ? 'Strategiska Webbplatser som Driver Affär | NorthForce' : 'Strategic Websites That Drive Business | NorthForce'}
        description={language === 'sv'
          ? 'Custom-byggda, konverteringsfokuserade webbplatser för tillväxtbolag. Ingen mallar – strategisk UX, SEO-optimering och affärsdrivande design från grunden.'
          : 'Custom-built, conversion-focused websites for growth companies. No templates – strategic UX, SEO optimization and business-driving design from the ground up.'}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-accent-cyan/5"></div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-6">
                <Globe className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-medium text-primary-600">
                  {language === 'sv' ? 'Webbplatser som Affärsmotor' : 'Websites as Business Engine'}
                </span>
              </div>

              <h1 className="font-heading text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                {language === 'sv' ? 'Din Webbplats Ska ' : 'Your Website Should '}
                <span className="bg-gradient-to-r from-primary-600 to-accent-cyan bg-clip-text text-transparent">
                  {language === 'sv' ? 'Driva Affär' : 'Drive Business'}
                </span>
                <br />
                {language === 'sv' ? 'Inte Bara Existera' : 'Not Just Exist'}
              </h1>

              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                {language === 'sv'
                  ? 'Custom-byggda, strategiska webbplatser som fungerar som centrala nav för tillväxt, försäljning och förtroende. Ingen mallar – varje element designat för att aktivt driva affärsresultat.'
                  : 'Custom-built, strategic websites functioning as central hubs for growth, sales and trust. No templates – every element designed to actively drive business results.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/audit"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-cyan text-white rounded-2xl hover:shadow-glow transition-all duration-300 font-semibold text-lg transform hover:scale-105"
                >
                  {language === 'sv' ? 'Boka Strategisession' : 'Book Strategy Session'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:border-primary-600 hover:text-primary-600 transition-all duration-300 font-semibold text-lg"
                >
                  {language === 'sv' ? 'Se Exempel' : 'View Examples'}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl font-bold text-gray-900 mb-4">
                {language === 'sv' ? 'Varför Traditionella Webbplatser' : 'Why Traditional Websites'}
                <span className="block text-red-600">
                  {language === 'sv' ? 'Misslyckas Med Att Driva Affär' : 'Fail to Drive Business'}
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {language === 'sv'
                  ? 'De flesta webbplatser är vackra men passiva. De missar affärsmöjligheter varje dag.'
                  : 'Most websites are beautiful but passive. They miss business opportunities every day.'}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {challenges.map((challenge, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-soft border border-gray-100">
                  <div className="text-red-500 mb-4">{challenge.icon}</div>
                  <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">
                    {challenge.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {challenge.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Approach Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl font-bold text-gray-900 mb-4">
                {language === 'sv' ? 'Vår Strategiska Metod' : 'Our Strategic Approach'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {language === 'sv'
                  ? 'Fyra pelare som säkerställer att varje webbplats aktivt driver affärsresultat.'
                  : 'Four pillars ensuring every website actively drives business results.'}
              </p>
            </div>

            <div className="space-y-12">
              {approach.map((item, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 md:p-12 shadow-soft border border-gray-100">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-cyan/20 rounded-2xl flex items-center justify-center text-primary-600">
                        {item.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-2xl font-bold text-gray-900 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {item.details.map((detail, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-accent-emerald flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Architecture Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-6">
                <Code className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-medium text-primary-600">
                  {language === 'sv' ? 'Teknisk Grund' : 'Technical Foundation'}
                </span>
              </div>
              <h2 className="font-heading text-4xl font-bold text-gray-900 mb-4">
                {language === 'sv' ? 'Byggd För Försäljning & Skalning' : 'Built For Sales & Scaling'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {language === 'sv'
                  ? 'Modern arkitektur som möjliggör affärsautomation, direktförsäljning och tillväxt från dag ett.'
                  : 'Modern architecture enabling business automation, direct sales and growth from day one.'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {technicalCapabilities.map((capability, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-soft border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-accent-cyan/20 rounded-xl flex items-center justify-center text-primary-600 mb-4">
                    {capability.icon}
                  </div>
                  <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">
                    {capability.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {capability.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-gradient-to-r from-primary-600 to-accent-cyan rounded-2xl p-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <CreditCard className="h-6 w-6 text-white" />
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-3">
                {language === 'sv' ? 'Stripe Kortbetalning – Standard På Alla Webbplatser' : 'Stripe Card Payments – Standard On All Websites'}
              </h3>
              <p className="text-white/90 text-lg max-w-3xl mx-auto">
                {language === 'sv'
                  ? 'Säker, PCI-compliant kortbetalning integrerad från start. Ta betalt för tjänster, produkter eller prenumerationer direkt på er webbplats.'
                  : 'Secure, PCI-compliant card payments integrated from the start. Accept payments for services, products or subscriptions directly on your website.'}
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Packages Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-6">
                <Package className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-medium text-primary-600">
                  {language === 'sv' ? 'Tydlig Paketering' : 'Clear Packaging'}
                </span>
              </div>
              <h2 className="font-heading text-4xl font-bold text-gray-900 mb-4">
                {language === 'sv' ? 'Välj Rätt Ambitionsnivå' : 'Choose the Right Ambition Level'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {language === 'sv'
                  ? 'Transparenta paket från snabb lansering till enterprise-lösningar. Alla priser exkl. moms.'
                  : 'Transparent packages from quick launch to enterprise solutions. All prices exclude VAT.'}
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {pricingPackages.map((pkg, index) => (
                <div
                  key={index}
                  className={`relative bg-white rounded-2xl shadow-soft border-2 transition-all hover:shadow-xl ${
                    pkg.popular ? 'border-primary-600 lg:-mt-4' : 'border-gray-200'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-primary-600 to-accent-cyan text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        {language === 'sv' ? 'Populärast' : 'Most Popular'}
                      </div>
                    </div>
                  )}

                  <div className="p-8">
                    <div className="mb-6">
                      <h3 className="font-heading text-2xl font-bold text-gray-900 mb-2">
                        {pkg.name}
                      </h3>
                      <p className="text-primary-600 font-medium mb-4">{pkg.tagline}</p>
                      <div className="text-4xl font-black text-gray-900 mb-2">{pkg.price}</div>
                      <p className="text-gray-600 text-sm leading-relaxed">{pkg.description}</p>
                    </div>

                    <div className="mb-8">
                      <div className="text-sm font-semibold text-gray-900 mb-3">
                        {language === 'sv' ? 'Inkluderat:' : 'Included:'}
                      </div>
                      <ul className="space-y-3">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-accent-emerald flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                      <div className="text-xs font-semibold text-gray-600 mb-1">
                        {language === 'sv' ? 'Idealisk för:' : 'Ideal for:'}
                      </div>
                      <div className="text-sm text-gray-900">{pkg.ideal}</div>
                    </div>

                    <Link
                      to="/contact"
                      className={`block w-full text-center px-6 py-4 rounded-xl font-semibold transition-all ${
                        pkg.popular
                          ? 'bg-gradient-to-r from-primary-600 to-accent-cyan text-white hover:shadow-glow'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      {pkg.cta}
                      <ArrowRight className="inline-block ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">
                {language === 'sv'
                  ? 'Alla paket inkluderar Stripe-betalningar, GDPR-compliance och 99.9% uptime-garanti.'
                  : 'All packages include Stripe payments, GDPR compliance and 99.9% uptime guarantee.'}
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-accent-cyan font-semibold transition-colors"
              >
                {language === 'sv' ? 'Behöver du något helt anpassat?' : 'Need something completely custom?'}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Webshop Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
                <ShoppingCart className="h-4 w-4 text-accent-cyan" />
                <span className="text-sm font-medium text-accent-cyan">
                  {language === 'sv' ? 'E-handel & Webbshop' : 'E-commerce & Webshop'}
                </span>
              </div>
              <h2 className="font-heading text-4xl font-bold mb-4">
                {language === 'sv' ? 'Skalbar E-handel Integrerad i Er Affär' : 'Scalable E-commerce Integrated Into Your Business'}
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                {language === 'sv'
                  ? 'Från enkel produktförsäljning till avancerad e-handel. Anpassad efter er affärsmodell och tillväxtmål.'
                  : 'From simple product sales to advanced e-commerce. Tailored to your business model and growth goals.'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {webshopFeatures.map((feature, index) => (
                <div key={index} className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-cyan/20 to-primary-600/20 rounded-xl flex items-center justify-center text-accent-cyan mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-heading text-lg font-bold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 md:p-12 border border-white/20">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-heading text-2xl font-bold mb-4">
                    {language === 'sv' ? 'Webbshop-Projekt' : 'Webshop Project'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-semibold text-accent-cyan mb-1">
                        {language === 'sv' ? 'Setup & Implementation' : 'Setup & Implementation'}
                      </div>
                      <div className="text-3xl font-black mb-2">
                        {language === 'sv' ? 'från 249 000 kr' : 'from €22,900'}
                      </div>
                      <p className="text-white/70 text-sm">
                        {language === 'sv'
                          ? 'Fast projektpris inkl. design, utveckling, Stripe-integration och produktsetup.'
                          : 'Fixed project price incl. design, development, Stripe integration and product setup.'}
                      </p>
                    </div>
                    <ul className="space-y-2">
                      {(language === 'sv'
                        ? [
                            'Custom e-handelsdesign',
                            'Produktkatalog & kategorier',
                            'Checkout & orderhantering',
                            'Stripe-betalningar & prenumerationer',
                            'Kundkonton & orderhistorik',
                            'Försäljningsanalys & rapporter',
                            'Mobil-optimerad shopping',
                            'SEO för produktsidor',
                          ]
                        : [
                            'Custom e-commerce design',
                            'Product catalog & categories',
                            'Checkout & order management',
                            'Stripe payments & subscriptions',
                            'Customer accounts & order history',
                            'Sales analytics & reports',
                            'Mobile-optimized shopping',
                            'SEO for product pages',
                          ]
                      ).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-accent-emerald flex-shrink-0 mt-0.5" />
                          <span className="text-white/90 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="font-heading text-2xl font-bold mb-4">
                    {language === 'sv' ? 'Löpande Optimering' : 'Ongoing Optimization'}
                  </h3>
                  <p className="text-white/80 mb-6">
                    {language === 'sv'
                      ? 'Efter lansering kan ni välja mellan olika upplägg för att kontinuerligt optimera försäljning och kundupplevelse:'
                      : 'After launch, choose between different setups to continuously optimize sales and customer experience:'}
                  </p>
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="font-semibold mb-1">{language === 'sv' ? 'Performance-baserat' : 'Performance-based'}</div>
                      <p className="text-white/70 text-sm">
                        {language === 'sv'
                          ? 'Löpande A/B-testing, konverteringsoptimering och tillväxtinitiativ.'
                          : 'Ongoing A/B testing, conversion optimization and growth initiatives.'}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="font-semibold mb-1">{language === 'sv' ? 'Retainer-modell' : 'Retainer Model'}</div>
                      <p className="text-white/70 text-sm">
                        {language === 'sv'
                          ? 'Fast månadsupplägg med dedikerad kapacitet för utveckling och support.'
                          : 'Fixed monthly setup with dedicated capacity for development and support.'}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="font-semibold mb-1">{language === 'sv' ? 'Projekt-baserat' : 'Project-based'}</div>
                      <p className="text-white/70 text-sm">
                        {language === 'sv'
                          ? 'Specifika förbättringsprojekt och feature-utveckling efter behov.'
                          : 'Specific improvement projects and feature development as needed.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/20 text-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 rounded-2xl hover:shadow-xl transition-all duration-300 font-semibold text-lg transform hover:scale-105"
                >
                  {language === 'sv' ? 'Diskutera Webbshop-Projekt' : 'Discuss Webshop Project'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Outcomes Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-accent-cyan/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl font-bold text-gray-900 mb-4">
                {language === 'sv' ? 'Mätbara Affärsresultat' : 'Measurable Business Outcomes'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {language === 'sv'
                  ? 'Varje projekt är designat för att leverera konkreta, mätbara förbättringar.'
                  : 'Every project is designed to deliver concrete, measurable improvements.'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {outcomes.map((outcome, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-soft border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-cyan/20 rounded-xl flex items-center justify-center text-primary-600 mb-4">
                    {outcome.icon}
                  </div>
                  <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">
                    {outcome.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {outcome.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl font-bold text-gray-900 mb-4">
                {language === 'sv' ? 'Anpassat För Din Bransch' : 'Tailored to Your Industry'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {language === 'sv'
                  ? 'Varje bransch har unika krav. Vi designar för era specifika affärsmål och målgrupper.'
                  : 'Every industry has unique requirements. We design for your specific business goals and audiences.'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {capabilities.map((capability, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-soft border border-gray-100">
                  <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">
                    {capability.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {capability.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Differentiators Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl font-bold text-gray-900 mb-4">
                {language === 'sv' ? 'Varför NorthForce' : 'Why NorthForce'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {language === 'sv'
                  ? 'Vi är inte en byrå. Vi är en strategisk partner som kombinerar business insights med teknisk excellens.'
                  : 'We\'re not an agency. We\'re a strategic partner combining business insights with technical excellence.'}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {differentiators.map((diff, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-soft border border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-cyan/20 rounded-xl flex items-center justify-center text-primary-600 mb-4">
                    {diff.icon}
                  </div>
                  <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">
                    {diff.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {diff.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {language === 'sv' ? 'Kom Igång Idag' : 'Get Started Today'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {language === 'sv'
                  ? 'Välj hur du vill ta nästa steg – boka direkt, begär offert eller diskutera er specifika situation.'
                  : 'Choose how you want to take the next step – book directly, request a quote or discuss your specific situation.'}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-2xl p-8 shadow-soft border border-gray-200 hover:border-primary-600 transition-all">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-4">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">
                  {language === 'sv' ? 'Boka Möte' : 'Book Meeting'}
                </h3>
                <p className="text-gray-600 mb-6 text-sm">
                  {language === 'sv'
                    ? 'Välj Foundation eller Growth-paketet och boka ett strategimöte för att komma igång.'
                    : 'Choose Foundation or Growth package and book a strategy meeting to get started.'}
                </p>
                <Link
                  to="/contact"
                  className="block w-full text-center px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold"
                >
                  {language === 'sv' ? 'Välj Paket' : 'Choose Package'}
                  <ArrowRight className="inline-block ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="bg-gradient-to-br from-primary-600 to-accent-cyan rounded-2xl p-8 shadow-glow text-white transform lg:-mt-2">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <Rocket className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">
                  {language === 'sv' ? 'Begär Offert' : 'Request Quote'}
                </h3>
                <p className="text-white/90 mb-6 text-sm">
                  {language === 'sv'
                    ? 'Enterprise-projekt, webbshop eller skräddarsydda lösningar? Vi skickar en detaljerad offert.'
                    : 'Enterprise project, webshop or custom solutions? We\'ll send a detailed quote.'}
                </p>
                <Link
                  to="/contact"
                  className="block w-full text-center px-6 py-3 bg-white text-primary-600 rounded-xl hover:shadow-xl transition-all font-semibold"
                >
                  {language === 'sv' ? 'Begär Offert' : 'Request Quote'}
                  <ArrowRight className="inline-block ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-soft border border-gray-200 hover:border-primary-600 transition-all">
                <div className="w-12 h-12 bg-accent-cyan/10 rounded-xl flex items-center justify-center text-accent-cyan mb-4">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">
                  {language === 'sv' ? 'Gratis Analys' : 'Free Analysis'}
                </h3>
                <p className="text-gray-600 mb-6 text-sm">
                  {language === 'sv'
                    ? 'Osäker på vad ni behöver? Boka en kostnadsfri digital analys och strategisession.'
                    : 'Unsure what you need? Book a free digital analysis and strategy session.'}
                </p>
                <Link
                  to="/audit"
                  className="block w-full text-center px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-xl hover:bg-gray-900 hover:text-white transition-all font-semibold"
                >
                  {language === 'sv' ? 'Boka Analys' : 'Book Analysis'}
                  <ArrowRight className="inline-block ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <p className="text-gray-700 mb-2">
                {language === 'sv' ? 'Har du frågor?' : 'Have questions?'}
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-accent-cyan font-semibold transition-colors"
              >
                {language === 'sv' ? 'Kontakta oss direkt' : 'Contact us directly'}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default StrategicWebsitesPage;
