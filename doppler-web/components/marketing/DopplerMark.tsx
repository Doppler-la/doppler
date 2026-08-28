export default function DopplerMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none" aria-hidden>
      <defs>
        <linearGradient id="doppler-mark-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366F1" />
          <stop offset="1" stopColor="#A855F7" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="256" r="20" fill="url(#doppler-mark-grad)" />
      <path d="M 200 178 A 78 78 0 0 1 200 334" stroke="url(#doppler-mark-grad)" strokeWidth="20" strokeLinecap="round" />
      <path d="M 200 124 A 132 132 0 0 1 200 388" stroke="url(#doppler-mark-grad)" strokeWidth="15" strokeLinecap="round" opacity="0.7" />
      <path d="M 200 70 A 186 186 0 0 1 200 442" stroke="url(#doppler-mark-grad)" strokeWidth="11" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}
