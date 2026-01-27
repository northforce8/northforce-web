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
  Rocket
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
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-primary-600 to-accent-cyan rounded-3xl p-12 text-center shadow-glow">
              <Rocket className="h-16 w-16 text-white mx-auto mb-6" />
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                {language === 'sv' ? 'Redo att Bygga En Webbplats Som Driver Affär?' : 'Ready to Build a Website That Drives Business?'}
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                {language === 'sv'
                  ? 'Låt oss diskutera era mål och hur en strategisk webbplats kan accelerera er tillväxt.'
                  : 'Let\'s discuss your goals and how a strategic website can accelerate your growth.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/audit"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 rounded-2xl hover:shadow-xl transition-all duration-300 font-semibold text-lg transform hover:scale-105"
                >
                  {language === 'sv' ? 'Boka Strategisession' : 'Book Strategy Session'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-2xl hover:bg-white hover:text-primary-600 transition-all duration-300 font-semibold text-lg"
                >
                  {language === 'sv' ? 'Kontakta Oss' : 'Contact Us'}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default StrategicWebsitesPage;
