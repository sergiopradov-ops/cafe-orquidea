import { cn } from "@/lib/utils";

/** Wordmark manuscrito (aproximación tipográfica al logo de la marca). */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-script leading-none", className)}>Orquídea</span>
  );
}
