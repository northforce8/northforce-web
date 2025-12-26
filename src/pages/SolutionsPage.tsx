import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Layers, CheckCircle, Sparkles, Target, Users, Zap, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SEOHead from '../components/SEOHead';
import BeforeAfterSection from '../components/BeforeAfterSection';

const SolutionsPage = () => {
  const { language } = useLanguage();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": language === 'sv' ? 'Lösningar för Företagstillväxt' : 'Business Growth Solutions',
    "description": language === 'sv'
      ? 'Strategisk kapacitet genom hybridmodell eller systemlösningar. Anpassat efter era behov och tillväxtfas.'
      : 'Strategic capacity through hybrid model or system solutions. Tailored to your needs and growth phase.',
    "provider": {
      "@type": "Organization",
      "name": "NorthForce",
      "url": "https://northforce.io"
    }
  };

  const solutions = [
    {
      id: 'hybrid',
      icon: <Brain className="h-16 w-16" />,
      iconColor: 'text-accent-cyan',
      badge: language === 'sv' ? 'Rekommenderad' : 'Recommended',
      title: language === 'sv' ? 'Hybridmodellen' : 'Hybrid Model',
      subtitle: language === 'sv' ? 'Strategisk Expertis + System + Flexibel Kapacitet' : 'Strategic Expertise + Systems + Flexible Capacity',
      description: language === 'sv'
        ? 'Sex specialistområden arbetar tillsammans i era system. Senior rådgivning kombinerat med kontinuerlig execution. Token-baserad kapacitet som skalar efter behov.'
        : 'Six specialist areas working together in your systems. Senior advisory combined with continuous execution. Token-based capacity that scales as needed.',
      features: [
        {
          text: language === 'sv' ? 'Sex expertområden: Sälj, Marknad, Ekonomi, Juridik, Ledning, HR' : 'Six expert areas: Sales, Marketing, Finance, Legal, Leadership, HR',
        },
        {
          text: language === 'sv' ? 'Strategisk ledning och kontinuerlig närvaro' : 'Strategic leadership and continuous presence',
        },
        {
          text: language === 'sv' ? 'Integrerad plattform som håller allt samordnat' : 'Integrated platform keeping everything coordinated',
        },
        {
          text: language === 'sv' ? 'Flexibel kapacitet genom token-modell' : 'Flexible capacity through token model',
        },
        {
          text: language === 'sv' ? 'Veckovisa cykler med mätbara resultat' : 'Weekly cycles with measurable results',
        },
        {
          text: language === 'sv' ? 'Ni äger system, data och processer' : 'You own systems, data and processes',
        },
      ],
      bestFor: [
        language === 'sv' ? 'Företag €5M-50M ARR' : 'Companies €5M-50M ARR',
        language === 'sv' ? 'B2B-fokus i tillväxtfas' : 'B2B focus in growth phase',
        language === 'sv' ? 'Behöver strategisk kapacitet' : 'Need strategic capacity',
        language === 'sv' ? 'Vill bygga långsiktig kapabilitet' : 'Want to build long-term capability',
      ],
      link: '/hybrid-model',
      cta: language === 'sv' ? 'Utforska Hybridmodellen' : 'Explore Hybrid Model',
    },
    {
      id: 'system',
      icon: <Layers className="h-16 w-16" />,
      iconColor: 'text-accent-emerald',
      title: language === 'sv' ? 'System Only' : 'System Only',
      subtitle: language === 'sv' ? 'Komplett Affärssystem Utan Execution' : 'Complete Business System Without Execution',
      description: language === 'sv'
        ? 'Central plattform för marknad, sälj, kundhantering och leverans. Ni får systemet, ni driver execution själva. Perfekt för bolag med intern kapacitet.'
        : 'Central platform for marketing, sales, customer management and delivery. You get the system, you drive execution. Perfect for companies with internal capacity.',
      features: [
        {
          text: language === 'sv' ? 'CRM & Pipeline-hantering' : 'CRM & Pipeline management',
        },
        {
          text: language === 'sv' ? 'Automatiserade kundresor och flöden' : 'Automated customer journeys and flows',
        },
        {
          text: language === 'sv' ? 'Kampanj- och kommunikationsverktyg' : 'Campaign and communication tools',
        },
        {
          text: language === 'sv' ? 'Dashboards och rapportering' : 'Dashboards and reporting',
        },
        {
          text: language === 'sv' ? 'Digital leveransplattform' : 'Digital delivery platform',
        },
        {
          text: language === 'sv' ? 'Support och vidareutveckling' : 'Support and continued development',
        },
      ],
      bestFor: [
        language === 'sv' ? 'Etablerade team på plats' : 'Established team in place',
        language === 'sv' ? 'Behöver bättre system' : 'Need better systems',
        language === 'sv' ? 'Vill konsolidera verktyg' : 'Want to consolidate tools',
        language === 'sv' ? 'Har intern execution-kapacitet' : 'Have internal execution capacity',
      ],
      link: '/system',
      cta: language === 'sv' ? 'Se Systemlösningen' : 'View System Solution',
    },
  ];

  const comparisonTable = [
    {
      feature: language === 'sv' ? 'Integrerad plattform' : 'Integrated platform',
      hybrid: true,
      system: true,
    },
    {
      feature: language === 'sv' ? 'CRM & Pipeline' : 'CRM & Pipeline',
      hybrid: true,
      system: true,
    },
    {
      feature: language === 'sv' ? 'Automation & Flöden' : 'Automation & Flows',
      hybrid: true,
      system: true,
    },
    {
      feature: language === 'sv' ? 'Strategisk ledning' : 'Strategic leadership',
      hybrid: true,
      system: false,
    },
    {
      feature: language === 'sv' ? 'Sex expertområden' : 'Six expert areas',
      hybrid: true,
      system: false,
    },
    {
      feature: language === 'sv' ? 'Kontinuerlig execution' : 'Continuous execution',
      hybrid: true,
      system: false,
    },
    {
      feature: language === 'sv' ? 'Token-baserad kapacitet' : 'Token-based capacity',
      hybrid: true,
      system: false,
    },
    {
      feature: language === 'sv' ? 'Veckovisa cykler' : 'Weekly cycles',
      hybrid: true,
      system: false,
    },
  ];

  return (
    <div className="bg-white overflow-hidden">
      <SEOHead
        title={language === 'sv' ? 'Lösningar — NorthForce' : 'Solutions — NorthForce'}
        description={language === 'sv'
          ? 'Hybridmodell med strategisk kapacitet eller system only. Välj lösning efter era behov och tillväxtfas.'
          : 'Hybrid model with strategic capacity or system only. Choose solution based on your needs and growth phase.'}
        canonicalUrl="https://northforce.io/solutions"
        structuredData={structuredData}
      />

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute top-1/4 right-1/3 w-[600px] h-[600px] bg-accent-cyan rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-accent-emerald rounded-full blur-[120px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-10">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full text-sm font-semibold tracking-wide uppercase">
                <Sparkles className="h-4 w-4 text-accent-cyan" />
                {language === 'sv' ? 'Anpassade Lösningar' : 'Tailored Solutions'}
              </span>
            </div>

            <h1 className="font-heading text-6xl sm:text-7xl lg:text-8xl font-black mb-10 tracking-tight leading-[1.05]">
              {language === 'sv' ? 'Välj Din' : 'Choose Your'}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-accent-emerald to-accent-cyan">
                {language === 'sv' ? 'Tillväxtväg' : 'Growth Path'}
              </span>
            </h1>

            <p className="font-body text-2xl lg:text-3xl text-white/90 mb-16 leading-relaxed max-w-4xl mx-auto font-light">
              {language === 'sv'
                ? 'Strategisk kapacitet med hybridmodell eller systemlösning. Anpassat efter era behov.'
                : 'Strategic capacity with hybrid model or system solution. Tailored to your needs.'}
            </p>

            <Link
              to="/contact"
              className="inline-flex items-center bg-gradient-to-r from-accent-cyan to-accent-emerald text-gray-900 px-12 py-6 rounded-2xl font-black text-xl hover:shadow-glow transition-all duration-300 transform hover:scale-105 group"
            >
              {language === 'sv' ? 'Boka Strategidialog' : 'Book Strategy Discussion'}
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Solutions Overview */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
              {language === 'sv' ? 'Två Vägar' : 'Two Paths'}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
                {language === 'sv' ? 'Ett Mål' : 'One Goal'}
              </span>
            </h2>
            <p className="font-body text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {language === 'sv'
                ? 'Båda lösningarna är byggda för hållbar tillväxt. Välj efter var ni är och vart ni vill.'
                : 'Both solutions are built for sustainable growth. Choose based on where you are and where you want to go.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {solutions.map((solution, index) => (
              <div
                key={solution.id}
                className={`relative bg-white rounded-3xl p-10 border-2 transition-all duration-300 hover:shadow-2xl ${
                  solution.badge
                    ? 'border-accent-cyan shadow-glow'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {solution.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-accent-cyan to-accent-emerald text-gray-900 px-6 py-2 rounded-full text-sm font-black shadow-glow">
                      {solution.badge}
                    </div>
                  </div>
                )}

                <div className="mb-8">
                  <div className={`${solution.iconColor} mb-6`}>
                    {solution.icon}
                  </div>
                  <h3 className="font-heading text-4xl font-black text-gray-900 mb-3 tracking-tight">
                    {solution.title}
                  </h3>
                  <p className="font-body text-lg font-semibold text-gray-700 mb-6">
                    {solution.subtitle}
                  </p>
                  <p className="font-body text-gray-600 leading-relaxed">
                    {solution.description}
                  </p>
                </div>

                <div className="mb-8">
                  <h4 className="font-heading text-lg font-black text-gray-900 mb-4">
                    {language === 'sv' ? 'Inkluderat:' : 'Included:'}
                  </h4>
                  <ul className="space-y-3">
                    {solution.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-accent-emerald flex-shrink-0 mt-0.5" />
                        <span className="font-body text-sm text-gray-700">{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                  <h4 className="font-heading text-sm font-black text-gray-900 mb-3 uppercase tracking-wide">
                    {language === 'sv' ? 'Passar Bäst För:' : 'Best For:'}
                  </h4>
                  <ul className="space-y-2">
                    {solution.bestFor.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-accent-cyan rounded-full"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={solution.link}
                  className={`block w-full text-center px-8 py-5 rounded-2xl font-black text-lg transition-all duration-300 transform hover:scale-105 ${
                    solution.badge
                      ? 'bg-gradient-to-r from-accent-cyan to-accent-emerald text-gray-900 hover:shadow-glow'
                      : 'bg-gray-900 text-white hover:bg-primary-900'
                  }`}
                >
                  {solution.cta}
                  <ArrowRight className="inline-block ml-2 h-5 w-5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-32 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              {language === 'sv' ? 'Jämförelse' : 'Comparison'}
            </h2>
            <p className="font-body text-xl text-gray-600">
              {language === 'sv'
                ? 'Se skillnaderna mellan lösningarna'
                : 'See the differences between solutions'}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-card">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left font-heading text-sm font-black text-gray-900 uppercase tracking-wide">
                    {language === 'sv' ? 'Funktion' : 'Feature'}
                  </th>
                  <th className="px-6 py-4 text-center font-heading text-sm font-black text-gray-900 uppercase tracking-wide">
                    {language === 'sv' ? 'Hybrid' : 'Hybrid'}
                  </th>
                  <th className="px-6 py-4 text-center font-heading text-sm font-black text-gray-900 uppercase tracking-wide">
                    System
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {comparisonTable.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-body text-gray-900">{row.feature}</td>
                    <td className="px-6 py-4 text-center">
                      {row.hybrid ? (
                        <CheckCircle className="h-6 w-6 text-accent-emerald mx-auto" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.system ? (
                        <CheckCircle className="h-6 w-6 text-accent-emerald mx-auto" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Before/After */}
      <BeforeAfterSection />

      {/* Final CTA */}
      <section className="py-40 bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]">
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-accent-cyan rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-accent-emerald rounded-full blur-[120px]"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-5xl lg:text-7xl font-black mb-8 tracking-tight leading-tight">
            {language === 'sv' ? 'Vilken Väg Passar Er?' : 'Which Path Fits You?'}
          </h2>
          <p className="font-body text-2xl text-white/90 mb-16 leading-relaxed max-w-3xl mx-auto">
            {language === 'sv'
              ? 'Låt oss ha en strategidialog om era behov och utforska den bästa lösningen för er tillväxtresa.'
              : "Let's have a strategy discussion about your needs and explore the best solution for your growth journey."}
          </p>

          <Link
            to="/contact"
            className="inline-flex items-center bg-gradient-to-r from-accent-cyan to-accent-emerald text-gray-900 px-12 py-6 rounded-2xl font-black text-xl hover:shadow-glow transition-all duration-300 transform hover:scale-105 group"
          >
            {language === 'sv' ? 'Boka Strategidialog' : 'Book Strategy Discussion'}
            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SolutionsPage;
