import Link from "next/link";

import { cn } from "@/lib/utils";

const variants = {
  solid: "bg-salvia text-crema hover:bg-salvia-oscuro",
  light: "bg-crema text-tinta hover:bg-white",
  peach: "bg-durazno text-tinta hover:bg-durazno-claro",
  outline: "border border-tinta/40 text-tinta hover:bg-tinta/5",
  "outline-light": "border border-crema/70 text-crema hover:bg-crema/10",
} as const;

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
  external?: boolean;
};

export function ButtonLink({
  href,
  children,
  variant = "solid",
  className,
  external = false,
}: Props) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors",
    variants[variant],
    className,
  );

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
