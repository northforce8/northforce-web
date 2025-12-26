import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Target, Briefcase, Scale, Users, Zap, CheckCircle, Award, LineChart, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SEOHead from '../components/SEOHead';

const PartnersPage = () => {
  const { language } = useLanguage();

  const partnerBenefits = [
    {
      icon: <LineChart className="h-8 w-8" />,
      title: language === 'sv' ? 'Stabila Återkommande Intäkter' : 'Stable Recurring Revenue',
      description: language === 'sv'
        ? 'Månadsavgifter per aktiverat område ger förutsägbara intäkter och jämnare arbetsbelastning över tid.'
        : 'Monthly fees per activated area provide predictable revenue and smoother workload over time.',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: language === 'sv' ? 'Ingen Egen Försäljning' : 'No Own Sales Required',
      description: language === 'sv'
        ? 'Vi sköter kundanskaffning, kvalificering och försäljning. Ni fokuserar på er specialistkompetens.'
        : 'We handle customer acquisition, qualification and sales. You focus on your specialist expertise.',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: language === 'sv' ? 'Färdigt System' : 'Ready-Made System',
      description: language === 'sv'
        ? 'All administration, struktur och systemuppsättning är klar. Ni kliver in i fungerande processer direkt.'
        : 'All administration, structure and system setup is ready. You step into working processes immediately.',
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: language === 'sv' ? 'Högre Marginaler' : 'Higher Margins',
      description: language === 'sv'
        ? 'Tokens uttrycker värde istället för timmar. Er specialistkompetens får större genomslag och bättre ersättning.'
        : 'Tokens express value instead of hours. Your specialist expertise gets greater impact and better compensation.',
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: language === 'sv' ? 'Långsiktiga Relationer' : 'Long-term Relationships',
      description: language === 'sv'
        ? 'Kunder abonnerar på kontinuitet, inte projekt. Ni bygger djupare relationer över månader och år.'
        : 'Customers subscribe to continuity, not projects. You build deeper relationships over months and years.',
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: language === 'sv' ? 'Tvärfunktionellt Samarbete' : 'Cross-functional Collaboration',
      description: language === 'sv'
        ? 'Arbeta med andra specialister i samma system utan koordinationskrångel. Gemensam plattform för alla.'
        : 'Work with other specialists in the same system without coordination hassle. Common platform for everyone.',
    },
  ];

  const partnerAreas = [
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: language === 'sv' ? 'Marknadsstrategi (CMO)' : 'Marketing Strategy (CMO)',
      description: language === 'sv'
        ? 'Strategisk marknadsrådgivning, kampanjledning, varumärkesbyggande och tillväxtmarknadsföring.'
        : 'Strategic marketing advisory, campaign leadership, brand building and growth marketing.',
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: language === 'sv' ? 'Försäljning (CRO)' : 'Sales (CRO)',
      description: language === 'sv'
        ? 'Säljstrategi, pipeline-optimering, säljprocesser och teamutveckling för ökad konvertering.'
        : 'Sales strategy, pipeline optimization, sales processes and team development for increased conversion.',
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: language === 'sv' ? 'Ekonomistyrning (CFO)' : 'Financial Management (CFO)',
      description: language === 'sv'
        ? 'Finansiell planering, rapportering, lönsamhetsanalys och kassaflödeshantering.'
        : 'Financial planning, reporting, profitability analysis and cash flow management.',
    },
    {
      icon: <Scale className="h-8 w-8" />,
      title: language === 'sv' ? 'Juridik & Compliance (CLO)' : 'Legal & Compliance (CLO)',
      description: language === 'sv'
        ? 'Avtal, bolagsrätt, riskhantering, dataskydd och styrningsramverk på enterprise-nivå.'
        : 'Contracts, corporate law, risk management, data protection and governance frameworks at enterprise level.',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: language === 'sv' ? 'Strategi & Transformation (CSO)' : 'Strategy & Transformation (CSO)',
      description: language === 'sv'
        ? 'Affärsstrategi, organisationsdesign, förändringsledning och strategisk planering.'
        : 'Business strategy, organizational design, change management and strategic planning.',
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: language === 'sv' ? 'HR & Organisationsutveckling' : 'HR & Organizational Development',
      description: language === 'sv'
        ? 'Talangstrategi, kultur, rekrytering, kompetensutveckling och medarbetarengagemang.'
        : 'Talent strategy, culture, recruitment, skills development and employee engagement.',
    },
  ];

  const howItWorks = [
    {
      step: '1',
      title: language === 'sv' ? 'Ansök som Partner' : 'Apply as Partner',
      description: language === 'sv'
        ? 'Berätta om din expertis, erfarenhet och vilket område du vill arbeta inom. Vi utvärderar matchning mot vår modell.'
        : 'Tell us about your expertise, experience and which area you want to work in. We evaluate fit with our model.',
    },
    {
      step: '2',
      title: language === 'sv' ? 'Onboarding & Integration' : 'Onboarding & Integration',
      description: language === 'sv'
        ? 'Introduktion till plattformen, arbetssätt, system och hur du samarbetar med andra specialister.'
        : 'Introduction to platform, working methods, systems and how you collaborate with other specialists.',
    },
    {
      step: '3',
      title: language === 'sv' ? 'Kund-matchning' : 'Customer Matching',
      description: language === 'sv'
        ? 'Vi matchar dig med kunder där ditt område aktiveras. Du får tillgång till kunddata och kan börja arbeta direkt.'
        : 'We match you with customers where your area is activated. You get access to customer data and can start working immediately.',
    },
    {
      step: '4',
      title: language === 'sv' ? 'Löpande Samarbete' : 'Ongoing Collaboration',
      description: language === 'sv'
        ? 'Du arbetar kontinuerligt med dina kunder via plattformen. Månadsavgifter och tokens ger stabil ekonomi.'
        : 'You work continuously with your customers via the platform. Monthly fees and tokens provide stable finances.',
    },
  ];

  return (
    <div className="bg-white overflow-hidden">
      <SEOHead
        title={language === 'sv'
          ? 'Bli Partner — NorthForce'
          : 'Become a Partner — NorthForce'}
        description={language === 'sv'
          ? 'Samarbeta med NorthForce och arbeta med våra kunder inom ditt specialistområde. Stabila intäkter, inga försäljningsbekymmer, färdigt system.'
          : 'Collaborate with NorthForce and work with our customers in your specialist area. Stable revenue, no sales worries, ready-made system.'}
        canonicalUrl="https://northforce.io/partners"
      />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center section-dark overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-96 h-96 bg-accent-cyan rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-brand-violet rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-accent-cyan/20 text-accent-cyan rounded-full text-sm font-semibold tracking-wide uppercase">
                {language === 'sv' ? 'Bli Partner' : 'Become a Partner'}
              </span>
            </div>

            <h1 className="font-heading text-6xl lg:text-8xl font-black text-white mb-8 tracking-tight leading-none">
              {language === 'sv' ? 'Arbeta med ' : 'Work with '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-brand-violet to-accent-emerald">
                {language === 'sv' ? 'Tillväxtbolag' : 'Growth Companies'}
              </span>
              <br />
              {language === 'sv' ? 'på Dina Villkor' : 'on Your Terms'}
            </h1>

            <p className="font-body text-xl lg:text-2xl text-white/80 mb-12 leading-relaxed max-w-3xl mx-auto">
              {language === 'sv'
                ? 'Fokusera på din specialistkompetens. Vi sköter försäljning, administration och system. Du får stabila återkommande intäkter och arbetar med kunder som värdesätter expertis.'
                : 'Focus on your specialist expertise. We handle sales, administration and systems. You get stable recurring revenue and work with customers who value expertise.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/contact"
                className="group bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center justify-center hover:bg-gray-100 transition-all duration-300 shadow-xl"
              >
                {language === 'sv' ? 'Ansök Som Partner' : 'Apply as Partner'}
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Benefits */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              {language === 'sv' ? 'Fördelar för ' : 'Benefits for '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
                {language === 'sv' ? 'Partners' : 'Partners'}
              </span>
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {language === 'sv'
                ? 'En affärsmodell byggd för att ge specialister stabilitet, genomslag och frihet'
                : 'A business model built to give specialists stability, impact and freedom'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partnerBenefits.map((benefit, index) => (
              <div
                key={index}
                className="group bg-white border border-gray-200 rounded-2xl p-8 hover:border-primary-600/40 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="flex-shrink-0 text-primary-600 transform group-hover:scale-110 transition-transform">
                    {benefit.icon}
                  </div>
                  <h3 className="font-heading text-xl font-bold text-gray-900">
                    {benefit.title}
                  </h3>
                </div>
                <p className="font-body text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Areas */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              {language === 'sv' ? 'Specialistområden ' : 'Specialist Areas '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
                {language === 'sv' ? 'Vi Söker' : 'We Seek'}
              </span>
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {language === 'sv'
                ? 'Vi letar efter erfarna specialister inom sex kärnområden som vill arbeta långsiktigt med tillväxtbolag'
                : 'We are looking for experienced specialists in six core areas who want to work long-term with growth companies'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partnerAreas.map((area, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-8 hover:border-primary-600/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mb-6">
                  <div className="text-white">
                    {area.icon}
                  </div>
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-4">
                  {area.title}
                </h3>
                <p className="font-body text-gray-600 leading-relaxed">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              {language === 'sv' ? 'Så ' : 'How '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
                {language === 'sv' ? 'Kommer Ni Igång' : 'to Get Started'}
              </span>
            </h2>
          </div>

          <div className="space-y-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-primary-600/40 hover:shadow-lg transition-all">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-accent-cyan flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl font-black">{item.step}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-2xl font-bold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="font-body text-lg text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Look For */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight">
              {language === 'sv' ? 'Vad Vi Söker hos En Partner' : 'What We Look For in a Partner'}
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-heading text-lg font-bold text-gray-900 mb-2">
                    {language === 'sv' ? 'Bevisad Erfarenhet' : 'Proven Experience'}
                  </h4>
                  <p className="font-body text-gray-600 leading-relaxed">
                    {language === 'sv'
                      ? 'Minst 5-10 års erfarenhet inom ditt område med dokumenterade framgångar. Du har arbetat både strategiskt och operativt.'
                      : 'At least 5-10 years of experience in your area with documented successes. You have worked both strategically and operationally.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-heading text-lg font-bold text-gray-900 mb-2">
                    {language === 'sv' ? 'Systemtänk & Struktur' : 'Systems Thinking & Structure'}
                  </h4>
                  <p className="font-body text-gray-600 leading-relaxed">
                    {language === 'sv'
                      ? 'Du förstår vikten av processer, dokumentation och systematiskt arbetssätt. Bekväm med digitala verktyg och plattformar.'
                      : 'You understand the importance of processes, documentation and systematic working methods. Comfortable with digital tools and platforms.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-heading text-lg font-bold text-gray-900 mb-2">
                    {language === 'sv' ? 'Samarbetsförmåga' : 'Collaboration Skills'}
                  </h4>
                  <p className="font-body text-gray-600 leading-relaxed">
                    {language === 'sv'
                      ? 'Vana att arbeta tvärfunktionellt med andra specialister. Du ser värdet i att komplettera varandra istället för att konkurrera.'
                      : 'Experienced in working cross-functionally with other specialists. You see the value in complementing each other rather than competing.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-heading text-lg font-bold text-gray-900 mb-2">
                    {language === 'sv' ? 'Långsiktigt Tänk' : 'Long-term Thinking'}
                  </h4>
                  <p className="font-body text-gray-600 leading-relaxed">
                    {language === 'sv'
                      ? 'Du vill bygga långsiktiga relationer med kunder och se resultat över tid, inte bara lösa snabba projekt.'
                      : 'You want to build long-term relationships with customers and see results over time, not just solve quick projects.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl lg:text-6xl font-black mb-8 tracking-tight">
            {language === 'sv' ? 'Redo Att Bli Partner?' : 'Ready to Become a Partner?'}
          </h2>
          <p className="font-body text-xl text-white/80 mb-12 leading-relaxed">
            {language === 'sv'
              ? 'Ansök idag och berätta om din expertis. Vi återkommer inom 48 timmar med nästa steg.'
              : 'Apply today and tell us about your expertise. We will get back to you within 48 hours with next steps.'}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center bg-white text-gray-900 px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl group"
          >
            {language === 'sv' ? 'Ansök Som Partner' : 'Apply as Partner'}
            <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PartnersPage;
