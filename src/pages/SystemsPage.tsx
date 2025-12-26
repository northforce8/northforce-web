import React from 'react';
import { ArrowRight, Target, Cog, Users, Fuel as Funnel, Bot, Inbox, Share2, CheckCircle, Zap, TrendingUp, Shield } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import CtaSection from '../components/CtaSection';
import SEOHead from '../components/SEOHead';

const SystemsPage = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": {
      "en": "Six Core Systems",
      "sv": "Sex kärnsystem"
    },
    "description": {
      "en": "Automation, CRM & Contact, Funnel & Web, AI Assistant, Unified Inbox & Reviews, Social Flow - complete business systems",
      "sv": "Automation, CRM & kontakt, funnel & webb, AI-assistent, enhetlig inkorg & recensioner, socialt flöde - kompletta affärssystem"
    },
    "provider": {
      "@type": "Organization",
      "name": "NorthForce",
      "url": "https://northforce.io"
    }
  };

  const systems = [
    {
      icon: <Cog className="h-10 w-10" />,
      iconColor: "text-accent-cyan",
      title: "Automation System",
      problem: "Manual tasks drain time and create bottlenecks",
      solution: "End-to-end automation that maps and streamlines key workflows",
      result: "Faster flow, fewer errors, and scalable operations without adding staff",
      features: ["Workflow mapping", "Process automation", "Error reduction", "Scalable operations"]
    },
    {
      icon: <Users className="h-10 w-10" />,
      iconColor: "text-accent-purple",
      title: "CRM & Contact System",
      problem: "Scattered data causes missed deals and poor follow-up",
      solution: "Unified pipeline with centralized contact and deal management",
      result: "Predictable sales, stronger relationships, and higher win rates",
      features: ["Contact management", "Deal tracking", "Pipeline visibility", "Relationship building"]
    },
    {
      icon: <Funnel className="h-10 w-10" />,
      iconColor: "text-accent-emerald",
      title: "Funnel & Web System",
      problem: "Random websites fail to convert visitors into customers",
      solution: "Conversion-optimized funnels and strategic websites built for growth",
      result: "Qualified leads, steady sales, and measurable revenue lift",
      features: ["Conversion optimization", "Lead generation", "Revenue tracking", "Growth metrics"]
    },
    {
      icon: <Bot className="h-10 w-10" />,
      iconColor: "text-accent-amber",
      title: "AI Assistant System",
      problem: "Customers wait too long for answers and drop off",
      solution: "AI agents that respond, qualify, and book meetings instantly",
      result: "24/7 lead capture, faster trust, and higher customer satisfaction",
      features: ["24/7 availability", "Lead qualification", "Meeting booking", "Customer support"]
    },
    {
      icon: <Inbox className="h-10 w-10" />,
      iconColor: "text-accent-rose",
      title: "Unified Inbox & Reviews System",
      problem: "Messages scattered across channels, reviews ignored",
      solution: "Centralized inbox with integrated review management system",
      result: "No missed leads, higher Google trust, and stronger online reputation",
      features: ["Centralized messaging", "Review management", "Reputation monitoring", "Response automation"]
    },
    {
      icon: <Share2 className="h-10 w-10" />,
      iconColor: "text-primary-600",
      title: "Social Flow System",
      problem: "Irregular posting and weak presence kills reach",
      solution: "Automated social content flow with built-in scheduling",
      result: "Consistent visibility, stronger brand presence, and steady engagement",
      features: ["Content scheduling", "Brand consistency", "Engagement tracking", "Multi-platform management"]
    }
  ];

  const benefits = [
    {
      icon: <Zap className="h-8 w-8 text-accent-cyan" />,
      title: "Immediate Impact",
      description: "See results within the first week of implementation"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-accent-emerald" />,
      title: "Scalable Growth",
      description: "Systems that grow with your business automatically"
    },
    {
      icon: <Shield className="h-8 w-8 text-accent-purple" />,
      title: "Reliable Operations",
      description: "Consistent performance you can depend on"
    }
  ];

  return (
    <div className="bg-white overflow-hidden">
      <SEOHead
        title="Six Core Systems"
        titleSv="Sex kärnsystem"
        description="Automation, CRM & Contact, Funnel & Web, AI Assistant, Unified Inbox & Reviews, Social Flow - complete business systems that drive results."
        descriptionSv="Automation, CRM & kontakt, funnel & webb, AI-assistent, enhetlig inkorg & recensioner, socialt flöde - kompletta affärssystem som driver resultat."
        keywords="business systems, automation system, CRM system, AI assistant, social media automation, unified inbox"
        keywordsSv="affärssystem, automationssystem, CRM-system, AI-assistent, sociala medier automation, enhetlig inkorg"
        canonicalUrl="https://northforce.io/systems"
        structuredData={structuredData}
        breadcrumbs={[{ name: "Home", url: "https://northforce.io/" }, { name: "Systems", url: "https://northforce.io/systems" }]}
      />
      
      <HeroSection
        title="Six Core "
        titleHighlight="Systems"
        subtitle="Each system solves a specific business problem with measurable outcomes."
        icon={<Target className="h-12 w-12 text-accent-cyan" />}
        backgroundVariant="subpage"
      />

      {/* Core Systems */}
      <section className="py-24 section-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
              Systems That Drive <span className="text-brand-violet">Results</span>
            </h2>
            <p className="font-body text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto font-normal leading-relaxed">
              Each system is designed to solve specific business challenges and deliver measurable outcomes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {systems.map((system, index) => (
              <div key={index} className="card-tech group">
                <div className={`${system.iconColor} mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                  {system.icon}
                </div>
                <h3 className="font-heading text-2xl font-black text-gray-900 mb-6 tracking-tight">{system.title}</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-accent-rose rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-body text-gray-900 font-bold text-sm mb-1">Problem:</p>
                      <p className="font-body text-gray-700 leading-relaxed">{system.problem}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-accent-amber rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-body text-gray-900 font-bold text-sm mb-1">Solution:</p>
                      <p className="font-body text-gray-700 leading-relaxed">{system.solution}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-accent-emerald rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-body text-gray-900 font-bold text-sm mb-1">Result:</p>
                      <p className="font-body text-gray-900 font-semibold leading-relaxed">{system.result}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-body text-sm font-bold text-gray-900 mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {system.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-accent-emerald flex-shrink-0" />
                        <span className="text-xs text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 section-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
              Why Choose Our <span className="text-brand-emerald">Systems</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center premium-card group">
                <div className="mb-6 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <h3 className="font-heading text-2xl font-black text-gray-900 mb-4 tracking-tight">{benefit.title}</h3>
                <p className="font-body text-gray-700 text-lg leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        title="Ready to Transform Your "
        titleHighlight="Business?"
        subtitle="Choose the systems that fit your needs and start building predictable growth."
        ctaButtons={[
          { text: 'Book Strategy Call', href: '/contact', variant: 'accent', icon: <ArrowRight className="h-6 w-6" /> },
          { text: 'View Solutions', href: '/solutions', variant: 'custom', customClasses: 'bg-white text-gray-900 px-10 py-5 rounded-2xl hover:bg-gray-100 transition-all duration-300 font-black text-xl transform hover:scale-105 shadow-card hover:shadow-glow' },
        ]}
      />
    </div>
  );
};

export default SystemsPage;