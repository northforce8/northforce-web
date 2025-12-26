import React from 'react';
import { CheckCircle, TrendingUp, Shield, Zap, Users, Award, Target, LineChart, Clock, DollarSign, RefreshCw, Star, Sparkles, Brain, Scale, Heart, Briefcase, Globe, Lock, Rocket } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const BenefitsSection = () => {
  const { t } = useLanguage();

  const benefits = [
    { icon: <Shield className="h-6 w-6" />, color: 'text-accent-cyan', key: '1' },
    { icon: <Users className="h-6 w-6" />, color: 'text-accent-purple', key: '2' },
    { icon: <Zap className="h-6 w-6" />, color: 'text-accent-emerald', key: '3' },
    { icon: <TrendingUp className="h-6 w-6" />, color: 'text-accent-amber', key: '4' },
    { icon: <Target className="h-6 w-6" />, color: 'text-accent-rose', key: '5' },
    { icon: <Brain className="h-6 w-6" />, color: 'text-primary-600', key: '6' },
    { icon: <DollarSign className="h-6 w-6" />, color: 'text-accent-cyan', key: '7' },
    { icon: <Clock className="h-6 w-6" />, color: 'text-accent-purple', key: '8' },
    { icon: <RefreshCw className="h-6 w-6" />, color: 'text-accent-emerald', key: '9' },
    { icon: <Award className="h-6 w-6" />, color: 'text-accent-amber', key: '10' },
    { icon: <Scale className="h-6 w-6" />, color: 'text-accent-rose', key: '11' },
    { icon: <LineChart className="h-6 w-6" />, color: 'text-primary-600', key: '12' },
    { icon: <Heart className="h-6 w-6" />, color: 'text-accent-cyan', key: '13' },
    { icon: <Star className="h-6 w-6" />, color: 'text-accent-purple', key: '14' },
    { icon: <Sparkles className="h-6 w-6" />, color: 'text-accent-emerald', key: '15' },
    { icon: <Briefcase className="h-6 w-6" />, color: 'text-accent-amber', key: '16' },
    { icon: <Globe className="h-6 w-6" />, color: 'text-accent-rose', key: '17' },
    { icon: <Lock className="h-6 w-6" />, color: 'text-primary-600', key: '18' },
    { icon: <Rocket className="h-6 w-6" />, color: 'text-accent-cyan', key: '19' },
    { icon: <CheckCircle className="h-6 w-6" />, color: 'text-accent-emerald', key: '20' },
  ];

  return (
    <section className="py-24 section-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tight">
            {t('benefits.title')} <span className="text-brand-violet">{t('benefits.title_highlight')}</span>
          </h2>
          <p className="font-body text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
            {t('benefits.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit) => (
            <div key={benefit.key} className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 hover:shadow-card transition-all duration-300 hover:border-primary-600/40 group">
              <div className="flex items-start space-x-4">
                <div className={`${benefit.color} mt-1 flex-shrink-0 transform group-hover:scale-110 transition-transform`}>
                  {benefit.icon}
                </div>
                <p className="font-body text-gray-900 font-semibold leading-relaxed">
                  {t(`benefits.${benefit.key}`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
