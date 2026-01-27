import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Globe,
  Building2,
  Users,
  Target,
  Zap,
  Shield,
  Database,
  TrendingUp,
  Mail,
  Phone,
  BarChart3,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SEOHead from '../components/SEOHead';

const BusinessDataPage = () => {
  const { language } = useLanguage();

  const benefits = [
    {
      icon: <Clock className="h-8 w-8" />,
      title: language === 'sv' ? 'Snabb Leverans' : 'Fast Delivery',
      description: language === 'sv'
        ? 'Få era leads inom ett par timmar efter beställning. Inget väntetid – börja prospektera direkt.'
        : 'Get your leads within a couple of hours after ordering. No waiting time – start prospecting immediately.',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: language === 'sv' ? 'Verifierad Kvalitet' : 'Verified Quality',
      description: language === 'sv'
        ? 'AI-stödd urvals- och kvalitetsprocess med dubbelverifierade e-postadresser för högsta träffsäkerhet.'
        : 'AI-supported selection and quality process with double-verified email addresses for highest accuracy.',
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: language === 'sv' ? 'Exakt Målgrupp' : 'Exact Target Audience',
      description: language === 'sv'
        ? 'Specificera bransch, geografiskt område, roller och företagsstorlek för perfekt matchning.'
        : 'Specify industry, geographic area, roles and company size for perfect matching.',
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: language === 'sv' ? 'Direkt Användbar' : 'Ready to Use',
      description: language === 'sv'
        ? 'Få data i Excel/CSV-format redo att importera direkt i ert CRM eller försäljningssystem.'
        : 'Get data in Excel/CSV format ready to import directly into your CRM or sales system.',
    },
  ];

  const dataPoints = [
    {
      icon: <Building2 className="h-6 w-6" />,
      title: language === 'sv' ? 'Företagsinformation' : 'Company Information',
      items: language === 'sv'
        ? ['Företagsnamn', 'Organisationsnummer', 'Bransch & sektor', 'Antal anställda', 'Omsättning', 'Webbplats']
        : ['Company name', 'Organization number', 'Industry & sector', 'Number of employees', 'Revenue', 'Website'],
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: language === 'sv' ? 'Kontaktinformation' : 'Contact Information',
      items: language === 'sv'
        ? ['Förnamn & efternamn', 'Jobbtitel', 'E-postadress (verifierad)', 'Telefonnummer (där tillgängligt)', 'LinkedIn-profil']
        : ['First & last name', 'Job title', 'Email address (verified)', 'Phone number (where available)', 'LinkedIn profile'],
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: language === 'sv' ? 'Geografisk Data' : 'Geographic Data',
      items: language === 'sv'
        ? ['Land', 'Region/län', 'Stad', 'Postadress', 'Koordinater']
        : ['Country', 'Region/state', 'City', 'Postal address', 'Coordinates'],
    },
  ];

  const specifications = [
    {
      icon: <Globe className="h-6 w-6" />,
      title: language === 'sv' ? 'Geografiskt Område' : 'Geographic Area',
      description: language === 'sv'
        ? 'Välj specifika länder, regioner eller städer. Från lokalt till globalt.'
        : 'Choose specific countries, regions or cities. From local to global.',
    },
    {
      icon: <Building2 className="h-6 w-6" />,
      title: language === 'sv' ? 'Bransch & Sektor' : 'Industry & Sector',
      description: language === 'sv'
        ? 'Ange en eller flera branscher, eller välj alla för bred täckning.'
        : 'Specify one or multiple industries, or choose all for broad coverage.',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: language === 'sv' ? 'Roller & Beslutsfattare' : 'Roles & Decision Makers',
      description: language === 'sv'
        ? 'VD, CFO, marknadschefer, inköpsansvariga – välj de roller ni vill nå.'
        : 'CEO, CFO, marketing managers, procurement managers – choose the roles you want to reach.',
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: language === 'sv' ? 'Företagsstorlek' : 'Company Size',
      description: language === 'sv'
        ? 'Filtrera på antal anställda eller omsättning för rätt företagssegment.'
        : 'Filter by number of employees or revenue for the right company segment.',
    },
  ];

  const qualityProcess = [
    {
      step: '1',
      title: language === 'sv' ? 'AI-Driven Urval' : 'AI-Driven Selection',
      description: language === 'sv'
        ? 'Algoritmer analyserar och väljer ut rätt företag och kontakter baserat på era kriterier.'
        : 'Algorithms analyze and select the right companies and contacts based on your criteria.',
    },
    {
      step: '2',
      title: language === 'sv' ? 'Dubbelverifiering' : 'Double Verification',
      description: language === 'sv'
        ? 'E-postadresser verifieras genom flera oberoende system för att säkerställa validitet.'
        : 'Email addresses verified through multiple independent systems to ensure validity.',
    },
    {
      step: '3',
      title: language === 'sv' ? 'Datberikning' : 'Data Enrichment',
      description: language === 'sv'
        ? 'Automatisk berikning med telefonnummer, roller och företagsinformation där tillgängligt.'
        : 'Automatic enrichment with phone numbers, roles and company information where available.',
    },
    {
      step: '4',
      title: language === 'sv' ? 'Kvalitetskontroll' : 'Quality Control',
      description: language === 'sv'
        ? 'Slutlig kontroll för att säkerställa att data möter höga kvalitetsstandarder.'
        : 'Final check to ensure data meets high quality standards.',
    },
  ];

  const useCases = [
    {
      title: language === 'sv' ? 'Outbound-försäljning' : 'Outbound Sales',
      description: language === 'sv'
        ? 'Bygg en kvalificerad prospektlista och nå ut direkt till rätt beslutsfattare.'
        : 'Build a qualified prospect list and reach out directly to the right decision makers.',
      icon: <TrendingUp className="h-6 w-6" />,
    },
    {
      title: language === 'sv' ? 'Marknadskampanjer' : 'Marketing Campaigns',
      description: language === 'sv'
        ? 'Skapa targeted e-postkampanjer till exakt rätt målgrupp för högre konvertering.'
        : 'Create targeted email campaigns to exactly the right audience for higher conversion.',
      icon: <Mail className="h-6 w-6" />,
    },
    {
      title: language === 'sv' ? 'Marknadsexpansion' : 'Market Expansion',
      description: language === 'sv'
        ? 'Identifiera och nå nya marknader och kundsegment snabbt och effektivt.'
        : 'Identify and reach new markets and customer segments quickly and efficiently.',
      icon: <Globe className="h-6 w-6" />,
    },
    {
      title: language === 'sv' ? 'Partner-rekrytering' : 'Partner Recruitment',
      description: language === 'sv'
        ? 'Hitta och kontakta potentiella partners, återförsäljare eller samarbetspartners.'
        : 'Find and contact potential partners, resellers or collaborators.',
      icon: <Users className="h-6 w-6" />,
    },
  ];

  return (
    <>
      <SEOHead
        title={language === 'sv' ? 'Affärsdata & Leadlistor för Snabb Tillväxt | NorthForce' : 'Business Data & Lead Lists for Rapid Growth | NorthForce'}
        description={language === 'sv'
          ? 'Köp verifierade leads och affärsdata. Snabb leverans, AI-verifierade kontakter och exakt målgruppsfiltrering för effektiv försäljning och prospektering.'
          : 'Purchase verified leads and business data. Fast delivery, AI-verified contacts and exact audience filtering for effective sales and prospecting.'}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-accent-cyan/5"></div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-6">
                <Database className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-medium text-primary-600">
                  {language === 'sv' ? 'Verifierad Affärsdata' : 'Verified Business Data'}
                </span>
              </div>

              <h1 className="font-heading text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                {language === 'sv' ? 'Kvalificerade Leads ' : 'Qualified Leads '}
                <span className="bg-gradient-to-r from-primary-600 to-accent-cyan bg-clip-text text-transparent">
                  {language === 'sv' ? 'På Timmar' : 'In Hours'}
                </span>
                <br />
                {language === 'sv' ? 'Inte Veckor' : 'Not Weeks'}
              </h1>

              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                {language === 'sv'
                  ? 'Verifierade kontakter och affärsdata för snabb försäljning och tillväxt. Specificera din målgrupp, få leverans inom ett par timmar.'
                  : 'Verified contacts and business data for rapid sales and growth. Specify your target audience, get delivery within a couple of hours.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-cyan text-white rounded-2xl hover:shadow-glow transition-all duration-300 font-semibold text-lg transform hover:scale-105"
                >
                  {language === 'sv' ? 'Beställ Leads Nu' : 'Order Leads Now'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <a
                  href="#specifications"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:border-primary-600 hover:text-primary-600 transition-all duration-300 font-semibold text-lg"
                >
                  {language === 'sv' ? 'Hur Det Fungerar' : 'How It Works'}
                  <ChevronDown className="ml-2 h-5 w-5" />
                </a>
              </div>

              <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
                  <div className="text-3xl font-black text-primary-600 mb-2">
                    {language === 'sv' ? '< 3h' : '< 3h'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {language === 'sv' ? 'Leveranstid' : 'Delivery time'}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
                  <div className="text-3xl font-black text-primary-600 mb-2">95%+</div>
                  <div className="text-sm text-gray-600">
                    {language === 'sv' ? 'E-post validitet' : 'Email validity'}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
                  <div className="text-3xl font-black text-primary-600 mb-2">100%</div>
                  <div className="text-sm text-gray-600">
                    {language === 'sv' ? 'Anpassningsbar' : 'Customizable'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl font-bold text-gray-900 mb-4">
                {language === 'sv' ? 'Varför Välja NorthForce Data' : 'Why Choose NorthForce Data'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {language === 'sv'
                  ? 'Kvalitet, snabbhet och precision för att accelerera er försäljning.'
                  : 'Quality, speed and precision to accelerate your sales.'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow border border-gray-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-accent-cyan/20 rounded-xl flex items-center justify-center text-primary-600 mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What You Get Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full mb-6 border border-gray-200">
                <Sparkles className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-medium text-primary-600">
                  {language === 'sv' ? 'Vad Du Får' : 'What You Get'}
                </span>
              </div>
              <h2 className="font-heading text-4xl font-bold text-gray-900 mb-4">
                {language === 'sv' ? 'Komplett Affärsdata För Effektiv Prospektering' : 'Complete Business Data For Effective Prospecting'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {language === 'sv'
                  ? 'Varje lead innehåller omfattande information för att göra er outreach personlig och effektiv.'
                  : 'Each lead contains comprehensive information to make your outreach personal and effective.'}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {dataPoints.map((category, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-soft border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-cyan/20 rounded-xl flex items-center justify-center text-primary-600">
                      {category.icon}
                    </div>
                    <h3 className="font-heading text-xl font-bold text-gray-900">
                      {category.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {category.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-accent-emerald flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">
                    {language === 'sv' ? 'Om Telefonnummer' : 'About Phone Numbers'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {language === 'sv'
                      ? 'Vi arbetar aktivt med att berika data med telefonnummer där de finns tillgängliga i öppna källor. Ingen garanti kan ges för täckning, men vi strävar efter högsta möjliga komplettering.'
                      : 'We actively work to enrich data with phone numbers where available in public sources. No guarantee can be given for coverage, but we strive for the highest possible completion.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Specifications Section */}
        <section id="specifications" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl font-bold text-gray-900 mb-4">
                {language === 'sv' ? 'Specificera Din Exakta Målgrupp' : 'Specify Your Exact Target Audience'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {language === 'sv'
                  ? 'Få exakt rätt leads genom att definiera era kriterier. Ju mer specifikt, desto högre relevans.'
                  : 'Get exactly the right leads by defining your criteria. The more specific, the higher relevance.'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {specifications.map((spec, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0">
                      {spec.icon}
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">
                        {spec.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {spec.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-primary-600 to-accent-cyan rounded-2xl p-8 md:p-12 text-white text-center">
              <h3 className="font-heading text-2xl font-bold mb-4">
                {language === 'sv' ? 'Flexibel Volym' : 'Flexible Volume'}
              </h3>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                {language === 'sv'
                  ? 'Beställ från 100 leads till 100,000+. Vi skalar efter era behov – från pilotprojekt till stora kampanjer.'
                  : 'Order from 100 leads to 100,000+. We scale to your needs – from pilot projects to large campaigns.'}
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 rounded-2xl hover:shadow-xl transition-all duration-300 font-semibold text-lg transform hover:scale-105"
              >
                {language === 'sv' ? 'Diskutera Era Behov' : 'Discuss Your Needs'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Quality Process Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-6">
                <Shield className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-medium text-primary-600">
                  {language === 'sv' ? 'Kvalitetsprocess' : 'Quality Process'}
                </span>
              </div>
              <h2 className="font-heading text-4xl font-bold text-gray-900 mb-4">
                {language === 'sv' ? 'Så Säkerställer Vi Högsta Kvalitet' : 'How We Ensure Highest Quality'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {language === 'sv'
                  ? 'En flerstegsprocess med AI och verifiering för att leverera data ni kan lita på.'
                  : 'A multi-step process with AI and verification to deliver data you can trust.'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {qualityProcess.map((process, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100 h-full">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-cyan rounded-xl flex items-center justify-center text-white font-black text-xl mb-4">
                      {process.step}
                    </div>
                    <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">
                      {process.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {process.description}
                    </p>
                  </div>
                  {index < qualityProcess.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-6 w-6 text-primary-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl font-bold text-gray-900 mb-4">
                {language === 'sv' ? 'Användningsområden' : 'Use Cases'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {language === 'sv'
                  ? 'Hur framgångsrika bolag använder kvalificerad affärsdata för att accelerera tillväxt.'
                  : 'How successful companies use qualified business data to accelerate growth.'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {useCases.map((useCase, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:border-primary-600 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0">
                      {useCase.icon}
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">
                        {useCase.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {useCase.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <Database className="h-16 w-16 text-accent-cyan mx-auto mb-6" />
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              {language === 'sv' ? 'Redo Att Accelerera Er Försäljning?' : 'Ready to Accelerate Your Sales?'}
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              {language === 'sv'
                ? 'Kontakta oss för att diskutera era behov. Vi skickar ett skräddarsytt förslag med prissättning inom 24 timmar.'
                : 'Contact us to discuss your needs. We\'ll send a tailored proposal with pricing within 24 hours.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 rounded-2xl hover:shadow-xl transition-all duration-300 font-semibold text-lg transform hover:scale-105"
              >
                {language === 'sv' ? 'Beställ Leads Nu' : 'Order Leads Now'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/audit"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-2xl hover:bg-white hover:text-gray-900 transition-all duration-300 font-semibold text-lg"
              >
                {language === 'sv' ? 'Boka Rådgivning' : 'Book Consultation'}
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-6 max-w-2xl mx-auto">
              <p className="text-white/80 text-sm">
                {language === 'sv'
                  ? 'GDPR-compliant datainsamling och hantering. All data kommer från offentliga och etiskt korrekta källor.'
                  : 'GDPR-compliant data collection and handling. All data comes from public and ethically correct sources.'}
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BusinessDataPage;
