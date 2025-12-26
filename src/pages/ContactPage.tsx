import React from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SEOHead from '../components/SEOHead';
import ContactForm from '../components/ContactForm';
import SocialRow from '../components/SocialIcons';

const ContactPage = () => {
  const { language } = useLanguage();

  const offices = [
    {
      city: 'Stockholm',
      country: language === 'sv' ? 'Sverige' : 'Sweden',
      address: 'Karlavägen 18',
      postal: '114 31 Stockholm',
    },
  ];

  const process = [
    {
      step: '1',
      title: language === 'sv' ? 'Förfrågan' : 'Inquiry',
      description: language === 'sv'
        ? 'Fyll i formuläret nedan och beskriv er situation'
        : 'Fill out the form below and describe your situation',
    },
    {
      step: '2',
      title: language === 'sv' ? 'Initial Dialog' : 'Initial Discussion',
      description: language === 'sv'
        ? 'Vi återkommer inom 24h för att boka ett 30-60 min samtal'
        : 'We get back within 24h to schedule a 30-60 min call',
    },
    {
      step: '3',
      title: language === 'sv' ? 'Strategidialog' : 'Strategy Discussion',
      description: language === 'sv'
        ? 'Djupdykning i era utmaningar, mål och potentiella lösningar'
        : 'Deep-dive into your challenges, goals and potential solutions',
    },
    {
      step: '4',
      title: language === 'sv' ? 'Proposal' : 'Proposal',
      description: language === 'sv'
        ? 'Skräddarsydd approach, roadmap och investering'
        : 'Tailored approach, roadmap and investment',
    },
  ];

  return (
    <div className="bg-white overflow-hidden">
      <SEOHead
        title={language === 'sv' ? 'Kontakt — NorthForce' : 'Contact — NorthForce'}
        description={language === 'sv'
          ? 'Låt oss samtala om era tillväxtutmaningar. Vi återkommer inom 24 timmar för att boka en strategidialog.'
          : 'Let us discuss your growth challenges. We get back within 24 hours to schedule a strategy discussion.'}
        canonicalUrl="https://northforce.io/contact"
      />

      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-cyan rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-emerald rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-accent-cyan/20 text-accent-cyan rounded-full text-sm font-semibold tracking-wide uppercase">
              {language === 'sv' ? 'Strategisk Dialog' : 'Strategic Dialogue'}
            </span>
          </div>

          <h1 className="font-heading text-5xl lg:text-7xl font-black mb-8 tracking-tight">
            {language === 'sv' ? 'Låt Oss ' : "Let's "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-emerald">
              {language === 'sv' ? 'Samtala' : 'Talk'}
            </span>
          </h1>
          <p className="font-body text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
            {language === 'sv'
              ? 'Vi börjar alltid med att förstå. Ingen försäljning, bara strategisk dialog om era utmaningar och möjligheter.'
              : 'We always start by understanding. No sales pitch, just strategic dialogue about your challenges and opportunities.'}
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight">
              {language === 'sv' ? 'Hur Vi ' : 'How We '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
                {language === 'sv' ? 'Arbetar' : 'Work'}
              </span>
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {language === 'sv'
                ? 'En transparent och strukturerad process från första kontakt till långsiktig partner.'
                : 'A transparent and structured process from first contact to long-term partnership.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {process.map((item, index) => (
              <div key={index} className="group relative bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-3xl p-8 hover:border-accent-cyan hover:shadow-2xl transition-all duration-500">
                {/* Connection Line (except last item) */}
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary-600 to-accent-cyan opacity-30 group-hover:opacity-100 transition-opacity" />
                )}

                <div className="flex items-start space-x-6">
                  {/* Step Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-cyan rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <span className="font-heading text-white font-black text-2xl">{item.step}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-heading text-2xl font-black text-gray-900 mb-3 leading-tight">
                      {item.title}
                    </h3>
                    <p className="font-body text-base text-gray-700 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl lg:text-4xl font-black text-gray-900 mb-4">
              {language === 'sv' ? 'Berätta Om Er Situation' : 'Tell Us About Your Situation'}
            </h2>
            <p className="font-body text-lg text-gray-600">
              {language === 'sv'
                ? 'Ju mer kontext vi får, desto bättre kan vi förbereda den initiala dialogen'
                : 'The more context we get, the better we can prepare the initial discussion'}
            </p>
          </div>

          <ContactForm />
        </div>
      </section>

      {/* Contact Info & Offices */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Direct Contact */}
            <div className="lg:col-span-1">
              <h3 className="font-heading text-2xl font-bold text-gray-900 mb-8">
                {language === 'sv' ? 'Direktkontakt' : 'Direct Contact'}
              </h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Email</p>
                    <a href="mailto:contact@northforce.io" className="text-primary-600 hover:text-accent-cyan transition-colors">
                      contact@northforce.io
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">
                      {language === 'sv' ? 'Telefon' : 'Phone'}
                    </p>
                    <a href="tel:+46103371334" className="text-primary-600 hover:text-accent-cyan transition-colors">
                      +46 10 337 13 34
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">
                      {language === 'sv' ? 'Svarstid' : 'Response Time'}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {language === 'sv' ? 'Inom 24 timmar' : 'Within 24 hours'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="font-semibold text-gray-900 mb-4">
                    {language === 'sv' ? 'Följ Oss' : 'Follow Us'}
                  </p>
                  <SocialRow variant="contact" className="social-brand-colors justify-start" />
                </div>
              </div>
            </div>

            {/* Offices */}
            <div className="lg:col-span-2">
              <h3 className="font-heading text-2xl font-bold text-gray-900 mb-8">
                {language === 'sv' ? 'Kontor' : 'Offices'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {offices.map((office, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-xl p-8">
                    <div className="flex items-start space-x-3 mb-4">
                      <MapPin className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-heading text-xl font-bold text-gray-900 mb-1">
                          {office.city}
                        </h4>
                        <p className="text-sm text-gray-500">{office.country}</p>
                      </div>
                    </div>
                    <div className="ml-9">
                      <p className="text-gray-700">{office.address}</p>
                      <p className="text-gray-700">{office.postal}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alternative - For Candidates */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl lg:text-4xl font-black text-gray-900 mb-6">
            {language === 'sv' ? 'Söker Du Jobb?' : 'Looking for a Job?'}
          </h2>
          <p className="font-body text-lg text-gray-600 mb-8">
            {language === 'sv'
              ? 'Vi rekryterar kontinuerligt strategiska tänkare med hands-on mentalitet.'
              : 'We continuously recruit strategic thinkers with hands-on mentality.'}
          </p>
          <a
            href="/careers"
            className="inline-flex items-center text-primary-600 hover:text-accent-cyan font-bold text-lg group"
          >
            {language === 'sv' ? 'Se lediga roller' : 'View open positions'}
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
