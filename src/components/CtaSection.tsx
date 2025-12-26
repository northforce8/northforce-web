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

interface CtaSectionProps {
  title: string;
  titleHighlight?: string;
  subtitle: string;
  ctaButtons?: CtaButton[];
  extraContent?: React.ReactNode;
  backgroundClass?: string; // Custom class for background, e.g., 'hero-gradient'
  titleClass?: string;
  subtitleClass?: string;
}

const CtaSection: React.FC<CtaSectionProps> = ({
  title,
  titleHighlight,
  subtitle,
  ctaButtons,
  extraContent,
  backgroundClass = 'hero-gradient',
  titleClass = 'font-heading text-5xl lg:text-7xl font-black mb-8 tracking-tight leading-tight',
  subtitleClass = 'font-body text-2xl lg:text-3xl text-white max-w-4xl mx-auto mb-16 font-medium leading-relaxed',
}) => {
  return (
    <section className={`py-32 ${backgroundClass} text-white relative overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className={titleClass}>
          {title} {titleHighlight && <span className="text-brand-emerald">{titleHighlight}</span>}
        </h2>
        <p className={subtitleClass}>
          {subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {ctaButtons && ctaButtons.map((button, index) => (
            <Link
              key={index}
              to={button.href}
              className={`${
                button.variant === 'primary'
                  ? 'btn-primary'
                  : button.variant === 'secondary'
                  ? 'btn-secondary'
                  : button.variant === 'accent'
                  ? 'bg-gradient-to-r from-primary-600 to-accent-cyan text-white px-10 py-5 rounded-2xl font-black text-xl shadow-card hover:shadow-glow transition-all duration-300 transform hover:scale-105'
                  : button.customClasses || '' // Custom variant, use customClasses if provided
              } inline-flex items-center justify-center`}
              onClick={button.onClick}
            >
              {button.text}
              {button.icon && <span className="ml-3 h-6 w-6">{button.icon}</span>}
            </Link>
          ))}
        </div>
        
        {extraContent && (
          <div className="mt-8">
            {extraContent}
          </div>
        )}
      </div>
    </section>
  );
};

export default CtaSection;