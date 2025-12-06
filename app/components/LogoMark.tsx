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
        <linearGradient id="lampGradient" x1="10" y1="8" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8C52FF" />
          <stop offset="0.5" stopColor="#C49BFF" />
          <stop offset="1" stopColor="#F7C552" />
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
        d="M10 34c0 4.2 3.5 6.5 7.2 7.4 5.3 1.4 11.7 1.6 17.6 1.6 9.6 0 17.8-2 17.8-7.5 0-2.7-1.9-4.9-5.1-6.3-1.3-.6-1.7-2.2-.8-3.3 1.4-1.7 1.9-3.3 1.9-4.6C48.6 19 42 15 32.6 15c-7.9 0-13.8 3.2-16.6 7.9C13.6 24 12 25.2 12 27c0 1.4.9 2.6 2.3 3.1-2.9 1-4.3 2.4-4.3 3.9Z"
        fill="url(#lampGradient)"
        filter="url(#glow)"
        opacity="0.95"
      />
      <path
        d="M45.5 27.4c3.2 1.8 6.5 2.4 8.5 2.5.8 0 1.3.9.8 1.6-1.8 2.6-5.1 4.6-9.9 3.8"
        stroke="#F7C552"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M21 44c0 2.9 4.2 5.2 9.4 5.2S39.8 47 39.8 44"
        stroke="url(#lampGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M28 20c0 2.2 3.4 4 7.6 4s7.6-1.8 7.6-4"
        stroke="#F7E6C4"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="20" cy="20" r="2" fill="#C49BFF" opacity="0.8" />
      <circle cx="44" cy="17" r="2.6" fill="#F7C552" opacity="0.9" />
      <circle cx="32" cy="12.5" r="1.8" fill="#8C52FF" opacity="0.7" />
    </svg>
  );
}

