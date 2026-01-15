import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Users, Shield, LineChart, Target, Briefcase, Scale, CheckCircle, Award, DollarSign, Zap, Sparkles, Brain, Network } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SEOHead from '../components/SEOHead';
import BeforeAfterSection from '../components/BeforeAfterSection';

const HomePage = () => {
  const { language, t } = useLanguage();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "NorthForce",
    "description": language === 'sv'
      ? "Strategisk partner för företagstillväxt genom hybridmodell kombinerar expertis, system och flexibel kapacitet"
      : "Strategic partner for business growth through hybrid model combining expertise, systems and flexible capacity",
    "url": "https://northforce.io/",
    "areaServed": {
      "@type": "Country",
      "name": ["Sweden", "Norway", "Denmark", "Finland"]
    }
  };

  const expertAreas = [
    {
      icon: <TrendingUp className="h-12 w-12" />,
      color: 'from-accent-cyan to-blue-500',
      title: language === 'sv' ? 'Sälj' : 'Sales',
      shortDesc: language === 'sv' ? 'Pipeline & Konvertering' : 'Pipeline & Conversion',
    },
    {
      icon: <Target className="h-12 w-12" />,
      color: 'from-accent-purple to-purple-600',
      title: language === 'sv' ? 'Marknad' : 'Marketing',
      shortDesc: language === 'sv' ? 'Positionering & Efterfrågan' : 'Positioning & Demand',
    },
    {
      icon: <DollarSign className="h-12 w-12" />,
      color: 'from-accent-emerald to-green-500',
      title: language === 'sv' ? 'Ekonomi' : 'Finance',
      shortDesc: language === 'sv' ? 'KPI & Lönsamhet' : 'KPI & Profitability',
    },
    {
      icon: <Briefcase className="h-12 w-12" />,
      color: 'from-accent-amber to-orange-500',
      title: language === 'sv' ? 'Ledning' : 'Leadership',
      shortDesc: language === 'sv' ? 'Strategi & Styrning' : 'Strategy & Governance',
    },
    {
      icon: <Users className="h-12 w-12" />,
      color: 'from-accent-rose to-pink-500',
      title: 'HR',
      shortDesc: language === 'sv' ? 'Talang & Kultur' : 'Talent & Culture',
    },
    {
      icon: <Scale className="h-12 w-12" />,
      color: 'from-primary-600 to-indigo-600',
      title: language === 'sv' ? 'Juridik' : 'Legal',
      shortDesc: language === 'sv' ? 'Avtal & Compliance' : 'Contracts & Compliance',
    },
  ];

  const valuePillars = [
    {
      icon: <Brain className="h-10 w-10" />,
      title: language === 'sv' ? 'Strategisk Expertis' : 'Strategic Expertise',
      description: language === 'sv'
        ? 'Senior rådgivning kombinerad med hands-on implementation'
        : 'Senior advisory combined with hands-on implementation',
    },
    {
      icon: <Network className="h-10 w-10" />,
      title: language === 'sv' ? 'Integrerade System' : 'Integrated Systems',
      description: language === 'sv'
        ? 'En plattform som håller alla områden samordnade'
        : 'One platform keeping all areas coordinated',
    },
    {
      icon: <Zap className="h-10 w-10" />,
      title: language === 'sv' ? 'Flexibel Kapacitet' : 'Flexible Capacity',
      description: language === 'sv'
        ? 'Skala efter behov utan risk eller overhead'
        : 'Scale as needed without risk or overhead',
    },
    {
      icon: <Shield className="h-10 w-10" />,
      title: language === 'sv' ? 'Ni Behåller Kontrollen' : 'You Retain Control',
      description: language === 'sv'
        ? 'Era system, er data, era beslut - vi driver execution'
        : 'Your systems, your data, your decisions - we drive execution',
    },
  ];

  const proofPoints = [
    {
      metric: '3-i-1',
      label: language === 'sv' ? 'Expertis, System & Kapacitet' : 'Expertise, Systems & Capacity',
      color: 'text-accent-cyan',
    },
    {
      metric: '1',
      label: language === 'sv' ? 'Plattform för alla områden' : 'Platform for all areas',
      color: 'text-accent-emerald',
    },
    {
      metric: '6',
      label: language === 'sv' ? 'Specialistområden integrerade' : 'Specialist areas integrated',
      color: 'text-accent-amber',
    },
    {
      metric: '100%',
      label: language === 'sv' ? 'Er kontroll & transparens' : 'Your control & transparency',
      color: 'text-accent-purple',
    },
  ];

  return (
    <div className="bg-white overflow-hidden">
      <SEOHead
        title={language === 'sv'
          ? 'NorthForce — Strategisk Partner för Företagstillväxt'
          : 'NorthForce — Strategic Partner for Business Growth'}
        description={language === 'sv'
          ? 'Expertis, system och flexibel kapacitet i en unik hybridmodell. Vi driver mätbar och hållbar tillväxt för ambitiösa företag i Norden.'
          : 'Expertise, systems and flexible capacity in a unique hybrid model. We drive measurable and sustainable growth for ambitious companies in the Nordics.'}
        canonicalUrl="https://northforce.io/"
        structuredData={structuredData}
      />

      {/* Hero - Premium Enterprise */}
      <section className="relative min-h-[90vh] flex items-center section-dark overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900"></div>
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute top-1/4 right-1/3 w-[600px] h-[600px] bg-accent-cyan rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-accent-emerald rounded-full blur-[120px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-10">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full text-sm font-semibold tracking-wide uppercase">
                <Sparkles className="h-4 w-4 text-accent-cyan" />
                {language === 'sv' ? 'Nästa Generation Tillväxtpartner' : 'Next Generation Growth Partner'}
              </span>
            </div>

            <h1 className="font-heading text-6xl sm:text-7xl lg:text-8xl font-black text-white mb-10 tracking-tight leading-[1.05]">
              {language === 'sv' ? 'Strategisk Kapacitet' : 'Strategic Capacity'}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-accent-emerald to-accent-cyan">
                {language === 'sv' ? 'När Ni Behöver Det' : 'When You Need It'}
              </span>
            </h1>

            <p className="font-body text-2xl lg:text-3xl text-white/90 mb-16 leading-relaxed max-w-4xl mx-auto font-light">
              {language === 'sv'
                ? 'Sex specialistområden. Ett system. Flexibel kapacitet. Er kontroll.'
                : 'Six specialist areas. One system. Flexible capacity. Your control.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16">
              <Link
                to="/contact"
                className="group bg-gradient-to-r from-accent-cyan to-accent-emerald text-gray-900 px-10 py-5 rounded-2xl font-black text-lg inline-flex items-center justify-center hover:shadow-glow transition-all duration-300 transform hover:scale-105"
              >
                {language === 'sv' ? 'Boka Strategidialog' : 'Book Strategy Discussion'}
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/hybrid-model"
                className="group border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-bold text-lg inline-flex items-center justify-center hover:border-white/60 hover:bg-white/10 transition-all duration-300"
              >
                {language === 'sv' ? 'Utforska Modellen' : 'Explore the Model'}
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Proof Points - Subtle Hero Integration */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-8 border-t border-white/10">
              {proofPoints.map((point, index) => (
                <div key={index} className="text-center">
                  <div className={`font-heading text-4xl lg:text-5xl font-black ${point.color} mb-2`}>
                    {point.metric}
                  </div>
                  <p className="font-body text-sm text-white/60 font-medium">
                    {point.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition - Enterprise Focus */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
              {language === 'sv' ? 'Varfor ' : 'Why '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
                {language === 'sv' ? 'NorthForce' : 'NorthForce'}
              </span>
            </h2>
            <p className="font-body text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {language === 'sv'
                ? 'För företag som vill accelerera tillväxt utan att offra kontroll, flexibilitet eller kvalitet'
                : 'For companies that want to accelerate growth without sacrificing control, flexibility or quality'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valuePillars.map((pillar, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 hover:border-primary-600/40 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-primary-600 mb-6 transform group-hover:scale-110 transition-transform">
                  {pillar.icon}
                </div>
                <h3 className="font-heading text-xl font-black text-gray-900 mb-4">
                  {pillar.title}
                </h3>
                <p className="font-body text-gray-600 leading-relaxed text-sm">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Six Areas - Circular/Connected Design */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
              {language === 'sv' ? 'Sex Områden' : 'Six Areas'}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
                {language === 'sv' ? 'Ett System' : 'One System'}
              </span>
            </h2>
            <p className="font-body text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {language === 'sv'
                ? 'Alla områden arbetar integrerat i era system mot gemensamma mål'
                : 'All areas work integrated in your systems towards common goals'}
            </p>
          </div>

          {/* Circular Layout for Desktop, Grid for Mobile */}
          <div className="relative">
            {/* Center Hub */}
            <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-48 h-48 bg-gradient-to-br from-primary-600 to-accent-cyan rounded-full flex items-center justify-center shadow-2xl">
                <div className="text-center text-white">
                  <Network className="h-12 w-12 mx-auto mb-3" />
                  <p className="font-heading font-black text-sm">
                    {language === 'sv' ? 'INTEGRERAD' : 'INTEGRATED'}
                    <br />
                    {language === 'sv' ? 'PLATTFORM' : 'PLATFORM'}
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop: Circular Layout */}
            <div className="hidden lg:block relative h-[700px]">
              {expertAreas.map((area, index) => {
                const angle = (index * 60) - 90; // 360/6 = 60 degrees, start at top
                const radius = 280;
                const x = radius * Math.cos((angle * Math.PI) / 180);
                const y = radius * Math.sin((angle * Math.PI) / 180);

                return (
                  <div
                    key={index}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    }}
                  >
                    <div className="group w-40 h-40">
                      <div className={`w-full h-full bg-gradient-to-br ${area.color} rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 cursor-pointer`}>
                        <div className="text-white mb-3">
                          {area.icon}
                        </div>
                        <h3 className="font-heading text-base font-black text-white mb-1">
                          {area.title}
                        </h3>
                        <p className="text-white/80 text-xs font-semibold">
                          {area.shortDesc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile & Tablet: Grid Layout */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:hidden">
              {expertAreas.map((area, index) => (
                <div key={index} className="group">
                  <div className={`bg-gradient-to-br ${area.color} rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer min-h-[180px]`}>
                    <div className="text-white mb-4">
                      {area.icon}
                    </div>
                    <h3 className="font-heading text-lg font-black text-white mb-2">
                      {area.title}
                    </h3>
                    <p className="text-white/80 text-sm font-semibold">
                      {area.shortDesc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 text-center">
            <Link
              to="/hybrid-model"
              className="inline-flex items-center bg-gradient-to-r from-primary-600 to-accent-cyan text-white px-10 py-5 rounded-2xl font-black text-lg hover:shadow-glow transition-all duration-300 transform hover:scale-105 group"
            >
              {language === 'sv' ? 'Se Hur Modellen Fungerar' : 'See How the Model Works'}
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works - Process & Engagement */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
              {language === 'sv' ? 'Hur Vi ' : 'How We '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
                {language === 'sv' ? 'Samarbetar' : 'Partner'}
              </span>
            </h2>
            <p className="font-body text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {language === 'sv'
                ? 'En kontinuerlig process där strategi möter execution i veckovisa cykler'
                : 'A continuous process where strategy meets execution in weekly cycles'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-accent-cyan/20 to-accent-cyan/10 rounded-full -z-10"></div>
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-accent-cyan hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-accent-cyan to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                  <span className="font-heading text-2xl font-black text-white">1</span>
                </div>
                <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">
                  {language === 'sv' ? 'Strategidialog' : 'Strategy Discussion'}
                </h3>
                <p className="font-body text-gray-600 leading-relaxed mb-6">
                  {language === 'sv'
                    ? 'Vi förstår era utmaningar, ambitioner och var vi kan skapa mest värde. Inga generiska lösningar.'
                    : 'We understand your challenges, ambitions and where we can create most value. No generic solutions.'}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-accent-cyan" />
                    <span>{language === 'sv' ? 'Nulägesanalys' : 'Current state analysis'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-accent-cyan" />
                    <span>{language === 'sv' ? 'Målbildsdefinition' : 'Target state definition'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-accent-cyan" />
                    <span>{language === 'sv' ? 'Prioriteringar' : 'Prioritization'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-accent-emerald/20 to-accent-emerald/10 rounded-full -z-10"></div>
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-accent-emerald hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-accent-emerald to-green-500 rounded-2xl flex items-center justify-center mb-6">
                  <span className="font-heading text-2xl font-black text-white">2</span>
                </div>
                <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">
                  {language === 'sv' ? 'Systemdesign' : 'System Design'}
                </h3>
                <p className="font-body text-gray-600 leading-relaxed mb-6">
                  {language === 'sv'
                    ? 'Vi bygger infrastrukturen: plattform, flöden, dashboards och integrationer som bär arbetet.'
                    : 'We build the infrastructure: platform, flows, dashboards and integrations that carry the work.'}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-accent-emerald" />
                    <span>{language === 'sv' ? 'Plattformssetup' : 'Platform setup'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-accent-emerald" />
                    <span>{language === 'sv' ? 'Processautomation' : 'Process automation'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-accent-emerald" />
                    <span>{language === 'sv' ? 'Dataintegrationer' : 'Data integrations'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-accent-amber/20 to-accent-amber/10 rounded-full -z-10"></div>
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-accent-amber hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-accent-amber to-orange-500 rounded-2xl flex items-center justify-center mb-6">
                  <span className="font-heading text-2xl font-black text-white">3</span>
                </div>
                <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">
                  {language === 'sv' ? 'Kontinuerlig Exekvering' : 'Continuous Execution'}
                </h3>
                <p className="font-body text-gray-600 leading-relaxed mb-6">
                  {language === 'sv'
                    ? 'Veckovisa cykler där vi exekverar, mäter, justerar och levererar målbar effekt.'
                    : 'Weekly cycles where we execute, measure, adjust and deliver measurable impact.'}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-accent-amber" />
                    <span>{language === 'sv' ? 'Veckoplanering' : 'Weekly planning'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-accent-amber" />
                    <span>{language === 'sv' ? 'Resultatuppföljning' : 'Results tracking'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-accent-amber" />
                    <span>{language === 'sv' ? 'Löpande optimering' : 'Continuous optimization'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After */}
      <BeforeAfterSection />

      {/* Who It's For - Target Audience */}
      <section className="py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
              {language === 'sv' ? 'För Företag Som ' : 'For Companies That '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
                {language === 'sv' ? 'Vill Växa Smart' : 'Want to Grow Smart'}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all">
              <Award className="h-12 w-12 text-accent-cyan mb-6" />
              <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">
                {language === 'sv' ? 'Tillväxtfas' : 'Growth Phase'}
              </h3>
              <p className="font-body text-gray-600 leading-relaxed mb-6">
                {language === 'sv'
                  ? 'Företag mellan 10-200 personer som är redo att skala operations och accelerera tillväxt.'
                  : 'Companies between 10-200 people ready to scale operations and accelerate growth.'}
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-accent-cyan flex-shrink-0 mt-0.5" />
                  <span>{language === 'sv' ? '€5M-50M ARR' : '€5M-50M ARR'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-accent-cyan flex-shrink-0 mt-0.5" />
                  <span>{language === 'sv' ? 'B2B-fokus' : 'B2B focus'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-accent-cyan flex-shrink-0 mt-0.5" />
                  <span>{language === 'sv' ? 'Beprovat affärskoncept' : 'Proven business model'}</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all">
              <LineChart className="h-12 w-12 text-accent-emerald mb-6" />
              <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">
                {language === 'sv' ? 'Strategiskt Fokus' : 'Strategic Focus'}
              </h3>
              <p className="font-body text-gray-600 leading-relaxed mb-6">
                {language === 'sv'
                  ? 'Ledning som värderar långsiktig kapacitetsuppbyggnad framför snabba fixes.'
                  : 'Leadership that values long-term capacity building over quick fixes.'}
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-accent-emerald flex-shrink-0 mt-0.5" />
                  <span>{language === 'sv' ? 'Data-drivna beslut' : 'Data-driven decisions'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-accent-emerald flex-shrink-0 mt-0.5" />
                  <span>{language === 'sv' ? 'Systemtankande' : 'Systems thinking'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-accent-emerald flex-shrink-0 mt-0.5" />
                  <span>{language === 'sv' ? 'Målbar ROI' : 'Measurable ROI'}</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all">
              <Shield className="h-12 w-12 text-accent-amber mb-6" />
              <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">
                {language === 'sv' ? 'Vill Behålla Kontrollen' : 'Want to Retain Control'}
              </h3>
              <p className="font-body text-gray-600 leading-relaxed mb-6">
                {language === 'sv'
                  ? 'Bolag som vill äga sina system, data och processer utan leverantörslåsning.'
                  : 'Companies that want to own their systems, data and processes without vendor lock-in.'}
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-accent-amber flex-shrink-0 mt-0.5" />
                  <span>{language === 'sv' ? 'Egen datasuveränitet' : 'Own data sovereignty'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-accent-amber flex-shrink-0 mt-0.5" />
                  <span>{language === 'sv' ? 'Kunskapsöverföring' : 'Knowledge transfer'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-accent-amber flex-shrink-0 mt-0.5" />
                  <span>{language === 'sv' ? 'Långsiktigt värde' : 'Long-term value'}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-16">
            <Link
              to="/industries"
              className="inline-flex items-center text-primary-600 hover:text-accent-cyan font-bold text-xl group"
            >
              {language === 'sv' ? 'Se branscher vi arbetar med' : 'View industries we serve'}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA - Strategic & Premium */}
      <section className="py-40 bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]">
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-accent-cyan rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-accent-emerald rounded-full blur-[120px]"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-10">
            <Sparkles className="h-16 w-16 text-accent-cyan mx-auto" />
          </div>
          <h2 className="font-heading text-5xl lg:text-7xl font-black mb-8 tracking-tight leading-tight">
            {language === 'sv' ? 'Redo Att Accelerera?' : 'Ready to Accelerate?'}
          </h2>
          <p className="font-body text-2xl text-white/90 mb-16 leading-relaxed max-w-3xl mx-auto">
            {language === 'sv'
              ? 'Börja med en strategidialog där vi utforskar era utmaningar och hur vi kan skapa mätbar effekt tillsammans.'
              : 'Start with a strategy discussion where we explore your challenges and how we can create measurable impact together.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link
              to="/contact"
              className="group bg-gradient-to-r from-accent-cyan to-accent-emerald text-gray-900 px-12 py-6 rounded-2xl font-black text-xl inline-flex items-center justify-center hover:shadow-glow transition-all duration-300 transform hover:scale-105"
            >
              {language === 'sv' ? 'Boka Strategidialog' : 'Book Strategy Discussion'}
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/impact"
              className="group border-2 border-white/30 text-white px-12 py-6 rounded-2xl font-bold text-xl inline-flex items-center justify-center hover:border-white/60 hover:bg-white/10 transition-all duration-300"
            >
              {language === 'sv' ? 'Se Vår Impact' : 'View Our Impact'}
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-12 border-t border-white/10">
            <div className="text-center">
              <div className="font-heading text-3xl font-black text-accent-cyan mb-2">95%</div>
              <p className="text-sm text-white/70">{language === 'sv' ? 'Kundretention' : 'Client retention'}</p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="font-heading text-3xl font-black text-accent-emerald mb-2">3v</div>
              <p className="text-sm text-white/70">{language === 'sv' ? 'Till första resultat' : 'To first results'}</p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="font-heading text-3xl font-black text-accent-amber mb-2">€5M+</div>
              <p className="text-sm text-white/70">{language === 'sv' ? 'Minimikrav ARR' : 'Minimum ARR'}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-gray-900 py-2 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-gray-500">
            Build v2025.01.15.{new Date().getTime()} | Deployed: {new Date().toISOString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
