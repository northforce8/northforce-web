import React from 'react';
import { X, Check, AlertTriangle, Users, TrendingUp, Target, Shield, Zap, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const BeforeAfterSection = () => {
  const { t } = useLanguage();

  const beforeItems = [
    { icon: <AlertTriangle className="h-6 w-6" />, text: t('before_after.before_1') },
    { icon: <Users className="h-6 w-6" />, text: t('before_after.before_2') },
    { icon: <X className="h-6 w-6" />, text: t('before_after.before_3') },
    { icon: <Clock className="h-6 w-6" />, text: t('before_after.before_4') },
    { icon: <Target className="h-6 w-6" />, text: t('before_after.before_5') },
    { icon: <AlertTriangle className="h-6 w-6" />, text: t('before_after.before_6') },
  ];

  const afterItems = [
    { icon: <Check className="h-6 w-6" />, text: t('before_after.after_1') },
    { icon: <Shield className="h-6 w-6" />, text: t('before_after.after_2') },
    { icon: <TrendingUp className="h-6 w-6" />, text: t('before_after.after_3') },
    { icon: <Zap className="h-6 w-6" />, text: t('before_after.after_4') },
    { icon: <Target className="h-6 w-6" />, text: t('before_after.after_5') },
    { icon: <Check className="h-6 w-6" />, text: t('before_after.after_6') },
  ];

  return (
    <section className="py-24 section-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-5xl lg:text-7xl font-black mb-8 tracking-tight">
            {t('before_after.before')} <span className="text-accent-cyan">vs</span> {t('before_after.after')}
          </h2>
          <p className="font-body text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed">
            {t('before_after.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Before */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="inline-block bg-accent-rose/20 rounded-full px-6 py-3 mb-4">
                <span className="font-heading text-2xl font-black text-accent-rose">{t('before_after.before')}</span>
              </div>
            </div>
            <div className="space-y-4">
              {beforeItems.map((item, index) => (
                <div key={index} className="flex items-start space-x-4 text-white/80">
                  <div className="text-accent-rose mt-1 flex-shrink-0">
                    {item.icon}
                  </div>
                  <p className="font-body leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* After */}
          <div className="bg-gradient-to-br from-accent-emerald/20 to-accent-cyan/20 backdrop-blur-sm border border-accent-emerald/30 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="inline-block bg-accent-emerald/30 rounded-full px-6 py-3 mb-4">
                <span className="font-heading text-2xl font-black text-accent-emerald">{t('before_after.after')}</span>
              </div>
            </div>
            <div className="space-y-4">
              {afterItems.map((item, index) => (
                <div key={index} className="flex items-start space-x-4 text-white">
                  <div className="text-accent-emerald mt-1 flex-shrink-0">
                    {item.icon}
                  </div>
                  <p className="font-body font-semibold leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;
