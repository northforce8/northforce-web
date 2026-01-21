import React from 'react';
import { ArrowRight, Code, Search, Zap, Globe, BarChart3, Brain, Sparkles } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import CtaSection from '../components/CtaSection';
import SEOHead from '../components/SEOHead';
import { useLanguage } from '../contexts/LanguageContext';

const ServicesPage = () => {
  const { t } = useLanguage();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": {
      "en": "Six Execution Capabilities",
      "sv": "Sex utförandekapaciteter"
    },
    "description": {
      "en": "Custom Development, SEO & Visibility, System Integrations, Funnels & Websites, Process Automation, AI-Powered Solutions",
      "sv": "Anpassad utveckling, SEO & synlighet, systemintegrationer, funnels & webbplatser, processautomation, AI-drivna lösningar"
    },
    "provider": {
      "@type": "Organization",
      "name": "NorthForce",
      "url": "https://northforce.io"
    }
  };

  const services = [
    {
      icon: <Code className="h-10 w-10" />,
      iconColor: "text-accent-cyan",
      title: t('services.development.title'),
      problem: t('services.development.problem'),
      solution: t('services.development.solution'),
      result: t('services.development.result')
    },
    {
      icon: <Search className="h-10 w-10" />,
      iconColor: "text-accent-purple",
      title: t('services.seo.title'),
      problem: t('services.seo.problem'),
      solution: t('services.seo.solution'),
      result: t('services.seo.result')
    },
    {
      icon: <Zap className="h-10 w-10" />,
      iconColor: "text-accent-emerald",
      title: t('services.integrations.title'),
      problem: t('services.integrations.problem'),
      solution: t('services.integrations.solution'),
      result: t('services.integrations.result')
    },
    {
      icon: <Globe className="h-10 w-10" />,
      iconColor: "text-accent-amber",
      title: t('services.funnels.title'),
      problem: t('services.funnels.problem'),
      solution: t('services.funnels.solution'),
      result: t('services.funnels.result')
    },
    {
      icon: <BarChart3 className="h-10 w-10" />,
      iconColor: "text-accent-rose",
      title: t('services.automation.title'),
      problem: t('services.automation.problem'),
      solution: t('services.automation.solution'),
      result: t('services.automation.result')
    },
    {
      icon: <Brain className="h-10 w-10" />,
      iconColor: "text-primary-600",
      title: t('services.ai.title'),
      problem: t('services.ai.problem'),
      solution: t('services.ai.solution'),
      result: t('services.ai.result')
    }
  ];

  return (
    <div className="bg-white overflow-hidden">
      <SEOHead
        title="Six Execution Capabilities"
        titleSv="Sex utförandekapaciteter"
        description="How we deliver systems that drive measurable business outcomes. Custom Development, SEO, Integrations, Funnels, Automation, AI Solutions."
        descriptionSv="Hur vi levererar system som driver mätbara affärsresultat. Anpassad utveckling, SEO, integrationer, funnels, automation, AI-lösningar."
        keywords="custom development, SEO services, system integrations, sales funnels, business process automation, AI solutions, enterprise software development"
        keywordsSv="anpassad utveckling, SEO-tjänster, systemintegrationer, försäljningsfunnels, affärsprocessautomation, AI-lösningar, företagsprogramutveckling"
        canonicalUrl="https://northforce.io/services"
        structuredData={structuredData}
        breadcrumbs={[{ name: "Home", url: "https://northforce.io/" }, { name: "Services", url: "https://northforce.io/services" }]}
      />
      
      <HeroSection
        title={t('services.title')}
        titleHighlight=""
        subtitle={t('services.subtitle')}
        icon={<Sparkles className="h-12 w-12 text-accent-purple" />}
        backgroundVariant="subpage"
      />

        {/* Services Grid */}
        <section className="py-24 section-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
                Execution <span className="text-brand-cyan">Capabilities</span>
              </h2>
              <p className="font-body text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto font-normal leading-relaxed">
                Our proven methodology ensures consistent delivery across all implementations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={index} className="card-tech group">
                  <div className={`${service.iconColor} mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                    {service.icon}
                  </div>
                  <h3 className="font-heading text-2xl font-black text-gray-900 mb-6 tracking-tight">{service.title}</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-accent-rose rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-body text-accent-cyan font-bold text-sm mb-1">Problem:</p>
                        <p className="font-body text-gray-700 leading-relaxed">{service.problem}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-accent-amber rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-body text-accent-cyan font-bold text-sm mb-1">Solution:</p>
                        <p className="font-body text-gray-700 leading-relaxed">{service.solution}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-accent-emerald rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-body text-accent-cyan font-bold text-sm mb-1">Result:</p>
                        <p className="font-body text-gray-900 font-semibold leading-relaxed">{service.result}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <p className="font-body text-xs text-gray-500 italic">Delivered as part of your complete NorthForce system.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      <CtaSection
        title="Ready to Transform Your "
        titleHighlight="Business?"
        subtitle="Let our execution capabilities drive measurable results for your business."
        ctaButtons={[
          { text: 'Book Strategy Call', href: '/contact', variant: 'accent', icon: <ArrowRight className="h-6 w-6" /> },
          { text: 'Get Free Audit', href: '/audit', variant: 'custom', customClasses: 'bg-white text-gray-900 px-10 py-5 rounded-2xl hover:bg-gray-100 transition-all duration-300 font-black text-xl transform hover:scale-105 shadow-card hover:shadow-glow' },
        ]}
      />
    </div>
  );
};

export default ServicesPage;