export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display text-lg font-bold ${className}`}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle cx="12" cy="12" r="9.2" stroke="currentColor" strokeWidth="1.6" />
        {/* La ligne de latitude — accent Corail */}
        <path d="M2.8 12h18.4" stroke="#FF6B5B" strokeWidth="1.8" strokeLinecap="round" />
        {/* Méridiens discrets */}
        <path
          d="M5.4 7.4c3.2 2 10 2 13.2 0M5.4 16.6c3.2-2 10-2 13.2 0"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.45"
        />
      </svg>
      Latitude
    </span>
  );
}
