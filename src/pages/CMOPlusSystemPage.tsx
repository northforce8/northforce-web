import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Users, BarChart3, Calendar, CheckCircle, Zap, Brain, Globe, TrendingUp, Shield, Clock, Sparkles } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import CtaSection from '../components/CtaSection';
import SEOHead from '../components/SEOHead';
import { useLanguage } from '../contexts/LanguageContext';

const CMOPlusSystemPage = () => {
  const { t } = useLanguage();

  const whatYouGet = [
    "Strategy & leadership: ICP, messaging, channel selection, calendars",
    "Content & SEO: pillar articles, repurpose to LinkedIn, carousels, video",
    "Outreach: Dripify sequences on LinkedIn and targeted email",
    "Webinars: monthly themes that drive audit bookings",
    "System execution: AI-chat, CRM, unified inbox, automations, dashboards",
    "Reporting: executive + ops dashboards with real-time KPIs"
  ];

  const packages = [
    {
      name: t('cmoplus.packages.launch'),
      description: "1 channel, 2 campaigns, 4–6 publications/month",
      goal: "Target 2–3 meetings/month"
    },
    {
      name: t('cmoplus.packages.growth'),
      description: "2–3 channels, 8–12 publications/month, email + SEO",
      goal: "Target 4–6 meetings/month"
    },
    {
      name: t('cmoplus.packages.scale'),
      description: "Multi-channel, webinar, SEO, lead magnets",
      goal: "Target 8–12 meetings/month"
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": ["Organization", "Service"],
    "name": {
      "en": "CMO + System",
      "sv": "CMO + System"
    },
    "provider": { // Organization providing the service
      "@type": "Organization",
      "name": "NorthForce",
      "url": "https://northforce.io",
      "sameAs": [
        "https://www.linkedin.com/company/northforce-io/",
        "https://twitter.com/NorthForce_io",
        "https://www.youtube.com/@NorthForce",
        "https://www.instagram.com/northforce.io/",
        "https://www.facebook.com/northforce.io/"
      ]
    },
    "serviceType": {
      "en": "CMO + System",
      "sv": "CMO + System"
    },
    "description": {
      "en": "Strategic marketing leadership combined with complete system execution. Weekly cadence, measurable meetings, predictable pipeline for B2B companies.",
      "sv": "Strategisk marknadsföringsledning kombinerat med komplett systemexekvering. Veckovis takt, mätbara möten, förutsägbar pipeline för B2B-företag."
    },
    "areaServed": ["SE", "ES", "CH"],
    "offers": [
      {
        "@type": "Offer",
        "name": {
          "en": "Launch",
          "sv": "Launch"
        },
        "description": {
          "en": "1 channel, 2 campaigns, 4–6 publications/month. Target 2–3 meetings/month",
          "sv": "1 kanal, 2 kampanjer, 4–6 publikationer/månad. Mål 2–3 möten/månad"
        }
      },
      {
        "@type": "Offer", 
        "name": {
          "en": "Growth",
          "sv": "Growth"
        },
        "description": {
          "en": "2–3 channels, 8–12 publications/month, email + SEO. Target 4–6 meetings/month",
          "sv": "2–3 kanaler, 8–12 publikationer/månad, e-post + SEO. Mål 4–6 möten/månad"
        }
      },
      {
        "@type": "Offer",
        "name": {
          "en": "Scale",
          "sv": "Scale"
        },
        "description": {
          "en": "Multi-channel, webinar, SEO, lead magnets. Target 8–12 meetings/month",
          "sv": "Multikanal, webbinarium, SEO, lead magnets. Mål 8–12 möten/månad"
        }
      }
    ], // Service offerings
    "potentialAction": {
      "@type": "ReserveAction",
      "target": "https://northforce.io/contact",
      "name": "Book an Audit"
    }
  };

  return (
    <div className="bg-white overflow-hidden">
      <SEOHead
        title="CMO + System - Strategic Marketing Leadership & Execution"
        description="Strategic marketing leadership combined with complete system execution. Weekly cadence, measurable meetings, predictable pipeline for B2B companies."
        keywords="CMO services, marketing leadership, B2B marketing, marketing automation, strategic marketing, business systems"
        canonicalUrl="https://northforce.io/cmo-plus-system"
        structuredData={structuredData}
        breadcrumbs={[{ name: "Home", url: "https://northforce.io/" }, { name: "CMO + System", url: "https://northforce.io/cmo-plus-system" }]}
      />
      
      <HeroSection
        title={t('cmoplus.title')}
        titleHighlight=""
        subtitle={t('cmoplus.subtitle')}
        backgroundVariant="homepage"
        extraContent={
          <>
            <Sparkles className="h-16 w-16 text-accent-cyan" />
            <Brain className="h-20 w-20 text-accent-purple" />
            <Zap className="h-16 w-16 text-accent-emerald" />
          </>
        }
        ctaButtons={[
          { text: 'Book an Audit', href: '/contact', variant: 'primary', icon: <ArrowRight className="h-6 w-6" /> },
          { text: 'Talk to us', href: '/contact', variant: 'secondary' },
        ]}
      />

        {/* Why this model */}
        <section className="py-24 section-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
                Leadership + System = Weekly <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">Pipeline</span>
              </h2>
              <p className="font-body text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto font-normal leading-relaxed">
                The marketing landscape is fragmented. Agencies produce, consultants plan, tools require internal operations. {/* Problem statement */}
                We take responsibility for the whole. With Maria's strategic leadership (SEO, content, channel mix) and the NorthForce platform {/* Our unique approach */}
                (AI-chatbot, CRM, unified inbox, social flow, dashboards, automation) you get rhythm every week. 
                Everything measured. Everything visible in real-time.
              </p>
            </div>
          </div>
        </section>

        {/* Who it's for (ICP) */}
        <section className="py-24 section-accent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
                Built for B2B Services, Tech & <span className="text-brand-cyan">Consulting</span> (5–100 employees)
              </h2>
              <p className="font-body text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto font-normal leading-relaxed">
                CEO or owner bears responsibility but time is lacking. Campaigns become ad hoc, tools underutilized, {/* Target audience problem */}
                funnel lacks structure. Our subscription replaces an internal marketing function with a clear goal: 
                qualified meetings and predictable pipeline. Starting in Sweden, parallel tests in Spain and Switzerland (English).
              </p>
            </div>
          </div>
        </section>

        {/* What you get */}
        <section className="py-24 section-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
                From Plan to Publishing to <span className="text-brand-emerald">Pipeline</span> — Every Week
              </h2>
            </div>
            {/* What you get list */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {whatYouGet.map((item, index) => (
                <div key={index} className="card-tech group">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-accent-emerald mt-1 flex-shrink-0" />
                    <p className="font-body text-gray-800 text-lg font-medium leading-relaxed">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Proof of control (dashboards) */}
        <section className="py-24 section-dark text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="font-heading text-5xl lg:text-7xl font-black mb-8 tracking-tight">
                Operate on numbers — not <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">opinions</span>
              </h2>
              <p className="font-body text-xl lg:text-2xl text-white max-w-4xl mx-auto font-normal leading-relaxed">
                See MQL, SQM, meeting-show-rate, win-rate, ACV, rankings and traffic. Follow publications, pipelines and campaigns day by day.
                Management view for decisions. Operational view for execution.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-accent-cyan mx-auto mb-4" />
                <h3 className="font-heading text-xl font-bold text-white mb-2">Executive Dashboard</h3>
                <p className="text-gray-300">MQL, SQM, win-rate, ACV</p>
              </div>
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-accent-emerald mx-auto mb-4" />
                <h3 className="font-heading text-xl font-bold text-white mb-2">Pipeline Tracking</h3>
                <p className="text-gray-300">Real-time lead flow</p>
              </div>
              <div className="text-center">
                <Globe className="h-12 w-12 text-accent-amber mx-auto mb-4" />
                <h3 className="font-heading text-xl font-bold text-white mb-2">SEO & Traffic</h3>
                <p className="text-gray-300">Rankings, organic growth</p>
              </div>
              <div className="text-center">
                <Target className="h-12 w-12 text-accent-rose mx-auto mb-4" />
                <h3 className="font-heading text-xl font-bold text-white mb-2">Campaign Performance</h3>
                <p className="text-gray-300">Daily execution metrics</p>
              </div>
            </div>
          </div>
        </section>

        {/* 90-day plan (GTM) */}
        <section className="py-24 section-accent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
                Traction in <span className="text-brand-cyan">90 Days</span>
              </h2>
              <p className="font-body text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto font-normal leading-relaxed">
                LinkedIn (Dripify), email and content/SEO as base. 1 webinar/month. AI-voice in controlled pilot. {/* GTM strategy */}
                Partnerships for reach. Goal week 2: 10 audits. Goal day 45: 3 customers signed. Goal day 90: 6 active customers with ongoing pipeline.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card-tech group text-center">
                <div className="text-accent-cyan mb-6 flex justify-center">
                  <Calendar className="h-12 w-12" />
                </div>
                <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">Week 2</h3>
                <p className="font-body text-gray-700 text-lg font-medium">10 audits booked</p>
              </div>
              <div className="card-tech group text-center">
                <div className="text-accent-emerald mb-6 flex justify-center">
                  <Users className="h-12 w-12" />
                </div>
                <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">Day 45</h3>
                <p className="font-body text-gray-700 text-lg font-medium">3 customers signed</p>
              </div>
              <div className="card-tech group text-center">
                <div className="text-accent-purple mb-6 flex justify-center">
                  <TrendingUp className="h-12 w-12" />
                </div>
                <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">Day 90</h3>
                <p className="font-body text-gray-700 text-lg font-medium">6 active customers with pipeline</p>
              </div>
            </div>
          </div>
        </section>

        {/* Packages & pricing logic */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
                Three tiers. One way of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">working</span>.
              </h2>
              <p className="font-body text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto font-normal leading-relaxed">
                Setup = 1 month. Subscription monthly. Transparent delivery, measurable goals. {/* Pricing model */}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {packages.map((pkg, index) => (
                <div key={index} className="card-tech group">
                  <h3 className="font-heading text-3xl font-black text-gray-900 mb-6 tracking-tight">{pkg.name}</h3>
                  <p className="font-body text-gray-700 text-lg font-medium leading-relaxed mb-4">{pkg.description}</p>
                  <p className="font-body text-accent-emerald font-bold text-lg">{pkg.goal}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Link 
                to="/contact" 
                className="bg-gradient-to-r from-primary-600 to-accent-cyan text-white px-10 py-5 rounded-2xl hover:shadow-glow transition-all duration-300 font-bold text-lg inline-flex items-center transform hover:scale-105"
              >
                Compare tiers
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
            </div>
          </div>
        </section>

        {/* Governance & cadence */}
        <section className="py-24 section-accent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
                Rhythm that <span className="text-brand-emerald">holds</span>
              </h2>
              <p className="font-body text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto font-normal leading-relaxed">
                Weekly stand-ups for obstacles and priorities. Monthly reviews against KPIs. Trello boards for Sales, Content, {/* Governance */}
                Campaigns and Client Ops with checklists and automation. Time-to-first-value ≤14 days.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card-tech group text-center">
                <Clock className="h-12 w-12 text-accent-cyan mx-auto mb-6" />
                <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">Weekly Stand-ups</h3>
                <p className="font-body text-gray-700 text-lg font-medium">Obstacles and priorities</p>
              </div>
              <div className="card-tech group text-center">
                <BarChart3 className="h-12 w-12 text-accent-emerald mx-auto mb-6" />
                <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">Monthly Reviews</h3>
                <p className="font-body text-gray-700 text-lg font-medium">KPI follow-up</p>
              </div>
              <div className="card-tech group text-center">
                <Target className="h-12 w-12 text-accent-purple mx-auto mb-6" />
                <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">Trello Boards</h3>
                <p className="font-body text-gray-700 text-lg font-medium">Sales, Content, Campaigns, Client Ops</p>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
                EU-first data & consent by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">design</span>
              </h2>
              <p className="font-body text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto font-normal leading-relaxed">
                DPA, role-based access, data minimization. Email/LinkedIn according to consent and opt-out. {/* Compliance */}
                AI-voice with clear identification and logging.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card-tech group text-center">
                <Shield className="h-12 w-12 text-accent-emerald mx-auto mb-6" />
                <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">GDPR Compliance</h3>
                <p className="font-body text-gray-700 text-lg font-medium">DPA, role-based access, data minimization</p>
              </div>
              <div className="card-tech group text-center">
                <CheckCircle className="h-12 w-12 text-accent-cyan mx-auto mb-6" />
                <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">Consent Management</h3>
                <p className="font-body text-gray-700 text-lg font-medium">Email/LinkedIn according to consent and opt-out</p>
              </div>
              <div className="card-tech group text-center">
                <Brain className="h-12 w-12 text-accent-purple mx-auto mb-6" />
                <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">AI Transparency</h3>
                <p className="font-body text-gray-700 text-lg font-medium">Clear identification and logging</p>
              </div>
            </div>
          </div>
        </section>

      <CtaSection
        title="Ready to Transform Your "
        titleHighlight="Marketing?"
        subtitle="Strategic leadership combined with systematic execution. Weekly cadence, measurable results."
        ctaButtons={[
          { text: 'Book an Audit', href: '/contact', variant: 'accent', icon: <ArrowRight className="h-6 w-6" /> },
          { text: 'Contact Sales', href: '/contact', variant: 'custom', customClasses: 'bg-white text-gray-900 px-10 py-5 rounded-2xl hover:bg-gray-100 transition-all duration-300 font-black text-xl transform hover:scale-105 shadow-card hover:shadow-glow' },
        ]}
        extraContent={
          <a href="#" className="text-gray-300 hover:text-white transition-colors text-lg font-medium">Download the Outline (PDF)</a>
        }
      />
    </div>
  );
};

export default CMOPlusSystemPage;