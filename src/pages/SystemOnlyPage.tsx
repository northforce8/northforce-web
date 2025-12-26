import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, TrendingUp, Target, Users, Zap, Clock, CheckCircle, BarChart, Workflow, Shield, RefreshCw, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SEOHead from '../components/SEOHead';

const SystemOnlyPage = () => {
  const { language } = useLanguage();

  const problems = [
    {
      problem: language === 'sv' ? 'Förlorade leads och dålig uppföljning' : 'Lost leads and poor follow-up',
      solution: language === 'sv' ? 'Central plattform för hela kundresan' : 'Central platform for the entire customer journey',
    },
    {
      problem: language === 'sv' ? 'Ingen pipeline-struktur eller synlighet' : 'No pipeline structure or visibility',
      solution: language === 'sv' ? 'Automatiska kundflöden och processer' : 'Automated customer flows and processes',
    },
    {
      problem: language === 'sv' ? 'Fragmenterade verktyg och systemen' : 'Fragmented tools and systems',
      solution: language === 'sv' ? 'Ett samlat affärssystem för marknad, sälj och leverans' : 'One unified business system for marketing, sales and delivery',
    },
    {
      problem: language === 'sv' ? 'Manuellt arbete i varje process' : 'Manual work in every process',
      solution: language === 'sv' ? 'Smartare arbetsflöden med AI och automation' : 'Smarter workflows with AI and automation',
    },
    {
      problem: language === 'sv' ? 'Svårt att växa utan att anställa' : 'Hard to grow without hiring',
      solution: language === 'sv' ? 'Digital motor som skalar utan proportionella kostnader' : 'Digital engine that scales without proportional costs',
    },
    {
      problem: language === 'sv' ? 'Ingen central bild av kunden' : 'No central view of the customer',
      solution: language === 'sv' ? 'Komplett kundöversikt och datadriven styrning' : 'Complete customer overview and data-driven governance',
    },
  ];

  const capabilities = [
    {
      icon: <Target className="h-10 w-10" />,
      title: language === 'sv' ? 'Försäljning & Pipeline' : 'Sales & Pipeline',
      description: language === 'sv'
        ? 'Strukturerad pipeline, automatiserad lead-hantering och tydlig försäljningsprocess från första kontakt till avslut.'
        : 'Structured pipeline, automated lead management and clear sales process from first contact to close.',
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: language === 'sv' ? 'Kundrelationer & CRM' : 'Customer Relations & CRM',
      description: language === 'sv'
        ? 'Central kundvy, historik, kommunikation och automatiserad uppföljning som säkerställer att ingen kontakt faller mellan stolarna.'
        : 'Central customer view, history, communication and automated follow-up ensuring no contact falls through the cracks.',
    },
    {
      icon: <Zap className="h-10 w-10" />,
      title: language === 'sv' ? 'Marknad & Kampanjer' : 'Marketing & Campaigns',
      description: language === 'sv'
        ? 'Automatiserade kampanjer, segment, landing pages och kommunikationsflöden som driver kvalificerade leads till försäljning.'
        : 'Automated campaigns, segments, landing pages and communication flows driving qualified leads to sales.',
    },
    {
      icon: <Workflow className="h-10 w-10" />,
      title: language === 'sv' ? 'Kundresor & Automation' : 'Customer Journeys & Automation',
      description: language === 'sv'
        ? 'Intelligenta flöden som guidar kunder genom hela resan – från intresse till köp till leverans till retention.'
        : 'Intelligent flows guiding customers through the entire journey – from interest to purchase to delivery to retention.',
    },
    {
      icon: <BarChart className="h-10 w-10" />,
      title: language === 'sv' ? 'Styrning & Insikter' : 'Governance & Insights',
      description: language === 'sv'
        ? 'Dashboards, KPIer och realtidsdata som ger ledningen full transparens och möjlighet till datadrivna beslut.'
        : 'Dashboards, KPIs and real-time data giving management full transparency and ability for data-driven decisions.',
    },
    {
      icon: <Layers className="h-10 w-10" />,
      title: language === 'sv' ? 'Digital Leverans' : 'Digital Delivery',
      description: language === 'sv'
        ? 'Komplett plattform för kurser, medlemskap, community och digital produktleverans utan externa verktyg.'
        : 'Complete platform for courses, memberships, community and digital product delivery without external tools.',
    },
  ];

  const benefits = [
    {
      title: language === 'sv' ? 'Snabb Implementation' : 'Rapid Implementation',
      description: language === 'sv'
        ? 'Veckor, inte månader. Systemet är designat för att ge värde från dag ett utan långa projekt.'
        : 'Weeks, not months. The system is designed to deliver value from day one without lengthy projects.',
    },
    {
      title: language === 'sv' ? 'Skalbar Utan Komplexitet' : 'Scalable Without Complexity',
      description: language === 'sv'
        ? 'Växer med er verksamhet. Lägg till kapacitet, användare och funktioner när ni behöver det.'
        : 'Grows with your business. Add capacity, users and features when you need them.',
    },
    {
      title: language === 'sv' ? 'Kombineras Med Befintligt' : 'Combines With Existing',
      description: language === 'sv'
        ? 'Arbetar parallellt med nuvarande system. Ni behöver inte ersätta allt på en gång.'
        : 'Works alongside current systems. You don\'t need to replace everything at once.',
    },
    {
      title: language === 'sv' ? 'Företagsgrad, Enkel Start' : 'Enterprise-Grade, Simple Start',
      description: language === 'sv'
        ? 'Samma kraftfulla motor som stora organisationer använder, men utan deras komplexitet.'
        : 'Same powerful engine that large organizations use, but without their complexity.',
    },
  ];

  const idealFor = [
    language === 'sv' ? 'Företag som vill digitalisera snabbt' : 'Companies wanting to digitalize quickly',
    language === 'sv' ? 'Team som behöver struktur innan tillväxt' : 'Teams needing structure before growth',
    language === 'sv' ? 'Organisationer som vill minska manuellt arbete' : 'Organizations wanting to reduce manual work',
    language === 'sv' ? 'Ledare som vill ha bättre styrning och transparens' : 'Leaders wanting better governance and transparency',
    language === 'sv' ? 'Bolag som vill skala utan att anställa stora team' : 'Companies wanting to scale without hiring large teams',
    language === 'sv' ? 'Verksamheter med fragmenterade verktyg' : 'Businesses with fragmented tools',
  ];

  return (
    <div className="bg-white overflow-hidden">
      <SEOHead
        title={language === 'sv' ? 'NorthForce System — Hel Tillväxtmotor i Ett System' : 'NorthForce System — Your Entire Growth Engine in One System'}
        description={language === 'sv'
          ? 'Struktur, automation, kundresor och digital leverans — utan att ersätta verktygen ni redan använder.'
          : 'Structure, automation, customer journeys and digital delivery — without replacing the tools you already use.'}
        canonicalUrl="https://northforce.io/system"
      />

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-primary-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-accent-cyan rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-accent-cyan/20 text-accent-cyan rounded-full text-sm font-semibold tracking-wide uppercase">
              {language === 'sv' ? 'Komplett Systemlösning' : 'Complete System Solution'}
            </span>
          </div>

          <h1 className="font-heading text-5xl lg:text-7xl font-black mb-8 tracking-tight leading-tight">
            {language === 'sv' ? 'Hela Er Tillväxtmotor' : 'Your Entire Growth Engine'}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-accent-emerald to-white">
              {language === 'sv' ? 'i Ett System' : 'in One System'}
            </span>
          </h1>

          <p className="font-body text-xl lg:text-2xl text-white/80 mb-12 leading-relaxed max-w-3xl mx-auto">
            {language === 'sv'
              ? 'Struktur, automation, kundresor och digital leverans — utan att ersätta verktygen ni redan använder. Börja enkelt, skala smart.'
              : 'Structure, automation, customer journeys and digital delivery — without replacing the tools you already use. Start simple, scale smart.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center bg-white text-gray-900 px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl group"
            >
              {language === 'sv' ? 'Kom Igång Med Systemet' : 'Start With System Only'}
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 group"
            >
              {language === 'sv' ? 'Boka Strategidialog' : 'Book Strategy Call'}
              <Sparkles className="ml-3 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Concept Explanation */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-5xl font-black text-gray-900 mb-8">
              {language === 'sv' ? 'Ett Affärsnav Som Binder Samman ' : 'A Business Hub That Connects '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
                {language === 'sv' ? 'Allt' : 'Everything'}
              </span>
            </h2>
            <p className="font-body text-xl text-gray-600 leading-relaxed">
              {language === 'sv'
                ? 'NorthForce-systemet fungerar som den centrala motorn i er verksamhet — det skapar en enhetlig struktur som kopplar samman försäljning, marknad, leverans och kundrelationer.'
                : 'The NorthForce system functions as the central engine of your business — it creates a unified structure connecting sales, marketing, delivery and customer relations.'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-10">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-accent-cyan rounded-full mt-2 flex-shrink-0"></div>
                <p className="font-body text-lg text-gray-700 leading-relaxed">
                  {language === 'sv'
                    ? 'Minskar manuellt arbete genom intelligenta automatiseringar och arbetsflöden'
                    : 'Reduces manual work through intelligent automations and workflows'}
                </p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-accent-cyan rounded-full mt-2 flex-shrink-0"></div>
                <p className="font-body text-lg text-gray-700 leading-relaxed">
                  {language === 'sv'
                    ? 'Ger ledningen en tydlig bild av pipeline, kundstatus och prioriteringar'
                    : 'Gives management a clear view of pipeline, customer status and priorities'}
                </p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-accent-cyan rounded-full mt-2 flex-shrink-0"></div>
                <p className="font-body text-lg text-gray-700 leading-relaxed">
                  {language === 'sv'
                    ? 'Skapar förutsägbarhet och kvalitet i alla kundprocesser'
                    : 'Creates predictability and quality in all customer processes'}
                </p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-accent-cyan rounded-full mt-2 flex-shrink-0"></div>
                <p className="font-body text-lg text-gray-700 leading-relaxed">
                  {language === 'sv'
                    ? 'Möjliggör tillväxt utan att bygga stora interna team'
                    : 'Enables growth without building large internal teams'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="font-body text-lg text-gray-600 italic">
              {language === 'sv'
                ? 'Företag kan börja med systemet som standalone-lösning och växa in i hybridmodellen senare när specialist-kapacitet behövs.'
                : 'Companies can start with the system as a standalone solution and grow into the hybrid model later when specialist capacity is needed.'}
            </p>
          </div>
        </div>
      </section>

      {/* Problem → Solution */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {language === 'sv' ? 'Från Problem till ' : 'From Problem to '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
                {language === 'sv' ? 'Resultat' : 'Results'}
              </span>
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'sv'
                ? 'NorthForce löser de utmaningar som håller tillväxten tillbaka'
                : 'NorthForce solves the challenges holding back growth'}
            </p>
          </div>

          <div className="space-y-6">
            {problems.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-8 hover:border-primary-600/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-red-600 font-bold text-sm">✕</span>
                    </div>
                    <div>
                      <p className="font-heading text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        {language === 'sv' ? 'Problem' : 'Problem'}
                      </p>
                      <p className="font-body text-lg text-gray-900">
                        {item.problem}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-heading text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-2">
                        {language === 'sv' ? 'Lösning' : 'Solution'}
                      </p>
                      <p className="font-body text-lg text-gray-900 font-semibold">
                        {item.solution}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities (not features) */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {language === 'sv' ? 'Komplett ' : 'Complete '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
                {language === 'sv' ? 'Affärskapacitet' : 'Business Capacity'}
              </span>
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'sv'
                ? 'Systemet hjälper företag att driva marknad, försäljning och leverans på ett mer strukturerat, automatiserat och datadrivet sätt'
                : 'The system helps companies run marketing, sales and delivery in a more structured, automated and data-driven way'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((capability, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-8 hover:border-primary-600/40 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="text-primary-600 mb-6 transform group-hover:scale-110 transition-transform">
                  {capability.icon}
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-4">
                  {capability.title}
                </h3>
                <p className="font-body text-gray-600 leading-relaxed">
                  {capability.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise-Level Simplicity */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {language === 'sv' ? 'Företagsgrad, ' : 'Enterprise-Level '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
                {language === 'sv' ? 'Enkel Start' : 'Simplicity'}
              </span>
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {language === 'sv'
                ? 'NorthForce ersätter inte nödvändigtvis allt ni har — det kompletterar, förstärker och kopplar ihop det.'
                : 'NorthForce doesn\'t necessarily replace everything you have — it complements, strengthens and connects it.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-8">
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="font-body text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white border border-primary-200 rounded-2xl p-8">
            <div className="flex items-start space-x-6">
              <Shield className="h-10 w-10 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">
                  {language === 'sv' ? 'Designat för Moderna Företag' : 'Designed for Modern Companies'}
                </h3>
                <p className="font-body text-gray-700 leading-relaxed">
                  {language === 'sv'
                    ? 'Systemet är byggt för företag som vill slippa långa projekt, komplexa migrationer och tekniska hinder. Det arbetar parallellt med era nuvarande system och kan integreras eller användas fristående beroende på behov.'
                    : 'The system is built for companies wanting to avoid lengthy projects, complex migrations and technical barriers. It works alongside your current systems and can be integrated or used standalone depending on needs.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ideal For */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {language === 'sv' ? 'För Företag Som Vill ' : 'For Companies That Want '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
                {language === 'sv' ? 'Börja Enkelt' : 'To Start Simple'}
              </span>
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'sv'
                ? 'System Only är perfekt för er som vill digitalisera och strukturera verksamheten innan ni aktiverar specialistkapacitet'
                : 'System Only is perfect for those wanting to digitalize and structure operations before activating specialist capacity'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {idealFor.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-accent-emerald flex-shrink-0 mt-1" />
                  <p className="font-body text-lg text-gray-700">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block bg-primary-50 border border-primary-200 rounded-2xl px-8 py-6">
              <p className="font-body text-lg text-gray-700">
                <span className="font-bold text-primary-600">
                  {language === 'sv' ? 'Viktigt:' : 'Important:'}
                </span>{' '}
                {language === 'sv'
                  ? 'Detta är en entry-level transformation, inte en light-version. Ni får tillgång till samma kraftfulla system som stora organisationer.'
                  : 'This is an entry-level transformation, not a light version. You get access to the same powerful system as large organizations.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration & Compatibility */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <RefreshCw className="h-16 w-16 text-primary-600 mx-auto mb-8" />
            <h2 className="font-heading text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {language === 'sv' ? 'Integration & ' : 'Integration & '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
                {language === 'sv' ? 'Kompatibilitet' : 'Compatibility'}
              </span>
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'sv'
                ? 'Affärsmässig kompatibilitet med era befintliga system och processer'
                : 'Business compatibility with your existing systems and processes'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-4">
                {language === 'sv' ? 'Arbetar Tillsammans' : 'Works Together'}
              </h3>
              <p className="font-body text-gray-600 leading-relaxed mb-6">
                {language === 'sv'
                  ? 'NorthForce kan enkelt lyfta in data från olika verktyg, komplettera befintliga system och modernisera processer gradvis.'
                  : 'NorthForce can easily pull data from various tools, complement existing systems and modernize processes gradually.'}
              </p>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-accent-cyan mt-1">→</span>
                  <span className="text-sm text-gray-600">
                    {language === 'sv' ? 'Integrerar med befintliga system' : 'Integrates with existing systems'}
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-accent-cyan mt-1">→</span>
                  <span className="text-sm text-gray-600">
                    {language === 'sv' ? 'Lyfter in data från olika verktyg' : 'Pulls data from various tools'}
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-accent-cyan mt-1">→</span>
                  <span className="text-sm text-gray-600">
                    {language === 'sv' ? 'Förstärker nuvarande kapacitet' : 'Strengthens current capacity'}
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-4">
                {language === 'sv' ? 'Gradvis Transformation' : 'Gradual Transformation'}
              </h3>
              <p className="font-body text-gray-600 leading-relaxed mb-6">
                {language === 'sv'
                  ? 'Ni behöver inte lämna era nuvarande system på en gång. Migrera i takt med behoven och när det passar verksamheten.'
                  : 'You don\'t need to leave your current systems at once. Migrate as needed and when it suits the business.'}
              </p>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-accent-cyan mt-1">→</span>
                  <span className="text-sm text-gray-600">
                    {language === 'sv' ? 'Ingen big bang-migration' : 'No big bang migration'}
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-accent-cyan mt-1">→</span>
                  <span className="text-sm text-gray-600">
                    {language === 'sv' ? 'Flexibel övergångsperiod' : 'Flexible transition period'}
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-accent-cyan mt-1">→</span>
                  <span className="text-sm text-gray-600">
                    {language === 'sv' ? 'Minimerad verksamhetsrisk' : 'Minimized business risk'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <TrendingUp className="h-16 w-16 text-accent-cyan mx-auto mb-8" />
          <h2 className="font-heading text-4xl lg:text-5xl font-black mb-8">
            {language === 'sv' ? 'Kom Igång Med NorthForce-Systemet' : 'Get Started With NorthForce System'}
          </h2>
          <p className="font-body text-xl text-white/80 mb-12 leading-relaxed">
            {language === 'sv'
              ? 'Vi börjar med en strategidialog där vi kartlägger era behov och designar rätt lösning. Ingen försäljning, bara professionell rådgivning.'
              : 'We start with a strategy discussion where we map your needs and design the right solution. No sales pitch, just professional advisory.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/contact"
              className="inline-flex items-center bg-white text-gray-900 px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl group"
            >
              {language === 'sv' ? 'Kom Igång Med Systemet' : 'Start With System Only'}
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 group"
            >
              {language === 'sv' ? 'Boka Strategidialog' : 'Book Strategy Call'}
              <Clock className="ml-3 h-5 w-5" />
            </Link>
          </div>

          <p className="text-sm text-white/60">
            {language === 'sv'
              ? 'Vill ni kombinera systemet med specialistkapacitet senare? Det är helt flexibelt — ni kan växa in i hybridmodellen när det passar er.'
              : 'Want to combine the system with specialist capacity later? It\'s completely flexible — you can grow into the hybrid model when it suits you.'}
          </p>
        </div>
      </section>
    </div>
  );
};

export default SystemOnlyPage;
