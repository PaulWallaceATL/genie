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
        <linearGradient id="lampGradient" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5DD8FF" />
          <stop offset="0.5" stopColor="#A78BFA" />
          <stop offset="1" stopColor="#F8D477" />
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
        d="M52 26c0 10.493-12.088 19-27 19-4.99 0-9.71-.884-13.695-2.447C9.305 42.358 8 40.28 8 38.012c0-2.537 1.551-4.803 3.909-5.728C11.704 30.621 14.431 29 17.5 29c1.964 0 3.725.685 5.098 1.788C29.062 26.441 34.8 22 42 22c4.694 0 8.645 1.344 10 4Z"
        fill="url(#lampGradient)"
        filter="url(#glow)"
        opacity="0.95"
      />
      <path
        d="M22 47c0 2.762 3.581 5 8 5s8-2.238 8-5"
        stroke="url(#lampGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M46 19c2 1.333 3 3 3 5 0 3.995-4.277 7.103-10.133 8.098"
        stroke="#C8D7FF"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
      <circle cx="46" cy="15" r="3" fill="#F8D477" opacity="0.9" />
      <circle cx="17" cy="18" r="2" fill="#5DD8FF" opacity="0.7" />
      <circle cx="28" cy="12" r="1.6" fill="#A78BFA" opacity="0.6" />
    </svg>
  );
}

