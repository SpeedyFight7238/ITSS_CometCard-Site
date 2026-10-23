import React from 'react';

interface CometIconProps {
  className?: string;
  size?: number;
}

/**
 * Distinctive Comet Icon matching the UT Dallas reference:
 * A crisp white star with a curved orange tail and small green accents.
 * Scalable, clean, and legible at small and medium sizes.
 */
export const CometIcon: React.FC<CometIconProps> = ({ className = 'w-6 h-6', size }) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-hidden="true"
    >
      {/* Small green sparkle & trail accents */}
      <path
        d="M 16 5 C 11 8, 7 14, 3 21"
        stroke="#10B981"
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity="0.95"
      />
      <circle cx="6" cy="12" r="1.3" fill="#34D399" />
      <circle cx="11" cy="7.5" r="1" fill="#6EE7B7" />

      {/* Main curved orange tail */}
      <path
        d="M 22 9.5 C 15 11.5, 7.5 18, 3 28 C 11.5 24, 18 19, 23 11.5 Z"
        fill="#C75B12"
      />

      {/* Inner vibrant gold/orange flame core */}
      <path
        d="M 21.5 10 C 16 12.5, 10.5 17.5, 6 24.5 C 13 21, 18 17, 22.5 11 Z"
        fill="#E87500"
      />

      {/* Crisp white star head */}
      <polygon
        points="22.5,2.5 24.2,7.8 29.5,9.5 24.2,11.2 22.5,16.5 20.8,11.2 15.5,9.5 20.8,7.8"
        fill="#FFFFFF"
        stroke="#E87500"
        strokeWidth="0.5"
      />

      {/* Star center highlight */}
      <circle cx="22.5" cy="9.5" r="1.4" fill="#FFFBEB" />
    </svg>
  );
};
