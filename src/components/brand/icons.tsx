import type { SVGProps } from "react";

/**
 * Íconos de línea propios (estilo de las ilustraciones de la marca).
 * Trazo con currentColor para heredar el color del contenedor.
 */
const paths = {
  cup: (
    <>
      <path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z" />
      <path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16" />
      <path d="M8 3c0 1.5 1 1.5 1 3M12 3c0 1.5 1 1.5 1 3" />
      <path d="M3 21h15" />
    </>
  ),
  bread: (
    <>
      <path d="M4 11a8 5 0 0 1 16 0v1a2 2 0 0 1-2 2v5H6v-5a2 2 0 0 1-2-2v-1Z" />
      <path d="M9 9.5l1.5 2M13 9l1.5 2" />
    </>
  ),
  cake: (
    <>
      <path d="M4 20h16" />
      <path d="M5 20v-7h14v7" />
      <path d="M5 15c1.5 1 2.5 1 3.5 0s2.5-1 3.5 0 2.5 1 3.5 0 2.5-1 3.5 0" />
      <path d="M12 13V9" />
      <path d="M12 6.5c.8-.8.8-1.7 0-2.5-.8.8-.8 1.7 0 2.5Z" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19c0-8 6-14 15-14 0 9-6 15-14 15" />
      <path d="M5 19 14 10" />
    </>
  ),
  wheatOff: (
    <>
      <path d="M12 21V9" />
      <path d="M12 13c-2 0-3.5-1.5-3.5-3.5 2 0 3.5 1.5 3.5 3.5Zm0 0c2 0 3.5-1.5 3.5-3.5-2 0-3.5 1.5-3.5 3.5Z" />
      <path d="M12 9c-2 0-3.5-1.5-3.5-3.5 2 0 3.5 1.5 3.5 3.5Zm0 0c2 0 3.5-1.5 3.5-3.5-2 0-3.5 1.5-3.5 3.5Z" />
      <path d="M4 4l16 16" />
    </>
  ),
  iced: (
    <>
      <path d="M7 7h10l-1.5 13h-7L7 7Z" />
      <path d="M12 7l2-4h3" />
      <path d="M8 12h8" />
    </>
  ),
  truck: (
    <>
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="7" cy="17.5" r="1.5" />
      <circle cx="17" cy="17.5" r="1.5" />
    </>
  ),
  table: (
    <>
      <path d="M3 9h18" />
      <path d="M5 9v10M19 9v10" />
      <path d="M8 9V6.5a1.5 1.5 0 0 1 3 0V9M13 9V6.5a1.5 1.5 0 0 1 3 0V9" />
    </>
  ),
  people: (
    <>
      <circle cx="8" cy="8" r="3" />
      <circle cx="16.5" cy="9" r="2.5" />
      <path d="M2.5 19c.6-3.2 2.9-5 5.5-5s4.9 1.8 5.5 5" />
      <path d="M14 14.2c.8-.5 1.6-.7 2.5-.7 2.2 0 4 1.5 4.5 4.5" />
    </>
  ),
  runner: (
    <>
      <circle cx="14.5" cy="4.5" r="1.8" />
      <path d="M9 21l2.5-5 3 2.5V22" />
      <path d="M6 12l3-3.5 4 .5 2.5 3.5 3 1" />
      <path d="M13 9l-2 5" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
} as const;

export type IconName = keyof typeof paths;

type Props = SVGProps<SVGSVGElement> & { name: IconName; strokeWidth?: number };

export function Icon({ name, strokeWidth = 1.25, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
