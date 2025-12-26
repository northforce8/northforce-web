import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Target, DollarSign, Briefcase, Users, Scale, CheckCircle, Zap, LineChart, Shield, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SEOHead from '../components/SEOHead';

const CapabilitiesPage = () => {
  const { language } = useLanguage();

  const capabilities = [
    {
      icon: <TrendingUp className="h-12 w-12" />,
      color: 'text-accent-cyan',
      title: language === 'sv' ? 'Tillväxtstrategi & Exekvering' : 'Growth Strategy & Execution',
      tagline: language === 'sv' ? 'Från vision till verklighet' : 'From vision to reality',
      description: language === 'sv'
        ? 'Vi kombinerar strategisk planering med operativ implementation för att accelerera er tillväxtresa.'
        : 'We combine strategic planning with operational implementation to accelerate your growth journey.',
      services: language === 'sv'
        ? [
            'Market & competitive intelligence',
            'Go-to-market strategi',
            'Business model innovation',
            'Portfolio management',
            'Strategic roadmapping',
            'Growth initiatives & experimentation',
          ]
        : [
            'Market & competitive intelligence',
            'Go-to-market strategy',
            'Business model innovation',
            'Portfolio management',
            'Strategic roadmapping',
            'Growth initiatives & experimentation',
          ],
    },
    {
      icon: <Target className="h-12 w-12" />,
      color: 'text-primary-600',
      title: language === 'sv' ? 'Sälj & Revenue Excellence' : 'Sales & Revenue Excellence',
      tagline: language === 'sv' ? 'Prediktabel pipeline, högre win rate' : 'Predictable pipeline, higher win rate',
      description: language === 'sv'
        ? 'Data-driven försäljningsprocess med fokus på konvertering, deal velocity och kundlivstidsvärde.'
        : 'Data-driven sales process focused on conversion, deal velocity and customer lifetime value.',
      services: language === 'sv'
        ? [
            'Pipeline-arkitektur & management',
            'Sales enablement & playbooks',
            'Pricing & proposal strategy',
            'Forecast-metodik & precision',
            'Account-based selling',
            'Channel & partner strategy',
          ]
        : [
            'Pipeline architecture & management',
            'Sales enablement & playbooks',
            'Pricing & proposal strategy',
            'Forecast methodology & precision',
            'Account-based selling',
            'Channel & partner strategy',
          ],
    },
    {
      icon: <Zap className="h-12 w-12" />,
      color: 'text-accent-emerald',
      title: language === 'sv' ? 'Marketing & Demand Generation' : 'Marketing & Demand Generation',
      tagline: language === 'sv' ? 'Kvalificerade leads, inte bara trafik' : 'Qualified leads, not just traffic',
      description: language === 'sv'
        ? 'Strategisk positionering och datadrivna kampanjer som genererar mätbar ROI och rätt kundprofiler.'
        : 'Strategic positioning and data-driven campaigns generating measurable ROI and right customer profiles.',
      services: language === 'sv'
        ? [
            'Positioning & messaging framework',
            'Demand generation programs',
            'Content strategy & SEO',
            'Marketing automation & nurture',
            'Campaign management & optimization',
            'Brand & employer branding',
          ]
        : [
            'Positioning & messaging framework',
            'Demand generation programs',
            'Content strategy & SEO',
            'Marketing automation & nurture',
            'Campaign management & optimization',
            'Brand & employer branding',
          ],
    },
    {
      icon: <DollarSign className="h-12 w-12" />,
      color: 'text-accent-amber',
      title: language === 'sv' ? 'Finansiell Styrning & Analytics' : 'Financial Management & Analytics',
      tagline: language === 'sv' ? 'Kontroll, transparens, smartare beslut' : 'Control, transparency, smarter decisions',
      description: language === 'sv'
        ? 'Business intelligence och finansiell kontroll för starkare marginaler och prediktabel ekonomi.'
        : 'Business intelligence and financial control for stronger margins and predictable economics.',
      services: language === 'sv'
        ? [
            'KPI-ramverk & dashboards',
            'Unit economics & cohort analysis',
            'Pricing strategy & optimization',
            'Budget & forecast management',
            'Profitability analysis per segment',
            'Financial modeling & scenario planning',
          ]
        : [
            'KPI framework & dashboards',
            'Unit economics & cohort analysis',
            'Pricing strategy & optimization',
            'Budget & forecast management',
            'Profitability analysis per segment',
            'Financial modeling & scenario planning',
          ],
    },
    {
      icon: <Users className="h-12 w-12" />,
      color: 'text-accent-rose',
      title: language === 'sv' ? 'People & Organization' : 'People & Organization',
      tagline: language === 'sv' ? 'Attrahera, utveckla, behålla A-players' : 'Attract, develop, retain A-players',
      description: language === 'sv'
        ? 'Organisationsdesign och talangförvärv för att bygga teams som kan exekvera strategin.'
        : 'Organizational design and talent acquisition to build teams that can execute the strategy.',
      services: language === 'sv'
        ? [
            'Organizational design & structure',
            'Recruitment & talent acquisition',
            'Onboarding & enablement programs',
            'Performance management',
            'Culture & employer branding',
            'Compensation & incentive design',
          ]
        : [
            'Organizational design & structure',
            'Recruitment & talent acquisition',
            'Onboarding & enablement programs',
            'Performance management',
            'Culture & employer branding',
            'Compensation & incentive design',
          ],
    },
    {
      icon: <Shield className="h-12 w-12" />,
      color: 'text-primary-600',
      title: language === 'sv' ? 'Governance, Risk & Compliance' : 'Governance, Risk & Compliance',
      tagline: language === 'sv' ? 'Skala tryggt och compliant' : 'Scale safely and compliant',
      description: language === 'sv'
        ? 'Ramverk för styrning, risk och regelefterlevnad som möjliggör tillväxt utan exponering.'
        : 'Framework for governance, risk and compliance enabling growth without exposure.',
      services: language === 'sv'
        ? [
            'Contract & deal structure',
            'Compliance framework & audits',
            'Data privacy & GDPR',
            'Risk assessment & mitigation',
            'Board & investor relations',
            'Legal operations & templates',
          ]
        : [
            'Contract & deal structure',
            'Compliance framework & audits',
            'Data privacy & GDPR',
            'Risk assessment & mitigation',
            'Board & investor relations',
            'Legal operations & templates',
          ],
    },
  ];

  const approach = [
    {
      title: language === 'sv' ? 'Diagnostik' : 'Diagnostics',
      description: language === 'sv'
        ? 'Vi börjar alltid med att förstå nuläge, mål och hinder. Data-driven analys kombinerat med strategiska workshops.'
        : 'We always start by understanding current state, goals and obstacles. Data-driven analysis combined with strategic workshops.',
    },
    {
      title: language === 'sv' ? 'Design' : 'Design',
      description: language === 'sv'
        ? 'Tillsammans designar vi målbild, roadmap och implementationsplan anpassad efter er kontext och kapacitet.'
        : 'Together we design target state, roadmap and implementation plan tailored to your context and capacity.',
    },
    {
      title: language === 'sv' ? 'Delivery' : 'Delivery',
      description: language === 'sv'
        ? 'Hands-on implementation i veckocykler med löpande uppföljning, optimering och kommunikation.'
        : 'Hands-on implementation in weekly cycles with ongoing follow-up, optimization and communication.',
    },
  ];

  return (
    <div className="bg-white overflow-hidden">
      <SEOHead
        title={language === 'sv' ? 'Kapabiliteter — NorthForce' : 'Capabilities — NorthForce'}
        description={language === 'sv'
          ? 'Sex integrerade kapabilitetsområden för hållbar företagstillväxt. Från strategi till implementation.'
          : 'Six integrated capability areas for sustainable business growth. From strategy to implementation.'}
        canonicalUrl="https://northforce.io/capabilities"
      />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-cyan rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-emerald rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-accent-cyan/20 text-accent-cyan rounded-full text-sm font-semibold tracking-wide uppercase">
              {language === 'sv' ? 'Sex Expertområden' : 'Six Expert Areas'}
            </span>
          </div>

          <h1 className="font-heading text-5xl lg:text-7xl font-black mb-8 tracking-tight">
            {language === 'sv' ? 'Våra ' : 'Our '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-emerald">
              {language === 'sv' ? 'Kapabiliteter' : 'Capabilities'}
            </span>
          </h1>
          <p className="font-body text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
            {language === 'sv'
              ? 'Sex fokusområden där vi kombinerar strategisk rådgivning med hands-on implementation för mätbar påverkan.'
              : 'Six focus areas where we combine strategic advisory with hands-on implementation for measurable impact.'}
          </p>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {capabilities.map((capability, index) => (
              <div
                key={index}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-start ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className={`${capability.color} mb-6`}>
                    {capability.icon}
                  </div>
                  <h2 className="font-heading text-3xl lg:text-4xl font-black text-gray-900 mb-4">
                    {capability.title}
                  </h2>
                  <p className="font-heading text-lg text-gray-600 mb-6 italic">
                    {capability.tagline}
                  </p>
                  <p className="font-body text-lg text-gray-700 leading-relaxed mb-8">
                    {capability.description}
                  </p>
                </div>

                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
                    <h3 className="font-heading text-sm font-bold text-gray-500 uppercase tracking-wide mb-6">
                      {language === 'sv' ? 'Fokusområden' : 'Focus Areas'}
                    </h3>
                    <ul className="space-y-3">
                      {capability.services.map((service, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-accent-emerald flex-shrink-0 mt-0.5" />
                          <span className="font-body text-gray-700">{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {language === 'sv' ? 'Vår ' : 'Our '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
                {language === 'sv' ? 'Arbetsmetodik' : 'Approach'}
              </span>
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'sv'
                ? 'Strukturerad process med fokus på snabb värdeskapande och kontinuerlig förbättring'
                : 'Structured process focused on rapid value creation and continuous improvement'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {approach.map((step, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-8 relative">
                <div className="absolute -top-4 left-8">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-cyan rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-4 mt-2">
                  {step.title}
                </h3>
                <p className="font-body text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Message */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RefreshCw className="h-16 w-16 text-primary-600 mx-auto mb-8" />
          <h2 className="font-heading text-4xl lg:text-5xl font-black text-gray-900 mb-8">
            {language === 'sv' ? 'Alla områden arbetar integrerat' : 'All Areas Work Integrated'}
          </h2>
          <p className="font-body text-xl text-gray-600 mb-12 leading-relaxed">
            {language === 'sv'
              ? 'Till skillnad från traditionella konsulter eller byråer som arbetar i silos, integrerar vi alla kapabiliteter i era system. Samma data, samma mål, samma veckoprocess.'
              : 'Unlike traditional consultants or agencies working in silos, we integrate all capabilities into your systems. Same data, same goals, same weekly process.'}
          </p>
          <Link
            to="/hybrid-model"
            className="inline-flex items-center text-primary-600 hover:text-accent-cyan font-bold text-lg group"
          >
            {language === 'sv' ? 'Läs mer om hybridmodellen' : 'Learn more about the hybrid model'}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl lg:text-5xl font-black mb-8">
            {language === 'sv' ? 'Låt oss diskutera era behov' : "Let's Discuss Your Needs"}
          </h2>
          <p className="font-body text-xl text-white/80 mb-12 leading-relaxed">
            {language === 'sv'
              ? 'Vi börjar alltid med en strategidialog för att förstå var vi kan skapa mest värde för er.'
              : 'We always start with a strategy discussion to understand where we can create most value for you.'}
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

export default CapabilitiesPage;
