import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Target, TrendingUp, Layers, Zap, Scale, RefreshCw, Shield, Sliders } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { useLanguage } from '../contexts/LanguageContext';

const PricingPage = () => {
  const { language } = useLanguage();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "NorthForce Engagement Model",
    "description": language === 'sv'
      ? "Flexibel engagemangsmodell designad för att skala med era behov. Transparent, förutsägbar och helt anpassad efter er affär."
      : "Flexible engagement model designed to scale with your needs. Transparent, predictable and fully tailored to your business.",
    "provider": {
      "@type": "Organization",
      "name": "NorthForce",
      "url": "https://northforce.io"
    }
  };

  const modelComponents = [
    {
      icon: <Layers className="h-12 w-12" />,
      title: language === 'sv' ? 'Plattform & Verktyg' : 'Platform & Tools',
      description: language === 'sv'
        ? 'Integrerad plattform med alla system, data och verktyg som behövs. Inget lappande mellan olika SaaS-lösningar - allt samlas i en miljö där expertis och teknologi möts.'
        : 'Integrated platform with all systems, data and tools needed. No patching between different SaaS solutions - everything gathered in one environment where expertise and technology meet.',
      value: language === 'sv'
        ? 'Företaget äger sin data och alla system vi bygger'
        : 'The company owns its data and all systems we build'
    },
    {
      icon: <Target className="h-12 w-12" />,
      title: language === 'sv' ? '6 Expertområden' : '6 Expert Areas',
      description: language === 'sv'
        ? 'Sälj, Marknad, Ekonomi, HR, Ledning och Juridik - allt i ett sammanhållet ekosystem. Aktivera de områden som behövs just nu och lägg till fler när företaget växer.'
        : 'Sales, Marketing, Finance, HR, Leadership and Legal - all in one cohesive ecosystem. Activate the areas needed right now and add more as the company grows.',
      value: language === 'sv'
        ? 'Erfarna specialister, inte juniora konsulter'
        : 'Experienced specialists, not junior consultants'
    },
    {
      icon: <Zap className="h-12 w-12" />,
      title: language === 'sv' ? 'Skalbar Kapacitet' : 'Scalable Capacity',
      description: language === 'sv'
        ? 'Betala bara för den kapacitet som faktiskt används. Inget slöseri med fasta kostnader eller outnyttjade resurser. Skala upp när det behövs, skala ner när fokus skiftar.'
        : 'Pay only for the capacity actually used. No waste with fixed costs or unused resources. Scale up when needed, scale down when focus shifts.',
      value: language === 'sv'
        ? 'Flexibilitet utan anställningsrisk'
        : 'Flexibility without hiring risk'
    }
  ];

  const engagementPhases = [
    {
      phase: '01',
      title: language === 'sv' ? 'Strategisk Dialog' : 'Strategic Dialogue',
      duration: language === 'sv' ? '45-60 min' : '45-60 min',
      description: language === 'sv'
        ? 'Vi börjar med ett djupdykande samtal för att förstå er situation, ambitioner och behov. Här kartlägger vi var ni är idag och vart ni vill.'
        : 'We start with an in-depth conversation to understand your situation, ambitions and needs. Here we map where you are today and where you want to go.',
      icon: <TrendingUp className="h-8 w-8" />
    },
    {
      phase: '02',
      title: language === 'sv' ? 'Behovsanalys & Design' : 'Needs Analysis & Design',
      duration: language === 'sv' ? '1-2 veckor' : '1-2 weeks',
      description: language === 'sv'
        ? 'Baserat på dialogen designar vi en skräddarsydd lösning: vilka expertområden, vilken kapacitet och vilken implementation som passar er bäst.'
        : 'Based on the dialogue, we design a tailored solution: which expert areas, which capacity and which implementation suits you best.',
      icon: <Sliders className="h-8 w-8" />
    },
    {
      phase: '03',
      title: language === 'sv' ? 'Transparent Prismodell' : 'Transparent Pricing Model',
      duration: language === 'sv' ? 'Direkt feedback' : 'Immediate feedback',
      description: language === 'sv'
        ? 'Ni får en kristallklar och fullständig bild av investering, förväntad ROI och hur modellen skalar med er över tid. Inga överraskningar.'
        : 'You get a crystal clear and complete picture of investment, expected ROI and how the model scales with you over time. No surprises.',
      icon: <CheckCircle className="h-8 w-8" />
    },
    {
      phase: '04',
      title: language === 'sv' ? 'Kontinuerlig Optimering' : 'Continuous Optimization',
      duration: language === 'sv' ? 'Löpande' : 'Ongoing',
      description: language === 'sv'
        ? 'När vi väl är igång har ni full flexibilitet att justera områden och kapacitet. Vi optimerar tillsammans baserat på resultat och förändrade behov.'
        : 'Once we are up and running, you have full flexibility to adjust areas and capacity. We optimize together based on results and changing needs.',
      icon: <RefreshCw className="h-8 w-8" />
    }
  ];

  const pricingPrinciples = [
    {
      icon: <Shield className="h-10 w-10" />,
      title: language === 'sv' ? 'Värdebaserad' : 'Value-Based',
      description: language === 'sv'
        ? 'Modellen är designad för att skapa mätbar affärsnytta, inte för att maximera fakturerade timmar.'
        : 'The model is designed to create measurable business value, not to maximize billable hours.'
    },
    {
      icon: <Scale className="h-10 w-10" />,
      title: language === 'sv' ? 'Transparent' : 'Transparent',
      description: language === 'sv'
        ? 'Ni förstår exakt vad ni betalar för, varför och vilken ROI ni kan förvänta er. Inga dolda avgifter.'
        : 'You understand exactly what you pay for, why and what ROI you can expect. No hidden fees.'
    },
    {
      icon: <Sliders className="h-10 w-10" />,
      title: language === 'sv' ? 'Flexibel' : 'Flexible',
      description: language === 'sv'
        ? 'Skala med era behov. Lägg till områden när ni växer, pausa när fokus skiftar. Ni har kontrollen.'
        : 'Scale with your needs. Add areas as you grow, pause when focus shifts. You are in control.'
    },
    {
      icon: <Target className="h-10 w-10" />,
      title: language === 'sv' ? 'Outcomebaserad' : 'Outcome-Based',
      description: language === 'sv'
        ? 'Vi mäts på de affärsmål ni sätter, inte på antal timmar eller leverabler. Era resultat är våra resultat.'
        : 'We are measured on the business goals you set, not on hours or deliverables. Your results are our results.'
    }
  ];

  const differentiators = [
    {
      title: language === 'sv' ? 'Inte projektbaserat' : 'Not Project-Based',
      old: language === 'sv' ? 'Traditionella konsultbolag' : 'Traditional Consulting Firms',
      oldDescription: language === 'sv'
        ? 'Säljer projekt med början och slut. När projektet avslutas försvinner kunskapen och kontinuiteten.'
        : 'Sell projects with a beginning and end. When the project ends, knowledge and continuity disappear.',
      new: 'NorthForce Hybrid Model',
      newDescription: language === 'sv'
        ? 'Kontinuerlig strategisk partner som växer med er. Vi driver execution men ni äger alltid outcome och IP.'
        : 'Continuous strategic partner that grows with you. We drive execution but you always own the outcome and IP.'
    },
    {
      title: language === 'sv' ? 'Inte fast anställning' : 'Not Full Employment',
      old: language === 'sv' ? 'Anställa seniora specialister' : 'Hiring Senior Specialists',
      oldDescription: language === 'sv'
        ? 'Höga fasta kostnader, anställningsrisk och svårt att hitta rätt kompetens när ni behöver skala över flera områden.'
        : 'High fixed costs, hiring risk and difficult to find the right expertise when you need to scale across multiple areas.',
      new: 'NorthForce Hybrid Model',
      newDescription: language === 'sv'
        ? 'Access till seniora specialister inom 6 områden utan anställningsrisk. Skala upp eller ner efter faktiska behov.'
        : 'Access to senior specialists in 6 areas without hiring risk. Scale up or down based on actual needs.'
    },
    {
      title: language === 'sv' ? 'Inte fragmenterade verktyg' : 'Not Fragmented Tools',
      old: language === 'sv' ? 'Lappa ihop olika SaaS-verktyg' : 'Patching Together Different SaaS Tools',
      oldDescription: language === 'sv'
        ? 'Köpa in separata system för varje funktion. Ingen helhetsbild, dålig integration och höga månadskostnader.'
        : 'Buy separate systems for each function. No overall picture, poor integration and high monthly costs.',
      new: 'NorthForce Hybrid Model',
      newDescription: language === 'sv'
        ? 'En integrerad plattform med expertis inkluderad. Allt som behövs för att driva tillväxt, i ett sammanhang.'
        : 'One integrated platform with expertise included. Everything needed to drive growth, in one context.'
    }
  ];

  const faqs = [
    {
      question: language === 'sv' ? 'Hur bestäms investeringen?' : 'How is the investment determined?',
      answer: language === 'sv'
        ? 'En skräddarsydd modell designas baserat på specifika behov: vilka expertområden som aktiveras, vilken kapacitet som behövs och vilken mognadsnivå verksamheten är på. Efter strategisk dialog fås en transparent bild av både investering och förväntad ROI med konkreta nyckeltal.'
        : 'A tailored model is designed based on specific needs: which expert areas are activated, what capacity is needed and what maturity level the business is at. After strategic dialogue, a transparent picture of both investment and expected ROI with concrete KPIs is provided.'
    },
    {
      question: language === 'sv' ? 'Är detta bara för stora företag?' : 'Is this only for large companies?',
      answer: language === 'sv'
        ? 'Absolut inte. Modellen är designad för tillväxtbolag inom SME-segmentet som behöver ledarskapsresurser men kanske saknar nyckelroller inom Sälj, Marknad, Ekonomi, HR, Ledning eller Juridik. Företaget får erfarna specialister utan att behöva anställa eller betala för dyra konsulttimmar.'
        : 'Absolutely not. The model is designed for growth companies in the SME segment needing leadership resources but may lack key roles in Sales, Marketing, Finance, HR, Leadership or Legal. Companies get experienced specialists without having to hire or pay for expensive consulting hours.'
    },
    {
      question: language === 'sv' ? 'Finns det långtidskontrakt?' : 'Are there long-term contracts?',
      answer: language === 'sv'
        ? 'Nej. Engagemangen är flexibla där företaget kan justera, skala eller avsluta när det passar. Affärsmodellen bygger på att kunden vill stanna för att värde levereras, inte för att de är låsta i ett kontrakt.'
        : 'No. Engagements are flexible where companies can adjust, scale or terminate when it suits them. The business model is built on customers wanting to stay because value is delivered, not because they are locked in a contract.'
    },
    {
      question: language === 'sv' ? 'Hur snabbt kan arbetet starta?' : 'How quickly can work start?',
      answer: language === 'sv'
        ? 'Efter strategisk dialog och godkänt upplägg kan arbetet vara operativt inom 1-2 veckor. Onboarding, systemsetup och teamallokering sker parallellt så att resultat snabbt börjar synas.'
        : 'After strategic dialogue and approved setup, work can be operational within 1-2 weeks. Onboarding, system setup and team allocation happen in parallel so results quickly start showing.'
    },
    {
      question: language === 'sv' ? 'Vad händer med data och system?' : 'What happens with data and systems?',
      answer: language === 'sv'
        ? 'Företaget äger ALLT: sin data, sina processer, sitt IP, sina kundrelationer och alla system som byggs. Endast plattformsteknologi och metodik ägs av NorthForce. Om samarbetet avslutas tar företaget med sig allt som byggts - ingen vendor lock-in.'
        : 'The company owns EVERYTHING: its data, its processes, its IP, its customer relationships and all systems built. Only platform technology and methodology are owned by NorthForce. If collaboration ends, the company takes everything built - no vendor lock-in.'
    },
    {
      question: language === 'sv' ? 'Varför inte bara anställa istället?' : 'Why not just hire instead?',
      answer: language === 'sv'
        ? 'En senior CMO, CFO eller säljchef kostar lätt 80 000-120 000 kr/mån i lön plus omkostnader, tar månader att rekrytera och skapar anställningsrisk. Med modellen fås tillgång till erfarna specialister inom ALLA 6 områden, direkt, utan risk och ofta till en lägre totalkostnad än att anställa motsvarande roller.'
        : 'A senior CMO, CFO or sales manager easily costs $8,000-12,000/month in salary plus overheads, takes months to recruit and creates hiring risk. With the model, access is gained to experienced specialists in ALL 6 areas, immediately, without risk and often at a lower total cost than hiring equivalent roles.'
    }
  ];

  return (
    <div className="bg-white overflow-hidden">
      <SEOHead
        title={language === 'sv'
          ? 'Investering & Engagemang — NorthForce'
          : 'Investment & Engagement — NorthForce'}
        description={language === 'sv'
          ? 'Flexibel investering för tillväxtbolag. Transparent engagemangsmodell designad för SME som behöver ledarskapsresurser utan anställningsrisk.'
          : 'Flexible investment for growth companies. Transparent engagement model designed for SMEs needing leadership resources without hiring risk.'}
        canonicalUrl="https://northforce.io/pricing"
        structuredData={structuredData}
      />

      <section className="relative min-h-[70vh] flex items-center bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-cyan rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-emerald rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-accent-cyan/20 text-accent-cyan rounded-full text-sm font-semibold tracking-wide uppercase">
              {language === 'sv' ? 'Flexibel & Värdebaserad' : 'Flexible & Value-Based'}
            </span>
          </div>

          <h1 className="font-heading text-5xl lg:text-7xl font-black mb-8 tracking-tight leading-[1.1]">
            {language === 'sv' ? 'Investering Som' : 'Investment That'}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-emerald">
              {language === 'sv' ? 'Skalar' : 'Scales'}
            </span>
            <br />
            {language === 'sv' ? 'Med Tillväxten' : 'With Growth'}
          </h1>

          <p className="font-body text-xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-12">
            {language === 'sv'
              ? 'Ingen tror på paketpriser eller one-size-fits-all längre. Varje tillväxtbolag är unikt, och modellen skräddarsys efter specifika behov, ambitioner och mognadsnivå.'
              : 'No one believes in package pricing or one-size-fits-all anymore. Every growth company is unique, and the model is tailored to specific needs, ambitions and maturity level.'}
          </p>

          <Link
            to="/contact"
            className="inline-flex items-center bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl group"
          >
            {language === 'sv' ? 'Boka Strategisk Dialog' : 'Book Strategic Dialogue'}
            <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-black text-gray-900 mb-6">
              {language === 'sv' ? 'Allt Som Behövs, I Ett' : 'Everything Needed, In One'}
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              {language === 'sv'
                ? 'Slipp välja mellan dyra konsulter, riskfyllda anställningar eller fragmenterade verktyg. Hybridmodellen ger tillgång till expertis, system och flexibel kapacitet - sammansatt för att driva tillväxt framåt.'
                : 'Stop choosing between expensive consultants, risky hires or fragmented tools. The hybrid model provides access to expertise, systems and flexible capacity - combined to drive growth forward.'}
            </p>
            <p className="font-body text-lg text-gray-500 max-w-2xl mx-auto">
              {language === 'sv'
                ? 'För tillväxtbolag inom SME som behöver ledarskapsresurser men saknar nyckelroller inom Sälj, Marknad, Ekonomi, HR, Ledning eller Juridik.'
                : 'For growth companies in SME segment needing leadership resources but lacking key roles in Sales, Marketing, Finance, HR, Leadership or Legal.'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {modelComponents.map((component, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200 hover:border-accent-cyan transition-all duration-300">
                <div className="text-accent-cyan mb-6">
                  {component.icon}
                </div>
                <h3 className="font-heading text-2xl font-bold text-gray-900 mb-4">
                  {component.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {component.description}
                </p>
                <div className="pt-4 border-t border-gray-300">
                  <p className="text-sm font-semibold text-accent-emerald">
                    {component.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-black text-gray-900 mb-4">
              {language === 'sv' ? 'Så Fungerar Processen' : 'How the Process Works'}
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'sv'
                ? 'Från första samtal till full implementation och kontinuerlig optimering'
                : 'From first conversation to full implementation and continuous optimization'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {engagementPhases.map((phase, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent-cyan to-accent-emerald rounded-xl flex items-center justify-center text-white font-black text-xl">
                      {phase.phase}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-heading text-xl font-bold text-gray-900">
                        {phase.title}
                      </h3>
                      <span className="text-sm font-semibold text-accent-cyan">
                        {phase.duration}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {phase.description}
                    </p>
                    <div className="text-accent-cyan">
                      {phase.icon}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-black text-gray-900 mb-4">
              {language === 'sv' ? 'Våra Principer' : 'Our Principles'}
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'sv'
                ? 'Grundpelarna i hur vi designar och prissätter våra engagemang'
                : 'The cornerstones of how we design and price our engagements'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingPrinciples.map((principle, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent-cyan/10 to-accent-emerald/10 rounded-2xl mb-6 text-accent-cyan">
                  {principle.icon}
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">
                  {principle.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-black text-gray-900 mb-4">
              {language === 'sv' ? 'Inte Som Alla Andra' : 'Not Like Everyone Else'}
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'sv'
                ? 'Vi har designat modellen för att lösa de fundamentala problemen med traditionella alternativ'
                : 'We designed the model to solve the fundamental problems with traditional alternatives'}
            </p>
          </div>

          <div className="space-y-12">
            {differentiators.map((diff, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                <h3 className="font-heading text-2xl font-black text-gray-900 mb-8 text-center">
                  {diff.title}
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="inline-block px-4 py-2 bg-gray-100 rounded-full text-sm font-semibold text-gray-600">
                      {diff.old}
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {diff.oldDescription}
                    </p>
                  </div>
                  <div className="space-y-4 relative">
                    <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 hidden md:block">
                      <ArrowRight className="h-8 w-8 text-accent-cyan" />
                    </div>
                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-accent-cyan to-accent-emerald text-white rounded-full text-sm font-semibold">
                      {diff.new}
                    </div>
                    <p className="text-gray-900 leading-relaxed font-medium">
                      {diff.newDescription}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-black text-gray-900 mb-4">
              {language === 'sv' ? 'Vanliga Frågor' : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 border-2 border-gray-200">
                <h3 className="font-heading text-lg font-bold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-cyan rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl lg:text-5xl font-black mb-6">
            {language === 'sv' ? 'Låt Oss Designa Er Modell' : 'Let Us Design Your Model'}
          </h2>
          <p className="font-body text-xl text-white/80 mb-10 leading-relaxed max-w-2xl mx-auto">
            {language === 'sv'
              ? 'Boka ett strategiskt samtal så tar vi fram en skräddarsydd lösning med transparent investering och tydlig ROI-prognos.'
              : 'Book a strategic conversation and we will create a tailored solution with transparent investment and clear ROI forecast.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl group"
            >
              {language === 'sv' ? 'Boka Strategisk Dialog' : 'Book Strategic Dialogue'}
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/audit"
              className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 group"
            >
              {language === 'sv' ? 'Få Gratis Analys' : 'Get Free Analysis'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
