import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Users, Globe, Award, TrendingUp, Lightbulb, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SEOHead from '../components/SEOHead';

const AboutPage = () => {
  const { language } = useLanguage();

  const values = [
    {
      icon: <Target className="h-8 w-8" />,
      title: language === 'sv' ? 'Outcome över Output' : 'Outcome over Output',
      description: language === 'sv'
        ? 'Vi mäter framgång på affärsresultat, inte leverabler. Varje insats ska ha tydlig koppling till värdeskapande.'
        : 'We measure success on business results, not deliverables. Every effort must have clear connection to value creation.',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: language === 'sv' ? 'Långsiktighet' : 'Long-term Thinking',
      description: language === 'sv'
        ? 'Vi bygger för hållbar tillväxt, inte quick wins. Relationer och systemkapital övertrumfar kortsiktiga optimeringar.'
        : 'We build for sustainable growth, not quick wins. Relationships and system capital trump short-term optimizations.',
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: language === 'sv' ? 'Thought Leadership' : 'Thought Leadership',
      description: language === 'sv'
        ? 'Vi driver utvecklingen framåt genom forskningsbaserad metodik och kontinuerlig innovation i vårt arbetssätt.'
        : 'We drive development forward through research-based methodology and continuous innovation in our way of working.',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: language === 'sv' ? 'Transparent Partnerskap' : 'Transparent Partnership',
      description: language === 'sv'
        ? 'Öppen kommunikation, rak feedback och gemensamt ägarskap av både framgångar och utmaningar.'
        : 'Open communication, straight feedback and shared ownership of both successes and challenges.',
    },
  ];

  const expertise = [
    {
      area: language === 'sv' ? 'Management Consulting' : 'Management Consulting',
      firms: language === 'sv' ? 'McKinsey, BCG, Bain, Accenture' : 'McKinsey, BCG, Bain, Accenture',
    },
    {
      area: language === 'sv' ? 'Tech & SaaS' : 'Tech & SaaS',
      firms: 'Google, Microsoft, Salesforce, HubSpot',
    },
    {
      area: language === 'sv' ? 'Private Equity' : 'Private Equity',
      firms: language === 'sv' ? 'Ledande PE/VC-fonder i Norden' : 'Leading PE/VC funds in the Nordics',
    },
    {
      area: language === 'sv' ? 'Scale-ups' : 'Scale-ups',
      firms: language === 'sv' ? 'Hypertillväxtbolag 10-100M ARR' : 'Hyper-growth companies 10-100M ARR',
    },
  ];

  return (
    <div className="bg-white overflow-hidden">
      <SEOHead
        title={language === 'sv' ? 'Om NorthForce' : 'About NorthForce'}
        description={language === 'sv'
          ? 'Vi är en ny generation strategisk partner för ambitiösa företag. Expertis från världsledande konsultbolag och tech-företag.'
          : 'We are a new generation strategic partner for ambitious companies. Expertise from world-leading consultancies and tech companies.'}
        canonicalUrl="https://northforce.io/about"
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
              {language === 'sv' ? 'Vårt Ursprung' : 'Our Origin'}
            </span>
          </div>

          <h1 className="font-heading text-5xl lg:text-7xl font-black mb-8 tracking-tight">
            {language === 'sv' ? 'En Ny Generation' : 'A New Generation'}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-emerald">
              {language === 'sv' ? 'Strategisk Partner' : 'Strategic Partner'}
            </span>
          </h1>
          <p className="font-body text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
            {language === 'sv'
              ? 'Ett nätverk av partners från världsledande konsultbolag och tech-företag, förenade för att bygga framtidens modell för tillväxtpartnerskap.'
              : 'A network of partners from world-leading consultancies and tech companies, united to build the future model for growth partnership.'}
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="font-heading text-4xl lg:text-5xl font-black text-gray-900 mb-8">
              {language === 'sv' ? 'Varför Vi Existerar' : 'Why We Exist'}
            </h2>
            <div className="space-y-6 font-body text-lg text-gray-700 leading-relaxed">
              <p>
                {language === 'sv'
                  ? 'Vi byggde NorthForce utifrån en enkel insikt: Växande företag fastnar mellan tre otillfredsställande alternativ när de söker tillväxtkapacitet.'
                  : 'We built NorthForce based on a simple insight: Growing companies get stuck between three unsatisfactory alternatives when seeking growth capacity.'}
              </p>
              <p>
                {language === 'sv'
                  ? 'Antingen anställer de – med hög risk, lång tid och personberoende. Eller så anlitar de konsulter och byråer – fragmenterat, projektbaserat och utan långsiktighet. Eller så försöker de klara allt själva – vilket leder till utbrändhet och suboptimala resultat.'
                  : 'Either they hire – with high risk, long time and person dependency. Or they engage consultants and agencies – fragmented, project-based and without long-term perspective. Or they try to handle everything themselves – which leads to burnout and suboptimal results.'}
              </p>
              <p>
                {language === 'sv'
                  ? 'NorthForce skapades för att erbjuda alternativet som inte existerade: En hybridmodell som kombinerar strategisk expertis från management consulting med skalbar leverans från tech-världen, allt levererat med kontinuiteten av ett strategiskt partnerskap.'
                  : 'NorthForce was created to offer the alternative that did not exist: A hybrid model combining strategic expertise from management consulting with scalable delivery from the tech world, all delivered with the continuity of a strategic partnership.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {language === 'sv' ? 'Våra ' : 'Our '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
                {language === 'sv' ? 'Värderingar' : 'Values'}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-8">
                <div className="text-primary-600 mb-4">
                  {value.icon}
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="font-body text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Background */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {language === 'sv' ? 'Vårt ' : 'Our '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
                {language === 'sv' ? 'Partnernätverk' : 'Partner Network'}
              </span>
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'sv'
                ? 'NorthForce är en hybridmodell där vi kombinerar interna specialister med ett kurerat nätverk av partners från världsledande organisationer'
                : 'NorthForce is a hybrid model where we combine internal specialists with a curated network of partners from world-leading organizations'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expertise.map((exp, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-8">
                <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">
                  {exp.area}
                </h3>
                <p className="font-body text-gray-600 text-sm">
                  {exp.firms}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-gradient-to-br from-primary-50 to-accent-cyan/10 border border-primary-200 rounded-2xl p-8 text-center">
            <h3 className="font-heading text-2xl font-bold text-gray-900 mb-4">
              {language === 'sv' ? 'Vi Rekryterar Kontinuerligt' : 'We Are Continuously Recruiting'}
            </h3>
            <p className="font-body text-gray-600 mb-6 max-w-2xl mx-auto">
              {language === 'sv'
                ? 'Söker du en plats där strategiskt tänkande möter hands-on execution? Där du får driva påverkan istället för att producera PowerPoints?'
                : 'Looking for a place where strategic thinking meets hands-on execution? Where you get to drive impact instead of producing PowerPoints?'}
            </p>
            <Link
              to="/careers"
              className="inline-flex items-center text-primary-600 hover:text-accent-cyan font-bold text-lg group"
            >
              {language === 'sv' ? 'Se lediga roller' : 'View open positions'}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Nordic Focus */}
      <section className="py-32 bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Globe className="h-16 w-16 text-accent-cyan mx-auto mb-8" />
          <h2 className="font-heading text-4xl lg:text-5xl font-black mb-8">
            {language === 'sv' ? 'Nordiskt Ursprung, Global Klass' : 'Nordic Origin, Global Class'}
          </h2>
          <p className="font-body text-xl text-white/80 mb-8 leading-relaxed">
            {language === 'sv'
              ? 'Vi är stolta över våra nordiska rötter – den kultur av transparens, pragmatism och samarbete som definierar regionen. Men vår metodik och standard är byggd på global best practice från världens främsta organisationer.'
              : 'We are proud of our Nordic roots – the culture of transparency, pragmatism and collaboration that defines the region. But our methodology and standard are built on global best practice from the world\'s leading organizations.'}
          </p>
          <p className="font-body text-lg text-white/70">
            {language === 'sv'
              ? 'Baserad i Stockholm — Verksam i hela Norden'
              : 'Based in Stockholm — Operating across the Nordics'}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl lg:text-5xl font-black text-gray-900 mb-8">
            {language === 'sv' ? 'Låt Oss Samtala' : "Let's Talk"}
          </h2>
          <p className="font-body text-xl text-gray-600 mb-12 leading-relaxed">
            {language === 'sv'
              ? 'Vi älskar att diskutera strategiska utmaningar med ambitiösa ledare. Ingen försäljning, bara genuint intresse för era mål.'
              : 'We love discussing strategic challenges with ambitious leaders. No sales pitch, just genuine interest in your goals.'}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center bg-gradient-to-r from-primary-600 to-accent-cyan text-white px-10 py-5 rounded-xl font-bold text-lg hover:shadow-glow transition-all duration-300 group"
          >
            {language === 'sv' ? 'Boka Strategidialog' : 'Book Strategy Discussion'}
            <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
