import React, { useState, useRef, useEffect } from 'react';
import { Info, X } from 'lucide-react';

interface InfoIconProps {
  content: string | React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
}

const InfoIcon: React.FC<InfoIconProps> = ({ content, title, size = 'sm' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('bottom');
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);

      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        if (spaceBelow < 250 && spaceAbove > spaceBelow) {
          setPosition('top');
        } else {
          setPosition('bottom');
        }
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen]);

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="inline-flex items-center justify-center text-gray-400 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 rounded-full transition-colors"
        aria-label={title || 'More information'}
        aria-expanded={isOpen}
      >
        <Info className={sizeClasses[size]} />
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          className={`absolute z-50 ${
            position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          } left-1/2 transform -translate-x-1/2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-4`}
          role="tooltip"
        >
          <div className="flex items-start justify-between mb-2">
            {title && (
              <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="ml-auto text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="text-sm text-gray-600 leading-relaxed">
            {typeof content === 'string' ? <p>{content}</p> : content}
          </div>
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border ${
              position === 'top'
                ? 'top-full -mt-[7px] border-b border-r border-t-0 border-l-0'
                : 'bottom-full -mb-[7px] border-t border-l border-b-0 border-r-0'
            } border-gray-200 rotate-45`}
          />
        </div>
      )}
    </div>
  );
};

export default InfoIcon;
