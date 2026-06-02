// icons.tsx — line icons used across the site (construction/services/UI)
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export const Icon = {
  cctv: (props: IconProps) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {/* ceiling/wall mount + arm */}
      <path d="M34 10h10M39 10v4M39 14l-6 3" />
      {/* camera body (angled) */}
      <path d="M6 20l27-6 2.4 9.6-27 6z" />
      {/* sunshade ridge */}
      <path d="M14 16.5l18-4" />
      {/* lens */}
      <circle cx="11.5" cy="21.5" r="2.6" />
    </svg>
  ),
  av: (props: IconProps) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {/* display screen */}
      <rect x="6" y="8" width="36" height="24" rx="2" />
      {/* play glyph */}
      <path d="M20 15l9 5-9 5z" />
      {/* stand */}
      <path d="M24 32v6M16 40h16" />
    </svg>
  ),
  building: (props: IconProps) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 42h36" />
      <path d="M10 42V14l14-6 14 6v28" />
      <path d="M16 42V22M24 42V22M32 42V22" />
      <path d="M14 18h20M14 28h20M14 36h20" />
    </svg>
  ),
  precast: (props: IconProps) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 14h40v8H4zM4 26h40v8H4z" />
      <path d="M8 22v4M16 22v4M24 22v4M32 22v4M40 22v4" />
      <path d="M12 14v-4h24v4" />
      <path d="M12 38v4h24v-4" />
    </svg>
  ),
  roads: (props: IconProps) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 4l-6 40M36 4l6 40" />
      <path d="M24 6v4M24 16v4M24 26v4M24 36v4" />
      <path d="M8 44h32" />
    </svg>
  ),
  mep: (props: IconProps) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 4l-12 22h10l-2 18 14-24h-10l4-16z" />
      <circle cx="36" cy="14" r="3" />
      <path d="M8 36c3 0 3 4 6 4M30 38c3 0 3 4 6 4" />
    </svg>
  ),
  civil: (props: IconProps) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 42h40" />
      <path d="M8 42V20l16-12 16 12v22" />
      <path d="M16 42V28h16v14" />
      <path d="M24 28v14" />
      <circle cx="24" cy="22" r="2" />
    </svg>
  ),
  fabrication: (props: IconProps) => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 32l8-8 6 6 12-12 14 14" />
      <path d="M4 40h40" />
      <circle cx="34" cy="10" r="2" />
      <path d="M30 14l-8 8M38 14l4 4" />
    </svg>
  ),
  arrow: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  arrowUpRight: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 17L17 7M8 7h9v9" />
    </svg>
  ),
  pin: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  mail: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),
  phone: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 3h4l2 5-3 2c1 3 4 6 7 7l2-3 5 2v4a2 2 0 0 1-2 2C10.2 22 2 13.8 2 5a2 2 0 0 1 2-2z" />
    </svg>
  ),
  clock: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  globe: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
    </svg>
  ),
  whatsapp: (props: IconProps) => (
    <svg viewBox="0 0 32 32" fill="currentColor" {...props}>
      <path d="M16 3C9.4 3 4 8.4 4 15c0 2.4.7 4.7 2 6.7L4 29l7.5-2c1.9 1 4.1 1.6 6.5 1.6 6.6 0 12-5.4 12-12S22.6 3 16 3zm6.6 17c-.3.8-1.6 1.5-2.2 1.6-.6.1-1.4.1-2.2-.1-.5-.2-1.2-.4-2-.8-3.5-1.5-5.8-5-6-5.2-.2-.3-1.4-1.9-1.4-3.6 0-1.7.9-2.5 1.2-2.9.3-.3.7-.4.9-.4h.7c.2 0 .5 0 .8.6.3.7 1 2.4 1.1 2.5.1.2.1.4 0 .6-.1.2-.2.4-.3.5-.2.2-.4.4-.5.6-.2.2-.4.4-.2.7.2.3 1 1.6 2.1 2.5 1.4 1.2 2.6 1.6 2.9 1.7.3.1.5.1.7-.1l.9-1c.3-.3.5-.3.8-.2.3.1 2 .9 2.3 1.1.3.2.6.3.7.4.1.2 0 1-.4 1.6z" />
    </svg>
  ),
  download: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 4v12M6 12l6 6 6-6M4 20h16" />
    </svg>
  ),
  check: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 12l5 5L20 6" />
    </svg>
  ),
} as const;

export type IconName = keyof typeof Icon;

// MaMark — Masar Emaar monogram (ME inside diamond)
export function MaMark({ size = 22, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 2L30 16 16 30 2 16 16 2z" />
      <path d="M9 21V11l4 6 3-4 3 4 4-6v10" stroke={color} strokeWidth="1.6" />
    </svg>
  );
}
