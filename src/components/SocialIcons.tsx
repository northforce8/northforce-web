import React from 'react';
import { Linkedin, Youtube, Instagram, Facebook, MapPin } from 'lucide-react';

interface SocialLink {
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string }> | 'custom';
}

const socials: SocialLink[] = [
  { 
    name: 'LinkedIn', 
    url: 'https://www.linkedin.com/company/northforce-io/?viewAsMember=true', 
    icon: Linkedin 
  },
  {
    name: 'X (Twitter)', 
    url: 'https://x.com/NorthForce8', 
    icon: 'custom'
  },
  { 
    name: 'YouTube', 
    url: 'https://www.youtube.com/@NorthForce8', 
    icon: Youtube 
  },
  { 
    name: 'Instagram', 
    url: 'https://www.instagram.com/northforce8/', 
    icon: Instagram 
  },
  { 
    name: 'Facebook', 
    url: 'https://www.facebook.com/people/NorthForce/61568071591918/', 
    icon: Facebook 
  },
  { 
    name: 'Google Maps', 
    url: 'https://google.com/maps/place//data=!4m2!3m1!1s0x465f9d996097c3af:0x869eb37410135e7e?source=g.page.m.ia._', 
    icon: MapPin 
  },
];

interface SocialRowProps {
  className?: string;
  variant?: 'footer' | 'contact';
}

const SocialRow: React.FC<SocialRowProps> = ({ className = '', variant = 'contact' }) => {
  const isFooter = variant === 'footer';
  const isContact = variant === 'contact';
  
  return (
    <div className={`flex items-center ${isFooter ? 'justify-start gap-4' : 'justify-center gap-6 sm:gap-4'} ${className}`}>
      {socials.map(({ name, url, icon: Icon }) => (
        <a
          key={name}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`NorthForce on ${name}`}
          style={{pointerEvents: 'auto'}}
          className={`${name === 'X (Twitter)' ? 'text-gray-400 hover:text-white transition-colors' : ''} ${
            // Apply specific styling for X (Twitter) to ensure it matches the custom SVG
            // For other icons, apply the general styling based on variant
            // This ensures the X icon is rendered correctly without breaking other social icons.

            isFooter 
              ? 'text-accent-cyan hover:bg-gradient-to-r hover:from-primary-600 hover:to-accent-cyan hover:shadow-glow hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg p-2 transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center' 
              : isContact && className.includes('social-brand-colors')
                ? getBrandColorClass(name)
                : 'text-slate-500 hover:text-[#00A8E8] focus:text-[#00A8E8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A8E8] focus:ring-offset-2 rounded'
          }`}
        >
          {name === 'X (Twitter)' ? (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          ) : (
            <Icon className={`${
              isFooter 
                ? 'w-6 h-6' 
                : 'w-6 h-6 sm:w-5 sm:h-5'
            }`} aria-hidden="true" />
          )}
        </a>
      ))}
    </div>
  );
};

const getBrandColorClass = (platform: string): string => {
  switch (platform) {
    case 'LinkedIn':
      return 'text-[#0077B5] hover:text-[#005885] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0077B5] focus:ring-offset-2 rounded';
    case 'X (Twitter)':
      return 'text-[#000000] hover:text-[#333333] transition-colors focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-offset-2 rounded';
    case 'YouTube':
      return 'text-[#FF0000] hover:text-[#CC0000] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2 rounded';
    case 'Instagram':
      return 'text-[#E4405F] hover:text-[#C13584] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E4405F] focus:ring-offset-2 rounded';
    case 'Facebook':
      return 'text-[#1877F2] hover:text-[#166FE5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-2 rounded';
    case 'Google Maps':
      return 'text-[#4285F4] hover:text-[#3367D6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:ring-offset-2 rounded';
    default:
      return 'text-slate-500 hover:text-[#00A8E8] focus:text-[#00A8E8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A8E8] focus:ring-offset-2 rounded';
  }
};

export default SocialRow;