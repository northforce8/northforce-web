import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Bot, Workflow, Database, Cpu, BarChart, MessageSquare, Users, Clock, TrendingUp, CheckCircle, Sparkles, Code, Layers } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SEOHead from '../components/SEOHead';

const AIAutomationPage = () => {
  const { language } = useLanguage();

  const capabilities = [
    {
      icon: <Workflow className="h-10 w-10" />,
      color: 'text-accent-cyan',
      title: language === 'sv' ? 'Workflow Automation' : 'Workflow Automation',
      description: language === 'sv'
        ? 'Intelligenta flöden som minskar manuellt arbete och skapar förutsägbarhet i era processer.'
        : 'Intelligent flows that reduce manual work and create predictability in your processes.',
      examples: [
        language === 'sv' ? 'Lead-routing och kvalificering' : 'Lead routing and qualification',
        language === 'sv' ? 'Automatiserade kundresor' : 'Automated customer journeys',
        language === 'sv' ? 'Dataflöden mellan system' : 'Data flows between systems',
        language === 'sv' ? 'Interna processer och godkännanden' : 'Internal processes and approvals',
        language === 'sv' ? 'Notifieringar och uppföljningar' : 'Notifications and follow-ups',
      ],
    },
    {
      icon: <Bot className="h-10 w-10" />,
      color: 'text-accent-purple',
      title: language === 'sv' ? 'AI-Agenter & Assistenter' : 'AI Agents & Assistants',
      description: language === 'sv'
        ? 'Skräddarsydda AI-agenter som arbetar i era system, besvarar frågor och fattar beslut baserat på er data.'
        : 'Custom AI agents working in your systems, answering questions and making decisions based on your data.',
      examples: [
        language === 'sv' ? 'Kundservice-agenter 24/7' : 'Customer service agents 24/7',
        language === 'sv' ? 'Säljstöd och lead-kvalificering' : 'Sales support and lead qualification',
        language === 'sv' ? 'Interna kunskapsassistenter' : 'Internal knowledge assistants',
        language === 'sv' ? 'Dataanalys och insiktsrapporter' : 'Data analysis and insight reports',
        language === 'sv' ? 'Dokumenthantering och avtalsanalys' : 'Document management and contract analysis',
      ],
    },
    {
      icon: <Code className="h-10 w-10" />,
      color: 'text-accent-emerald',
      title: language === 'sv' ? 'System & Produktutveckling' : 'System & Product Development',
      description: language === 'sv'
        ? 'Vi utvecklar tekniska lösningar på riktigt – från prototyper till fullskaliga plattformar och integrationer.'
        : 'We develop real technical solutions – from prototypes to full-scale platforms and integrations.',
      examples: [
        language === 'sv' ? 'Interna appar och verktyg' : 'Internal apps and tools',
        language === 'sv' ? 'Plattformar och dashboards' : 'Platforms and dashboards',
        language === 'sv' ? 'API-integrationer' : 'API integrations',
        language === 'sv' ? 'Datamodeller och pipelines' : 'Data models and pipelines',
        language === 'sv' ? 'Skalbara system-moduler' : 'Scalable system modules',
      ],
    },
  ];

  const useCases = [
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: language === 'sv' ? 'AI-driven kundserviceagent' : 'AI-Driven Customer Service Agent',
      description: language === 'sv'
        ? 'Intelligent agent som hanterar kundfrågor 24/7, eskalar till team vid behov och lär sig kontinuerligt från era processer.'
        : 'Intelligent agent handling customer inquiries 24/7, escalating to team when needed and continuously learning from your processes.',
      impact: language === 'sv' ? '-65% svarstid, +40% kundnöjdhet' : '-65% response time, +40% customer satisfaction',
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: language === 'sv' ? 'Automatiserat lead-scoring' : 'Automated Lead Scoring',
      description: language === 'sv'
        ? 'System som analyserar, kvalificerar och routar leads baserat på beteende, data och era säljkriterier i realtid.'
        : 'System analyzing, qualifying and routing leads based on behavior, data and your sales criteria in real-time.',
      impact: language === 'sv' ? '+180% konvertering, -50% säljcykeltid' : '+180% conversion, -50% sales cycle time',
    },
    {
      icon: <BarChart className="h-8 w-8" />,
      title: language === 'sv' ? 'Unified Operations Dashboard' : 'Unified Operations Dashboard',
      description: language === 'sv'
        ? 'Centraliserad vy som kopplar ihop sälj, marknad och ekonomi med live-data, KPIer och prediktiv analys.'
        : 'Centralized view connecting sales, marketing and finance with live data, KPIs and predictive analytics.',
      impact: language === 'sv' ? 'Single source of truth, snabbare beslut' : 'Single source of truth, faster decisions',
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: language === 'sv' ? 'Intern AI-assistent' : 'Internal AI Assistant',
      description: language === 'sv'
        ? 'Kunskapsagent som svarar på frågor om dokument, avtal, policies och intern data direkt i era arbetsflöden.'
        : 'Knowledge agent answering questions about documents, contracts, policies and internal data directly in your workflows.',
      impact: language === 'sv' ? '-70% tid för informationssökning' : '-70% time searching for information',
    },
    {
      icon: <Layers className="h-8 w-8" />,
      title: language === 'sv' ? 'System-integrationer' : 'System Integrations',
      description: language === 'sv'
        ? 'Sömlösa kopplingar mellan CRM, ERP, ekonomisystem och externa verktyg med automatiserad datasynk.'
        : 'Seamless connections between CRM, ERP, finance systems and external tools with automated data sync.',
      impact: language === 'sv' ? 'Eliminerar manuell datainmatning' : 'Eliminates manual data entry',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: language === 'sv' ? 'Automatiserad onboarding' : 'Automated Onboarding',
      description: language === 'sv'
        ? 'Intelligenta flöden som guidar nya kunder eller medarbetare genom hela processen med personaliserad kommunikation.'
        : 'Intelligent flows guiding new customers or employees through the entire process with personalized communication.',
      impact: language === 'sv' ? '-80% admin-tid, bättre upplevelse' : '-80% admin time, better experience',
    },
    {
      icon: <Cpu className="h-8 w-8" />,
      title: language === 'sv' ? 'Intern produktionsapp' : 'Internal Production App',
      description: language === 'sv'
        ? 'Skräddarsydda verktyg för projekt, produktion eller planering som är byggda exakt efter era processer och behov.'
        : 'Custom tools for projects, production or planning built exactly according to your processes and needs.',
      impact: language === 'sv' ? 'Perfekt anpassning, snabb leverans' : 'Perfect fit, rapid delivery',
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: language === 'sv' ? 'AI-styrd affärsanalys' : 'AI-Powered Business Analysis',
      description: language === 'sv'
        ? 'Kontinuerlig analys av kund- och affärsdata med intelligenta insikter, trender och rekommendationer.'
        : 'Continuous analysis of customer and business data with intelligent insights, trends and recommendations.',
      impact: language === 'sv' ? 'Proaktiva beslut, nya möjligheter' : 'Proactive decisions, new opportunities',
    },
  ];

  const benefits = [
    {
      title: language === 'sv' ? 'Snabbare implementering' : 'Faster Implementation',
      description: language === 'sv'
        ? 'Veckor istället för månader tack vare vår moderna tech stack och proven metodologi.'
        : 'Weeks instead of months thanks to our modern tech stack and proven methodology.',
    },
    {
      title: language === 'sv' ? 'Minskad manuell tid' : 'Reduced Manual Time',
      description: language === 'sv'
        ? 'Frigör teamets tid från repetitiva uppgifter till strategiskt arbete som driver värde.'
        : 'Free team time from repetitive tasks to strategic work that drives value.',
    },
    {
      title: language === 'sv' ? 'Datadriven styrning' : 'Data-Driven Governance',
      description: language === 'sv'
        ? 'Beslut baserade på realtidsdata och AI-insikter istället för magkänsla och antaganden.'
        : 'Decisions based on real-time data and AI insights instead of gut feeling and assumptions.',
    },
    {
      title: language === 'sv' ? 'Högre processkvalitet' : 'Higher Process Quality',
      description: language === 'sv'
        ? 'Konsekvent exekvering, färre fel och förutsägbara resultat genom automation.'
        : 'Consistent execution, fewer errors and predictable results through automation.',
    },
    {
      title: language === 'sv' ? 'Minskad kostnad' : 'Reduced Cost',
      description: language === 'sv'
        ? 'Bygg lösningar utan att anställa utvecklingsteam eller binda långsiktiga IT-resurser.'
        : 'Build solutions without hiring development teams or committing long-term IT resources.',
    },
    {
      title: language === 'sv' ? 'Skalbar kapacitet' : 'Scalable Capacity',
      description: language === 'sv'
        ? 'System och AI-agenter som växer med er utan proportionellt ökade personalkostnader.'
        : 'Systems and AI agents that grow with you without proportionally increased personnel costs.',
    },
  ];

  return (
    <div className="bg-white overflow-hidden">
      <SEOHead
        title={language === 'sv' ? 'AI & Automation — NorthForce' : 'AI & Automation — NorthForce'}
        description={language === 'sv'
          ? 'AI-agenter, automation och systemutveckling som driver verkliga affärsresultat. Från workflows till skräddarsydda appar.'
          : 'AI agents, automation and system development driving real business results. From workflows to custom apps.'}
        canonicalUrl="https://northforce.io/ai-automation"
      />

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-cyan rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-purple rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-accent-cyan/20 text-accent-cyan rounded-full text-sm font-semibold tracking-wide uppercase">
              {language === 'sv' ? 'Teknisk Kraft' : 'Technical Power'}
            </span>
          </div>

          <h1 className="font-heading text-5xl lg:text-7xl font-black mb-8 tracking-tight leading-tight">
            AI & Automation
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-emerald">
              {language === 'sv' ? 'För Verklig Påverkan' : 'For Real Impact'}
            </span>
          </h1>

          <p className="font-body text-xl lg:text-2xl text-white/80 mb-12 leading-relaxed max-w-3xl mx-auto">
            {language === 'sv'
              ? 'Från workflows till skräddarsydda appar – vi designar intelligenta system som accelererar era processer och bygger kapacitet utan att anställa.'
              : 'From workflows to custom apps – we design intelligent systems that accelerate your processes and build capacity without hiring.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center bg-white text-gray-900 px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl group"
            >
              {language === 'sv' ? 'Boka Strategidialog' : 'Book Strategy Discussion'}
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/audit"
              className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 group"
            >
              {language === 'sv' ? 'Gratis AI-Analys' : 'Free AI Analysis'}
              <Sparkles className="ml-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Three Capability Levels */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {language === 'sv' ? 'Tre Nivåer av ' : 'Three Levels of '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
                {language === 'sv' ? 'Teknisk Kapacitet' : 'Technical Capacity'}
              </span>
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {language === 'sv'
                ? 'Vi kombinerar automation, AI och utveckling för att skapa lösningar som traditionella konsultteam tar månader att bygga'
                : 'We combine automation, AI and development to create solutions that traditional consulting teams take months to build'}
            </p>
          </div>

          <div className="space-y-16">
            {capabilities.map((capability, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-10"
              >
                <div className="flex items-start space-x-6 mb-8">
                  <div className={`${capability.color} flex-shrink-0`}>
                    {capability.icon}
                  </div>
                  <div>
                    <h3 className="font-heading text-3xl font-black text-gray-900 mb-4">
                      {capability.title}
                    </h3>
                    <p className="font-body text-lg text-gray-700 leading-relaxed">
                      {capability.description}
                    </p>
                  </div>
                </div>

                <div className="ml-16">
                  <h4 className="font-heading text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
                    {language === 'sv' ? 'Exempel på vad vi bygger:' : 'Examples of what we build:'}
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {capability.examples.map((example, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-accent-emerald flex-shrink-0 mt-0.5" />
                        <span className="font-body text-gray-700">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery in Hybrid Model */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {language === 'sv' ? 'Hur Det ' : 'How It\'s '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
                {language === 'sv' ? 'Levereras' : 'Delivered'}
              </span>
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'sv'
                ? 'Flexibel leverans anpassad efter behov och omfattning'
                : 'Flexible delivery adapted to needs and scope'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-cyan rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                1
              </div>
              <h3 className="font-heading text-2xl font-bold text-gray-900 mb-4">
                {language === 'sv' ? 'Del av Abonnemanget' : 'Part of Subscription'}
              </h3>
              <p className="font-body text-gray-700 leading-relaxed mb-6">
                {language === 'sv'
                  ? 'När AI eller automation behövs inom något av de sex expertområdena använder ni tokens för utveckling, systemuppsättning eller anpassningar.'
                  : 'When AI or automation is needed within any of the six expert areas, you use tokens for development, system setup or customizations.'}
              </p>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-accent-cyan mt-1">→</span>
                  <span className="text-sm text-gray-600">
                    {language === 'sv' ? 'Flexibel kapacitet' : 'Flexible capacity'}
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-accent-cyan mt-1">→</span>
                  <span className="text-sm text-gray-600">
                    {language === 'sv' ? 'Löpande optimering' : 'Continuous optimization'}
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-accent-cyan mt-1">→</span>
                  <span className="text-sm text-gray-600">
                    {language === 'sv' ? 'Integrerat i strategin' : 'Integrated in strategy'}
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-cyan rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                2
              </div>
              <h3 className="font-heading text-2xl font-bold text-gray-900 mb-4">
                {language === 'sv' ? 'Skräddarsydda Projekt' : 'Custom Projects'}
              </h3>
              <p className="font-body text-gray-700 leading-relaxed mb-6">
                {language === 'sv'
                  ? 'När ni behöver en större teknisk lösning – till exempel ett system, en app eller omfattande integration – levereras det som separat projekt med egen scope.'
                  : 'When you need a larger technical solution – for example a system, app or extensive integration – it\'s delivered as a separate project with its own scope.'}
              </p>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-accent-cyan mt-1">→</span>
                  <span className="text-sm text-gray-600">
                    {language === 'sv' ? 'Dedikerad leverans' : 'Dedicated delivery'}
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-accent-cyan mt-1">→</span>
                  <span className="text-sm text-gray-600">
                    {language === 'sv' ? 'Tydlig projektplan' : 'Clear project plan'}
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-accent-cyan mt-1">→</span>
                  <span className="text-sm text-gray-600">
                    {language === 'sv' ? 'Påverkar ej abonnemanget' : 'Does not affect subscription'}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-br from-primary-50 to-accent-cyan/10 border border-primary-200 rounded-2xl p-8 text-center">
            <p className="font-body text-lg text-gray-700">
              {language === 'sv'
                ? 'Modellen är byggd för att lösa både små och stora behov med samma struktur, utan att störa den löpande strategiska rådgivningen.'
                : 'The model is built to solve both small and large needs with the same structure, without disrupting ongoing strategic advisory.'}
            </p>
          </div>
        </div>
      </section>

      {/* Use Case Examples */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {language === 'sv' ? 'Vad Vi ' : 'What We '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
                {language === 'sv' ? 'Bygger' : 'Build'}
              </span>
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'sv'
                ? 'Verkliga exempel från enterprise-kunder'
                : 'Real examples from enterprise clients'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:border-primary-600/40 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="text-primary-600 mb-4 transform group-hover:scale-110 transition-transform">
                  {useCase.icon}
                </div>
                <h3 className="font-heading text-lg font-bold text-gray-900 mb-3">
                  {useCase.title}
                </h3>
                <p className="font-body text-sm text-gray-600 leading-relaxed mb-4">
                  {useCase.description}
                </p>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs font-semibold text-accent-emerald">
                    {useCase.impact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Benefits */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {language === 'sv' ? 'Varför AI & Automation är ' : 'Why AI & Automation is '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
                {language === 'sv' ? 'Kärnan' : 'Core'}
              </span>
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'sv'
                ? 'Den strategiska nyttan för er organisation'
                : 'The strategic benefit for your organization'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-8">
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="font-body text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-block bg-white border border-gray-200 rounded-2xl px-8 py-6">
              <p className="font-body text-lg text-gray-700 mb-2">
                <span className="font-bold text-primary-600">
                  {language === 'sv' ? 'Resultat:' : 'Result:'}
                </span>{' '}
                {language === 'sv'
                  ? 'Systemstöd som kombinerar människor + AI för maximal kapacitet och påverkan'
                  : 'System support combining people + AI for maximum capacity and impact'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Zap className="h-16 w-16 text-accent-cyan mx-auto mb-8" />
          <h2 className="font-heading text-4xl lg:text-5xl font-black mb-8">
            {language === 'sv' ? 'Bygg Er Nästa Lösning' : 'Build Your Next Solution'}
          </h2>
          <p className="font-body text-xl text-white/80 mb-12 leading-relaxed">
            {language === 'sv'
              ? 'Vi börjar alltid med att förstå era behov, utmaningar och mål. Sedan designar vi den mest effektiva vägen framåt.'
              : 'We always start by understanding your needs, challenges and goals. Then we design the most efficient path forward.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center bg-white text-gray-900 px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl group"
            >
              {language === 'sv' ? 'Boka Strategidialog' : 'Book Strategy Discussion'}
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/audit"
              className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 group"
            >
              {language === 'sv' ? 'Gratis AI-Analys' : 'Free AI Analysis'}
              <Clock className="ml-3 h-5 w-5" />
            </Link>
          </div>

          <p className="mt-8 text-sm text-white/60">
            {language === 'sv'
              ? 'Vi återkommer inom 24 timmar för att schemalägga en initial dialog'
              : 'We get back within 24 hours to schedule an initial discussion'}
          </p>
        </div>
      </section>
    </div>
  );
};

export default AIAutomationPage;
