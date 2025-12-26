import React from 'react';
import { ArrowRight, Target, Sparkles, Shield, CheckCircle } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import CtaSection from '../components/CtaSection';
import SEOHead from '../components/SEOHead';

const MethodPage = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": {
      "en": "Our Proven Method",
      "sv": "Vår beprövade metod"
    },
    "description": {
      "en": "System Delivery Cycle, Leverage-by-Design, Premium Partner Program. Three integrated models for maximum impact",
      "sv": "Systemleveranscykel, Leverage-by-Design, Premium partnerprogram. Tre integrerade modeller för maximal påverkan"
    },
    "provider": {
      "@type": "Organization",
      "name": "NorthForce",
      "url": "https://northforce.io"
    }
  };

  const methods = [
    {
      icon: <Target className="h-12 w-12" />,
      iconColor: "text-accent-cyan",
      title: "System Delivery Cycle",
      subtitle: "6A Framework",
      description: "Assess, Align, Architect, Assemble, Activate, Amplify",
      details: "Structured approach to implementing and optimizing business systems with measurable milestones at each phase.",
      outcome: "Predictable delivery, measurable results, systematic excellence"
    },
    {
      icon: <Sparkles className="h-12 w-12" />,
      iconColor: "text-accent-purple",
      title: "Leverage-by-Design",
      subtitle: "Exponential Growth Model",
      description: "Building systems that multiply your efforts and compound over time",
      details: "Every component is designed to create leverage, turning linear inputs into exponential outputs through intelligent automation.",
      outcome: "Scalable growth, sustainable competitive advantage, maximum ROI"
    },
    {
      icon: <Shield className="h-12 w-12" />,
      iconColor: "text-accent-emerald",
      title: "System Partner Model",
      subtitle: "Long-term Success Framework",
      description: "Continuous optimization and strategic evolution partnership",
      details: "Beyond implementation - ongoing partnership that ensures your systems evolve with your business and market changes.",
      outcome: "Continuous improvement, strategic evolution, sustained growth"
    }
  ];

  const deliveryPhases = [
    {
      phase: "Assess",
      description: "Deep analysis of current systems, workflows, and pain points",
      duration: "Week 1-2",
      deliverable: "Comprehensive audit report"
    },
    {
      phase: "Align",
      description: "Strategic planning and goal setting with stakeholder alignment",
      duration: "Week 2-3",
      deliverable: "Implementation roadmap"
    },
    {
      phase: "Architect",
      description: "System design and technical architecture planning",
      duration: "Week 3-4",
      deliverable: "Technical specifications"
    },
    {
      phase: "Assemble",
      description: "Development, configuration, and integration of systems",
      duration: "Week 4-8",
      deliverable: "Functional systems"
    },
    {
      phase: "Activate",
      description: "Testing, training, and go-live preparation",
      duration: "Week 8-10",
      deliverable: "Live system deployment"
    },
    {
      phase: "Amplify",
      description: "Optimization, scaling, and continuous improvement",
      duration: "Ongoing",
      deliverable: "Performance optimization"
    }
  ];

  return (
    <div className="bg-white overflow-hidden">
      <SEOHead
        title="Our Proven Method"
        titleSv="Vår beprövade metod"
        description="Three integrated models that ensure maximum impact: System Delivery Cycle, Leverage-by-Design, Premium Partner Program."
        descriptionSv="Tre integrerade modeller som säkerställer maximal påverkan: Systemleveranscykel, Leverage-by-Design, Premium partnerprogram."
        keywords="business methodology, system delivery cycle, leverage by design, partner program, business transformation framework"
        keywordsSv="affärsmetodik, systemleveranscykel, leverage by design, partnerprogram, affärstransformationramverk"
        canonicalUrl="https://northforce.io/method"
        structuredData={structuredData}
        breadcrumbs={[{ name: "Home", url: "https://northforce.io/" }, { name: "Method", url: "https://northforce.io/method" }]}
      />
      
      <HeroSection
        title="Our Proven "
        titleHighlight="Method"
        subtitle="Three integrated models that ensure maximum impact and long-term success."
        icon={<Target className="h-12 w-12 text-accent-cyan" />}
        backgroundVariant="subpage"
      />

        {/* Three Methods */}
        <section className="py-24 section-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
                Three Models, One <span className="text-brand-violet">Vision</span>
              </h2>
              <p className="font-body text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto font-normal leading-relaxed">
                Systematic excellence through proven methodologies.
              </p>
            </div>
            
            <div className="space-y-16">
              {methods.map((method, index) => (
                <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="premium-card">
                      <div className={`${method.iconColor} mb-6 transform hover:scale-110 transition-transform duration-300`}>
                        {method.icon}
                      </div>
                      <div className="mb-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${method.iconColor} bg-current/10`}>
                          {method.subtitle}
                        </span>
                      </div>
                      <h3 className="font-heading text-3xl font-black text-gray-900 mb-6 tracking-tight">{method.title}</h3>
                      <p className="font-body text-xl text-gray-700 mb-6 font-medium leading-relaxed">{method.description}</p>
                      <p className="font-body text-gray-600 mb-6 leading-relaxed">{method.details}</p>
                      <p className="text-gradient font-bold text-lg">{method.outcome}</p>
                    </div>
                  </div>
                  
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200/60">
                      <h4 className="font-heading text-2xl font-black text-gray-900 mb-6">Key Benefits</h4>
                      <ul className="space-y-4">
                        {index === 0 && (
                          <>
                            <li className="flex items-start space-x-3">
                              <CheckCircle className="h-5 w-5 text-accent-cyan mt-1 flex-shrink-0" />
                              <span className="font-body text-gray-700">Structured execution with clear milestones</span>
                            </li>
                            <li className="flex items-start space-x-3">
                              <CheckCircle className="h-5 w-5 text-accent-cyan mt-1 flex-shrink-0" />
                              <span className="font-body text-gray-700">Risk mitigation through phased approach</span>
                            </li>
                            <li className="flex items-start space-x-3">
                              <CheckCircle className="h-5 w-5 text-accent-cyan mt-1 flex-shrink-0" />
                              <span className="font-body text-gray-700">Measurable progress at every stage</span>
                            </li>
                          </>
                        )}
                        {index === 1 && (
                          <>
                            <li className="flex items-start space-x-3">
                              <CheckCircle className="h-5 w-5 text-accent-purple mt-1 flex-shrink-0" />
                              <span className="font-body text-gray-700">Exponential growth through intelligent design</span>
                            </li>
                            <li className="flex items-start space-x-3">
                              <CheckCircle className="h-5 w-5 text-accent-purple mt-1 flex-shrink-0" />
                              <span className="font-body text-gray-700">Future-proof architecture that scales</span>
                            </li>
                            <li className="flex items-start space-x-3">
                              <CheckCircle className="h-5 w-5 text-accent-purple mt-1 flex-shrink-0" />
                              <span className="font-body text-gray-700">Maximum ROI through strategic leverage</span>
                            </li>
                          </>
                        )}
                        {index === 2 && (
                          <>
                            <li className="flex items-start space-x-3">
                              <CheckCircle className="h-5 w-5 text-accent-emerald mt-1 flex-shrink-0" />
                              <span className="font-body text-gray-700">Continuous optimization and improvement</span>
                            </li>
                            <li className="flex items-start space-x-3">
                              <CheckCircle className="h-5 w-5 text-accent-emerald mt-1 flex-shrink-0" />
                              <span className="font-body text-gray-700">Strategic guidance and market adaptation</span>
                            </li>
                            <li className="flex items-start space-x-3">
                              <CheckCircle className="h-5 w-5 text-accent-emerald mt-1 flex-shrink-0" />
                              <span className="font-body text-gray-700">Long-term partnership for sustained success</span>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6A Framework Detail */}
        <section className="py-24 section-accent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
                The 6A <span className="text-brand-cyan">Framework</span>
              </h2>
              <p className="font-body text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto font-normal leading-relaxed">
                Our systematic approach to delivering transformative business systems.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {deliveryPhases.map((phase, index) => (
                <div key={index} className="card-tech group">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-primary-600 to-accent-cyan text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-black shadow-glow mr-4">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-heading text-2xl font-black text-gray-900 tracking-tight">{phase.phase}</h3>
                      <p className="text-sm text-gray-500">{phase.duration}</p>
                    </div>
                  </div>
                  
                  <p className="font-body text-gray-700 mb-4 leading-relaxed">{phase.description}</p>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-body text-sm font-semibold text-gray-900 mb-1">Key Deliverable:</p>
                    <p className="font-body text-sm text-gray-700">{phase.deliverable}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      <CtaSection
        title="Ready to Experience Our "
        titleHighlight="Method?"
        subtitle="Let our proven methodology drive transformative results for your business."
        ctaButtons={[
          { text: 'Book Strategy Call', href: '/contact', variant: 'accent', icon: <ArrowRight className="h-6 w-6" /> },
          { text: 'Get Free Audit', href: '/audit', variant: 'custom', customClasses: 'bg-white text-gray-900 px-10 py-5 rounded-2xl hover:bg-gray-100 transition-all duration-300 font-black text-xl transform hover:scale-105 shadow-card hover:shadow-glow' },
        ]}
      />
    </div>
  );
};

export default MethodPage;