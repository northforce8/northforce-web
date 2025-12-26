import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ObjectionsSection = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const objections = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <section className="py-24 section-accent">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
            {t('objections.title')} <span className="text-brand-emerald">{t('objections.title_highlight')}</span>
          </h2>
          <p className="font-body text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
            {t('objections.subtitle')}
          </p>
        </div>

        <div className="space-y-4">
          {objections.map((num) => (
            <div
              key={num}
              className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl overflow-hidden hover:shadow-card transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === num ? null : num)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setOpenIndex(openIndex === num ? null : num);
                  }
                }}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:ring-offset-2"
                aria-expanded={openIndex === num}
                aria-controls={`objection-${num}`}
                id={`objection-trigger-${num}`}
              >
                <div className="flex items-start space-x-4 flex-1">
                  <MessageCircle className="h-6 w-6 text-accent-cyan mt-1 flex-shrink-0" />
                  <span className="font-heading text-xl font-bold text-gray-900">
                    {t(`objections.${num}.q`)}
                  </span>
                </div>
                {openIndex === num ? (
                  <ChevronUp className="h-6 w-6 text-gray-600 flex-shrink-0 ml-4" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-gray-600 flex-shrink-0 ml-4" />
                )}
              </button>

              {openIndex === num && (
                <div className="px-8 pb-6 pt-2" id={`objection-${num}`} role="region" aria-labelledby={`objection-trigger-${num}`}>
                  <div className="pl-10 border-l-4 border-accent-emerald ml-3">
                    <p className="font-body text-gray-700 leading-relaxed pl-6">
                      {t(`objections.${num}.a`)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ObjectionsSection;
