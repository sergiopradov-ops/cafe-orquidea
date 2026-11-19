import { tagLabels, type ProductTag } from "@/lib/schemas/product";
import { cn } from "@/lib/utils";

export function ProductTags({ tags, className }: { tags: ProductTag[]; className?: string }) {
  if (tags.length === 0) return null;
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label="Características">
      {tags.map((t) => (
        <li
          key={t}
          className="rounded-full bg-salvia-claro/40 px-2.5 py-0.5 text-xs font-medium text-salvia-oscuro"
        >
          {tagLabels[t]}
        </li>
      ))}
    </ul>
  );
}
