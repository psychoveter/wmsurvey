import React from "react";

function IconBase({ children, className = "h-5 w-5 text-white" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const BrainIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M9 3a3 3 0 0 0-3 3v1.2A3.8 3.8 0 0 0 3 11a3.8 3.8 0 0 0 2 3.34V16a3 3 0 0 0 3 3h1" />
    <path d="M15 3a3 3 0 0 1 3 3v1.2A3.8 3.8 0 0 1 21 11a3.8 3.8 0 0 1-2 3.34V16a3 3 0 0 1-3 3h-1" />
    <path d="M12 3v18" />
    <path d="M9 8h3" />
    <path d="M12 16H8.5" />
    <path d="M15 8h-3" />
    <path d="M12 12h4" />
  </IconBase>
);

export const NetworkIcon = ({ className }) => (
  <IconBase className={className}>
    <circle cx="12" cy="5" r="2.5" />
    <circle cx="5" cy="18" r="2.5" />
    <circle cx="19" cy="18" r="2.5" />
    <path d="M10.5 6.9 6.7 15.2" />
    <path d="M13.5 6.9 17.3 15.2" />
    <path d="M7.5 18h9" />
  </IconBase>
);

export const BoxesIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="m12 2 7 4-7 4-7-4 7-4Z" />
    <path d="M5 10l7 4 7-4" />
    <path d="M5 14l7 4 7-4" />
  </IconBase>
);

export const GitBranchIcon = ({ className }) => (
  <IconBase className={className}>
    <circle cx="6" cy="5" r="2" />
    <circle cx="18" cy="5" r="2" />
    <circle cx="18" cy="19" r="2" />
    <path d="M8 5h6" />
    <path d="M18 7v10" />
    <path d="M6 7v7c0 2 2 4 4 4h6" />
  </IconBase>
);

export const FilmIcon = ({ className }) => (
  <IconBase className={className}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M7 5v14" />
    <path d="M17 5v14" />
    <path d="M3 9h4" />
    <path d="M17 9h4" />
    <path d="M3 15h4" />
    <path d="M17 15h4" />
  </IconBase>
);

export const GamepadIcon = ({ className }) => (
  <IconBase className={className}>
    <rect x="3" y="9" width="18" height="8" rx="4" />
    <path d="M8 13H6" />
    <path d="M7 12v2" />
    <circle cx="16.5" cy="12.5" r="0.8" />
    <circle cx="18.5" cy="14.5" r="0.8" />
  </IconBase>
);

export const GaugeIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M4 14a8 8 0 1 1 16 0" />
    <path d="M12 14l4-4" />
    <path d="M12 14v1" />
  </IconBase>
);

export const SigmaIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M17 5H8l6 7-6 7h9" />
  </IconBase>
);

export const SearchIcon = ({ className }) => (
  <IconBase className={className}>
    <circle cx="11" cy="11" r="6" />
    <path d="m20 20-4.2-4.2" />
  </IconBase>
);

export const LayersIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 12 9 5 9-5" />
    <path d="m3 16 9 5 9-5" />
  </IconBase>
);

export const AtomIcon = ({ className }) => (
  <IconBase className={className}>
    <circle cx="12" cy="12" r="1.8" />
    <ellipse cx="12" cy="12" rx="8" ry="3.8" />
    <ellipse cx="12" cy="12" rx="3.8" ry="8" transform="rotate(30 12 12)" />
    <ellipse cx="12" cy="12" rx="3.8" ry="8" transform="rotate(-30 12 12)" />
  </IconBase>
);

export const UsersIcon = ({ className }) => (
  <IconBase className={className}>
    <circle cx="9" cy="8" r="2.5" />
    <circle cx="17" cy="9" r="2" />
    <path d="M4.5 18a4.5 4.5 0 0 1 9 0" />
    <path d="M14 18a3.5 3.5 0 0 1 7 0" />
  </IconBase>
);

export const MemoryIcon = ({ className }) => (
  <IconBase className={className}>
    <rect x="6" y="6" width="12" height="12" rx="2" />
    <path d="M9 3v3" />
    <path d="M12 3v3" />
    <path d="M15 3v3" />
    <path d="M9 18v3" />
    <path d="M12 18v3" />
    <path d="M15 18v3" />
    <path d="M3 9h3" />
    <path d="M3 12h3" />
    <path d="M3 15h3" />
    <path d="M18 9h3" />
    <path d="M18 12h3" />
    <path d="M18 15h3" />
  </IconBase>
);

export const WorkflowIcon = ({ className }) => (
  <IconBase className={className}>
    <rect x="3" y="4" width="6" height="4" rx="1" />
    <rect x="15" y="4" width="6" height="4" rx="1" />
    <rect x="9" y="16" width="6" height="4" rx="1" />
    <path d="M9 6h6" />
    <path d="M12 8v8" />
  </IconBase>
);

export const ExternalLinkIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M14 5h5v5" />
    <path d="M10 14 19 5" />
    <path d="M19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" />
  </IconBase>
);

export const FilterIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M4 6h16" />
    <path d="M7 12h10" />
    <path d="M10 18h4" />
  </IconBase>
);

export const TargetIcon = ({ className }) => (
  <IconBase className={className}>
    <circle cx="12" cy="12" r="7" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
  </IconBase>
);

export const SparklesIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
    <path d="M5 16l.8 2.2L8 19l-2.2.8L5 22l-.8-2.2L2 19l2.2-.8L5 16Z" />
    <path d="M19 14l.7 1.8L21.5 16l-1.8.7L19 18.5l-.7-1.8L16.5 16l1.8-.2L19 14Z" />
  </IconBase>
);

export const RouteIcon = ({ className }) => (
  <IconBase className={className}>
    <circle cx="6" cy="18" r="2" />
    <circle cx="18" cy="6" r="2" />
    <path d="M8 18h3a5 5 0 0 0 5-5V8" />
    <path d="M11 8h5" />
  </IconBase>
);

export const BookIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5Z" />
    <path d="M4 21a2 2 0 0 1 2-2h12" />
  </IconBase>
);
