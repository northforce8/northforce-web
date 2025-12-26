import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Target, DollarSign, Briefcase, Users, Scale, Shield, CheckCircle, Brain, Zap, LineChart, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SEOHead from '../components/SEOHead';
import BenefitsGrid from '../components/BenefitsGrid';
import ObjectionsSection from '../components/ObjectionsSection';
import BeforeAfterSection from '../components/BeforeAfterSection';

const HybridModelPage = () => {
  const { language } = useLanguage();

  const expertAreas = [
    {
      icon: <TrendingUp className="h-10 w-10" />,
      color: 'text-accent-cyan',
      title: language === 'sv' ? 'Sälj' : 'Sales',
      description: language === 'sv'
        ? 'Pipeline-optimering, affärshastighet, forecast-precision och win rate-förbättring genom strukturerad metodik och datadriven approach.'
        : 'Pipeline optimization, deal velocity, forecast precision and win rate improvement through structured methodology and data-driven approach.',
    },
    {
      icon: <Target className="h-10 w-10" />,
      color: 'text-accent-purple',
      title: language === 'sv' ? 'Marknad' : 'Marketing',
      description: language === 'sv'
        ? 'Strategisk positionering, efterfrågegenerering, content excellence och mätbar ROI över alla kanaler med fokus på kvalificerade leads.'
        : 'Strategic positioning, demand generation, content excellence and measurable ROI across all channels focused on qualified leads.',
    },
    {
      icon: <DollarSign className="h-10 w-10" />,
      color: 'text-accent-emerald',
      title: language === 'sv' ? 'Ekonomi' : 'Finance',
      description: language === 'sv'
        ? 'Business intelligence, KPI-ramverk, pricing strategy och finansiell kontroll för starkare marginaler och prediktabel tillväxt.'
        : 'Business intelligence, KPI framework, pricing strategy and financial control for stronger margins and predictable growth.',
    },
    {
      icon: <Briefcase className="h-10 w-10" />,
      color: 'text-accent-amber',
      title: language === 'sv' ? 'Ledning' : 'Leadership',
      description: language === 'sv'
        ? 'Strategisk planering, OKR-implementation, beslutssystem och governance för tydlig riktning och effektiv exekvering.'
        : 'Strategic planning, OKR implementation, decision systems and governance for clear direction and effective execution.',
    },
    {
      icon: <Users className="h-10 w-10" />,
      color: 'text-accent-rose',
      title: 'HR',
      description: language === 'sv'
        ? 'Talangrekrytering, organisationsdesign, kultur och employer branding för att attrahera och behålla A-players.'
        : 'Talent acquisition, organizational design, culture and employer branding to attract and retain A-players.',
    },
    {
      icon: <Scale className="h-10 w-10" />,
      color: 'text-primary-600',
      title: language === 'sv' ? 'Juridik' : 'Legal',
      description: language === 'sv'
        ? 'Avtalsstruktur, compliance-framework, riskhantering och juridisk infrastruktur för skalbar affärsverksamhet.'
        : 'Contract structure, compliance framework, risk management and legal infrastructure for scalable business operations.',
    },
  ];

  const engagementModel = [
    {
      phase: language === 'sv' ? 'Discovery' : 'Discovery',
      duration: language === 'sv' ? '2-4 veckor' : '2-4 weeks',
      description: language === 'sv'
        ? 'Djupdykning i affären, nulägesanalys och identifiering av strategiska möjligheter'
        : 'Deep-dive into business, current state analysis and identification of strategic opportunities',
    },
    {
      phase: language === 'sv' ? 'Design' : 'Design',
      duration: language === 'sv' ? '3-6 veckor' : '3-6 weeks',
      description: language === 'sv'
        ? 'Målbild, roadmap, systemdesign och kapacitetsplanering anpassat efter era behov'
        : 'Target state, roadmap, system design and capacity planning tailored to your needs',
    },
    {
      phase: language === 'sv' ? 'Delivery' : 'Delivery',
      duration: language === 'sv' ? 'Kontinuerlig' : 'Continuous',
      description: language === 'sv'
        ? 'Löpande implementation, optimering och skalning i veckocykler med mätbara resultat'
        : 'Ongoing implementation, optimization and scaling in weekly cycles with measurable results',
    },
  ];

  const principles = [
    {
      title: language === 'sv' ? 'Ni behåller kontrollen' : 'You Retain Control',
      description: language === 'sv'
        ? 'Er data, era system, era beslut. Vi driver execution men du äger alltid outcome.'
        : 'Your data, your systems, your decisions. We drive execution but you always own the outcome.',
      icon: <Shield className="h-8 w-8" />,
    },
    {
      title: language === 'sv' ? 'Kontinuerlig närvaro' : 'Continuous Presence',
      description: language === 'sv'
        ? 'Inte projektbaserat utan långsiktig strategisk partner med veckoprocess och tät kommunikation.'
        : 'Not project-based but long-term strategic partner with weekly process and tight communication.',
      icon: <RefreshCw className="h-8 w-8" />,
    },
    {
      title: language === 'sv' ? 'Mätbar påverkan' : 'Measurable Impact',
      description: language === 'sv'
        ? 'Varje insats kopplas till affärsmål med tydliga KPIer och transparent uppföljning.'
        : 'Every effort connected to business goals with clear KPIs and transparent follow-up.',
      icon: <LineChart className="h-8 w-8" />,
    },
    {
      title: language === 'sv' ? 'Flexibel kapacitet' : 'Flexible Capacity',
      description: language === 'sv'
        ? 'Skala upp och ner, flytta resurser mellan områden baserat på var behoven är störst.'
        : 'Scale up and down, move resources between areas based on where needs are greatest.',
      icon: <Zap className="h-8 w-8" />,
    },
  ];

  return (
    <div className="bg-white overflow-hidden">
      <SEOHead
        title={language === 'sv'
          ? 'Hybridmodellen — NorthForce'
          : 'The Hybrid Model — NorthForce'}
        description={language === 'sv'
          ? 'En ny generation av strategiskt partnerskap som kombinerar expertis, system och flexibel kapacitet för hållbar tillväxt.'
          : 'A new generation of strategic partnership combining expertise, systems and flexible capacity for sustainable growth.'}
        canonicalUrl="https://northforce.io/hybrid-model"
      />

      {/* Hero - Elegant & Minimal */}
      <section className="relative min-h-[70vh] flex items-center bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-cyan rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-emerald rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-accent-cyan/20 text-accent-cyan rounded-full text-sm font-semibold tracking-wide uppercase">
              {language === 'sv' ? 'Nästa Generation' : 'Next Generation'}
            </span>
          </div>

          <h1 className="font-heading text-5xl lg:text-7xl font-black mb-8 tracking-tight leading-[1.1]">
            {language === 'sv' ? 'Hybrid' : 'The Hybrid'}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-emerald">
              {language === 'sv' ? 'modellen' : ' Model'}
            </span>
          </h1>

          <p className="font-body text-xl lg:text-2xl text-white/80 mb-12 leading-relaxed max-w-3xl mx-auto">
            {language === 'sv'
              ? 'Vi kombinerar det bästa från strategisk rådgivning, teknologileverantörer och inhouse-team i en integrerad modell för modern tillväxt.'
              : 'We combine the best of management consulting, technology providers and in-house teams in an integrated model for modern growth.'}
          </p>

          <Link
            to="/contact"
            className="inline-flex items-center bg-white text-gray-900 px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl group"
          >
            {language === 'sv' ? 'Diskutera Era Behov' : 'Discuss Your Needs'}
            <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* The Challenge - Problem Statement */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {language === 'sv' ? 'Utmaningen' : 'The Challenge'}
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {language === 'sv'
                ? 'Växande företag behöver nya lösningar'
                : 'Growing companies need new solutions'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <div className="text-gray-400 mb-4 text-sm font-semibold uppercase tracking-wide">
                {language === 'sv' ? 'Anställningar' : 'Hiring'}
              </div>
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-4">
                {language === 'sv' ? 'Hög risk, lång tid' : 'High Risk, Long Time'}
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">—</span>
                  {language === 'sv' ? 'Felrekrytering kostar 18-24 månader' : 'Wrong hire costs 18-24 months'}
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">—</span>
                  {language === 'sv' ? 'Personberoende och single points of failure' : 'Person-dependent and single points of failure'}
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">—</span>
                  {language === 'sv' ? 'Svårt att skala kapacitet flexibelt' : 'Difficult to scale capacity flexibly'}
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <div className="text-gray-400 mb-4 text-sm font-semibold uppercase tracking-wide">
                {language === 'sv' ? 'Konsulter' : 'Consultants'}
              </div>
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-4">
                {language === 'sv' ? 'Fragmentering' : 'Fragmentation'}
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">—</span>
                  {language === 'sv' ? 'Flera leverantörer utan samordning' : 'Multiple vendors without coordination'}
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">—</span>
                  {language === 'sv' ? 'Projekttänk med deadline-stress' : 'Project thinking with deadline stress'}
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">—</span>
                  {language === 'sv' ? 'Kunskap försvinner när projektet avslutas' : 'Knowledge disappears when project ends'}
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <div className="text-gray-400 mb-4 text-sm font-semibold uppercase tracking-wide">
                {language === 'sv' ? 'Byråer' : 'Agencies'}
              </div>
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-4">
                {language === 'sv' ? 'Silotänk' : 'Silo Thinking'}
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">—</span>
                  {language === 'sv' ? 'Fokus på output istället för outcome' : 'Focus on output instead of outcome'}
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">—</span>
                  {language === 'sv' ? 'Kampanjtänk utan långsiktighet' : 'Campaign thinking without long-term view'}
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">—</span>
                  {language === 'sv' ? 'Ingen koppling till affärsstrategi' : 'No connection to business strategy'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Areas - Professional Grid */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {language === 'sv' ? 'Sex Integrerade ' : 'Six Integrated '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
                {language === 'sv' ? 'Kapabiliteter' : 'Capabilities'}
              </span>
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {language === 'sv'
                ? 'Alla arbetar i era system, med er data, mot samma affärsmål'
                : 'All work in your systems, with your data, towards the same business goals'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {expertAreas.map((area, index) => (
              <div
                key={index}
                className="group bg-white border border-gray-200 rounded-xl p-8 hover:border-primary-600/40 hover:shadow-xl transition-all duration-300"
              >
                <div className={`${area.color} mb-6 transform group-hover:scale-110 transition-transform`}>
                  {area.icon}
                </div>
                <h3 className="font-heading text-2xl font-bold text-gray-900 mb-4">{area.title}</h3>
                <p className="font-body text-gray-600 leading-relaxed text-sm">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After */}
      <BeforeAfterSection />

      {/* Core Principles */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {language === 'sv' ? 'Fundamentala ' : 'Fundamental '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
                {language === 'sv' ? 'Principer' : 'Principles'}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {principles.map((principle, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-8">
                <div className="text-primary-600 mb-4">
                  {principle.icon}
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">
                  {principle.title}
                </h3>
                <p className="font-body text-gray-600 leading-relaxed">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Model */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {language === 'sv' ? 'Så Vi ' : 'How We '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
                {language === 'sv' ? 'Samarbetar' : 'Partner'}
              </span>
            </h2>
          </div>

          <div className="space-y-6">
            {engagementModel.map((phase, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-8 flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-cyan rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between mb-3">
                    <h3 className="font-heading text-2xl font-bold text-gray-900">{phase.phase}</h3>
                    <span className="text-sm text-gray-500 font-semibold">{phase.duration}</span>
                  </div>
                  <p className="font-body text-gray-600 leading-relaxed">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits - 20 Reasons */}
      <BenefitsGrid />

      {/* Objections */}
      <ObjectionsSection />

      {/* Investment Approach - No Explicit Pricing */}
      <section className="py-32 bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Scale className="h-16 w-16 text-accent-cyan mx-auto mb-8" />
          <h2 className="font-heading text-4xl lg:text-5xl font-black mb-8">
            {language === 'sv' ? 'Investering & Scope' : 'Investment & Scope'}
          </h2>
          <p className="font-body text-xl text-white/80 mb-12 leading-relaxed">
            {language === 'sv'
              ? 'Varje engagement är unikt och skräddarsys efter era specifika behov, ambitioner och nuläge. Vi tror på transparens och tydlighet, men också på att värde kommer först.'
              : 'Each engagement is unique and tailored to your specific needs, ambitions and current state. We believe in transparency and clarity, but also that value comes first.'}
          </p>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-12 text-left">
            <h3 className="font-heading text-2xl font-bold mb-6 text-center">
              {language === 'sv' ? 'Modellen bygger på tre komponenter:' : 'The model builds on three components:'}
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-accent-emerald flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold mb-1">{language === 'sv' ? 'Strategisk Plattform' : 'Strategic Platform'}</h4>
                  <p className="text-white/70 text-sm">
                    {language === 'sv'
                      ? 'System, verktyg, licenser och infrastruktur som bär arbetet'
                      : 'Systems, tools, licenses and infrastructure that carry the work'}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-accent-emerald flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold mb-1">{language === 'sv' ? 'Expert-kapacitet' : 'Expert Capacity'}</h4>
                  <p className="text-white/70 text-sm">
                    {language === 'sv'
                      ? 'Flexibel tillgång till specialister inom alla sex områden'
                      : 'Flexible access to specialists across all six areas'}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-accent-emerald flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold mb-1">{language === 'sv' ? 'Strategisk Ledning' : 'Strategic Leadership'}</h4>
                  <p className="text-white/70 text-sm">
                    {language === 'sv'
                      ? 'Kontinuerlig styrning, prioritering och beslutsunderlag'
                      : 'Continuous governance, prioritization and decision support'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/contact"
            className="inline-flex items-center bg-white text-gray-900 px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl group"
          >
            {language === 'sv' ? 'Diskutera Era Behov' : 'Discuss Your Needs'}
            <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HybridModelPage;
