import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Cog, Users, Fuel as Funnel, Bot, Inbox, Share2, Code, Search, Zap, Globe, BarChart3, Brain, Building2, Scale, GraduationCap, Heart, Store, Plane, UserCheck, Palette, Briefcase, Rocket, Sparkles, Shield, CheckCircle, Star } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import HeroSection from '../components/HeroSection';
import CtaSection from '../components/CtaSection';
import ContactForm from '../components/ContactForm';

const HomePage = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": {
      "en": "NorthForce - AI Automation & CRM Systems for Predictable Growth",
      "sv": "NorthForce - AI-automation & CRM-system för förutsägbar tillväxt"
    },
    "description": {
      "en": "Complete AI & automation systems that save time, build trust, and drive measurable growth. CRM, funnels, chatbots, integrations, analytics.",
      "sv": "Kompletta AI- och automationssystem som sparar tid, bygger förtroende och driver mätbar tillväxt. CRM, funnels, chatbots, integrationer, analys."
    },
    "url": "https://northforce.io/",
    "mainEntity": {
      "@type": "Organization",
      "name": "NorthForce"
    }
  };

  const systems = [
    {
      icon: <Cog className="h-10 w-10" />,
      iconColor: "text-accent-cyan",
      title: "Automation",
      problem: "Manual tasks drain time and create bottlenecks",
      solution: "End-to-end automation that maps and streamlines key workflows",
      result: "Faster flow, fewer errors, and scalable operations without adding staff"
    },
    {
      icon: <Users className="h-10 w-10" />,
      iconColor: "text-accent-purple",
      title: "CRM & Contact",
      problem: "Scattered data causes missed deals and poor follow-up",
      solution: "Unified pipeline with centralized contact and deal management",
      result: "Predictable sales, stronger relationships, and higher win rates"
    },
    {
      icon: <Funnel className="h-10 w-10" />,
      iconColor: "text-accent-emerald",
      title: "Funnel & Web",
      problem: "Random websites fail to convert visitors into customers",
      solution: "Conversion-optimized funnels and strategic websites built for growth",
      result: "Qualified leads, steady sales, and measurable revenue lift"
    },
    {
      icon: <Bot className="h-10 w-10" />,
      iconColor: "text-accent-amber",
      title: "AI Assistant",
      problem: "Customers wait too long for answers and drop off",
      solution: "AI agents that respond, qualify, and book meetings instantly",
      result: "24/7 lead capture, faster trust, and higher customer satisfaction"
    },
    {
      icon: <Inbox className="h-10 w-10" />,
      iconColor: "text-accent-rose",
      title: "Unified Inbox & Reviews",
      problem: "Messages scattered across channels, reviews ignored",
      solution: "Centralized inbox with integrated review management system",
      result: "No missed leads, higher Google trust, and stronger online reputation"
    },
    {
      icon: <Share2 className="h-10 w-10" />,
      iconColor: "text-primary-600",
      title: "Social Flow",
      problem: "Irregular posting and weak presence kills reach",
      solution: "Automated social content flow with built-in scheduling",
      result: "Consistent visibility, stronger brand presence, and steady engagement"
    }
  ];

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

  const industries = [
    { icon: <Building2 className="h-7 w-7" />, name: "Real Estate", color: "text-accent-cyan" },
    { icon: <Scale className="h-7 w-7" />, name: "Legal", color: "text-accent-purple" },
    { icon: <Target className="h-7 w-7" />, name: "Finance", color: "text-accent-emerald" },
    { icon: <GraduationCap className="h-7 w-7" />, name: "Education", color: "text-accent-amber" },
    { icon: <Heart className="h-7 w-7" />, name: "Healthcare", color: "text-accent-rose" },
    { icon: <Store className="h-7 w-7" />, name: "Local Services", color: "text-primary-600" },
    { icon: <Globe className="h-7 w-7" />, name: "E-commerce", color: "text-accent-cyan" },
    { icon: <Plane className="h-7 w-7" />, name: "Travel & Events", color: "text-accent-purple" },
    { icon: <UserCheck className="h-7 w-7" />, name: "Recruitment", color: "text-accent-emerald" },
    { icon: <Palette className="h-7 w-7" />, name: "Creative", color: "text-accent-amber" },
    { icon: <Briefcase className="h-7 w-7" />, name: "B2B Agencies", color: "text-accent-rose" },
    { icon: <Rocket className="h-7 w-7" />, name: "Tech Startups", color: "text-primary-600" }
  ];

  const methods = [
    {
      icon: <Target className="h-8 w-8 text-accent-cyan" />,
      title: "System Delivery Cycle",
      description: "6A: Assess, Align, Architect, Assemble, Activate, Amplify",
      outcome: "Structured execution for maximum impact"
    },
    {
      icon: <Sparkles className="h-8 w-8 text-accent-purple" />,
      title: "Leverage-by-Design",
      description: "Systems structured for exponential growth",
      outcome: "Every component multiplies results"
    },
    {
      icon: <Shield className="h-8 w-8 text-accent-emerald" />,
      title: "System Partner Model",
      description: "Long-term collaboration, scaling with clients",
      outcome: "Continuous optimization and growth"
    }
  ];

  const proofPoints = [
    { metric: "+40%", description: "More leads in 6 weeks", color: "text-accent-cyan" },
    { metric: "2x", description: "Faster onboarding", color: "text-accent-purple" },
    { metric: "+60%", description: "Trust signals", color: "text-accent-emerald" },
    { metric: "95%", description: "Client retention rate", color: "text-accent-amber" },
    { metric: "$2.4M", description: "Revenue generated for clients", color: "text-accent-rose" },
    { metric: "24/7", description: "AI assistant uptime", color: "text-primary-600" }
  ];

  return (
    <div className="bg-white overflow-hidden">
      <SEOHead
        title="NorthForce — AI Automation & CRM Systems for Predictable Growth"
        titleSv="NorthForce — AI-automation & CRM-system för förutsägbar tillväxt"
        description="Complete AI & automation systems that save time, build trust, and drive measurable growth. CRM, funnels, chatbots, integrations, analytics."
        descriptionSv="Kompletta AI- och automationssystem som sparar tid, bygger förtroende och driver mätbar tillväxt. CRM, funnels, chatbots, integrationer, analys."
        keywords="AI automation, CRM systems, business automation, lead generation, sales funnels, chatbots, system integrations, predictable growth"
        keywordsSv="AI-automation, CRM-system, affärsautomation, leadgenerering, försäljningsfunnels, chatbots, systemintegrationer, förutsägbar tillväxt"
        canonicalUrl="https://northforce.io/"
        structuredData={structuredData}
      />
      
      <HeroSection
        title="AI automation & "
        titleHighlight="CRM systems"
        subtitle="Stop losing leads, time, and trust — run everything in one system."
        backgroundVariant="homepage"
        extraContent={
          <>
            <Sparkles className="h-16 w-16 text-accent-cyan" />
            <Brain className="h-20 w-20 text-accent-purple" />
            <Zap className="h-16 w-16 text-accent-emerald" />
          </>
        }
        ctaButtons={[
          { text: 'Book Strategy Call', href: '/contact', variant: 'primary', icon: <ArrowRight className="h-6 w-6" /> },
          { text: 'See Services', href: '/services', variant: 'secondary' },
          { text: 'Find Your Industry', href: '/industries', variant: 'secondary' },
        ]}
      />

      {/* Core Systems */}
      <section id="systems" className="py-24 section-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
              Six Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">Systems</span> That Drive <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-emerald to-accent-cyan">Results</span>
            </h2>
            <p className="font-body text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto font-normal leading-relaxed">
              Each system solves a specific business problem with measurable outcomes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {systems.map((system, index) => (
              <div key={index} className="card-tech group">
                <div className={`${system.iconColor} mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                  {system.icon}
                </div>
                <h3 className="font-heading text-2xl font-black text-gray-900 mb-6 tracking-tight">{system.title}</h3>
                
                <div className="space-y-4">
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 section-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
              Six Execution <span className="text-brand-cyan">Capabilities</span>
            </h2>
            <p className="font-body text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto font-normal leading-relaxed">
              How we deliver systems that drive measurable business outcomes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="card-tech group" style={{minHeight: '320px'}}>
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

      {/* Solutions */}
      <section className="py-24 section-dark text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl lg:text-7xl font-black mb-8 tracking-tight">
              Complete System <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">Solutions</span>
            </h2>
            <p className="font-body text-xl lg:text-2xl text-white max-w-3xl mx-auto font-normal leading-relaxed">
              Replace your entire SaaS stack with integrated systems that work together seamlessly.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Essential */}
            <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300 shadow-2xl max-w-sm mx-auto">
              <div className="text-center mb-6">
                <h3 className="font-heading text-3xl font-black text-white mb-4 tracking-tight">Essential</h3>
                <p className="text-5xl font-black mb-3" style={{color: '#00A878'}}>$145/mo</p>
                <p className="text-gray-300 text-lg">Foundation for growth</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-3 text-white">
                  <CheckCircle className="h-5 w-5" style={{color: '#00A8E8'}} />
                  <span className="text-sm font-normal">CRM & Contact Management</span>
                </li>
                <li className="flex items-center space-x-3 text-white">
                  <CheckCircle className="h-5 w-5" style={{color: '#00A8E8'}} />
                  <span className="text-sm font-normal">Funnel & Web Optimization</span>
                </li>
                <li className="flex items-center space-x-3 text-white">
                  <CheckCircle className="h-5 w-5" style={{color: '#00A8E8'}} />
                  <span className="text-sm font-normal">Basic Automation</span>
                </li>
              </ul>
              
              <Link
                to="/solutions" 
                className="block w-full text-center text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center space-x-2"
                style={{backgroundColor: '#00A8E8'}}
              >
                <span>See Details</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Growth */}
            <div className="relative bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300 shadow-2xl max-w-sm mx-auto">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-primary-600 to-accent-cyan text-white px-4 py-2 rounded-full text-sm font-semibold shadow-glow flex items-center space-x-1">
                  <Star className="h-4 w-4" />
                  <span>Most Popular</span>
                </div>
              </div>
              
              <div className="text-center mb-6 mt-4">
                <h3 className="font-heading text-3xl font-black text-white mb-4 tracking-tight">Growth</h3>
                <p className="text-5xl font-black mb-3" style={{color: '#00A878'}}>$295/mo</p>
                <p className="text-gray-300 text-lg">Scale with intelligence</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-3 text-white">
                  <CheckCircle className="h-5 w-5" style={{color: '#00A8E8'}} />
                  <span className="text-sm font-normal">All Essential features</span>
                </li>
                <li className="flex items-center space-x-3 text-white">
                  <CheckCircle className="h-5 w-5" style={{color: '#00A8E8'}} />
                  <span className="text-sm font-normal">AI Assistant & Chatbot</span>
                </li>
                <li className="flex items-center space-x-3 text-white">
                  <CheckCircle className="h-5 w-5" style={{color: '#00A8E8'}} />
                  <span className="text-sm font-normal">Unified Inbox & Reviews</span>
                </li>
              </ul>
              
              <Link
                to="/solutions" 
                className="block w-full text-center text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center space-x-2"
                style={{backgroundColor: '#00A8E8'}}
              >
                <span>See Details</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300 shadow-2xl max-w-sm mx-auto">
              <div className="text-center mb-6">
                <h3 className="font-heading text-3xl font-black text-white mb-4 tracking-tight">Pro</h3>
                <p className="text-5xl font-black mb-3" style={{color: '#00A878'}}>$495/mo</p>
                <p className="text-gray-300 text-lg">Enterprise-grade systems</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-3 text-white">
                  <CheckCircle className="h-5 w-5" style={{color: '#00A8E8'}} />
                  <span className="text-sm font-normal">All Growth features</span>
                </li>
                <li className="flex items-center space-x-3 text-white">
                  <CheckCircle className="h-5 w-5" style={{color: '#00A8E8'}} />
                  <span className="text-sm font-normal">Social Flow Management</span>
                </li>
                <li className="flex items-center space-x-3 text-white">
                  <CheckCircle className="h-5 w-5" style={{color: '#00A8E8'}} />
                  <span className="text-sm font-normal">Enterprise Analytics</span>
                </li>
              </ul>
              
              <Link
                to="/solutions" 
                className="block w-full text-center text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center space-x-2"
                style={{backgroundColor: '#00A8E8'}}
              >
                <span>See Details</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="py-24 section-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-6xl font-black text-gray-900 mb-6">
              Built for Every <span className="text-brand-emerald">Industry</span>
            </h2>
            <p className="font-body text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto font-light">
              NorthForce adapts to your sector's unique challenges and requirements.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {industries.map((industry, index) => (
              <Link 
                key={index} 
                to="/industries" 
                className="flex flex-col items-center p-8 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:shadow-glow transition-all duration-300 group transform hover:scale-105"
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

      {/* Method */}
      <section className="py-24 section-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-6xl font-black text-gray-900 mb-6">
              Our Proven <span className="text-brand-cyan">Method</span>
            </h2>
            <p className="font-body text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto font-light">
              Three models that ensure maximum impact and long-term success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {methods.map((method, index) => (
              <div key={index} className="card-tech group">
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {method.icon}
                </div>
                <h3 className="font-heading text-2xl font-bold text-gray-900 mb-4">{method.title}</h3>
                <p className="font-body text-gray-600 mb-4">{method.description}</p>
                <p className="text-gradient font-semibold">{method.outcome}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/method" 
              className="btn-primary inline-flex items-center"
            >
              Learn Our Method
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-6xl font-black text-gray-900 mb-6">
              Measurable <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">Results</span>
            </h2>
            <p className="font-body text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto font-light">
              Real outcomes from real clients across industries.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
            {proofPoints.map((point, index) => (
              <div key={index} className="text-center group">
                <div className={`font-heading text-4xl lg:text-5xl font-black ${point.color} mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                  {point.metric}
                </div>
                <p className="font-body text-gray-600 text-sm font-medium">{point.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              to="/proof" 
              className="bg-gradient-to-r from-gray-900 to-primary-900 text-white px-10 py-5 rounded-2xl hover:shadow-glow transition-all duration-300 font-bold text-lg inline-flex items-center transform hover:scale-105"
            >
              View Case Studies
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 section-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-6xl font-black text-gray-900 mb-6">
              Transparent <span className="text-brand-emerald">Pricing</span>
            </h2>
            <p className="font-body text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto font-light">
              Core systems $995 each. System solutions tiered. Custom by quote.
            </p>
            <p className="font-body text-xl text-gradient font-bold mt-6">
              Invest once, scale predictably.
            </p>
          </div>
          
          <div className="text-center">
            <Link 
              to="/pricing" 
              className="btn-primary inline-flex items-center"
            >
              View Full Pricing
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

      <CtaSection
        title="Ready to Transform Your "
        titleHighlight="Success Story?"
        subtitle="Comprehensive audit of your site, SEO, content, listings, speed, and social presence. Get a detailed PDF report with actionable roadmap."
        backgroundClass="py-24 bg-gradient-to-r from-primary-600 via-accent-cyan to-accent-purple"
        titleClass="font-heading text-4xl lg:text-6xl font-black mb-6 tracking-tight"
        subtitleClass="font-body text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-12 font-light"
        ctaButtons={[
          { text: 'Get Free Audit', href: '/audit', variant: 'custom', icon: <ArrowRight className="h-6 w-6" />, customClasses: 'bg-white text-primary-900 px-10 py-5 rounded-2xl hover:bg-gray-100 transition-all duration-300 font-bold text-lg inline-flex items-center transform hover:scale-105 shadow-soft hover:shadow-glow' },
        ]}
      />

      {/* Insights */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-6xl font-black text-gray-900 mb-6">
              Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">Insights</span>
            </h2>
            <p className="font-body text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto font-light">
              Expert perspectives on automation, AI, and system optimization.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <article className="card-tech group">
              <div className="p-8">
                <h3 className="font-heading text-2xl font-bold text-gray-900 mb-4">
                  The ROI of Business Automation: Real Numbers
                </h3>
                <p className="font-body text-gray-600 mb-6">
                  How companies save 40% operational costs through strategic automation implementation.
                </p>
                <Link to="/insights" className="text-accent-cyan hover:text-accent-purple font-semibold transition-colors">
                  Read More →
                </Link>
              </div>
            </article>
            
            <article className="card-tech group">
              <div className="p-8">
                <h3 className="font-heading text-2xl font-bold text-gray-900 mb-4">
                  AI Assistants: Beyond Chatbots
                </h3>
                <p className="font-body text-gray-600 mb-6">
                  Building intelligent systems that qualify leads, book meetings, and increase conversion rates.
                </p>
                <Link to="/insights" className="text-accent-purple hover:text-accent-rose font-semibold transition-colors">
                  Read More →
                </Link>
              </div>
            </article>
            
            <article className="card-tech group">
              <div className="p-8">
                <h3 className="font-heading text-2xl font-bold text-gray-900 mb-4">
                  System Integration Mastery
                </h3>
                <p className="font-body text-gray-600 mb-6">
                  Creating unified workflows that eliminate data silos and boost team productivity.
                </p>
                <Link to="/insights" className="text-accent-emerald hover:text-accent-amber font-semibold transition-colors">
                  Read More →
                </Link>
              </div>
            </article>
          </div>
          
          <div className="text-center">
            <Link 
              to="/insights" 
              className="bg-gradient-to-r from-gray-900 to-primary-900 text-white px-10 py-5 rounded-2xl hover:shadow-glow transition-all duration-300 font-bold text-lg inline-flex items-center transform hover:scale-105"
            >
              View All Insights
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

      <CtaSection
        title="Ready to Transform Your "
        titleHighlight="Business?"
        subtitle="Stop losing leads, time, and trust. Start building systems that drive measurable growth."
        backgroundClass="py-24 section-dark"
        titleClass="font-heading text-4xl lg:text-6xl font-black mb-6"
        subtitleClass="font-body text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto font-light"
        ctaButtons={[]} // No buttons, as it has a ContactForm directly
        extraContent={<ContactForm variant="inline" />}
      />
    </div>
  );
};

export default HomePage;