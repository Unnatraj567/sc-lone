import React from 'react';

interface AshokaEmblemProps {
  className?: string;
  size?: number;
}

export const AshokaEmblem: React.FC<AshokaEmblemProps> = ({ className = "w-6 h-6", size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="National Emblem of India"
    >
      {/* Base Pedestal */}
      <rect x="10" y="39" width="28" height="4" rx="1.5" fill="currentColor" />
      <rect x="13" y="35.5" width="22" height="3.5" rx="1" fill="currentColor" opacity="0.9" />

      {/* Ashoka Chakra in Central Base */}
      <circle cx="24" cy="37.2" r="2.8" stroke="#ffffff" strokeWidth="0.8" fill="none" />
      <circle cx="24" cy="37.2" r="0.6" fill="#ffffff" />
      
      {/* Central Lion Profile */}
      <path
        d="M20 18C20 13.5 22 10 24 10C26 10 28 13.5 28 18C28 20 28.5 23 29 25C29.5 27 28 32 28 35.5H20C20 32 18.5 27 19 25C19.5 23 20 20 20 18Z"
        fill="currentColor"
      />
      {/* Central Lion Head & Crown */}
      <path
        d="M21.5 12C21.5 9 22.8 7 24 7C25.2 7 26.5 9 26.5 12C26.5 14 25.5 15.5 24 15.5C22.5 15.5 21.5 14 21.5 12Z"
        fill="currentColor"
      />
      {/* Left Lion Profile */}
      <path
        d="M19 16C17 14 14 14 13.5 17C13 20 15 23 16 26C17 29 18 33 19.5 35.5H22C21 32 20 27 19 25C18.5 23 18.5 20 19 16Z"
        fill="currentColor"
        opacity="0.85"
      />
      <circle cx="15.5" cy="16" r="2.5" fill="currentColor" opacity="0.9" />

      {/* Right Lion Profile */}
      <path
        d="M29 16C31 14 34 14 34.5 17C35 20 33 23 32 26C31 29 30 33 28.5 35.5H26C27 32 28 27 29 25C29.5 23 29.5 20 29 16Z"
        fill="currentColor"
        opacity="0.85"
      />
      <circle cx="32.5" cy="16" r="2.5" fill="currentColor" opacity="0.9" />

      {/* Stylized Mane Detail Lines */}
      <path d="M22 20H26M21 24H27M20.5 28H27.5M21 32H27" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
};
