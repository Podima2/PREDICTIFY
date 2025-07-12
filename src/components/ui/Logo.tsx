import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'white' | 'red' | 'gradient';
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', variant = 'white' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const getLogoColors = () => {
    switch (variant) {
      case 'red':
        return {
          main: '#dc2626',
          accent: '#ef4444',
          opacity: '0.9'
        };
      case 'gradient':
        return {
          main: 'url(#logoGradient)',
          accent: '#ef4444',
          opacity: '1'
        };
      case 'white':
      default:
        return {
          main: '#ffffff',
          accent: '#ffffff',
          opacity: '0.8'
        };
    }
  };

  const colors = getLogoColors();

  return (
    <svg 
      className={`${sizeClasses[size]} ${className}`} 
      viewBox="0 0 24 24" 
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gradient definition for gradient variant */}
      {variant === 'gradient' && (
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#f87171" />
          </linearGradient>
        </defs>
      )}
      
      {/* Crystal ball / prediction orb design */}
      <circle 
        cx="12" 
        cy="12" 
        r="9" 
        fill="none"
        stroke={colors.main}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      
      {/* Inner prediction symbol - lightning bolt */}
      <path 
        d="M13 2 L4.5 12.5 L10 12.5 L11 22 L19.5 11.5 L14 11.5 Z" 
        fill={colors.main}
        stroke={colors.main}
        strokeWidth="0.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        transform="scale(0.6) translate(4.8, 4.8)"
      />
      
      {/* Accent dots for modern touch */}
      <circle cx="8" cy="8" r="0.8" fill={colors.accent} opacity={colors.opacity} />
      <circle cx="16" cy="8" r="0.8" fill={colors.accent} opacity={colors.opacity} />
      <circle cx="12" cy="16" r="0.8" fill={colors.accent} opacity={colors.opacity} />
    </svg>
  );
};