import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Zap, Star, TrendingUp, Users, DollarSign, Shield, Target, Briefcase, Scale, CheckCircle, Sparkles, RefreshCw, Award, LineChart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SEOHead from '../components/SEOHead';
import HeroSection from '../components/HeroSection';
import BenefitsSection from '../components/BenefitsSection';
import BeforeAfterSection from '../components/BeforeAfterSection';

const HomePage = () => {
  const { language, t } = useLanguage();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NorthForce",
    "description": language === 'sv'
      ? "Hybridmodell för företagstillväxt - sex expertområden, ett system, flexibel kapacitet"
      : "Hybrid model for business growth - six expert areas, one system, flexible capacity",
    "url": "https://northforce.io/",
    "foundingDate": "2024",
    "areaServed": ["SE", "NO", "DK", "FI"],
    "serviceType": ["Business Consulting", "Technology Solutions", "Digital Transformation"]
  };

  // Pricing with currency conversion
  const currencySymbol = language === 'sv' ? 'kr' : '$';
  const packages = [
    {
      name: 'Essential',
      systemFee: Math.round(3900 * (language === 'sv' ? 1 : 1/10.5)),
      tokens: 40,
      totalMin: Math.round(28900 * (language === 'sv' ? 1 : 1/10.5)),
      totalMax: Math.round(38900 * (language === 'sv' ? 1 : 1/10.5)),
    },
    {
      name: 'Core',
      systemFee: Math.round(7900 * (language === 'sv' ? 1 : 1/10.5)),
      tokens: 120,
      totalMin: Math.round(52900 * (language === 'sv' ? 1 : 1/10.5)),
      totalMax: Math.round(77900 * (language === 'sv' ? 1 : 1/10.5)),
      popular: true,
    },
    {
      name: 'Professional',
      systemFee: Math.round(12900 * (language === 'sv' ? 1 : 1/10.5)),
      tokens: 300,
      totalMin: Math.round(107900 * (language === 'sv' ? 1 : 1/10.5)),
      totalMax: Math.round(162900 * (language === 'sv' ? 1 : 1/10.5)),
    },
  ];

  const expertAreas = [
    {
      icon: <TrendingUp className="h-10 w-10" />,
      color: 'text-accent-cyan',
      title: language === 'sv' ? 'Sälj' : 'Sales',
      items: language === 'sv'
        ? ['Pipeline & deals', 'Konvertering', 'Forecast', 'Säljstöd']
        : ['Pipeline & deals', 'Conversion', 'Forecast', 'Sales support'],
    },
    {
      icon: <Target className="h-10 w-10" />,
      color: 'text-accent-purple',
      title: language === 'sv' ? 'Marknad' : 'Marketing',
      items: language === 'sv'
        ? ['Strategi', 'SEO & innehåll', 'Kampanjer', 'Leads']
        : ['Strategy', 'SEO & content', 'Campaigns', 'Leads'],
    },
    {
      icon: <DollarSign className="h-10 w-10" />,
      color: 'text-accent-emerald',
      title: language === 'sv' ? 'Ekonomi' : 'Finance',
      items: language === 'sv'
        ? ['Lönsamhet', 'Nyckeltal', 'Prissättning', 'Kassaflöde']
        : ['Profitability', 'KPIs', 'Pricing', 'Cash flow'],
    },
    {
      icon: <Briefcase className="h-10 w-10" />,
      color: 'text-accent-amber',
      title: language === 'sv' ? 'Ledning' : 'Leadership',
      items: language === 'sv'
        ? ['Strategi', 'Prioriteringar', 'Mål', 'Beslut']
        : ['Strategy', 'Priorities', 'Goals', 'Decisions'],
    },
    {
      icon: <Users className="h-10 w-10" />,
      color: 'text-accent-rose',
      title: 'HR',
      items: language === 'sv'
        ? ['Rekrytering', 'Kultur', 'Onboarding', 'Employer brand']
        : ['Recruitment', 'Culture', 'Onboarding', 'Employer brand'],
    },
    {
      icon: <Scale className="h-10 w-10" />,
      color: 'text-primary-600',
      title: language === 'sv' ? 'Juridik' : 'Legal',
      items: language === 'sv'
        ? ['Avtal', 'Compliance', 'Regelverk', 'Risk']
        : ['Contracts', 'Compliance', 'Regulations', 'Risk'],
    },
  ];

  const proofPoints = [
    { metric: language === 'sv' ? '+150%' : '+150%', description: language === 'sv' ? 'Högre leadgenerering' : 'Higher lead generation', color: 'text-accent-cyan' },
    { metric: language === 'sv' ? '67%' : '67%', description: language === 'sv' ? 'Lägre kostnad per lead' : 'Lower cost per lead', color: 'text-accent-purple' },
    { metric: language === 'sv' ? '3 veckor' : '3 weeks', description: language === 'sv' ? 'Genomsnittlig tid till effekt' : 'Average time to impact', color: 'text-accent-emerald' },
    { metric: '95%', description: language === 'sv' ? 'Kundbehållning' : 'Customer retention', color: 'text-accent-amber' },
  ];

  return (
    <div className="bg-white overflow-hidden">
      <SEOHead
        title={language === 'sv' ? 'NorthForce — Hybridmodellen för företagstillväxt' : 'NorthForce — The Hybrid Model for Business Growth'}
        description={language === 'sv'
          ? 'Sex expertområden, ett system, flexibel kapacitet. Modern hybridlösning som kombinerar ledarskap och skalbar teknologi för konkurrenskraftig tillväxt.'
          : 'Six expert areas, one system, flexible capacity. Modern hybrid solution combining leadership and scalable technology for competitive growth.'}
        keywords={language === 'sv'
          ? 'hybridmodell, företagstillväxt, expertområden, tokens, abonnemang, flexibel kapacitet, ledarskap, system'
          : 'hybrid model, business growth, expert areas, tokens, subscription, flexible capacity, leadership, systems'}
        canonicalUrl="https://northforce.io/"
        structuredData={structuredData}
      />

      {/* Hero */}
      <HeroSection
        title={t('hero.title') + ' '}
        titleHighlight={t('hero.title_highlight')}
        subtitle={t('hero.subtitle')}
        backgroundVariant="homepage"
        extraContent={
          <>
            <Brain className="h-16 w-16 text-accent-cyan" />
            <Star className="h-20 w-20 text-brand-violet" />
            <Zap className="h-16 w-16 text-accent-emerald" />
          </>
        }
        ctaButtons={[
          { text: language === 'sv' ? 'Upptäck modellen' : 'Discover the Model', href: '/hybrid-model', variant: 'primary', icon: <ArrowRight className="h-6 w-6" /> },
          { text: language === 'sv' ? 'Se priser' : 'View Pricing', href: '#pricing', variant: 'secondary' },
        ]}
      />

      {/* Problem Section */}
      <section className="py-24 section-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
              {language === 'sv' ? 'Varför ' : 'Why '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">{language === 'sv' ? 'växande företag' : 'Growing Companies'}</span>
              {language === 'sv' ? ' väljer hybridmodellen' : ' Choose the Hybrid Model'}
            </h2>
            <p className="font-body text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
              {language === 'sv'
                ? 'Anställning är dyrt och riskabelt. Byråer är fragmenterade. Projekt fasas ut. Det finns ett bättre sätt.'
                : 'Hiring is expensive and risky. Agencies are fragmented. Projects phase out. There is a better way.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="premium-card group text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-cyan/20 to-accent-cyan/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-accent-cyan" />
              </div>
              <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">
                {language === 'sv' ? 'Lägre risk' : 'Lower Risk'}
              </h3>
              <p className="font-body text-gray-700 leading-relaxed">
                {language === 'sv'
                  ? 'Ingen risk för felrekryteringar, uppsägningstider eller outnyttjad kapacitet. Skala upp och ner efter behov.'
                  : 'No risk of wrong hires, notice periods, or unused capacity. Scale up and down as needed.'}
              </p>
            </div>

            <div className="premium-card group text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-purple/20 to-accent-purple/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <RefreshCw className="h-8 w-8 text-accent-purple" />
              </div>
              <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">
                {language === 'sv' ? 'Full flexibilitet' : 'Full Flexibility'}
              </h3>
              <p className="font-body text-gray-700 leading-relaxed">
                {language === 'sv'
                  ? 'Flytta kapacitet mellan sälj, marknad, ekonomi, HR, juridik och strategi när prioriteringarna ändras.'
                  : 'Move capacity between sales, marketing, finance, HR, legal, and strategy as priorities change.'}
              </p>
            </div>

            <div className="premium-card group text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-emerald/20 to-accent-emerald/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <LineChart className="h-8 w-8 text-accent-emerald" />
              </div>
              <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">
                {language === 'sv' ? 'Mätbara resultat' : 'Measurable Results'}
              </h3>
              <p className="font-body text-gray-700 leading-relaxed">
                {language === 'sv'
                  ? 'Tydliga KPIer, veckouppföljning och kontinuerlig optimering. Alltid kopplat till era affärsmål.'
                  : 'Clear KPIs, weekly follow-up, and continuous optimization. Always connected to your business goals.'}
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/hybrid-model"
              className="bg-gradient-to-r from-primary-600 to-accent-cyan text-white px-10 py-5 rounded-2xl hover:shadow-glow transition-all duration-300 font-bold text-lg inline-flex items-center transform hover:scale-105"
            >
              {language === 'sv' ? 'Läs mer om modellen' : 'Learn About the Model'}
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Expert Areas */}
      <section className="py-24 section-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl lg:text-7xl font-black mb-8 tracking-tight">
              {language === 'sv' ? 'Sex expertområden ' : 'Six Expert Areas '}
              <span className="text-brand-emerald">{language === 'sv' ? 'i samma system' : 'in One System'}</span>
            </h2>
            <p className="font-body text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed">
              {language === 'sv'
                ? 'Alla arbetar i era system med er data. Inget dubbeljobb, ingen förlorad information.'
                : 'Everyone works in your systems with your data. No duplicate work, no lost information.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expertAreas.map((area, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:border-white/30 transition-all group">
                <div className={`${area.color} mb-6 transform group-hover:scale-110 transition-transform`}>
                  {area.icon}
                </div>
                <h3 className="font-heading text-2xl font-black mb-4">{area.title}</h3>
                <ul className="space-y-2">
                  {area.items.map((item, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-white/80">
                      <CheckCircle className="h-4 w-4 text-accent-emerald flex-shrink-0" />
                      <span className="font-body text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After */}
      <BeforeAfterSection />

      {/* Pricing Preview */}
      <section id="pricing" className="py-24 section-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
              {language === 'sv' ? 'Enkel, ' : 'Simple, '}
              <span className="text-brand-cyan">{language === 'sv' ? 'transparent prissättning' : 'Transparent Pricing'}</span>
            </h2>
            <p className="font-body text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
              {language === 'sv'
                ? 'Systemavgift + tokens. Skala efter behov. Inga överraskningar.'
                : 'System fee + tokens. Scale as needed. No surprises.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`premium-card group relative ${pkg.popular ? 'ring-2 ring-accent-cyan' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-accent-cyan text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>{language === 'sv' ? 'Populärast' : 'Most Popular'}</span>
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="font-heading text-3xl font-black text-gray-900 mb-4">{pkg.name}</h3>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">{language === 'sv' ? 'Systemavgift' : 'System Fee'}</p>
                    <p className="text-2xl font-black text-gray-900">
                      {currencySymbol}{pkg.systemFee.toLocaleString()}{language === 'sv' ? '/mån' : '/mo'}
                    </p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">{language === 'sv' ? 'Kapacitet' : 'Capacity'}</p>
                    <p className="text-lg font-bold text-accent-cyan">{pkg.tokens} tokens</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{language === 'sv' ? 'Total kostnad' : 'Total Cost'}</p>
                    <p className="text-xl font-black text-accent-emerald">
                      {currencySymbol}{pkg.totalMin.toLocaleString()}-{pkg.totalMax.toLocaleString()}{language === 'sv' ? '/mån' : '/mo'}
                    </p>
                  </div>
                </div>

                <Link
                  to="/hybrid-model#pricing"
                  className="block w-full text-center bg-gradient-to-r from-primary-600 to-accent-cyan text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-glow transform hover:scale-105"
                >
                  {language === 'sv' ? 'Se detaljer' : 'View Details'}
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/hybrid-model#pricing"
              className="text-primary-600 hover:text-accent-cyan font-bold text-lg inline-flex items-center"
            >
              {language === 'sv' ? 'Se alla paket och detaljer' : 'View all packages and details'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Highlight */}
      <BenefitsSection />

      {/* Proof Points */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-6xl font-black text-gray-900 mb-6">
              {language === 'sv' ? 'Bevisade ' : 'Proven '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">{language === 'sv' ? 'resultat' : 'Results'}</span>
            </h2>
            <p className="font-body text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto">
              {language === 'sv'
                ? 'Verkliga resultat från verkliga företag'
                : 'Real results from real companies'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {proofPoints.map((point, index) => (
              <div key={index} className="text-center group">
                <div className={`font-heading text-5xl lg:text-6xl font-black ${point.color} mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                  {point.metric}
                </div>
                <p className="font-body text-gray-700 font-medium">{point.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/proof"
              className="bg-gradient-to-r from-gray-900 to-primary-900 text-white px-10 py-5 rounded-2xl hover:shadow-glow transition-all duration-300 font-bold text-lg inline-flex items-center transform hover:scale-105"
            >
              {language === 'sv' ? 'Se fallstudier' : 'View Case Studies'}
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 section-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-5xl lg:text-7xl font-black mb-8 tracking-tight">
            {language === 'sv' ? 'Redo att transformera er tillväxt?' : 'Ready to Transform Your Growth?'}
          </h2>
          <p className="font-body text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            {language === 'sv'
              ? 'Boka ett strategimöte eller få en gratis analys av era system och möjligheter.'
              : 'Book a strategy meeting or get a free analysis of your systems and opportunities.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/contact"
              className="bg-accent-cyan text-white px-10 py-5 rounded-2xl hover:shadow-glow transition-all duration-300 font-bold text-lg inline-flex items-center justify-center transform hover:scale-105"
            >
              {language === 'sv' ? 'Boka strategimöte' : 'Book Strategy Meeting'}
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
            <Link
              to="/audit"
              className="bg-white text-gray-900 px-10 py-5 rounded-2xl hover:bg-gray-100 transition-all duration-300 font-bold text-lg inline-flex items-center justify-center transform hover:scale-105 shadow-card"
            >
              {language === 'sv' ? 'Gratis systemanalys' : 'Free System Analysis'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
