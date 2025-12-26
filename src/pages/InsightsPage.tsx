import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Zap, BarChart3 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import CtaSection from '../components/CtaSection';
import SEOHead from '../components/SEOHead';

const InsightsPage = () => {
  const { language } = useLanguage();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": {
      "en": "NorthForce Insights",
      "sv": "NorthForce Insikter"
    },
    "description": {
      "en": "Expert perspectives on automation, AI, and system optimization for business growth",
      "sv": "Expertperspektiv på automation, AI och systemoptimering för affärstillväxt"
    },
    "publisher": {
      "@type": "Organization",
      "name": "NorthForce",
      "url": "https://northforce.io"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "url": "https://northforce.io/insights"
    }
  };

  const featuredArticles = [
    {
      title: language === 'sv' ? "Hybridmodellens ROI i Praktiken" : "The ROI of the Hybrid Model in Practice",
      excerpt: language === 'sv'
        ? "Hur företag uppnår 3x ROI genom att kombinera strategisk expertis med flexibel kapacitet."
        : "How companies achieve 3x ROI by combining strategic expertise with flexible capacity.",
      category: language === 'sv' ? "Strategi" : "Strategy",
      icon: <Zap className="h-6 w-6" />,
      color: "text-accent-cyan"
    },
    {
      title: language === 'sv' ? "Från Projekt till Partnership" : "From Project to Partnership",
      excerpt: language === 'sv'
        ? "Varför kontinuerlig närvaro driver bättre resultat än punktinsatser."
        : "Why continuous presence drives better results than point interventions.",
      category: language === 'sv' ? "Ledarskap" : "Leadership",
      icon: <Brain className="h-6 w-6" />,
      color: "text-accent-purple"
    },
    {
      title: language === 'sv' ? "Skalbar Excellens" : "Scalable Excellence",
      excerpt: language === 'sv'
        ? "Hur system och dokumentation skapar tillväxt utan kaos."
        : "How systems and documentation create growth without chaos.",
      category: language === 'sv' ? "Operationer" : "Operations",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "text-accent-emerald"
    }
  ];

  const recentArticles = [
    {
      title: language === 'sv' ? "Att Mäta Konsultvärde" : "Measuring Consulting Value",
      excerpt: language === 'sv'
        ? "Nyckeltal och ramverk för att utvärdera strategiska partners."
        : "Key metrics and frameworks for evaluating strategic partners.",
      category: language === 'sv' ? "Analys" : "Analytics",
      date: language === 'sv' ? "10 jan 2025" : "Jan 10, 2025"
    },
    {
      title: language === 'sv' ? "Framtidens Organisationsmodell" : "The Future Organization Model",
      excerpt: language === 'sv'
        ? "Varför fler företag väljer flexibel kapacitet framför fasta strukturer."
        : "Why more companies choose flexible capacity over fixed structures.",
      category: language === 'sv' ? "Trender" : "Trends",
      date: language === 'sv' ? "8 jan 2025" : "Jan 8, 2025"
    },
    {
      title: language === 'sv' ? "System som Skapar Frihet" : "Systems that Create Freedom",
      excerpt: language === 'sv'
        ? "Hur rätt processer och dokumentation minskar stress och ökar kontroll."
        : "How proper processes and documentation reduce stress and increase control.",
      category: language === 'sv' ? "Processer" : "Processes",
      date: language === 'sv' ? "5 jan 2025" : "Jan 5, 2025"
    }
  ];

  const categories = [
    { name: "All", count: 24 },
    { name: "Automation", count: 8 },
    { name: "AI Solutions", count: 6 },
    { name: "CRM", count: 4 },
    { name: "Integration", count: 3 },
    { name: "Analytics", count: 2 },
    { name: "Security", count: 1 }
  ];

  return (
    <div className="bg-white overflow-hidden">
      <SEOHead
        title="Latest Insights - Expert Perspectives on Business Automation"
        titleSv="Senaste insikter - Expertperspektiv på affärsautomation"
        description="Expert perspectives on automation, AI, and system optimization. Learn how to transform your business with proven strategies and real-world case studies."
        descriptionSv="Expertperspektiv på automation, AI och systemoptimering. Lär dig hur du transformerar ditt företag med beprövade strategier och verkliga fallstudier."
        keywords="business automation insights, AI implementation, system optimization, automation ROI, business process improvement"
        keywordsSv="affärsautomation insikter, AI-implementering, systemoptimering, automation ROI, affärsprocessförbättring"
        canonicalUrl="https://northforce.io/insights"
        structuredData={structuredData}
        breadcrumbs={[{ name: "Home", url: "https://northforce.io/" }, { name: "Insights", url: "https://northforce.io/insights" }]}
      />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-purple rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-cyan rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-white/20 text-white rounded-full text-sm font-semibold tracking-wide uppercase">
              {language === 'sv' ? 'Kunskap & Insikter' : 'Knowledge & Insights'}
            </span>
          </div>

          <h1 className="font-heading text-5xl lg:text-7xl font-black mb-8 tracking-tight">
            {language === 'sv' ? 'Senaste ' : 'Latest '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-cyan">
              {language === 'sv' ? 'Insikter' : 'Insights'}
            </span>
          </h1>
          <p className="font-body text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
            {language === 'sv'
              ? 'Strategiska perspektiv, operativa ramverk och beprövade metoder för att bygga skalbar och hållbar tillväxt. Från teori till praktisk implementation.'
              : 'Strategic perspectives, operational frameworks, and proven methods for building scalable and sustainable growth. From theory to practical implementation.'}
          </p>
        </div>
      </section>

        {/* Featured Articles */}
        <section className="py-24 section-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                {language === 'sv' ? 'Utvald ' : 'Featured '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-cyan">
                  {language === 'sv' ? 'Kunskap' : 'Knowledge'}
                </span>
              </h2>
              <p className="font-body text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                {language === 'sv'
                  ? 'Djupgående analyser och praktiska ramverk för strategisk tillväxt och operativ excellens.'
                  : 'In-depth analyses and practical frameworks for strategic growth and operational excellence.'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
              {featuredArticles.map((article, index) => (
                <article key={index} className="bg-white border-2 border-gray-200 rounded-3xl p-10 hover:border-accent-cyan hover:shadow-2xl transition-all duration-500 group">
                  <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
                    {/* Icon & Category */}
                    <div className="flex-shrink-0 mb-6 md:mb-0">
                      <div className={`${article.color} w-20 h-20 bg-gradient-to-br from-current/10 to-current/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <div className="w-10 h-10">
                          {article.icon}
                        </div>
                      </div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${article.color} bg-current/10`}>
                        {article.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="font-heading text-3xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
                        {article.title}
                      </h3>
                      <p className="font-body text-lg text-gray-700 mb-6 leading-relaxed">
                        {article.excerpt}
                      </p>

                      <Link
                        to="/contact"
                        className={`inline-flex items-center ${article.color} font-bold hover:opacity-80 transition-opacity group/link`}
                      >
                        {language === 'sv' ? 'Diskutera Detta Ämne Med Oss' : 'Discuss This Topic With Us'}
                        <ArrowRight className="ml-2 h-5 w-5 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Categories & Recent Articles */}
        <section className="py-24 section-accent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Categories Sidebar */}
              <div className="lg:col-span-1">
                <div className="premium-card sticky top-8">
                  <h3 className="font-heading text-2xl font-black text-gray-900 mb-6">Categories</h3>
                  <ul className="space-y-3">
                    {categories.map((category, index) => (
                      <li key={index}>
                        <button className="flex items-center justify-between w-full text-left py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors">
                          <span className="font-body text-gray-700 font-medium">{category.name}</span>
                          <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">{category.count}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recent Articles */}
              <div className="lg:col-span-3">
                <h3 className="font-heading text-4xl font-black text-gray-900 mb-12 tracking-tight">
                  {language === 'sv' ? 'Senaste Artiklarna' : 'Recent Articles'}
                </h3>
                <div className="space-y-6">
                  {recentArticles.map((article, index) => (
                    <article key={index} className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-primary-600 hover:shadow-xl transition-all duration-300 group">
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-start justify-between">
                          <span className="inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide text-primary-600 bg-primary-600/10">
                            {article.category}
                          </span>
                          <span className="text-sm text-gray-500 font-medium">{article.date}</span>
                        </div>

                        <h4 className="font-heading text-2xl font-black text-gray-900 group-hover:text-primary-600 transition-colors leading-tight">
                          {article.title}
                        </h4>

                        <p className="font-body text-base text-gray-700 leading-relaxed">
                          {article.excerpt}
                        </p>

                        <div className="pt-4 border-t border-gray-100">
                          <Link
                            to="/contact"
                            className="inline-flex items-center text-primary-600 font-bold hover:text-accent-cyan transition-colors group/link"
                          >
                            {language === 'sv' ? 'Diskutera Detta Ämne' : 'Discuss This Topic'}
                            <ArrowRight className="ml-2 h-5 w-5 group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-24 section-dark text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="font-heading text-5xl lg:text-7xl font-black mb-8 tracking-tight">
              Stay <span className="text-brand-emerald">Informed</span>
            </h2>
            <p className="font-body text-xl lg:text-2xl text-white max-w-3xl mx-auto mb-12 font-normal leading-relaxed">
              Get weekly insights on business automation, AI trends, and system optimization strategies.
            </p>
            
            <div className="max-w-md mx-auto">
              <form className="flex space-x-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-cyan transition-all"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-accent-cyan to-accent-purple text-white px-8 py-4 rounded-2xl hover:shadow-glow transition-all duration-300 font-bold transform hover:scale-105"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>

      <CtaSection
        title="Ready to Transform Your "
        titleHighlight="Business?"
        subtitle="Apply these insights to your business with our proven systems and expert guidance."
        backgroundClass="py-24 bg-white"
        titleClass="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight"
        subtitleClass="font-body text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 font-normal leading-relaxed"
        ctaButtons={[
          { text: 'Book Strategy Call', href: '/contact', variant: 'accent', icon: <ArrowRight className="h-6 w-6" /> },
          { text: 'Get Free Audit', href: '/audit', variant: 'custom', customClasses: 'bg-gray-100 text-gray-900 px-10 py-5 rounded-2xl hover:bg-gray-200 transition-all duration-300 font-bold text-lg inline-flex items-center transform hover:scale-105' },
        ]}
      />
    </div>
  );
};

export default InsightsPage;