import React from 'react';
import { ArrowRight, Globe, Users, Zap, Target, CheckCircle } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import CtaSection from '../components/CtaSection';
import SEOHead from '../components/SEOHead';

const AboutPage = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": {
      "en": "About NorthForce",
      "sv": "Om NorthForce"
    },
    "description": {
      "en": "Nordic precision meets global execution. Founded with a mission to help businesses achieve systematic excellence",
      "sv": "Nordisk precision möter global exekvering. Grundat med ett uppdrag att hjälpa företag uppnå systematisk excellens"
    },
    "mainEntity": {
      "@type": "Organization",
      "name": "NorthForce",
      "foundingDate": "2023",
      "foundingLocation": {
        "@type": "Place",
        "name": "Stockholm, Sweden"
      }
    }
  };

  const values = [
    {
      icon: <Target className="h-8 w-8" />,
      iconColor: "text-accent-cyan",
      title: "Precision",
      description: "We believe in getting things right the first time. Quality over quantity, always."
    },
    {
      icon: <Users className="h-8 w-8" />,
      iconColor: "text-accent-purple",
      title: "Transparency",
      description: "Open communication, honest feedback, and clear expectations at every level."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      iconColor: "text-accent-emerald",
      title: "Innovation",
      description: "We push boundaries and find better ways to solve complex business problems."
    },
    {
      icon: <Globe className="h-8 w-8" />,
      iconColor: "text-accent-amber",
      title: "Global Impact",
      description: "Nordic values with global reach. We help businesses worldwide achieve excellence."
    }
  ];

  const team = [
    {
      name: "Maria Andersson",
      role: "Founder & CEO",
      description: "Strategic leader with 15+ years in business automation and system optimization.",
      expertise: ["Business Strategy", "System Architecture", "Team Leadership"]
    },
    {
      name: "Erik Johansson",
      role: "CTO",
      description: "Technical visionary specializing in AI integration and enterprise system development.",
      expertise: ["AI Development", "System Integration", "Technical Architecture"]
    },
    {
      name: "Anna Lindberg",
      role: "Head of Client Success",
      description: "Ensures every client achieves their automation goals and maximizes system ROI.",
      expertise: ["Client Relations", "Process Optimization", "Success Metrics"]
    }
  ];

  return (
    <div className="bg-white overflow-hidden">
      <SEOHead
        title="About Us - Nordic Precision Meets Global Execution"
        titleSv="Om oss - Nordisk precision möter global exekvering"
        description="We bring Nordic values of trust, transparency, and precision to business automation worldwide. Founded in Stockholm with a mission to achieve systematic excellence."
        descriptionSv="Vi för nordiska värderingar av förtroende, transparens och precision till affärsautomation världen över. Grundat i Stockholm med ett uppdrag att uppnå systematisk excellens."
        keywords="about NorthForce, Nordic business automation, company mission, systematic excellence, business transformation"
        keywordsSv="om NorthForce, nordisk affärsautomation, företagsuppdrag, systematisk excellens, affärstransformation"
        canonicalUrl="https://northforce.io/about"
        structuredData={structuredData}
        breadcrumbs={[{ name: "Home", url: "https://northforce.io/" }, { name: "About", url: "https://northforce.io/about" }]}
      />
      
      <HeroSection
        title="Nordic Precision Meets Global "
        titleHighlight="Execution"
        subtitle="Founded with a mission to help businesses achieve systematic excellence through precision-built automation and AI solutions."
        icon={<Globe className="h-12 w-12 text-accent-cyan" />}
        backgroundVariant="subpage"
      />

        {/* Our Story */}
        <section className="py-24 section-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
                  Our <span className="text-brand-violet">Story</span>
                </h2>
                <div className="space-y-6 font-body text-xl text-gray-700 font-medium leading-relaxed">
                  <p>
                    NorthForce was born from a simple observation: businesses everywhere were drowning 
                    in disconnected tools, manual processes, and systems that promised efficiency but 
                    delivered complexity.
                  </p>
                  <p>
                    Founded in Stockholm in 2023, we set out to change this. We believe that technology 
                    should amplify human potential, not complicate it. Our Nordic approach combines 
                    precision engineering with transparent communication and sustainable growth.
                  </p>
                  <p>
                    Today, we help businesses across industries transform their operations through 
                    intelligent automation, unified systems, and AI-powered solutions that actually work.
                  </p>
                </div>
              </div>
              
              <div className="premium-card bg-gradient-to-br from-primary-600/10 to-accent-cyan/10 border border-primary-600/30">
                <h3 className="font-heading text-3xl font-black text-gray-900 mb-8 tracking-tight">
                  Our Mission
                </h3>
                <p className="font-body text-xl text-gray-700 mb-8 font-medium leading-relaxed">
                  To help businesses achieve systematic excellence through precision-built automation 
                  and AI solutions that save time, build trust, and drive measurable growth.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-accent-emerald mt-1 flex-shrink-0" />
                    <span className="font-body text-gray-700 font-medium">Systems that actually work together</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-accent-emerald mt-1 flex-shrink-0" />
                    <span className="font-body text-gray-700 font-medium">Transparent processes and honest communication</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-accent-emerald mt-1 flex-shrink-0" />
                    <span className="font-body text-gray-700 font-medium">Measurable results and continuous improvement</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 section-accent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
                Our <span className="text-brand-emerald">Values</span>
              </h2>
              <p className="font-body text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto font-normal leading-relaxed">
                These principles guide everything we do, from client work to how we treat each other.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center premium-card group">
                  <div className={`${value.iconColor} mb-6 flex justify-center transform group-hover:scale-110 transition-transform duration-300 p-4 bg-current/10 rounded-2xl mx-auto w-fit`}>
                    {value.icon}
                  </div>
                  <h3 className="font-heading text-2xl font-black text-gray-900 mb-4 tracking-tight">{value.title}</h3>
                  <p className="font-body text-gray-700 text-lg font-medium leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
                Meet the <span className="text-brand-cyan">Team</span>
              </h2>
              <p className="font-body text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto font-normal leading-relaxed">
                The experts behind NorthForce's systematic approach to business transformation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="premium-card text-center group">
                  <div className="bg-gradient-to-br from-primary-600/10 to-accent-cyan/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-12 w-12 text-primary-600" />
                  </div>
                  <h3 className="font-heading text-2xl font-black text-gray-900 mb-2 tracking-tight">{member.name}</h3>
                  <p className="font-body text-lg text-primary-600 font-semibold mb-4">{member.role}</p>
                  <p className="font-body text-gray-700 mb-6 leading-relaxed">{member.description}</p>
                  
                  <div>
                    <h4 className="font-body text-sm font-bold text-gray-900 mb-3">Expertise:</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {member.expertise.map((skill, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      <CtaSection
        title="Ready to Work "
        titleHighlight="Together?"
        subtitle="Let's transform your business with systems that drive measurable results."
        ctaButtons={[
          { text: 'Start a Conversation', href: '/contact', variant: 'accent', icon: <ArrowRight className="h-6 w-6" /> },
          { text: 'Join Our Team', href: '/careers', variant: 'custom', customClasses: 'bg-white text-gray-900 px-10 py-5 rounded-2xl hover:bg-gray-100 transition-all duration-300 font-black text-xl transform hover:scale-105 shadow-card hover:shadow-glow' },
        ]}
      />
    </div>
  );
};

export default AboutPage;