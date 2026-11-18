import Link from "next/link";

import { Icon } from "@/components/brand/icons";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  link?: { href: string; label: string };
  className?: string;
};

export function SectionHeading({ title, link, className }: Props) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <h2 className="text-4xl sm:text-5xl">{title}</h2>
      {link ? (
        <Link href={link.href} className="group inline-flex items-center gap-2 text-sm font-medium">
          {link.label}
          <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      ) : null}
    </div>
  );
}
