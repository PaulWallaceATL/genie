type LogoMarkProps = {
  size?: number;
  className?: string;
};

export function LogoMark({ size = 28, className }: LogoMarkProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="lampGradient" x1="6" y1="10" x2="58" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F7C552" />
          <stop offset="0.4" stopColor="#4FA3FF" />
          <stop offset="1" stopColor="#1B3760" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M9 35.2c0 3.8 3.5 6.7 8.4 8 5.6 1.4 12.2 1.6 17.8 1.6 10.4 0 18.8-2.6 18.8-8 0-2.6-1.9-5-5.1-6.6-1.3-.6-1.6-2.2-.7-3.2 1.8-2 2.6-4.3 2.6-6.6C50.8 14.8 42 10 31 10c-9 0-15.7 4-18.8 10-2.4.5-4.2 2.2-4.2 4.4 0 1.7 1 3.2 2.8 4-3.5 1.2-5.8 3.4-5.8 6.8Z"
        fill="url(#lampGradient)"
        filter="url(#glow)"
        opacity="0.98"
      />
      <path
        d="M47 26.8c3.8 1.7 7.9 2.3 10.8 2.4 1 0 1.6 1.1 1 2-2 2.7-5.4 4.7-10.5 4"
        stroke="#F7D785"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M23 44.8c0 3.3 4.6 5.8 10.2 5.8S43.4 48 43.4 44.8"
        stroke="url(#lampGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M32 16.8c0 2.8 4 5 8.6 5s8.6-2.2 8.6-5"
        stroke="#F9EFD2"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M39 15c3 1.4 4.6 4.3 4.6 6.8 0 3.2-1.6 5.8-4.6 7.6"
        stroke="#D7A8FF"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.9"
      />
      <circle cx="19.5" cy="22" r="2.2" fill="#C49BFF" opacity="0.85" />
      <circle cx="45.5" cy="18.5" r="2.6" fill="#F7C552" opacity="0.9" />
      <circle cx="30" cy="12.5" r="1.9" fill="#5C2BBA" opacity="0.75" />
    </svg>
  );
}

