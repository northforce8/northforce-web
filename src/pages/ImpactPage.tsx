import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Target, DollarSign, Users, Clock, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SEOHead from '../components/SEOHead';

const ImpactPage = () => {
  const { language } = useLanguage();

  const metrics = [
    { value: '150%', label: language === 'sv' ? 'Genomsnittlig ökning leadgenerering' : 'Average increase in lead generation', color: 'text-accent-cyan' },
    { value: '67%', label: language === 'sv' ? 'Reduktion i kostnad per lead' : 'Reduction in cost per lead', color: 'text-primary-600' },
    { value: '3v', label: language === 'sv' ? 'Genomsnittlig tid till mätbar effekt' : 'Average time to measurable impact', color: 'text-accent-emerald' },
    { value: '95%', label: language === 'sv' ? 'Kundretention efter 12 månader' : 'Client retention after 12 months', color: 'text-accent-amber' },
  ];

  const caseStudies = [
    {
      industry: language === 'sv' ? 'B2B SaaS' : 'B2B SaaS',
      size: language === 'sv' ? '45M ARR' : '45M ARR',
      challenge: language === 'sv'
        ? 'Fragmenterad go-to-market med låg konvertering och lång sales cycle. Tre olika byråer utan samordning.'
        : 'Fragmented go-to-market with low conversion and long sales cycle. Three different agencies without coordination.',
      solution: language === 'sv'
        ? 'Implementerade integrerad hybridmodell med fokus på pipeline-arkitektur, demand generation och sales enablement.'
        : 'Implemented integrated hybrid model focused on pipeline architecture, demand generation and sales enablement.',
      results: [
        { metric: '+180%', description: language === 'sv' ? 'Ökning i kvalificerade leads' : 'Increase in qualified leads' },
        { metric: '-35%', description: language === 'sv' ? 'Kortare sales cycle' : 'Shorter sales cycle' },
        { metric: '+42%', description: language === 'sv' ? 'Förbättrad win rate' : 'Improved win rate' },
      ],
      timeframe: language === 'sv' ? '6 månader' : '6 months',
    },
    {
      industry: language === 'sv' ? 'Professional Services' : 'Professional Services',
      size: language === 'sv' ? '28M omsättning' : '28M revenue',
      challenge: language === 'sv'
        ? 'Organisk tillväxt hade planat ut. Begränsad marknadsföring och ingen strukturerad försäljningsprocess.'
        : 'Organic growth had plateaued. Limited marketing and no structured sales process.',
      solution: language === 'sv'
        ? 'Byggde go-to-market från grunden: positionering, demand generation, CRM-implementation och sales playbook.'
        : 'Built go-to-market from scratch: positioning, demand generation, CRM implementation and sales playbook.',
      results: [
        { metric: '+250%', description: language === 'sv' ? 'Ökning inbound leads' : 'Increase in inbound leads' },
        { metric: '8.2x', description: language === 'sv' ? 'ROI på marketing spend' : 'ROI on marketing spend' },
        { metric: '+65%', description: language === 'sv' ? 'Omsättningstillväxt YoY' : 'Revenue growth YoY' },
      ],
      timeframe: language === 'sv' ? '9 månader' : '9 months',
    },
    {
      industry: language === 'sv' ? 'Tech-enabled Services' : 'Tech-enabled Services',
      size: language === 'sv' ? '12M ARR' : '12M ARR',
      challenge: language === 'sv'
        ? 'Grundarna drev allt själva, inget team och ingen systematik. Otydlig positionering och låg prissättning.'
        : 'Founders drove everything themselves, no team and no systems. Unclear positioning and low pricing.',
      solution: language === 'sv'
        ? 'Organisationsdesign, rekrytering, system-implementation och pricing strategy. Från founders till team-driven.'
        : 'Organizational design, recruitment, systems implementation and pricing strategy. From founders to team-driven.',
      results: [
        { metric: '+120%', description: language === 'sv' ? 'Ökat genomsnittligt deal value' : 'Increased average deal value' },
        { metric: '5', description: language === 'sv' ? 'Nya A-player rekryteringar' : 'New A-player hires' },
        { metric: '+92%', description: language === 'sv' ? 'EBITDA-förbättring' : 'EBITDA improvement' },
      ],
      timeframe: language === 'sv' ? '12 månader' : '12 months',
    },
  ];

  const testimonials = [
    {
      quote: language === 'sv'
        ? 'NorthForce är inte en konsult, de är en strategisk partner. De arbetar i våra system, med vår data, och driver konkret påverkan varje vecka.'
        : 'NorthForce is not a consultant, they are a strategic partner. They work in our systems, with our data, and drive concrete impact every week.',
      author: 'Richard Lium',
      title: language === 'sv' ? 'Affärsområdeschef, Dagens Industri Nätverk' : 'Business Area Manager, Dagens Industri Nätverk',
      company: 'Dagens Industri Nätverk',
    },
    {
      quote: language === 'sv'
        ? 'Vi skulle behövt anställa minst 5 personer för att få samma kapacitet. Med NorthForce får vi expertis inom alla områden utan anställningsrisken.'
        : 'We would have needed to hire at least 5 people to get the same capacity. With NorthForce we get expertise in all areas without the hiring risk.',
      author: 'Edison Donnius',
      title: language === 'sv' ? 'VD, Noside' : 'CEO, Noside',
      company: 'Noside',
    },
  ];

  return (
    <div className="bg-white overflow-hidden">
      <SEOHead
        title={language === 'sv' ? 'Kundeffekt — NorthForce' : 'Client Impact — NorthForce'}
        description={language === 'sv'
          ? 'Beprövade resultat från verkliga företag. Case studies och mätbar påverkan på tillväxt och lönsamhet.'
          : 'Proven results from real companies. Case studies and measurable impact on growth and profitability.'}
        canonicalUrl="https://northforce.io/impact"
      />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-emerald rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-cyan rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-accent-emerald/20 text-accent-emerald rounded-full text-sm font-semibold tracking-wide uppercase">
              {language === 'sv' ? 'Verifierade Resultat' : 'Verified Results'}
            </span>
          </div>

          <h1 className="font-heading text-5xl lg:text-7xl font-black mb-8 tracking-tight">
            {language === 'sv' ? 'Kund' : 'Client '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-emerald">
              {language === 'sv' ? 'effekt' : 'Impact'}
            </span>
          </h1>
          <p className="font-body text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
            {language === 'sv'
              ? 'Verkliga resultat från verkliga företag. Vi mäter framgång på affärsutfall, inte deliverables.'
              : 'Real results from real companies. We measure success on business outcomes, not deliverables.'}
          </p>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className={`font-heading text-5xl lg:text-6xl font-black ${metric.color} mb-4`}>
                  {metric.value}
                </div>
                <p className="font-body text-sm text-gray-600 leading-tight">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {language === 'sv' ? 'Case ' : 'Case '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
                {language === 'sv' ? 'Studies' : 'Studies'}
              </span>
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'sv'
                ? 'Anonymiserade exempel från verkliga kunder över olika branscher och storlekar'
                : 'Anonymized examples from real clients across different industries and sizes'}
            </p>
          </div>

          <div className="space-y-16">
            {caseStudies.map((study, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl p-10">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="bg-gradient-to-br from-primary-600 to-accent-cyan text-white px-4 py-1 rounded-full text-sm font-semibold">
                    {study.industry}
                  </div>
                  <div className="text-gray-600 text-sm font-semibold">
                    {study.size}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
                  <div>
                    <h3 className="font-heading text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                      {language === 'sv' ? 'Utmaning' : 'Challenge'}
                    </h3>
                    <p className="font-body text-gray-700 leading-relaxed mb-6">
                      {study.challenge}
                    </p>

                    <h3 className="font-heading text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                      {language === 'sv' ? 'Lösning' : 'Solution'}
                    </h3>
                    <p className="font-body text-gray-700 leading-relaxed">
                      {study.solution}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-heading text-sm font-bold text-gray-500 uppercase tracking-wide mb-6">
                      {language === 'sv' ? 'Resultat' : 'Results'}
                    </h3>
                    <div className="space-y-4">
                      {study.results.map((result, idx) => (
                        <div key={idx} className="flex items-start space-x-4">
                          <div className="font-heading text-3xl font-black text-primary-600 flex-shrink-0">
                            {result.metric}
                          </div>
                          <div className="font-body text-gray-700 pt-1">
                            {result.description}
                          </div>
                        </div>
                      ))}
                      <div className="pt-4 flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{study.timeframe}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {language === 'sv' ? 'Vad Kunder ' : 'What Clients '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
                {language === 'sv' ? 'Säger' : 'Say'}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white border-2 border-gray-200 rounded-3xl p-10 hover:border-accent-cyan hover:shadow-2xl transition-all duration-500">
                {/* Company Badge */}
                <div className="mb-8 flex items-center justify-center">
                  <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600/10 to-accent-cyan/10 border-2 border-primary-600/20 rounded-full">
                    <span className="font-heading text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan tracking-wide uppercase">
                      {testimonial.company}
                    </span>
                  </div>
                </div>

                {/* Quote */}
                <p className="font-body text-xl text-gray-700 leading-relaxed mb-8 italic">
                  "{testimonial.quote}"
                </p>

                {/* Author Info */}
                <div className="border-t border-gray-200 pt-6">
                  <p className="font-heading text-base font-black text-gray-900 mb-1">
                    {testimonial.author}
                  </p>
                  <p className="font-body text-sm text-gray-600 leading-relaxed">
                    {testimonial.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl lg:text-5xl font-black mb-8">
            {language === 'sv' ? 'Ska vi diskutera era mål?' : "Shall We Discuss Your Goals?"}
          </h2>
          <p className="font-body text-xl text-white/80 mb-12 leading-relaxed">
            {language === 'sv'
              ? 'Vi börjar alltid med att förstå var ni är idag och var ni vill vara. Ingen försäljning, bara strategisk dialog.'
              : 'We always start by understanding where you are today and where you want to be. No sales pitch, just strategic dialogue.'}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center bg-white text-gray-900 px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl group"
          >
            {language === 'sv' ? 'Boka Strategidialog' : 'Book Strategy Discussion'}
            <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ImpactPage;
