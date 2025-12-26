import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Zap, RefreshCw, Target, TrendingUp, DollarSign, Users, Clock, Layers, BarChart3, ArrowLeftRight } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import CtaSection from '../components/CtaSection';
import SEOHead from '../components/SEOHead';
import { useLanguage } from '../contexts/LanguageContext';

const TokensPage = () => {
  const { language } = useLanguage();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": {
      "en": "How Tokens Work - NorthForce Flexible Capacity System",
      "sv": "Hur Tokens Fungerar - NorthForce Flexibel Kapacitetssystem"
    },
    "description": {
      "en": "Understanding NorthForce token system: flexible capacity that moves freely between expert areas, represents value not hours, and scales with your business needs.",
      "sv": "Förstå NorthForce token-system: flexibel kapacitet som flyttas fritt mellan expertområden, representerar värde inte timmar, och skalar med era affärsbehov."
    },
    "author": {
      "@type": "Organization",
      "name": "NorthForce"
    }
  };

  const tokenBenefits = [
    {
      icon: <RefreshCw className="h-10 w-10" />,
      title: language === 'sv' ? 'Flexibel Fördelning' : 'Flexible Allocation',
      description: language === 'sv'
        ? 'Flytta tokens fritt mellan Sälj, Marknad, Ekonomi, Ledning, HR och Juridik baserat på var behovet är störst just nu.'
        : 'Move tokens freely between Sales, Marketing, Finance, Leadership, HR and Legal based on where the need is greatest right now.',
      color: 'text-accent-cyan'
    },
    {
      icon: <Target className="h-10 w-10" />,
      title: language === 'sv' ? 'Värde, Inte Timmar' : 'Value, Not Hours',
      description: language === 'sv'
        ? 'Tokens representerar levererat värde och omfattning, inte bara nedlagd tid. Fokus på resultat istället för resursförbrukning.'
        : 'Tokens represent delivered value and scope, not just time spent. Focus on results instead of resource consumption.',
      color: 'text-accent-purple'
    },
    {
      icon: <TrendingUp className="h-10 w-10" />,
      title: language === 'sv' ? 'Skala Efter Behov' : 'Scale As Needed',
      description: language === 'sv'
        ? 'Öka eller minska er token-pool när verksamheten växer eller behoven ändras. Ingen friktion, ingen anställningsrisk.'
        : 'Increase or decrease your token pool as business grows or needs change. No friction, no hiring risk.',
      color: 'text-accent-emerald'
    },
    {
      icon: <BarChart3 className="h-10 w-10" />,
      title: language === 'sv' ? 'Transparent Förbrukning' : 'Transparent Usage',
      description: language === 'sv'
        ? 'Se exakt hur tokens används, i vilka områden, och mot vilka mål. Full insyn och kontroll över er investering.'
        : 'See exactly how tokens are used, in which areas, and towards which goals. Full transparency and control over your investment.',
      color: 'text-accent-amber'
    }
  ];

  const tokenExamples = [
    {
      scenario: language === 'sv' ? 'Lansering av ny produkt' : 'New Product Launch',
      distribution: [
        { area: language === 'sv' ? 'Marknad' : 'Marketing', tokens: 50, percentage: 42 },
        { area: language === 'sv' ? 'Sälj' : 'Sales', tokens: 40, percentage: 33 },
        { area: language === 'sv' ? 'Ekonomi' : 'Finance', tokens: 20, percentage: 17 },
        { area: language === 'sv' ? 'Ledning' : 'Leadership', tokens: 10, percentage: 8 }
      ],
      total: 120,
      color: 'from-accent-purple to-accent-cyan'
    },
    {
      scenario: language === 'sv' ? 'Skalning av säljteam' : 'Sales Team Scaling',
      distribution: [
        { area: language === 'sv' ? 'Sälj' : 'Sales', tokens: 70, percentage: 58 },
        { area: 'HR', tokens: 25, percentage: 21 },
        { area: language === 'sv' ? 'Ekonomi' : 'Finance', tokens: 15, percentage: 13 },
        { area: language === 'sv' ? 'Ledning' : 'Leadership', tokens: 10, percentage: 8 }
      ],
      total: 120,
      color: 'from-accent-cyan to-accent-emerald'
    },
    {
      scenario: language === 'sv' ? 'Lönsamhetsoptimering' : 'Profitability Optimization',
      distribution: [
        { area: language === 'sv' ? 'Ekonomi' : 'Finance', tokens: 60, percentage: 50 },
        { area: language === 'sv' ? 'Ledning' : 'Leadership', tokens: 30, percentage: 25 },
        { area: language === 'sv' ? 'Sälj' : 'Sales', tokens: 20, percentage: 17 },
        { area: language === 'sv' ? 'Juridik' : 'Legal', tokens: 10, percentage: 8 }
      ],
      total: 120,
      color: 'from-accent-emerald to-accent-amber'
    }
  ];

  const comparisonModels = [
    {
      model: language === 'sv' ? 'Timbaserad Konsult' : 'Hourly Consultant',
      metrics: [
        { label: language === 'sv' ? 'Kostnad per timme' : 'Cost per hour', value: language === 'sv' ? '1 500 – 3 000 kr' : '$150 – 300' },
        { label: language === 'sv' ? 'Flexibilitet' : 'Flexibility', value: language === 'sv' ? 'Låg - Fast timkostnad' : 'Low - Fixed hourly cost' },
        { label: language === 'sv' ? 'Fokus' : 'Focus', value: language === 'sv' ? 'Tid nedlagd' : 'Time spent' },
        { label: language === 'sv' ? 'Skalbarhet' : 'Scalability', value: language === 'sv' ? 'Begränsad' : 'Limited' }
      ],
      limitation: language === 'sv'
        ? 'Betalar för tid, inte resultat. Svårt att fördela om mellan områden.'
        : 'Pay for time, not results. Difficult to reallocate between areas.'
    },
    {
      model: language === 'sv' ? 'Fast Anställning' : 'Full-Time Employee',
      metrics: [
        { label: language === 'sv' ? 'Månadskostnad' : 'Monthly cost', value: language === 'sv' ? '60 000 – 90 000 kr' : '$6 000 – 9 000' },
        { label: language === 'sv' ? 'Flexibilitet' : 'Flexibility', value: language === 'sv' ? 'Ingen - Fast kostnad' : 'None - Fixed cost' },
        { label: language === 'sv' ? 'Fokus' : 'Focus', value: language === 'sv' ? 'Specifik roll' : 'Specific role' },
        { label: language === 'sv' ? 'Skalbarhet' : 'Scalability', value: language === 'sv' ? 'Mycket begränsad' : 'Very limited' }
      ],
      limitation: language === 'sv'
        ? 'Hög fast kostnad, anställningsrisk, ingen flexibilitet mellan områden.'
        : 'High fixed cost, hiring risk, no flexibility between areas.'
    },
    {
      model: language === 'sv' ? 'NorthForce Tokens' : 'NorthForce Tokens',
      metrics: [
        { label: language === 'sv' ? 'Kostnad per token' : 'Cost per token', value: language === 'sv' ? 'Varierar (450-1100 kr)' : 'Varies ($45-110)' },
        { label: language === 'sv' ? 'Flexibilitet' : 'Flexibility', value: language === 'sv' ? 'Maximal - Fritt mellan områden' : 'Maximum - Free between areas' },
        { label: language === 'sv' ? 'Fokus' : 'Focus', value: language === 'sv' ? 'Levererat värde' : 'Delivered value' },
        { label: language === 'sv' ? 'Skalbarhet' : 'Scalability', value: language === 'sv' ? 'Obegränsad' : 'Unlimited' }
      ],
      limitation: language === 'sv'
        ? 'Kräver aktiv styrning och prioritering av var tokens ska användas.'
        : 'Requires active management and prioritization of where tokens are used.',
      highlight: true
    }
  ];

  return (
    <div className="bg-white overflow-hidden">
      <SEOHead
        title={language === 'sv' ? 'Hur Tokens Fungerar' : 'How Tokens Work'}
        description={language === 'sv'
          ? 'Flexibel kapacitet som flyttas fritt mellan expertområden, representerar värde inte timmar, och skalar med era affärsbehov.'
          : 'Flexible capacity that moves freely between expert areas, represents value not hours, and scales with your business needs.'}
        keywords={language === 'sv'
          ? 'tokens, flexibel kapacitet, värdebaserad prissättning, skalbar kapacitet, expertområden'
          : 'tokens, flexible capacity, value-based pricing, scalable capacity, expert areas'}
        canonicalUrl="https://northforce.io/tokens"
        structuredData={structuredData}
        breadcrumbs={[
          { name: "Home", url: "https://northforce.io/" },
          { name: "Pricing", url: "https://northforce.io/pricing" },
          { name: "Tokens", url: "https://northforce.io/tokens" }
        ]}
      />

      <HeroSection
        title={language === 'sv' ? 'Hur ' : 'How '}
        titleHighlight="Tokens"
        titleEnd={language === 'sv' ? ' Fungerar' : ' Work'}
        subtitle={language === 'sv'
          ? 'Flexibel kapacitet som representerar värde, inte timmar. Flytta fritt mellan områden efter behov.'
          : 'Flexible capacity that represents value, not hours. Move freely between areas as needed.'}
        icon={<Zap className="h-12 w-12 text-accent-emerald" />}
        backgroundVariant="subpage"
      />

      {/* What Are Tokens */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
              {language === 'sv' ? 'Vad Är ' : 'What Are '}
              <span className="text-brand-emerald">Tokens?</span>
            </h2>
            <p className="font-body text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto font-normal leading-relaxed">
              {language === 'sv'
                ? 'En modern måttenhet för specialist-kapacitet som ger er maximal flexibilitet'
                : 'A modern unit of measurement for specialist capacity that gives you maximum flexibility'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="premium-card group">
              <div className="bg-accent-emerald/10 p-4 rounded-2xl w-fit mb-6">
                <Clock className="h-12 w-12 text-accent-emerald" />
              </div>
              <h3 className="font-heading text-3xl font-black text-gray-900 mb-4">
                {language === 'sv' ? '1 Token = 30 Minuter' : '1 Token = 30 Minutes'}
              </h3>
              <p className="font-body text-gray-700 text-lg leading-relaxed mb-6">
                {language === 'sv'
                  ? 'Varje token representerar 30 minuters specialist-arbete plus systemaktivering. 2 tokens = 1 timme. Detta gör det enkelt att planera och budgetera kapacitet.'
                  : 'Each token represents 30 minutes of specialist work plus system activation. 2 tokens = 1 hour. This makes it easy to plan and budget capacity.'}
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">1 {language === 'sv' ? 'token' : 'token'}</span>
                    <span className="text-accent-emerald font-bold">30 min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">2 tokens</span>
                    <span className="text-accent-emerald font-bold">1 {language === 'sv' ? 'timme' : 'hour'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">40 tokens</span>
                    <span className="text-accent-emerald font-bold">20 {language === 'sv' ? 'timmar' : 'hours'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">120 tokens</span>
                    <span className="text-accent-emerald font-bold">60 {language === 'sv' ? 'timmar' : 'hours'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="premium-card group">
              <div className="bg-accent-cyan/10 p-4 rounded-2xl w-fit mb-6">
                <Layers className="h-12 w-12 text-accent-cyan" />
              </div>
              <h3 className="font-heading text-3xl font-black text-gray-900 mb-4">
                {language === 'sv' ? 'Värde, Inte Bara Tid' : 'Value, Not Just Time'}
              </h3>
              <p className="font-body text-gray-700 text-lg leading-relaxed mb-6">
                {language === 'sv'
                  ? 'Tokens uttrycker omfattning och värde av leveransen, inte enbart nedlagd tid. En strategisk analys kan ta 4 tokens medan implementation av ett flöde kan ta 8 tokens - båda levererar tydligt värde.'
                  : 'Tokens express scope and value of delivery, not just time spent. A strategic analysis may take 4 tokens while implementing a flow may take 8 tokens - both deliver clear value.'}
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-accent-cyan flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{language === 'sv' ? 'Fokus på levererat resultat' : 'Focus on delivered results'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-accent-cyan flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{language === 'sv' ? 'Speglar komplexitet och värde' : 'Reflects complexity and value'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-accent-cyan flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{language === 'sv' ? 'Tydlig mätbarhet och uppföljning' : 'Clear measurability and follow-up'}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-50 to-accent-cyan/10 border-2 border-primary-200 rounded-2xl p-10 max-w-4xl mx-auto">
            <h4 className="font-heading text-2xl font-black text-gray-900 mb-6 text-center">
              {language === 'sv' ? 'Alla Tokens Kostar Samma För Er' : 'All Tokens Cost The Same For You'}
            </h4>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {language === 'sv'
                ? 'Internt har olika expertområden olika marknadspriser (Juridik 900-1100 kr/token, Ekonomi 750-950 kr/token, HR 450-650 kr/token), men för er som kund kostar alla tokens samma oavsett vilket område de används i.'
                : 'Internally, different expert areas have different market prices (Legal $90-110/token, Finance $75-95/token, HR $45-65/token), but for you as a customer, all tokens cost the same regardless of which area they are used in.'}
            </p>
            <div className="bg-white rounded-lg p-6">
              <p className="font-bold text-gray-900 mb-2">{language === 'sv' ? 'Detta ger er:' : 'This gives you:'}</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent-emerald flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{language === 'sv' ? 'Enkel budgetering - ett pris att hålla koll på' : 'Simple budgeting - one price to track'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent-emerald flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{language === 'sv' ? 'Maximal flexibilitet - flytta tokens utan extra kostnader' : 'Maximum flexibility - move tokens without extra costs'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent-emerald flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{language === 'sv' ? 'Fokus på resultat - inte vad som kostar mest' : 'Focus on results - not what costs most'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Four Key Benefits */}
      <section className="py-24 section-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
              {language === 'sv' ? 'Fyra ' : 'Four '}
              <span className="text-brand-cyan">{language === 'sv' ? 'Nyckelfördelar' : 'Key Benefits'}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tokenBenefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group">
                <div className={`${benefit.color} mb-6 flex items-center gap-4`}>
                  <div className="transform group-hover:scale-110 transition-transform">
                    {benefit.icon}
                  </div>
                  <h3 className="font-heading text-2xl font-black text-gray-900">{benefit.title}</h3>
                </div>
                <p className="font-body text-gray-700 text-lg leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Examples */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
              {language === 'sv' ? 'Verkliga ' : 'Real '}
              <span className="text-brand-violet">{language === 'sv' ? 'Exempel' : 'Examples'}</span>
            </h2>
            <p className="font-body text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto font-normal leading-relaxed">
              {language === 'sv'
                ? 'Se hur företag fördelar sina 120 tokens baserat på olika fokusområden'
                : 'See how companies allocate their 120 tokens based on different focus areas'}
            </p>
          </div>

          <div className="space-y-12">
            {tokenExamples.map((example, index) => (
              <div key={index} className="premium-card group">
                <div className={`bg-gradient-to-r ${example.color} text-white rounded-xl p-6 mb-6`}>
                  <h3 className="font-heading text-3xl font-black mb-2">{example.scenario}</h3>
                  <p className="text-white/90 text-lg">{language === 'sv' ? 'Totalt' : 'Total'}: {example.total} tokens</p>
                </div>

                <div className="space-y-4">
                  {example.distribution.map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-heading font-bold text-gray-900 text-lg">{item.area}</span>
                        <span className="text-accent-emerald font-bold text-xl">{item.tokens} tokens ({item.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-accent-cyan to-accent-emerald h-3 rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison with Traditional Models */}
      <section className="py-24 section-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl lg:text-7xl font-black mb-8 tracking-tight">
              {language === 'sv' ? 'Jämför Med ' : 'Compare With '}
              <span className="text-brand-cyan">{language === 'sv' ? 'Traditionella Modeller' : 'Traditional Models'}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {comparisonModels.map((model, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 ${
                  model.highlight
                    ? 'bg-gradient-to-br from-accent-emerald/20 to-accent-cyan/20 border-2 border-accent-emerald'
                    : 'bg-white/10 backdrop-blur-sm border border-white/20'
                }`}
              >
                {model.highlight && (
                  <div className="text-center mb-4">
                    <div className="inline-block bg-accent-emerald text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {language === 'sv' ? 'Rekommenderat' : 'Recommended'}
                    </div>
                  </div>
                )}

                <h3 className="font-heading text-2xl font-black text-white mb-6 text-center">{model.model}</h3>

                <div className="space-y-4 mb-6">
                  {model.metrics.map((metric, idx) => (
                    <div key={idx}>
                      <p className="text-sm text-white/60 mb-1">{metric.label}</p>
                      <p className="text-white font-semibold">{metric.value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm text-white/80 leading-relaxed">{model.limitation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Get Started */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
              {language === 'sv' ? 'Kom ' : 'Get '}
              <span className="text-brand-emerald">{language === 'sv' ? 'Igång' : 'Started'}</span>
            </h2>
            <p className="font-body text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto font-normal leading-relaxed">
              {language === 'sv'
                ? 'Tre enkla steg för att börja använda tokens'
                : 'Three simple steps to start using tokens'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center premium-card group">
              <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-6">
                1
              </div>
              <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">
                {language === 'sv' ? 'Välj Paket' : 'Choose Package'}
              </h3>
              <p className="font-body text-gray-700 leading-relaxed">
                {language === 'sv'
                  ? 'Bestäm hur mycket kapacitet ni behöver. 40, 120, 300 eller 700+ tokens per månad.'
                  : 'Decide how much capacity you need. 40, 120, 300 or 700+ tokens per month.'}
              </p>
            </div>

            <div className="text-center premium-card group">
              <div className="bg-accent-cyan text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-6">
                2
              </div>
              <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">
                {language === 'sv' ? 'Aktivera Områden' : 'Activate Areas'}
              </h3>
              <p className="font-body text-gray-700 leading-relaxed">
                {language === 'sv'
                  ? 'Välj vilka expertområden ni vill ha tillgång till. Aktivera fler när behoven växer.'
                  : 'Choose which expert areas you want access to. Activate more as needs grow.'}
              </p>
            </div>

            <div className="text-center premium-card group">
              <div className="bg-accent-emerald text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-6">
                3
              </div>
              <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">
                {language === 'sv' ? 'Använd Flexibelt' : 'Use Flexibly'}
              </h3>
              <p className="font-body text-gray-700 leading-relaxed">
                {language === 'sv'
                  ? 'Fördela tokens där behovet är störst. Flytta mellan områden utan begränsningar.'
                  : 'Allocate tokens where need is greatest. Move between areas without restrictions.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaSection
        title={language === 'sv' ? 'Redo att Börja Med ' : 'Ready to Start With '}
        titleHighlight="Tokens?"
        subtitle={language === 'sv'
          ? 'Upplev flexibiliteten med ett modernt kapacitetssystem designat för tillväxt.'
          : 'Experience the flexibility of a modern capacity system designed for growth.'}
        ctaButtons={[
          { text: language === 'sv' ? 'Se Priser' : 'View Pricing', href: '/pricing', variant: 'accent', icon: <ArrowRight className="h-6 w-6" /> },
          { text: language === 'sv' ? 'Boka Samtal' : 'Book Call', href: '/contact', variant: 'custom', customClasses: 'bg-white text-gray-900 px-10 py-5 rounded-2xl hover:bg-gray-100 transition-all duration-300 font-black text-xl transform hover:scale-105 shadow-card hover:shadow-glow' },
        ]}
      />
    </div>
  );
};

export default TokensPage;
