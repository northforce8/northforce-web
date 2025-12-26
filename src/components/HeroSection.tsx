import React from 'react';
import { Link } from 'react-router-dom';

interface CtaButton {
  text: string;
  href: string;
  variant: 'primary' | 'secondary' | 'accent' | 'custom';
  icon?: React.ReactNode;
  customClasses?: string;
  onClick?: () => void;
}

interface HeroSectionProps {
  title: string;
  titleHighlight?: string;
  subtitle: string;
  icon?: React.ReactNode;
  backgroundVariant: 'homepage' | 'subpage';
  ctaButtons?: CtaButton[];
  extraContent?: React.ReactNode;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  titleHighlight,
  subtitle,
  icon,
  backgroundVariant,
  ctaButtons,
  extraContent,
}) => {
  const bgClass = backgroundVariant === 'homepage' ? 'bg-homepage-hero' : 'bg-subpage-hero';
  const h1Class = backgroundVariant === 'homepage' ? 'hero-h1--home text-sharp-white' : 'hero-h1--sub text-sharp-white';
  const subtitleClass = 'font-body text-sharp-white mt-4 md:mt-5 font-normal leading-relaxed hero-subtitle';

  return (
    <section className={`relative ${bgClass} py-20 lg:py-32 overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {icon && (
            <div className="flex items-center justify-center mb-6">
              {icon}
            </div>
          )}
          {extraContent && (
            <div className="flex items-center justify-center space-x-4 mb-8">
              {extraContent}
            </div>
          )}
          
          <h1 className={`${h1Class} mb-12 tracking-tight leading-none`}>
            {title} {titleHighlight && <span className="text-brand-accent">{titleHighlight}</span>}
          </h1>
          <p className={`${subtitleClass} mb-16`}>
            {subtitle}
          </p>
          
          {ctaButtons && ctaButtons.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center mt-8 md:mt-10 mb-12">
              {ctaButtons.map((button, index) => (
                <Link
                  key={index}
                  to={button.href}
                  className={`${
                    button.variant === 'primary'
                      ? 'bg-primary-800 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-soft hover:shadow-glow transition-all duration-300 transform hover:scale-105'
                      : button.variant === 'secondary'
                      ? 'bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-300'
                      : button.variant === 'accent'
                      ? 'bg-gradient-to-r from-primary-600 to-accent-cyan text-white px-8 py-4 rounded-2xl hover:shadow-glow transition-all duration-300 font-medium text-sm transform hover:scale-105'
                      : button.customClasses || '' // Custom variant, use customClasses if provided
                  } inline-flex items-center justify-center`}
                  onClick={button.onClick}
                >
                  {button.text}
                  {button.icon && <span className="ml-3 h-6 w-6">{button.icon}</span>}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;