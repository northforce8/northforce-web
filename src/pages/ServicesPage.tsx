import React from 'react';
import { ArrowRight, Code, Search, Zap, Globe, BarChart3, Brain, Sparkles } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import CtaSection from '../components/CtaSection';
import SEOHead from '../components/SEOHead';

const ServicesPage = () => {
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
      title: "Custom Development",
      problem: "Standard tools can't cover unique processes.",
      solution: "Tailored platforms and applications designed around your exact workflows.",
      result: "Scalable digital assets that give you long-term competitive edge."
    },
    {
      icon: <Search className="h-10 w-10" />,
      iconColor: "text-accent-purple",
      title: "SEO & Visibility Systems",
      problem: "Low visibility makes strong companies invisible online.",
      solution: "Structured SEO, E-E-A-T optimization, and listings that boost trust signals.",
      result: "Higher rankings, more inbound leads, and credibility that compounds over time."
    },
    {
      icon: <Zap className="h-10 w-10" />,
      iconColor: "text-accent-emerald",
      title: "System Integrations",
      problem: "Disconnected tools create silos and wasted effort.",
      solution: "Secure, enterprise-grade integrations that unify data and processes.",
      result: "One source of truth, faster operations, and stronger customer experience."
    },
    {
      icon: <Globe className="h-10 w-10" />,
      iconColor: "text-accent-amber",
      title: "Funnels & Strategic Websites",
      problem: "Websites without structure don't generate sales.",
      solution: "High-converting funnels and websites built as growth engines.",
      result: "Consistent lead flow, measurable ROI, and predictable revenue."
    },
    {
      icon: <BarChart3 className="h-10 w-10" />,
      iconColor: "text-accent-rose",
      title: "Business Process Automation",
      problem: "Manual tasks drain resources and slow teams.",
      solution: "Automating repetitive processes across sales, marketing, and support.",
      result: "Cost savings, improved efficiency, and more time for growth activities."
    },
    {
      icon: <Brain className="h-10 w-10" />,
      iconColor: "text-primary-600",
      title: "AI-Powered Agent Solutions",
      problem: "Customers demand instant responses but humans can't be online 24/7.",
      solution: "AI-driven chat and voice agents that qualify leads, support clients, and book meetings.",
      result: "24/7 coverage, higher customer satisfaction, and better lead conversion."
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
        title="Six Execution "
        titleHighlight="Capabilities"
        subtitle="How we deliver systems that drive measurable business outcomes."
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