import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Users, Zap, Target, CheckCircle } from 'lucide-react';
import CtaSection from '../components/CtaSection';
import SEOHead from '../components/SEOHead';
import { useLanguage } from '../contexts/LanguageContext';

const CareersPage = () => {
  const { t } = useLanguage();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": {
      "en": "Careers at NorthForce",
      "sv": "Karriärer på NorthForce"
    },
    "description": {
      "en": "Join the NorthForce team. Build systems that transform businesses with cutting-edge technology and Nordic work-life balance.",
      "sv": "Gå med i NorthForce-teamet. Bygg system som transformerar företag med banbrytande teknik och nordisk work-life balance."
    },
    "mainEntity": {
      "@type": "Organization",
      "name": "NorthForce"
    },
    "about": {
      "@type": "JobPosting",
      "hiringOrganization": {
        "@type": "Organization",
        "name": "NorthForce",
        "sameAs": "https://northforce.io"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "SE"
        }
      }
    }
  };

  const values = [
    {
      icon: <Target className="h-8 w-8" />,
      title: t('careers.values.precision.title'),
      description: t('careers.values.precision.desc')
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: t('careers.values.transparency.title'),
      description: t('careers.values.transparency.desc')
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: t('careers.values.growth.title'),
      description: t('careers.values.growth.desc')
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: t('careers.values.balance.title'),
      description: t('careers.values.balance.desc')
    }
  ];

  const benefits = [
    t('careers.benefits.remote'),
    t('careers.benefits.equipment'),
    t('careers.benefits.learning'),
    t('careers.benefits.health'),
    t('careers.benefits.ownership'),
    t('careers.benefits.team')
  ];

  const openPositions = [
    {
      title: "Senior Systems Architect",
      department: "Engineering",
      location: "Oslo, Norway / Remote",
      type: "Full-time",
      description: "Lead the design and implementation of complex business automation systems for enterprise clients."
    },
    {
      title: "AI/ML Engineer", 
      department: "Engineering",
      location: "Stockholm, Sweden / Remote",
      type: "Full-time",
      description: "Develop intelligent automation solutions and AI assistants that drive measurable business results."
    },
    {
      title: "Business Systems Consultant",
      department: "Consulting",
      location: "Copenhagen, Denmark / Remote", 
      type: "Full-time",
      description: "Work directly with clients to analyze, design, and implement transformative business systems."
    },
    {
      title: "Growth Marketing Specialist",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description: "Drive growth through content marketing, SEO, and systematic lead generation strategies."
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time", 
      description: "Ensure client success and drive expansion through ongoing relationship management and optimization."
    },
    {
      title: "Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Build beautiful, responsive interfaces for client systems and internal tools using modern web technologies."
    }
  ];

  const workCulture = [
    {
      title: "Nordic Work-Life Balance",
      description: "We believe in sustainable productivity. Work hard during work hours, then disconnect and recharge."
    },
    {
      title: "Continuous Learning",
      description: "Stay at the cutting edge with conference attendance, online courses, and dedicated learning time."
    },
    {
      title: "Flat Hierarchy",
      description: "Your ideas matter regardless of your title. Everyone has a voice in shaping our direction."
    },
    {
      title: "Results-Oriented",
      description: "We measure success by outcomes, not hours. Deliver great work and how you do it is up to you."
    }
  ];

  return (
    <div className="bg-white">
      <SEOHead
        title="Join the NorthForce Team"
        titleSv="Gå med i NorthForce-teamet"
        description="Build systems that transform businesses with cutting-edge technology and Nordic work-life balance."
        descriptionSv="Gå med i NorthForce-teamet. Bygg system som transformerar företag med banbrytande teknik och nordisk work-life balance."
        keywords="NorthForce careers, business automation jobs, AI systems engineer, remote work Sweden, Nordic work culture"
        keywordsSv="NorthForce karriärer, affärsautomation jobb, AI-systemingenjör, distansarbete Sverige, nordisk arbetskultur"
        canonicalUrl="https://northforce.io/careers"
        structuredData={structuredData}
        breadcrumbs={[{ name: "Home", url: "https://northforce.io/" }, { name: "Careers", url: "https://northforce.io/careers" }]}
      />
      
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-purple rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-cyan rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-accent-purple/20 text-accent-purple rounded-full text-sm font-semibold tracking-wide uppercase">
              Bli en av oss
            </span>
          </div>

          <h1 className="font-heading text-5xl lg:text-7xl font-black mb-8 tracking-tight">
            {t('careers.title')}
          </h1>
          <p className="font-body text-xl text-white/80 leading-relaxed max-w-2xl mx-auto mb-6">
            {t('careers.subtitle')}
          </p>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-24 section-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight leading-tight">
              {t('careers.values.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center premium-card group">
                <div className="text-primary-600 mb-6 flex justify-center transform group-hover:scale-110 transition-transform duration-300 p-4 bg-primary-600/10 rounded-2xl"> {/* Icon container */}
                  {value.icon}
                </div>
                <h3 className="font-heading text-2xl font-black text-gray-900 mb-4 tracking-tight">{value.title}</h3>
                <p className="font-body text-gray-700 text-lg font-medium leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Culture */}
      <section className="py-24 section-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight leading-tight">
              How We Work
            </h2>
            <p className="font-body text-2xl lg:text-3xl text-gray-700 max-w-4xl mx-auto font-medium leading-relaxed">
              A culture built on trust, transparency, and the Nordic approach to work-life balance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {workCulture.map((item, index) => (
              <div key={index} className="premium-card group">
                <h3 className="font-heading text-3xl font-black text-gray-900 mb-6 tracking-tight">{item.title}</h3>
                <p className="font-body text-gray-700 text-lg font-medium leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-10 tracking-tight leading-tight">
                {t('careers.benefits.title')}
              </h2>
              
              <ul className="space-y-6">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-4">
                    <CheckCircle className="h-7 w-7 text-accent-emerald mt-1 flex-shrink-0" />
                    <span className="font-body text-gray-800 text-lg font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="premium-card bg-gradient-to-br from-primary-600/10 to-accent-cyan/10 border border-primary-600/30">
              <h3 className="font-heading text-3xl font-black text-gray-900 mb-8 tracking-tight">
                Life at NorthForce
              </h3>
              <div className="space-y-8">
                <div>
                  <h4 className="font-heading text-xl font-black text-gray-900 mb-3">Remote-First Culture</h4>
                  <p className="font-body text-gray-700 text-lg font-medium leading-relaxed">Work from anywhere with quarterly team gatherings in Nordic cities.</p>
                </div>
                <div>
                  <h4 className="font-heading text-xl font-black text-gray-900 mb-3">Cutting-Edge Projects</h4>
                  <p className="font-body text-gray-700 text-lg font-medium leading-relaxed">Work on complex systems that transform how businesses operate.</p>
                </div>
                <div>
                  <h4 className="font-heading text-xl font-black text-gray-900 mb-3">Growth Opportunities</h4>
                  <p className="font-body text-gray-700 text-lg font-medium leading-relaxed">Clear career progression with mentorship and skill development.</p>
                </div>
                <div>
                  <h4 className="font-heading text-xl font-black text-gray-900 mb-3">Impact-Driven Work</h4>
                  <p className="font-body text-gray-700 text-lg font-medium leading-relaxed">See the direct results of your work in client success stories.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-24 section-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight leading-tight">
              {t('careers.openings.title')}
            </h2>
          </div>

          <div className="space-y-8">
            {openPositions.map((position, index) => (
              <div key={index} className="premium-card group hover:shadow-glow transition-all duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
                  <div className="lg:col-span-2">
                    <h3 className="font-heading text-2xl font-black text-gray-900 mb-4 tracking-tight">{position.title}</h3>
                    <p className="font-body text-gray-700 text-lg font-medium leading-relaxed">{position.description}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-lg text-gray-700">
                      <span className="font-bold">Department:</span> {position.department}
                    </div>
                    <div className="text-lg text-gray-700">
                      <span className="font-bold">Location:</span> {position.location}
                    </div>
                    <div className="text-lg text-gray-700">
                      <span className="font-bold">Type:</span> {position.type}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Link 
                      to="/contact" 
                      className="bg-gradient-to-r from-primary-600 to-accent-cyan text-white px-8 py-4 rounded-2xl hover:shadow-glow transition-all duration-300 font-bold text-lg inline-flex items-center transform hover:scale-105"
                    >
                      Apply Now
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight leading-tight">
              Our Hiring Process
            </h2>
            <p className="font-body text-2xl lg:text-3xl text-gray-700 max-w-4xl mx-auto font-medium leading-relaxed">
              A transparent, efficient process designed to find the right fit for both sides.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-primary-600 to-accent-cyan text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-glow">
                1
              </div>
              <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">Application Review</h3>
              <p className="font-body text-gray-700 text-lg font-medium leading-relaxed">We review your application and portfolio within 48 hours.</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-accent-purple to-accent-rose text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-glow">
                2
              </div>
              <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">Initial Conversation</h3>
              <p className="font-body text-gray-700 text-lg font-medium leading-relaxed">30-minute call to discuss your background and our opportunity.</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-accent-emerald to-accent-amber text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-glow">
                3
              </div>
              <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">Technical Assessment</h3>
              <p className="font-body text-gray-700 text-lg font-medium leading-relaxed">Role-specific challenge or presentation to showcase your skills.</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-accent-cyan to-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-glow">
                4
              </div>
              <h3 className="font-heading text-2xl font-black text-gray-900 mb-4">Team Interview</h3>
              <p className="font-body text-gray-700 text-lg font-medium leading-relaxed">Meet the team and discuss how you'll contribute to our mission.</p>
            </div>
          </div>
        </div>
      </section>
      
      <CtaSection
        title="Ready to Join Our "
        titleHighlight="Mission?"
        subtitle="Don't see the perfect role? We're always looking for exceptional talent. Send us your information and let's start a conversation."
        ctaButtons={[
          { text: 'Start a Conversation', href: '/contact', variant: 'primary', icon: <ArrowRight className="h-6 w-6" /> },
          { text: 'Learn More About Us', href: '/about', variant: 'secondary' },
        ]}
      />
    </div>
  );
};

export default CareersPage;