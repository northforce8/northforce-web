import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, BarChart3, Globe, Zap, CheckCircle, FileText, TrendingUp, Shield, Sparkles, Network, Target, Building2, Scale, GraduationCap, Heart, Store, Plane, UserCheck, Palette, Briefcase, Rocket, Star, Brain } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import CtaSection from '../components/CtaSection';
import SEOHead from '../components/SEOHead';
import ContactForm from '../components/ContactForm';
import { useLanguage } from '../contexts/LanguageContext';

const AuditPage = () => {
  const { language, t } = useLanguage();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": {
      "en": "AI Audit",
      "sv": "AI-revision"
    },
    "description": {
      "en": "Get a comprehensive audit covering site, SEO, content strategy, online listings, site speed, and social presence. Receive a detailed PDF report with a strategic roadmap.",
      "sv": "Få en omfattande revision som täcker webbplats, SEO, innehållsstrategi, onlinelistor, webbplatshastighet och social närvaro. Få en detaljerad PDF-rapport med en strategisk färdplan."
    },
    "provider": {
      "@type": "Organization",
      "name": "NorthForce",
      "url": "https://northforce.io"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "name": "AI Audit"
    }
  };

  const auditAreas = [
    {
      icon: <Globe className="h-10 w-10" />,
      iconColor: "text-accent-cyan",
      title: t('audit.analyze.site'),
      description: t('audit.analyze.site_desc')
    },
    {
      icon: <Search className="h-10 w-10" />,
      iconColor: "text-primary-600",
      title: t('audit.analyze.seo'),
      description: t('audit.analyze.seo_desc')
    },
    {
      icon: <BarChart3 className="h-10 w-10" />,
      iconColor: "text-accent-emerald",
      title: t('audit.analyze.content'),
      description: t('audit.analyze.content_desc')
    },
    {
      icon: <TrendingUp className="h-10 w-10" />,
      iconColor: "text-accent-amber",
      title: t('audit.analyze.listings'),
      description: t('audit.analyze.listings_desc')
    },
    {
      icon: <Zap className="h-10 w-10" />,
      iconColor: "text-accent-rose",
      title: t('audit.analyze.speed'),
      description: t('audit.analyze.speed_desc')
    },
    {
      icon: <Shield className="h-10 w-10" />,
      iconColor: "text-primary-600",
      title: t('audit.analyze.social'),
      description: t('audit.analyze.social_desc')
    }
  ];

  const industries = [
    { icon: <Building2 className="h-7 w-7" />, name: t('audit.industries.real_estate'), color: "text-accent-cyan" },
    { icon: <Scale className="h-7 w-7" />, name: t('audit.industries.legal'), color: "text-primary-600" },
    { icon: <Target className="h-7 w-7" />, name: t('audit.industries.finance'), color: "text-accent-emerald" },
    { icon: <GraduationCap className="h-7 w-7" />, name: t('audit.industries.education'), color: "text-accent-amber" },
    { icon: <Heart className="h-7 w-7" />, name: t('audit.industries.healthcare'), color: "text-accent-rose" },
    { icon: <Store className="h-7 w-7" />, name: t('audit.industries.local_services'), color: "text-primary-600" },
    { icon: <Globe className="h-7 w-7" />, name: t('audit.industries.ecommerce'), color: "text-accent-cyan" },
    { icon: <Plane className="h-7 w-7" />, name: t('audit.industries.travel'), color: "text-primary-600" },
    { icon: <UserCheck className="h-7 w-7" />, name: t('audit.industries.recruitment'), color: "text-accent-emerald" },
    { icon: <Palette className="h-7 w-7" />, name: t('audit.industries.creative'), color: "text-accent-amber" },
    { icon: <Briefcase className="h-7 w-7" />, name: t('audit.industries.b2b'), color: "text-accent-rose" },
    { icon: <Rocket className="h-7 w-7" />, name: t('audit.industries.tech'), color: "text-primary-600" }
  ];

  const proofPoints = [
    { metric: "+40%", description: "More leads in 6 weeks", color: "text-accent-cyan" },
    { metric: "2x", description: "Faster onboarding", color: "text-primary-600" },
    { metric: "+60%", description: "Trust signals", color: "text-accent-emerald" },
    { metric: "95%", description: "Client retention rate", color: "text-accent-amber" },
    { metric: "$2.4M", description: "Revenue generated for clients", color: "text-accent-rose" },
    { metric: "24/7", description: "AI assistant uptime", color: "text-primary-600" }
  ];

  return (
    <div className="bg-white overflow-hidden">
      <SEOHead
        title="AI Audit - Get Your Digital Roadmap"
        titleSv="AI-revision - Få din digitala färdplan"
        description="Get a comprehensive audit covering site, SEO, content strategy, online listings, site speed, and social presence. Receive a detailed PDF report with a strategic roadmap."
        descriptionSv="Få en omfattande revision som täcker webbplats, SEO, innehållsstrategi, onlinelistor, webbplatshastighet och social närvaro. Få en detaljerad PDF-rapport med en strategisk färdplan."
        keywords="audit, website audit, SEO audit, digital marketing audit, business analysis, site speed, content strategy"
        keywordsSv="revision, webbplatsrevision, SEO-revision, digital marknadsföringsrevision, affärsanalys, webbplatshastighet, innehållsstrategi"
        canonicalUrl="https://northforce.io/audit"
        structuredData={structuredData}
        breadcrumbs={[{ name: "Home", url: "https://northforce.io/" }, { name: "Audit", url: "https://northforce.io/audit" }]}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-cyan rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-emerald rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          {/* Hero Title */}
          <div className="text-center">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-accent-cyan/20 text-accent-cyan rounded-full text-sm font-semibold tracking-wide uppercase">
                {t('audit.hero.badge')}
              </span>
            </div>

            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-8 tracking-tight leading-none">
              {t('audit.hero.title')}<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-emerald">{t('audit.hero.title_highlight')}</span>
            </h1>
            <p className="font-body text-xl lg:text-2xl text-white/80 max-w-4xl mx-auto mb-12 leading-relaxed">
              {t('audit.hero.subtitle')}
            </p>

            {/* Primary CTA */}
            <div className="flex flex-col items-center gap-6 mb-12">
              <a
                href="#book-session"
                className="bg-gradient-to-r from-accent-cyan to-accent-emerald text-gray-900 px-12 py-6 rounded-2xl hover:shadow-glow transition-all duration-300 font-black text-xl inline-flex items-center transform hover:scale-105"
              >
                {t('audit.hero.cta_primary')}
                <ArrowRight className="ml-3 h-6 w-6" />
              </a>

              {/* Secondary option */}
              <div className="text-white/60 text-sm">
                <span>{t('audit.hero.cta_secondary')} </span>
                <a href="#ai-audit" className="text-accent-cyan hover:text-accent-emerald transition-colors underline">
                  {t('audit.hero.cta_secondary_link')}
                </a>
              </div>
            </div>

            {/* Enterprise Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="flex items-center justify-center gap-3 text-white">
                <CheckCircle className="h-6 w-6 text-accent-cyan flex-shrink-0" />
                <span className="font-body text-lg font-semibold">{t('audit.hero.benefit_1')}</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-white">
                <CheckCircle className="h-6 w-6 text-accent-emerald flex-shrink-0" />
                <span className="font-body text-lg font-semibold">{t('audit.hero.benefit_2')}</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-white">
                <CheckCircle className="h-6 w-6 text-accent-amber flex-shrink-0" />
                <span className="font-body text-lg font-semibold">{t('audit.hero.benefit_3')}</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-white">
                <CheckCircle className="h-6 w-6 text-accent-rose flex-shrink-0" />
                <span className="font-body text-lg font-semibold">{t('audit.hero.benefit_4')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Ladder: Choose Your Path */}
      <section className="py-24 section-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
              {t('audit.path.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">{t('audit.path.title_highlight')}</span>
            </h2>
            <p className="font-body text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
              {t('audit.path.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Strategic Advisory - Premium */}
            <div className="relative bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 p-12 rounded-3xl shadow-glow border-4 border-accent-cyan overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="absolute top-6 right-6">
                <span className="bg-accent-cyan text-gray-900 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wide">
                  {t('audit.path.recommended')}
                </span>
              </div>

              <Star className="h-16 w-16 text-accent-cyan mb-6" />
              <h3 className="font-heading text-4xl font-black text-white mb-4 tracking-tight">
                {t('audit.path.advisory.title')}
              </h3>
              <p className="font-body text-xl text-white/80 mb-8 leading-relaxed">
                {t('audit.path.advisory.desc')}
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-accent-cyan flex-shrink-0 mt-1" />
                  <span className="font-body text-white">{t('audit.path.advisory.feature_1')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-accent-cyan flex-shrink-0 mt-1" />
                  <span className="font-body text-white">{t('audit.path.advisory.feature_2')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-accent-cyan flex-shrink-0 mt-1" />
                  <span className="font-body text-white">{t('audit.path.advisory.feature_3')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-accent-cyan flex-shrink-0 mt-1" />
                  <span className="font-body text-white">{t('audit.path.advisory.feature_4')}</span>
                </div>
              </div>

              <a
                href="#book-session"
                className="block w-full bg-gradient-to-r from-accent-cyan to-accent-emerald text-gray-900 px-8 py-5 rounded-2xl hover:shadow-glow transition-all duration-300 font-black text-xl text-center transform hover:scale-105"
              >
                {t('audit.path.advisory.cta')}
              </a>

              <p className="text-white/60 text-sm text-center mt-4">
                {t('audit.path.advisory.note')}
              </p>
            </div>

            {/* AI Audit - Lead Qualifier */}
            <div id="ai-audit" className="bg-white p-12 rounded-3xl shadow-card border border-gray-200 hover:shadow-glow transition-all duration-300">
              <Brain className="h-16 w-16 text-primary-600 mb-6" />
              <h3 className="font-heading text-4xl font-black text-gray-900 mb-4 tracking-tight">
                {t('audit.path.ai.title')}
              </h3>
              <p className="font-body text-xl text-gray-700 mb-8 leading-relaxed">
                {t('audit.path.ai.desc')}
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-accent-emerald flex-shrink-0 mt-1" />
                  <span className="font-body text-gray-700">{t('audit.path.ai.feature_1')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-accent-emerald flex-shrink-0 mt-1" />
                  <span className="font-body text-gray-700">{t('audit.path.ai.feature_2')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-accent-emerald flex-shrink-0 mt-1" />
                  <span className="font-body text-gray-700">{t('audit.path.ai.feature_3')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-accent-emerald flex-shrink-0 mt-1" />
                  <span className="font-body text-gray-700">{t('audit.path.ai.feature_4')}</span>
                </div>
              </div>

              <a
                href="#request-audit"
                className="block w-full bg-gray-900 text-white px-8 py-5 rounded-2xl hover:bg-primary-900 transition-all duration-300 font-black text-xl text-center transform hover:scale-105"
              >
                {t('audit.path.ai.cta')}
              </a>

              <p className="text-gray-500 text-sm text-center mt-4">
                {t('audit.path.ai.note')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Book Strategic Advisory Session Form */}
      <section id="book-session" className="py-24 section-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
              {t('audit.form.title')} <span className="text-brand-cyan">{t('audit.form.title_highlight')}</span>
            </h2>
            <p className="font-body text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
              {t('audit.form.subtitle')}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* What We Analyze (AI Audit Details) */}
      <section id="request-audit" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
              {t('audit.analyze.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">{t('audit.analyze.title_highlight')}</span>
            </h2>
            <p className="font-body text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
              {t('audit.analyze.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {auditAreas.map((area, index) => (
              <div key={index} className="card-tech group">
                <div className={`${area.iconColor} mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                  {area.icon}
                </div>
                <h3 className="font-heading text-2xl font-black text-gray-900 mb-4 tracking-tight">{area.title}</h3>
                <p className="font-body text-gray-700 leading-relaxed">{area.description}</p>
              </div>
            ))}
          </div>

          {/* Request AI Audit Form */}
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="font-heading text-3xl font-black text-gray-900 mb-4 tracking-tight">
                {t('audit.analyze.form_title')}
              </h3>
              <p className="font-body text-lg text-gray-600">
                {t('audit.analyze.form_subtitle')}
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Enterprise Credentials Section */}
      <section className="py-24 section-dark text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl lg:text-7xl font-black mb-8 tracking-tight">
              {t('audit.credentials.title')} <span className="text-brand-emerald">{t('audit.credentials.title_highlight')}</span>
            </h2>
            <p className="font-body text-xl lg:text-2xl text-white/80 max-w-4xl mx-auto font-medium leading-relaxed">
              {t('audit.credentials.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="font-heading text-5xl font-black text-accent-cyan mb-4">$2.4M+</div>
              <p className="font-body text-white/90 text-lg font-semibold mb-2">{t('audit.credentials.revenue')}</p>
              <p className="font-body text-white/70 text-sm">{t('audit.credentials.revenue_desc')}</p>
            </div>
            <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="font-heading text-5xl font-black text-accent-emerald mb-4">95%</div>
              <p className="font-body text-white/90 text-lg font-semibold mb-2">{t('audit.credentials.retention')}</p>
              <p className="font-body text-white/70 text-sm">{t('audit.credentials.retention_desc')}</p>
            </div>
            <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="font-heading text-5xl font-black text-accent-amber mb-4">40%</div>
              <p className="font-body text-white/90 text-lg font-semibold mb-2">{t('audit.credentials.growth')}</p>
              <p className="font-body text-white/70 text-sm">{t('audit.credentials.growth_desc')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h3 className="font-heading text-3xl font-black text-white mb-6 tracking-tight">
                {t('audit.credentials.different.title')}
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Rocket className="h-8 w-8 text-accent-cyan flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-heading text-xl font-black text-white mb-2">{t('audit.credentials.different.systems.title')}</h4>
                    <p className="font-body text-white/80 leading-relaxed">
                      {t('audit.credentials.different.systems.desc')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Target className="h-8 w-8 text-accent-emerald flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-heading text-xl font-black text-white mb-2">{t('audit.credentials.different.roi.title')}</h4>
                    <p className="font-body text-white/80 leading-relaxed">
                      {t('audit.credentials.different.roi.desc')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Network className="h-8 w-8 text-accent-amber flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-heading text-xl font-black text-white mb-2">{t('audit.credentials.different.hybrid.title')}</h4>
                    <p className="font-body text-white/80 leading-relaxed">
                      {t('audit.credentials.different.hybrid.desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-accent-cyan/20 to-accent-emerald/20 p-10 rounded-3xl border-2 border-accent-cyan/30">
              <h3 className="font-heading text-3xl font-black text-white mb-6 tracking-tight">
                {t('audit.credentials.for.title')}
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-accent-cyan flex-shrink-0 mt-1" />
                  <span className="font-body text-white/90 leading-relaxed">
                    <strong className="text-white">{t('audit.credentials.for.growth')}</strong> {t('audit.credentials.for.growth_desc')}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-accent-emerald flex-shrink-0 mt-1" />
                  <span className="font-body text-white/90 leading-relaxed">
                    <strong className="text-white">{t('audit.credentials.for.service')}</strong> {t('audit.credentials.for.service_desc')}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-accent-amber flex-shrink-0 mt-1" />
                  <span className="font-body text-white/90 leading-relaxed">
                    <strong className="text-white">{t('audit.credentials.for.b2b')}</strong> {t('audit.credentials.for.b2b_desc')}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-accent-rose flex-shrink-0 mt-1" />
                  <span className="font-body text-white/90 leading-relaxed">
                    <strong className="text-white">{t('audit.credentials.for.leadership')}</strong> {t('audit.credentials.for.leadership_desc')}
                  </span>
                </li>
              </ul>

              <div className="mt-8 pt-8 border-t border-white/20">
                <p className="font-body text-white/70 text-sm italic">
                  "{t('audit.credentials.for.note')}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-6xl font-black mb-6 text-gray-900">
              {t('audit.industries.title')} <span className="text-brand-emerald">{t('audit.industries.title_highlight')}</span>
            </h2>
            <p className="font-body text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto font-light">
              {t('audit.industries.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {industries.map((industry, index) => (
              <Link
                key={index}
                to="/industries"
                className="flex flex-col items-center p-8 bg-gray-50 border border-gray-200 rounded-2xl hover:shadow-glow transition-all duration-300 group transform hover:scale-105"
              >
                <div className={`${industry.color} mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                  {industry.icon}
                </div>
                <span className="font-body text-sm font-semibold text-center text-gray-900">{industry.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        title={t('audit.cta.title') + ' '}
        titleHighlight={t('audit.cta.title_highlight')}
        subtitle={t('audit.cta.subtitle')}
        ctaButtons={[
          { text: t('audit.cta.request'), href: '/contact', variant: 'accent', icon: <ArrowRight className="h-6 w-6" /> },
          { text: t('audit.cta.solutions'), href: '/solutions', variant: 'custom', customClasses: 'bg-white text-gray-900 px-10 py-5 rounded-2xl hover:bg-gray-100 transition-all duration-300 font-black text-xl transform hover:scale-105 shadow-card hover:shadow-glow' },
        ]}
      />
    </div>
  );
};

export default AuditPage;
