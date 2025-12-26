import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Brain, Zap, Star, TrendingUp, Users, DollarSign,
  Shield, CheckCircle, Target, Briefcase, Scale, Heart,
  LineChart, Clock, Sparkles, Award, RefreshCw
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SEOHead from '../components/SEOHead';
import HeroSection from '../components/HeroSection';
import BenefitsSection from '../components/BenefitsSection';
import ObjectionsSection from '../components/ObjectionsSection';
import BeforeAfterSection from '../components/BeforeAfterSection';

const HybridModelPage = () => {
  const { language, t } = useLanguage();

  // Pricing data with SEK/USD conversion (1 USD ≈ 10.5 SEK)
  const currencySymbol = language === 'sv' ? 'kr' : '$';
  const currencyMultiplier = language === 'sv' ? 10.5 : 1;

  const packages = [
    {
      name: 'Essential',
      systemFee: Math.round(3900 * (language === 'sv' ? 1 : 1/10.5)),
      tokens: 40,
      capacityMin: Math.round(25000 * (language === 'sv' ? 1 : 1/10.5)),
      capacityMax: Math.round(35000 * (language === 'sv' ? 1 : 1/10.5)),
      popular: false,
    },
    {
      name: 'Core',
      systemFee: Math.round(7900 * (language === 'sv' ? 1 : 1/10.5)),
      tokens: 120,
      capacityMin: Math.round(45000 * (language === 'sv' ? 1 : 1/10.5)),
      capacityMax: Math.round(70000 * (language === 'sv' ? 1 : 1/10.5)),
      popular: true,
    },
    {
      name: 'Professional',
      systemFee: Math.round(12900 * (language === 'sv' ? 1 : 1/10.5)),
      tokens: 300,
      capacityMin: Math.round(95000 * (language === 'sv' ? 1 : 1/10.5)),
      capacityMax: Math.round(150000 * (language === 'sv' ? 1 : 1/10.5)),
      popular: false,
    },
    {
      name: 'Enterprise',
      systemFee: Math.round(19900 * (language === 'sv' ? 1 : 1/10.5)),
      tokens: '700-1200',
      capacityMin: Math.round(180000 * (language === 'sv' ? 1 : 1/10.5)),
      capacityMax: Math.round(350000 * (language === 'sv' ? 1 : 1/10.5)),
      popular: false,
    },
  ];

  const expertAreas = [
    {
      icon: <TrendingUp className="h-10 w-10" />,
      color: 'text-accent-cyan',
      title: language === 'sv' ? 'Sälj' : 'Sales',
      description: language === 'sv'
        ? 'Pipeline, konvertering, forecast och säljstöd. Arbetar med marknad för leads och ekonomi för affärskalkyler.'
        : 'Pipeline, conversion, forecast, and sales support. Works with marketing for leads and finance for deal calculations.',
    },
    {
      icon: <Target className="h-10 w-10" />,
      color: 'text-accent-purple',
      title: language === 'sv' ? 'Marknad' : 'Marketing',
      description: language === 'sv'
        ? 'Strategi, positionering, innehåll, SEO och kampanjer. Stödjer sälj med kvalificerade leads och HR med employer branding.'
        : 'Strategy, positioning, content, SEO, and campaigns. Supports sales with qualified leads and HR with employer branding.',
    },
    {
      icon: <DollarSign className="h-10 w-10" />,
      color: 'text-accent-emerald',
      title: language === 'sv' ? 'Ekonomi' : 'Finance',
      description: language === 'sv'
        ? 'Lönsamhet, nyckeltal, prissättning och kassaflöde. Samarbetar med ledning för styrning och sälj för affärsbeslut.'
        : 'Profitability, KPIs, pricing, and cash flow. Collaborates with leadership for control and sales for business decisions.',
    },
    {
      icon: <Briefcase className="h-10 w-10" />,
      color: 'text-accent-amber',
      title: language === 'sv' ? 'Ledning & Strategi' : 'Leadership & Strategy',
      description: language === 'sv'
        ? 'Prioriteringar, mål, beslut och affärsutveckling. Navet som knyter ihop alla områden och säkerställer riktning.'
        : 'Priorities, goals, decisions, and business development. The hub that connects all areas and ensures direction.',
    },
    {
      icon: <Users className="h-10 w-10" />,
      color: 'text-accent-rose',
      title: 'HR',
      description: language === 'sv'
        ? 'Rekrytering, kultur, onboarding och employer branding. Arbetar med marknad för varumärke och juridik för avtal.'
        : 'Recruitment, culture, onboarding, and employer branding. Works with marketing for brand and legal for contracts.',
    },
    {
      icon: <Scale className="h-10 w-10" />,
      color: 'text-primary-600',
      title: language === 'sv' ? 'Juridik' : 'Legal',
      description: language === 'sv'
        ? 'Avtal, compliance, regelverk och riskbedömning. Stödjer ekonomi i större affärer och HR i anställningsrelaterade frågor.'
        : 'Contracts, compliance, regulations, and risk assessment. Supports finance in major deals and HR in employment matters.',
    },
  ];

  return (
    <div className="bg-white overflow-hidden">
      <SEOHead
        title={language === 'sv' ? 'Hybridmodellen - Sex expertområden, ett system' : 'The Hybrid Model - Six expert areas, one system'}
        description={language === 'sv'
          ? 'Modern hybridlösning som kombinerar expertkapacitet och skalbart system. Sex områden: sälj, marknad, ekonomi, ledning, HR och juridik.'
          : 'Modern hybrid solution combining expert capacity and scalable system. Six areas: sales, marketing, finance, leadership, HR, and legal.'}
        keywords={language === 'sv'
          ? 'hybridmodell, företagstillväxt, tokens, expertområden, abonnemang, flexibel kapacitet'
          : 'hybrid model, business growth, tokens, expert areas, subscription, flexible capacity'}
        canonicalUrl="https://northforce.io/hybrid-model"
      />

      {/* Hero */}
      <HeroSection
        title={language === 'sv' ? 'Det moderna sättet att driva ' : 'The Modern Way to Drive '}
        titleHighlight={language === 'sv' ? 'konkurrenskraftig tillväxt' : 'Competitive Growth'}
        subtitle={language === 'sv'
          ? 'Sex expertområden. Ett system. Flexibel kapacitet. Ingen anställningsrisk.'
          : 'Six expert areas. One system. Flexible capacity. No hiring risk.'}
        backgroundVariant="homepage"
        extraContent={
          <>
            <Brain className="h-16 w-16 text-accent-cyan" />
            <Star className="h-20 w-20 text-brand-violet" />
            <Zap className="h-16 w-16 text-accent-emerald" />
          </>
        }
        ctaButtons={[
          { text: language === 'sv' ? 'Se priser' : 'View Pricing', href: '#pricing', variant: 'primary', icon: <ArrowRight className="h-6 w-6" /> },
          { text: language === 'sv' ? 'Gratis analys' : 'Free Audit', href: '/audit', variant: 'secondary' },
        ]}
      />

      {/* Problem Section - Alex Hormozi Style */}
      <section className="py-24 section-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
              {language === 'sv' ? 'Utmaningen ' : 'The Challenge '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">{language === 'sv' ? 'växande företag' : 'Growing Companies'}</span>
              {language === 'sv' ? ' möter' : ' Face'}
            </h2>
            <p className="font-body text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
              {language === 'sv'
                ? 'Anställning är riskabelt. Byråer är fragmenterade. Projekt fasas ut. Tillväxten stannar.'
                : 'Hiring is risky. Agencies are fragmented. Projects fade out. Growth stalls.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-tech group">
              <div className="w-3 h-3 bg-accent-rose rounded-full mb-6"></div>
              <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">
                {language === 'sv' ? 'Anställning = Risk' : 'Hiring = Risk'}
              </h3>
              <p className="font-body text-gray-700 leading-relaxed">
                {language === 'sv'
                  ? 'Höga kostnader, långa åtaganden och risken för felrekryteringar. Ett misstag kan kosta 6-12 månaders lön plus overhead.'
                  : 'High costs, long commitments, and the risk of wrong hires. One mistake can cost 6-12 months of salary plus overhead.'}
              </p>
            </div>

            <div className="card-tech group">
              <div className="w-3 h-3 bg-accent-amber rounded-full mb-6"></div>
              <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">
                {language === 'sv' ? 'Flera leverantörer = Kaos' : 'Multiple Vendors = Chaos'}
              </h3>
              <p className="font-body text-gray-700 leading-relaxed">
                {language === 'sv'
                  ? 'Olika system, motstridiga prioriteringar, ingen gemensam sanning. Resultatet blir dubbeljobb och förlorad information.'
                  : 'Different systems, conflicting priorities, no single source of truth. The result is duplicate work and lost information.'}
              </p>
            </div>

            <div className="card-tech group">
              <div className="w-3 h-3 bg-accent-emerald rounded-full mb-6"></div>
              <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">
                {language === 'sv' ? 'Projekt = Kortvarig effekt' : 'Projects = Short-lived Effect'}
              </h3>
              <p className="font-body text-gray-700 leading-relaxed">
                {language === 'sv'
                  ? 'Ingen kontinuitet, kunskap försvinner när konsulter lämnar. Investera igen om sex månader.'
                  : 'No continuity, knowledge disappears when consultants leave. Reinvest in six months.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 section-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl lg:text-7xl font-black mb-8 tracking-tight">
              {language === 'sv' ? 'Introducerar NorthForce ' : 'Introducing the NorthForce '}
              <span className="text-brand-violet">{language === 'sv' ? 'hybridmodellen' : 'Hybrid Model'}</span>
            </h2>
            <p className="font-body text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed">
              {language === 'sv'
                ? 'Ledarskap + System + Flexibel kapacitet. Allt i ett abonnemang.'
                : 'Leadership + System + Flexible Capacity. All in one subscription.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:border-white/30 transition-all">
              <Shield className="h-12 w-12 text-accent-cyan mb-6" />
              <h3 className="font-heading text-2xl font-black mb-4">
                {language === 'sv' ? 'Integrerad plattform' : 'Integrated Platform'}
              </h3>
              <p className="text-white/80 leading-relaxed">
                {language === 'sv'
                  ? 'CRM, automation, analys och verktyg i ett system. Licenser, support och uppdateringar ingår.'
                  : 'CRM, automation, analytics, and tools in one system. Licenses, support, and updates included.'}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:border-white/30 transition-all">
              <Users className="h-12 w-12 text-accent-purple mb-6" />
              <h3 className="font-heading text-2xl font-black mb-4">
                {language === 'sv' ? 'Sex expertområden' : 'Six Expert Areas'}
              </h3>
              <p className="text-white/80 leading-relaxed">
                {language === 'sv'
                  ? 'Sälj, Marknad, Ekonomi, HR, Juridik och Strategi. Alla arbetar i samma system.'
                  : 'Sales, Marketing, Finance, HR, Legal, and Strategy. All work in the same system.'}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:border-white/30 transition-all">
              <RefreshCw className="h-12 w-12 text-accent-emerald mb-6" />
              <h3 className="font-heading text-2xl font-black mb-4">
                {language === 'sv' ? 'Token-baserad kapacitet' : 'Token-Based Capacity'}
              </h3>
              <p className="text-white/80 leading-relaxed">
                {language === 'sv'
                  ? 'Använd kapacitet där du behöver den mest. Flytta tokens mellan områden efter behov.'
                  : 'Use capacity where you need it most. Move tokens between areas as needed.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Areas */}
      <section className="py-24 section-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
              {language === 'sv' ? 'Sex expertområden ' : 'Six Expert Areas '}
              <span className="text-brand-emerald">{language === 'sv' ? 'arbetar tillsammans' : 'Working Together'}</span>
            </h2>
            <p className="font-body text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
              {language === 'sv'
                ? 'Varje område bidrar med specialistkompetens. Tillsammans skapar de exponentiellt värde.'
                : 'Each area brings specialized expertise. Together they create exponential value.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {expertAreas.map((area, index) => (
              <div key={index} className="card-tech group">
                <div className={`${area.color} mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                  {area.icon}
                </div>
                <h3 className="font-heading text-2xl font-black text-gray-900 mb-4 tracking-tight">{area.title}</h3>
                <p className="font-body text-gray-700 leading-relaxed">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 section-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl lg:text-7xl font-black mb-8 tracking-tight">
              {language === 'sv' ? 'Enkel, ' : 'Simple, '}
              <span className="text-brand-emerald">{language === 'sv' ? 'transparent prissättning' : 'Transparent Pricing'}</span>
            </h2>
            <p className="font-body text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed">
              {language === 'sv'
                ? 'Välj ditt paket. Skala upp eller ner. Inga överraskningar.'
                : 'Choose your package. Scale up or down. No surprises.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-8 border ${pkg.popular ? 'border-accent-cyan' : 'border-white/20'} hover:border-white/30 transition-all duration-300 shadow-2xl relative`}
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
                  <h3 className="font-heading text-3xl font-black text-white mb-4 tracking-tight">{pkg.name}</h3>
                  <div className="mb-2">
                    <span className="text-sm text-white/60">{language === 'sv' ? 'Systemavgift' : 'System Fee'}</span>
                    <p className="text-2xl font-black text-white">{currencySymbol}{pkg.systemFee.toLocaleString()}{language === 'sv' ? '/mån' : '/mo'}</p>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm text-white/60">{language === 'sv' ? 'Kapacitet' : 'Capacity'}</span>
                    <p className="text-lg font-semibold text-accent-cyan">{pkg.tokens} tokens</p>
                  </div>
                  <div>
                    <span className="text-sm text-white/60">{language === 'sv' ? 'Total kostnad' : 'Total Cost'}</span>
                    <p className="text-2xl font-black text-accent-emerald">
                      {currencySymbol}{pkg.capacityMin.toLocaleString()}-{pkg.capacityMax.toLocaleString()}{language === 'sv' ? '/mån' : '/mo'}
                    </p>
                  </div>
                </div>

                <Link
                  to="/contact"
                  className="block w-full text-center bg-accent-cyan text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  {language === 'sv' ? 'Kom igång' : 'Get Started'}
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-3xl">
              <h4 className="font-heading text-2xl font-black mb-4">{language === 'sv' ? 'Hur det fungerar' : 'How It Works'}</h4>
              <ul className="text-left space-y-3 text-white/90">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-accent-emerald mt-1 flex-shrink-0" />
                  <span>{language === 'sv' ? 'Systemavgiften täcker plattformen, licenser och support' : 'System fee covers platform, licenses, and support'}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-accent-emerald mt-1 flex-shrink-0" />
                  <span>{language === 'sv' ? 'Tokens aktiverar kapacitet i de områden ni använder' : 'Tokens activate capacity in the areas you use'}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-accent-emerald mt-1 flex-shrink-0" />
                  <span>{language === 'sv' ? 'Flytta tokens fritt mellan sälj, marknad, ekonomi, HR, juridik och strategi' : 'Move tokens freely between sales, marketing, finance, HR, legal, and strategy'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After */}
      <BeforeAfterSection />

      {/* Benefits - 20 Reasons */}
      <BenefitsSection />

      {/* Objections - 20 Questions */}
      <ObjectionsSection />

      {/* How We Work */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
              {language === 'sv' ? 'Så arbetar vi ' : 'How We Work '}
              <span className="text-brand-cyan">{language === 'sv' ? 'tillsammans' : 'Together'}</span>
            </h2>
            <p className="font-body text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
              {language === 'sv'
                ? 'En kontinuerlig process som skapar resultat vecka för vecka'
                : 'A continuous process that creates results week by week'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-tech group text-center">
              <div className="text-accent-cyan mb-6 flex justify-center">
                <div className="bg-accent-cyan/10 rounded-full p-6">
                  <Target className="h-12 w-12 text-accent-cyan" />
                </div>
              </div>
              <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">
                {language === 'sv' ? 'Planera' : 'Plan'}
              </h3>
              <p className="font-body text-gray-700 leading-relaxed">
                {language === 'sv'
                  ? 'Varje vecka börjar med att prioritera insatser baserat på era mål och var effekten blir störst.'
                  : 'Each week starts by prioritizing efforts based on your goals and where impact is greatest.'}
              </p>
            </div>

            <div className="card-tech group text-center">
              <div className="text-accent-purple mb-6 flex justify-center">
                <div className="bg-accent-purple/10 rounded-full p-6">
                  <Zap className="h-12 w-12 text-accent-purple" />
                </div>
              </div>
              <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">
                {language === 'sv' ? 'Genomföra' : 'Execute'}
              </h3>
              <p className="font-body text-gray-700 leading-relaxed">
                {language === 'sv'
                  ? 'Experterna i respektive område arbetar i era system med er data. Allt dokumenteras och är synligt i realtid.'
                  : 'Experts in each area work in your systems with your data. Everything is documented and visible in real-time.'}
              </p>
            </div>

            <div className="card-tech group text-center">
              <div className="text-accent-emerald mb-6 flex justify-center">
                <div className="bg-accent-emerald/10 rounded-full p-6">
                  <LineChart className="h-12 w-12 text-accent-emerald" />
                </div>
              </div>
              <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">
                {language === 'sv' ? 'Mäta & Justera' : 'Measure & Adjust'}
              </h3>
              <p className="font-body text-gray-700 leading-relaxed">
                {language === 'sv'
                  ? 'Vi följer upp resultat, analyserar vad som fungerar och justerar inför nästa vecka. Kontinuerlig förbättring.'
                  : 'We follow up on results, analyze what works, and adjust for next week. Continuous improvement.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ownership */}
      <section className="py-24 section-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
              {language === 'sv' ? 'Ni äger ' : 'You Own '}
              <span className="text-brand-emerald">{language === 'sv' ? 'allt' : 'Everything'}</span>
            </h2>
            <p className="font-body text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
              {language === 'sv'
                ? 'Data, system, material och kunskap stannar hos er'
                : 'Data, systems, materials, and knowledge stay with you'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 text-center hover:shadow-card transition-all">
              <Shield className="h-10 w-10 text-accent-cyan mx-auto mb-4" />
              <h4 className="font-heading text-lg font-bold text-gray-900 mb-2">
                {language === 'sv' ? 'Era data' : 'Your Data'}
              </h4>
              <p className="font-body text-sm text-gray-700">
                {language === 'sv' ? 'All data ägs och kontrolleras av er' : 'All data is owned and controlled by you'}
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 text-center hover:shadow-card transition-all">
              <Briefcase className="h-10 w-10 text-accent-purple mx-auto mb-4" />
              <h4 className="font-heading text-lg font-bold text-gray-900 mb-2">
                {language === 'sv' ? 'Era system' : 'Your Systems'}
              </h4>
              <p className="font-body text-sm text-gray-700">
                {language === 'sv' ? 'Ni äger plattformarna och licenserna' : 'You own the platforms and licenses'}
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 text-center hover:shadow-card transition-all">
              <Brain className="h-10 w-10 text-accent-emerald mx-auto mb-4" />
              <h4 className="font-heading text-lg font-bold text-gray-900 mb-2">
                {language === 'sv' ? 'Ert material' : 'Your Materials'}
              </h4>
              <p className="font-body text-sm text-gray-700">
                {language === 'sv' ? 'Allt innehåll och dokumentation är ert' : 'All content and documentation is yours'}
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 text-center hover:shadow-card transition-all">
              <Award className="h-10 w-10 text-accent-amber mx-auto mb-4" />
              <h4 className="font-heading text-lg font-bold text-gray-900 mb-2">
                {language === 'sv' ? 'Er kunskap' : 'Your Knowledge'}
              </h4>
              <p className="font-body text-sm text-gray-700">
                {language === 'sv' ? 'Processen och strukturen stannar kvar' : 'Process and structure remain with you'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 section-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-5xl lg:text-7xl font-black mb-8 tracking-tight">
            {language === 'sv' ? 'Redo att börja?' : 'Ready to Get Started?'}
          </h2>
          <p className="font-body text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            {language === 'sv'
              ? 'Boka ett möte eller få en gratis analys av er digitala närvaro.'
              : 'Book a meeting or get a free analysis of your digital presence.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/contact"
              className="bg-accent-cyan text-white px-10 py-5 rounded-2xl hover:shadow-glow transition-all duration-300 font-bold text-lg inline-flex items-center justify-center transform hover:scale-105"
            >
              {language === 'sv' ? 'Boka möte' : 'Book Meeting'}
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
            <Link
              to="/audit"
              className="bg-white text-gray-900 px-10 py-5 rounded-2xl hover:bg-gray-100 transition-all duration-300 font-bold text-lg inline-flex items-center justify-center transform hover:scale-105 shadow-card"
            >
              {language === 'sv' ? 'Gratis analys' : 'Free Audit'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HybridModelPage;
