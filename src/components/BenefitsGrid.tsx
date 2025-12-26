import React, { useState } from 'react';
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const BenefitsGrid = () => {
  const { t } = useLanguage();
  const [expandedBenefit, setExpandedBenefit] = useState<number | null>(null);

  const benefits = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: t(`benefits.${i + 1}.title`),
    desc: t(`benefits.${i + 1}.desc`),
  }));

  const toggleBenefit = (id: number) => {
    setExpandedBenefit(expandedBenefit === id ? null : id);
  };

  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="font-heading text-4xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            {t('benefits.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-cyan">
              {t('benefits.title_highlight')}
            </span>
          </h2>
          <p className="font-body text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {t('benefits.subtitle')}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className={`group relative bg-gradient-to-br from-gray-50 to-white border rounded-3xl p-8 transition-all duration-500 cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:ring-offset-2 ${
                expandedBenefit === benefit.id
                  ? 'border-accent-cyan shadow-2xl scale-[1.01]'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-xl'
              }`}
              onClick={() => toggleBenefit(benefit.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleBenefit(benefit.id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-expanded={expandedBenefit === benefit.id}
              aria-label={`${benefit.title}. ${expandedBenefit === benefit.id ? t('benefits.show_less') : t('benefits.read_more')}`}
            >
              {/* Subtle Background Accent */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent-cyan/5 to-primary-600/5 rounded-full blur-3xl transition-opacity duration-500 ${
                expandedBenefit === benefit.id ? 'opacity-100' : 'opacity-0'
              }`}></div>

              <div className="relative">
                {/* Number Badge */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-accent-cyan rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="font-heading text-white font-black text-xl">{benefit.id}</span>
                    </div>
                    <CheckCircle className={`h-6 w-6 transition-all duration-300 ${
                      expandedBenefit === benefit.id ? 'text-accent-cyan scale-110' : 'text-gray-300'
                    }`} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-heading text-xl font-black text-gray-900 mb-4 leading-tight">
                  {benefit.title}
                </h3>

                {/* Description - Expandable */}
                <div className={`overflow-hidden transition-all duration-500 ${
                  expandedBenefit === benefit.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <p className="font-body text-base text-gray-700 leading-relaxed mb-4">
                    {benefit.desc}
                  </p>
                </div>

                {/* Expand Button */}
                <button className={`flex items-center text-sm font-bold transition-all duration-300 mt-2 ${
                  expandedBenefit === benefit.id
                    ? 'text-accent-cyan'
                    : 'text-primary-600 hover:text-accent-cyan'
                }`}>
                  {expandedBenefit === benefit.id ? (
                    <>
                      <span>{t('benefits.show_less')}</span>
                      <ChevronUp className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    <>
                      <span>{t('benefits.read_more')}</span>
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="font-body text-lg text-gray-700 mb-8">
            {t('benefits.subtitle')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default BenefitsGrid;
