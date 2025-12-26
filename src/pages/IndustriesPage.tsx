import React from 'react';
import { ArrowRight, Briefcase, Cpu, DollarSign, Scale, Building, Cog, Users, Heart, BookOpen, Truck, Hammer, Coffee } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import CtaSection from '../components/CtaSection';
import SEOHead from '../components/SEOHead';

const IndustriesPage = () => {
  const { language } = useLanguage();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": {
      "en": "Industry-Specific Solutions",
      "sv": "Branschspecifika lösningar"
    },
    "description": {
      "en": "NorthForce supports twelve selected B2B industries where our hybrid model creates the greatest impact",
      "sv": "NorthForce arbetar med tolv utvalda B2B-branscher där vår hybridmodell skapar störst effekt"
    },
    "provider": {
      "@type": "Organization",
      "name": "NorthForce",
      "url": "https://northforce.io"
    }
  };

  const industries = [
    {
      icon: <Briefcase className="h-8 w-8" />,
      name: language === 'sv' ? "Professional Services & B2B Agencies" : "Professional Services & B2B Agencies",
      focus: language === 'sv'
        ? "Systematiserad tillväxt och leveranskapacitet för kunskapsintensiva tjänsteföretag"
        : "Systematized growth and delivery capacity for knowledge-intensive service firms",
      gradient: "from-primary-600 to-primary-700",
    },
    {
      icon: <Cpu className="h-8 w-8" />,
      name: language === 'sv' ? "Tech & SaaS" : "Tech & SaaS",
      focus: language === 'sv'
        ? "Skalbar kundanskaffning och retention för tech-bolag i tillväxtfas"
        : "Scalable customer acquisition and retention for growth-stage tech companies",
      gradient: "from-accent-cyan to-blue-600",
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      name: language === 'sv' ? "Finance & FinTech" : "Finance & FinTech",
      focus: language === 'sv'
        ? "Compliance-säker expansion med optimerad kundresa och konvertering"
        : "Compliance-safe expansion with optimized customer journey and conversion",
      gradient: "from-accent-emerald to-green-600",
    },
    {
      icon: <Scale className="h-8 w-8" />,
      name: language === 'sv' ? "Juridik & Advokatbyråer" : "Legal & Law Firms",
      focus: language === 'sv'
        ? "Partner-governance och klientanskaffning för hög-kvalitet juridiska tjänster"
        : "Partner governance and client acquisition for high-quality legal services",
      gradient: "from-gray-700 to-gray-800",
    },
    {
      icon: <Building className="h-8 w-8" />,
      name: language === 'sv' ? "Fastighet & Projektutveckling" : "Real Estate & Development",
      focus: language === 'sv'
        ? "Projektportföljstyrning och investerarrelationer för fastighetsutvecklare"
        : "Project portfolio governance and investor relations for property developers",
      gradient: "from-accent-amber to-orange-600",
    },
    {
      icon: <Cog className="h-8 w-8" />,
      name: language === 'sv' ? "Industri & Tillverkning" : "Manufacturing & Industry",
      focus: language === 'sv'
        ? "Operativ effektivitet och marknadsexpansion för industriföretag"
        : "Operational efficiency and market expansion for industrial companies",
      gradient: "from-slate-600 to-slate-700",
    },
    {
      icon: <Users className="h-8 w-8" />,
      name: language === 'sv' ? "Rekrytering & HR-företag" : "Recruitment & HR Firms",
      focus: language === 'sv'
        ? "Pipeline-hantering och klientretention för rekryteringsföretag"
        : "Pipeline management and client retention for recruitment companies",
      gradient: "from-purple-600 to-purple-700",
    },
    {
      icon: <Heart className="h-8 w-8" />,
      name: language === 'sv' ? "Hälsa, Vård & Wellness" : "Healthcare & Wellness",
      focus: language === 'sv'
        ? "Patientresa-optimering och evidensbaserad expansion för hälsoföretag"
        : "Patient journey optimization and evidence-based expansion for health companies",
      gradient: "from-accent-rose to-pink-600",
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      name: language === 'sv' ? "Utbildning & Träning" : "Education & Training",
      focus: language === 'sv'
        ? "Student acquisition och completion-optimering för utbildningsföretag"
        : "Student acquisition and completion optimization for education companies",
      gradient: "from-indigo-600 to-indigo-700",
    },
    {
      icon: <Truck className="h-8 w-8" />,
      name: language === 'sv' ? "Logistik & Transport" : "Logistics & Transport",
      focus: language === 'sv'
        ? "Operativ excellens och kundrelationer för logistikföretag"
        : "Operational excellence and customer relations for logistics companies",
      gradient: "from-teal-600 to-teal-700",
    },
    {
      icon: <Hammer className="h-8 w-8" />,
      name: language === 'sv' ? "Bygg & Teknisk Service" : "Construction & Technical Services",
      focus: language === 'sv'
        ? "Projektledning och kapacitetsstyrning för byggföretag"
        : "Project management and capacity governance for construction firms",
      gradient: "from-yellow-600 to-yellow-700",
    },
    {
      icon: <Coffee className="h-8 w-8" />,
      name: language === 'sv' ? "Hospitality & Upplevelser" : "Hospitality & Experiences",
      focus: language === 'sv'
        ? "Gästresa och intäktsoptimering för hospitality-verksamheter"
        : "Guest journey and revenue optimization for hospitality operations",
      gradient: "from-rose-600 to-rose-700",
    },
  ];

  return (
    <div className="bg-white overflow-hidden">
      <SEOHead
        title="Industries We Support"
        titleSv="Branscher Vi Stödjer"
        description="NorthForce supports twelve selected B2B industries where our hybrid model creates measurable impact through structure, capacity and systems."
        descriptionSv="NorthForce arbetar med tolv utvalda B2B-branscher där vår hybridmodell skapar mätbar effekt genom struktur, kapacitet och system."
        keywords="B2B industries, professional services, tech SaaS, finance, legal, real estate, manufacturing, recruitment, healthcare, education, logistics, construction, hospitality"
        keywordsSv="B2B branscher, professional services, tech SaaS, finans, juridik, fastighet, industri, rekrytering, hälsa, utbildning, logistik, bygg, hospitality"
        canonicalUrl="https://northforce.io/industries"
        structuredData={structuredData}
        breadcrumbs={[{ name: "Home", url: "https://northforce.io/" }, { name: "Industries", url: "https://northforce.io/industries" }]}
      />

      {/* Hero - Premium Enterprise */}
      <section className="relative min-h-[70vh] flex items-center section-dark overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900"></div>
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute top-1/4 right-1/3 w-[600px] h-[600px] bg-accent-cyan rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-accent-emerald rounded-full blur-[120px]"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <div className="mb-10">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full text-sm font-semibold tracking-wide uppercase">
              {language === 'sv' ? 'Tolv Utvalda B2B-Branscher' : 'Twelve Selected B2B Industries'}
            </span>
          </div>

          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-8 tracking-tight leading-[1.1]">
            {language === 'sv' ? 'Branscher Vi ' : 'Industries We '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-accent-emerald to-accent-cyan">
              {language === 'sv' ? 'Stödjer' : 'Support'}
            </span>
          </h1>
          <p className="font-body text-xl lg:text-2xl text-white/80 leading-relaxed max-w-3xl mx-auto">
            {language === 'sv'
              ? 'Vår hybridmodell skapar störst effekt där struktur, kapacitet och system möter mätbara resultat.'
              : 'Our hybrid model creates the greatest impact where structure, capacity and systems meet measurable results.'}
          </p>
        </div>
      </section>

      {/* Industries Grid - Premium Layout */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="group relative bg-white border border-gray-200 rounded-2xl p-8 hover:border-primary-600/30 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* Icon with gradient background */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${industry.gradient} text-white mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                  {industry.icon}
                </div>

                {/* Title */}
                <h3 className="font-heading text-xl font-black text-gray-900 mb-4 leading-tight tracking-tight">
                  {industry.name}
                </h3>

                {/* Focus description */}
                <p className="font-body text-gray-600 text-sm leading-relaxed mb-6">
                  {industry.focus}
                </p>

                {/* Subtle CTA */}
                <div className="flex items-center text-primary-600 font-semibold text-sm group-hover:text-accent-cyan transition-colors">
                  <span>{language === 'sv' ? 'Utforska' : 'Explore'}</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Hover effect border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary-600/20 transition-all duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work - Enterprise Context */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight">
              {language === 'sv' ? 'Branschoberoende ' : 'Industry-Agnostic '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
                {language === 'sv' ? 'Metodik' : 'Methodology'}
              </span>
            </h2>
            <p className="font-body text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {language === 'sv'
                ? 'Vår hybridmodell kombinerar expertis, system och flexibel kapacitet anpassat efter varje branschs specifika dynamik. Samma strukturerade tillvägagångssätt, olika branschinsikt.'
                : 'Our hybrid model combines expertise, systems and flexible capacity adapted to each industry\'s specific dynamics. Same structured approach, different industry insight.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="relative">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white flex items-center justify-center font-black text-2xl shadow-lg">
                  1
                </div>
                <div>
                  <h3 className="font-heading text-xl font-black text-gray-900 mb-3 tracking-tight">
                    {language === 'sv' ? 'Branschanalys' : 'Industry Analysis'}
                  </h3>
                  <p className="font-body text-base text-gray-600 leading-relaxed">
                    {language === 'sv'
                      ? 'Djupdykning i er branschs specifika utmaningar och möjligheter'
                      : 'Deep dive into your industry\'s specific challenges and opportunities'}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-accent-cyan to-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-lg">
                  2
                </div>
                <div>
                  <h3 className="font-heading text-xl font-black text-gray-900 mb-3 tracking-tight">
                    {language === 'sv' ? 'Systemdesign' : 'System Design'}
                  </h3>
                  <p className="font-body text-base text-gray-600 leading-relaxed">
                    {language === 'sv'
                      ? 'Anpassade system och processer för er branschs krav'
                      : 'Customized systems and processes for your industry requirements'}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-accent-emerald to-green-600 text-white flex items-center justify-center font-black text-2xl shadow-lg">
                  3
                </div>
                <div>
                  <h3 className="font-heading text-xl font-black text-gray-900 mb-3 tracking-tight">
                    {language === 'sv' ? 'Kontinuerlig Optimering' : 'Continuous Optimization'}
                  </h3>
                  <p className="font-body text-base text-gray-600 leading-relaxed">
                    {language === 'sv'
                      ? 'Löpande förbättring baserad på branschspecifika KPIer'
                      : 'Ongoing improvement based on industry-specific KPIs'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaSection
        title={language === 'sv' ? 'Er Bransch' : 'Your Industry'}
        titleHighlight={language === 'sv' ? 'Vår Expertis' : 'Our Expertise'}
        subtitle={language === 'sv'
          ? 'Låt oss visa hur vår hybridmodell anpassas till er branschs specifika utmaningar'
          : 'Let us show how our hybrid model adapts to your industry\'s specific challenges'}
        ctaButtons={[
          {
            text: language === 'sv' ? 'Boka Strategidialog' : 'Book Strategy Discussion',
            href: '/contact',
            variant: 'accent',
            icon: <ArrowRight className="h-6 w-6" />
          },
        ]}
      />
    </div>
  );
};

export default IndustriesPage;
