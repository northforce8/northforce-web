import React, { useState } from 'react';
import { Shield, Eye, Cookie } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const LegalPage = () => {
  const [activeTab, setActiveTab] = useState('terms');

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": {
      "en": "Legal Information",
      "sv": "Juridisk information"
    },
    "description": {
      "en": "Terms of Service, Privacy Policy, and Cookie Policy for NorthForce services",
      "sv": "Användarvillkor, integritetspolicy och cookie-policy för NorthForce-tjänster"
    },
    "mainEntity": {
      "@type": "Organization",
      "name": "NorthForce"
    }
  };

  const tabs = [
    { id: 'terms', label: 'Terms of Service', icon: <Shield className="h-5 w-5" /> },
    { id: 'privacy', label: 'Privacy Policy', icon: <Eye className="h-5 w-5" /> },
    { id: 'cookies', label: 'Cookie Policy', icon: <Cookie className="h-5 w-5" /> }
  ];

  return (
    <div className="bg-white">
      <SEOHead
        title="Legal Information"
        titleSv="Juridisk information"
        description="Terms of Service, Privacy Policy, and Cookie Policy for NorthForce services"
        descriptionSv="Användarvillkor, integritetspolicy och cookie-policy för NorthForce-tjänster"
        keywords="terms of service, privacy policy, cookie policy, legal information, GDPR compliance"
        keywordsSv="användarvillkor, integritetspolicy, cookie-policy, juridisk information, GDPR-efterlevnad"
        canonicalUrl="https://northforce.io/legal"
        structuredData={structuredData}
        breadcrumbs={[{ name: "Home", url: "https://northforce.io/" }, { name: "Legal", url: "https://northforce.io/legal" }]}
      />
      
      {/* Hero Section - This page has a unique hero, so not using HeroSection component directly */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20"> {/* Unique background */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-heading text-6xl lg:text-8xl font-black text-gray-900 mb-12 tracking-tight leading-none">Legal Information</h1>
            <p className="font-body text-2xl lg:text-3xl text-gray-700 mb-16 max-w-4xl mx-auto font-medium leading-relaxed">
              Transparency in all our policies and procedures. Clear terms, honest privacy practices, and straightforward cookie usage.
            </p>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-8 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 py-5 px-2 border-b-2 font-bold text-lg ${ // Tab button styling
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'terms' && (
            <div className="prose prose-lg max-w-none">
              <h2 className="font-heading text-5xl font-black text-gray-900 mb-10 tracking-tight">Terms of Service</h2>
              <p className="font-body text-gray-700 text-xl font-medium mb-10">
                <strong>Last updated:</strong> December 15, 2024
              </p>

              <div className="space-y-8">
                <section>
                  <h3 className="font-heading text-2xl font-black text-gray-900 mb-6">1. Agreement to Terms</h3>
                  <p className="font-body text-gray-800 text-lg font-medium leading-relaxed">
                    By accessing and using NorthForce services, you accept and agree to be bound by the terms 
                    and provision of this agreement. These Terms of Service constitute the entire agreement 
                    between NorthForce and you regarding the use of our services.
                  </p>
                </section>

                <section>
                  <h3 className="font-heading text-2xl font-black text-gray-900 mb-6">2. Services Description</h3>
                  <p className="font-body text-gray-800 text-lg font-medium leading-relaxed mb-6">
                    NorthForce provides business automation, AI solutions, and system integration services including:
                  </p>
                  <ul className="list-disc list-inside text-gray-800 text-lg font-medium space-y-3">
                    <li>Custom business automation systems</li>
                    <li>AI assistant development and deployment</li>
                    <li>CRM and contact management solutions</li>
                    <li>Website and funnel optimization</li>
                    <li>System integration and workflow automation</li>
                    <li>Consulting and strategic guidance</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">3. Service Agreement</h3>
                  <p className="text-gray-700">
                    Specific services, deliverables, timelines, and pricing are defined in individual 
                    service agreements or statements of work. These terms supplement and govern all 
                    such agreements.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">4. Payment Terms</h3>
                  <div className="text-gray-700 space-y-3">
                    <p>Payment terms vary by service package:</p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Core systems: Payment due upon project completion</li>
                      <li>System solutions: 50% deposit, 50% on completion</li>
                      <li>Custom development: Payment schedule defined in project agreement</li>
                      <li>All invoices are due within 30 days of receipt</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">5. Intellectual Property</h3>
                  <p className="text-gray-700">
                    Upon full payment, clients own the systems and customizations created specifically 
                    for them. NorthForce retains ownership of proprietary methodologies, frameworks, 
                    and general knowledge gained through service delivery.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">6. Confidentiality</h3>
                  <p className="text-gray-700">
                    We maintain strict confidentiality of all client information and business data. 
                    Client information is never shared with third parties without explicit consent, 
                    except as required by law.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">7. Warranties and Disclaimers</h3>
                  <p className="text-gray-700">
                    We warrant that services will be performed in a professional manner consistent 
                    with industry standards. However, specific business results cannot be guaranteed 
                    as they depend on many factors beyond our control.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h3>
                  <p className="text-gray-700">
                    NorthForce's liability for any claim related to services provided shall not exceed 
                    the total amount paid by the client for the specific services giving rise to the claim.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">9. Contact Information</h3>
                  <p className="text-gray-700">
                    For questions about these terms, please contact us at legal@northforce.com or 
                    through our contact page.
                  </p>
                </section>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="prose prose-lg max-w-none">
             <h2 className="font-heading text-5xl font-black text-gray-900 mb-10 tracking-tight">Privacy Policy</h2>
             <p className="font-body text-gray-700 text-xl font-medium mb-10">
                <strong>Last updated:</strong> December 15, 2024
              </p>

              <div className="space-y-8">
                <section>
                 <h3 className="font-heading text-2xl font-black text-gray-900 mb-6">1. Information We Collect</h3>
                 <div className="font-body text-gray-800 text-lg font-medium space-y-4">
                   <p className="font-bold">Information you provide:</p>
                   <ul className="list-disc list-inside space-y-3">
                      <li>Contact information (name, email, phone number)</li>
                      <li>Company information and industry details</li>
                      <li>Project requirements and business challenges</li>
                      <li>Communication preferences</li>
                    </ul>
                    
                   <p className="font-bold">Information we collect automatically:</p>
                   <ul className="list-disc list-inside space-y-3">
                      <li>Website usage data and analytics</li>
                      <li>Device and browser information</li>
                      <li>IP address and location data</li>
                      <li>Cookies and similar technologies</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h3>
                  <div className="text-gray-700">
                    <p className="mb-3">We use collected information for:</p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Providing and improving our services</li>
                      <li>Responding to inquiries and support requests</li>
                      <li>Sending relevant business communications</li>
                      <li>Analyzing website performance and user experience</li>
                      <li>Complying with legal obligations</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">3. Information Sharing</h3>
                  <p className="text-gray-700">
                    We do not sell, trade, or rent your personal information to third parties. 
                    We may share information only in these circumstances:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                    <li>With your explicit consent</li>
                    <li>To comply with legal requirements</li>
                    <li>With trusted service providers bound by confidentiality agreements</li>
                    <li>To protect our rights and safety</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">4. Data Security</h3>
                  <p className="text-gray-700">
                    We implement appropriate technical and organizational measures to protect your 
                    personal information against unauthorized access, alteration, disclosure, or destruction. 
                    This includes encryption, secure data transmission, and regular security assessments.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">5. Data Retention</h3>
                  <p className="text-gray-700">
                    We retain personal information for as long as necessary to provide services and 
                    fulfill the purposes outlined in this policy, unless a longer retention period 
                    is required by law.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">6. Your Rights</h3>
                  <div className="text-gray-700">
                    <p className="mb-3">You have the right to:</p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Access your personal information</li>
                      <li>Correct inaccurate information</li>
                      <li>Request deletion of your information</li>
                      <li>Object to processing of your information</li>
                      <li>Withdraw consent for data processing</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">7. International Transfers</h3>
                  <p className="text-gray-700">
                    Your information may be processed in countries other than your country of residence. 
                    We ensure appropriate safeguards are in place for international data transfers.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">8. Contact Us</h3>
                  <p className="text-gray-700">
                    For privacy-related questions or to exercise your rights, contact us at 
                    privacy@northforce.com or through our contact page.
                  </p>
                </section>
              </div>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="prose prose-lg max-w-none">
             <h2 className="font-heading text-5xl font-black text-gray-900 mb-10 tracking-tight">Cookie Policy</h2>
             <p className="font-body text-gray-700 text-xl font-medium mb-10">
                <strong>Last updated:</strong> December 15, 2024
              </p>

              <div className="space-y-8">
                <section>
                 <h3 className="font-heading text-2xl font-black text-gray-900 mb-6">1. What Are Cookies</h3>
                 <p className="font-body text-gray-800 text-lg font-medium leading-relaxed">
                    Cookies are small text files that are stored on your device when you visit our website. 
                    They help us provide you with a better experience by remembering your preferences and 
                    analyzing how you use our site.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">2. Types of Cookies We Use</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Essential Cookies</h4>
                      <p className="text-gray-700">
                        These cookies are necessary for the website to function properly. They enable 
                        basic functions like page navigation and access to secure areas.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Analytics Cookies</h4>
                      <p className="text-gray-700">
                        We use Google Analytics to understand how visitors interact with our website. 
                        This helps us improve our content and user experience.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Functional Cookies</h4>
                      <p className="text-gray-700">
                        These cookies remember your preferences and choices to provide enhanced features 
                        and personalized content.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">3. Third-Party Cookies</h3>
                  <p className="text-gray-700">
                    We may use third-party services that place cookies on your device:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                    <li><strong>Google Analytics:</strong> For website analytics and performance measurement</li>
                    <li><strong>Google Fonts:</strong> For web font delivery</li>
                    <li><strong>Calendly:</strong> For appointment scheduling functionality</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">4. Managing Cookies</h3>
                  <div className="text-gray-700 space-y-3">
                    <p>You can control cookies in several ways:</p>
                    
                    <div className="font-body text-gray-800 text-lg font-medium">
                      <h4 className="font-semibold mb-2">Browser Settings</h4>
                      <p className="mb-2">Most browsers allow you to:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>View and delete cookies</li>
                        <li>Block all cookies</li>
                        <li>Block third-party cookies</li>
                        <li>Clear cookies when you close the browser</li>
                      </ul>
                    </div>
                    
                    <div className="font-body text-gray-800 text-lg font-medium">
                      <h4 className="font-semibold mb-2">Opt-Out Links</h4>
                      <p>You can opt out of specific services:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:underline">Google Analytics Opt-out</a></li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">5. Impact of Disabling Cookies</h3>
                  <p className="text-gray-700">
                    Disabling cookies may affect website functionality. Essential cookies are required 
                    for basic operation, while other cookies enhance your experience but are not strictly necessary.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">6. Cookie Consent</h3>
                  <p className="text-gray-700">
                    By continuing to use our website, you consent to our use of cookies as described 
                    in this policy. We may ask for explicit consent for certain types of cookies where required by law.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">7. Updates to This Policy</h3>
                  <p className="text-gray-700">
                    We may update this cookie policy from time to time. Any changes will be posted 
                    on this page with an updated effective date.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">8. Contact Us</h3>
                  <p className="text-gray-700">
                    If you have questions about our use of cookies, please contact us at 
                    privacy@northforce.com or through our contact page.
                  </p>
                </section>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LegalPage;