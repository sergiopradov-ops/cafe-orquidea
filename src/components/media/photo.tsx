import Image from "next/image";

import { Icon, type IconName } from "@/components/brand/icons";
import type { MediaItem } from "@/content/media";
import { cn } from "@/lib/utils";

const tones = {
  salvia: "bg-salvia text-salvia-claro",
  durazno: "bg-durazno-claro text-cafe/50",
  arena: "bg-arena text-cafe/40",
  crema: "bg-crema-claro text-cafe/40",
} as const;

type Props = {
  item: MediaItem;
  icon: IconName;
  tone?: keyof typeof tones;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/**
 * Foto real si existe; si no, un panel ilustrado con la paleta de la marca.
 * El contenedor debe tener posición y tamaño (se usa `fill`).
 */
export function Photo({
  item,
  icon,
  tone = "arena",
  className,
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: Props) {
  if (item.src) {
    const contain = item.fit === "contain";
    return (
      <Image
        src={item.src}
        alt={item.alt}
        fill
        priority={priority}
        sizes={sizes}
        style={item.position ? { objectPosition: item.position } : undefined}
        className={cn(contain ? "bg-white object-contain" : "object-cover", className)}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={item.alt}
      className={cn(
        "absolute inset-0 flex items-center justify-center overflow-hidden",
        tones[tone],
        className,
      )}
    >
      <Icon name={icon} strokeWidth={0.6} className="h-2/5 max-h-64 w-auto opacity-70" />
      <Icon
        name="leaf"
        strokeWidth={0.5}
        className="absolute -right-8 -bottom-8 h-48 w-48 rotate-12 opacity-30"
      />
    </div>
  );
}
