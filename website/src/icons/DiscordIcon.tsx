import { component$, type HTMLAttributes } from '@builder.io/qwik';

export const DiscordIcon = component$<HTMLAttributes<SVGSVGElement>>(
  (props) => (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="Discord icon"
      fill="currentColor"
      {...props}
    >
      <path d="M39.97 9.52a38.04 38.04 0 0 0-9.5-2.92 26.07 26.07 0 0 0-1.21 2.47 35.34 35.34 0 0 0-10.53 0A26.18 26.18 0 0 0 17.5 6.6 38.31 38.31 0 0 0 8 9.53a38.34 38.34 0 0 0-6.8 26.09 38.25 38.25 0 0 0 11.64 5.84 28.11 28.11 0 0 0 2.5-4.02 24.75 24.75 0 0 1-3.94-1.87l.96-.72a27.34 27.34 0 0 0 23.27 0c.32.25.64.5.97.72a24.85 24.85 0 0 1-3.94 1.88 27.86 27.86 0 0 0 2.5 4.01 38.08 38.08 0 0 0 11.64-5.84 38.32 38.32 0 0 0-6.83-26.1ZM16.36 30.37a4.4 4.4 0 0 1-4.14-4.6 4.37 4.37 0 0 1 4.13-4.6 4.36 4.36 0 0 1 4.15 4.6 4.4 4.4 0 0 1-4.14 4.6Zm15.28 0a4.4 4.4 0 0 1-4.14-4.6 4.37 4.37 0 0 1 4.14-4.6 4.34 4.34 0 0 1 4.13 4.6 4.4 4.4 0 0 1-4.13 4.6Z" />
    </svg>
  )
);