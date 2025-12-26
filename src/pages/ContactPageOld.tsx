import React from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import SEOHead from '../components/SEOHead';
import ContactForm from '../components/ContactForm';
import ContactInfo from '../components/ContactInfo';
import BookingForm from '../components/BookingForm';

const ContactPage = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": {
      "en": "Contact NorthForce",
      "sv": "Kontakta NorthForce"
    },
    "description": {
      "en": "Get in touch to transform your business together",
      "sv": "Kontakta oss för att transformera ditt företag tillsammans"
    },
    "mainEntity": {
      "@type": "Organization",
      "name": "NorthForce",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Karlavägen 18",
        "addressLocality": "Stockholm",
        "postalCode": "114 31",
        "addressCountry": "SE"
      },
      "telephone": "+46 10 337 13 34",
      "email": "support@northforce.io"
    }
  };

  return (
    <div className="bg-white overflow-hidden">
      <SEOHead
        title="Contact Us - Transform Your Business Together"
        titleSv="Kontakta oss - Transformera ditt företag tillsammans"
        description="Get in touch to discuss your business automation needs. We respond within 2 hours during business hours."
        descriptionSv="Kontakta oss för att diskutera dina affärsautomationsbehov. Vi svarar inom 2 timmar under kontorstid."
        keywords="contact NorthForce, business automation consultation, system implementation contact, enterprise solutions inquiry"
        keywordsSv="kontakta NorthForce, affärsautomation konsultation, systemimplementering kontakt, företagslösningar förfrågan"
        canonicalUrl="https://northforce.io/contact"
        structuredData={structuredData}
        breadcrumbs={[{ name: "Home", url: "https://northforce.io/" }, { name: "Contact", url: "https://northforce.io/contact" }]}
      />
      
      <HeroSection
        title="Transform Your Business "
        titleHighlight="Together"
        subtitle="Ready to build systems that save time, build trust, and drive measurable growth? Let's start the conversation."
        icon={<MessageSquare className="h-12 w-12 text-accent-cyan" />}
        backgroundVariant="subpage"
      />

        {/* Contact Options */}
        <section className="py-24 section-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <div>
                <div className="mb-8">
                  <h2 className="font-heading text-4xl font-black text-gray-900 mb-4 tracking-tight">
                    Send Us a Message
                  </h2>
                  <p className="font-body text-xl text-gray-700 font-medium leading-relaxed">
                    Tell us about your business challenges and we'll respond within 2 hours during business hours.
                  </p>
                </div>
                <ContactForm />
              </div>

              {/* Booking Form - This is a specific form, not a generic CTA */}
              <div>
                <div className="mb-8">
                  <h2 className="font-heading text-4xl font-black text-gray-900 mb-4 tracking-tight">
                    Book a Strategy Call
                  </h2>
                  <p className="font-body text-xl text-gray-700 font-medium leading-relaxed">
                    Schedule a consultation to discuss your automation needs and explore solutions.
                  </p>
                </div>
                <BookingForm />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-24 section-accent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
                  Get in <span className="text-brand-cyan">Touch</span>
                </h2>
                <p className="font-body text-xl lg:text-2xl text-gray-700 mb-12 font-medium leading-relaxed">
                  Multiple ways to connect with our team. Choose what works best for you.
                </p>
                
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent-cyan/10 p-3 rounded-2xl">
                      <Mail className="h-6 w-6 text-accent-cyan" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-black text-gray-900 mb-2">Email Us</h3>
                      <p className="font-body text-gray-700 mb-2">For detailed inquiries and project discussions</p>
                      <a href="mailto:support@northforce.io" className="text-accent-cyan hover:text-accent-purple font-semibold transition-colors">
                        support@northforce.io
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent-purple/10 p-3 rounded-2xl">
                      <Phone className="h-6 w-6 text-accent-purple" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-black text-gray-900 mb-2">Call Us</h3>
                      <p className="font-body text-gray-700 mb-2">Direct line for urgent matters and quick questions</p>
                      <a href="tel:+46103371334" className="text-accent-purple hover:text-accent-rose font-semibold transition-colors">
                        +46 10 337 13 34
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent-emerald/10 p-3 rounded-2xl">
                      <MapPin className="h-6 w-6 text-accent-emerald" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-black text-gray-900 mb-2">Visit Us</h3>
                      <p className="font-body text-gray-700 mb-2">Our Stockholm office (by appointment)</p>
                      <address className="text-accent-emerald font-semibold not-italic">
                        Karlavägen 18<br />
                        114 31 Stockholm, Sweden
                      </address>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent-amber/10 p-3 rounded-2xl">
                      <Clock className="h-6 w-6 text-accent-amber" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-black text-gray-900 mb-2">Business Hours</h3>
                      <p className="font-body text-gray-700">Monday - Friday: 9:00 AM - 6:00 PM (CET)</p>
                      <p className="font-body text-gray-600 text-sm">Emergency support available 24/7</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <ContactInfo variant="compact" />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
                Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">Questions</span>
              </h2>
            </div>
            
            <div className="space-y-8">
              <div className="premium-card">
                <h3 className="font-heading text-xl font-black text-gray-900 mb-3">How quickly can you implement a system?</h3>
                <p className="font-body text-gray-700 leading-relaxed">
                  Implementation timelines vary by complexity. Essential systems typically take 2-4 weeks, 
                  Growth solutions 4-8 weeks, and Pro implementations 8-12 weeks. We provide detailed 
                  timelines during our initial consultation.
                </p>
              </div>
              
              <div className="premium-card">
                <h3 className="font-heading text-xl font-black text-gray-900 mb-3">Do you work with international clients?</h3>
                <p className="font-body text-gray-700 leading-relaxed">
                  Yes! While we're based in Stockholm, we serve clients globally. We work in English, 
                  Swedish, and can accommodate different time zones for meetings and support.
                </p>
              </div>
              
              <div className="premium-card">
                <h3 className="font-heading text-xl font-black text-gray-900 mb-3">What's included in the free audit?</h3>
                <p className="font-body text-gray-700 leading-relaxed">
                  Our comprehensive audit covers your website, SEO, content strategy, online listings, 
                  site speed, and social presence. You'll receive a detailed PDF report with actionable 
                  recommendations and a strategic roadmap.
                </p>
              </div>
              
              <div className="premium-card">
                <h3 className="font-heading text-xl font-black text-gray-900 mb-3">Can you integrate with our existing tools?</h3>
                <p className="font-body text-gray-700 leading-relaxed">
                  Absolutely. We specialize in creating seamless integrations with existing business tools 
                  and can often replace multiple tools with a unified system that works better and costs less.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
  );
};

export default ContactPage;