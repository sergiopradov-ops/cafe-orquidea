import { whatsappLink } from "@/lib/site";

type Props = {
  message: string;
  label: string;
  /** "inline": línea secundaria bajo un formulario. "button": CTA principal. */
  variant?: "inline" | "button";
};

/** No renderiza nada si no hay número de WhatsApp configurado. */
export function WhatsAppCta({ message, label, variant = "inline" }: Props) {
  const href = whatsappLink(message);
  if (!href) return null;

  if (variant === "button") {
    return (
      <a
        href={href}
        className="mt-8 inline-block rounded-full bg-crema px-6 py-3 text-sm font-medium text-tinta transition-colors hover:bg-durazno-claro"
      >
        {label}
      </a>
    );
  }

  return (
    <p className="mt-6 text-sm">
      ¿Prefieres WhatsApp?{" "}
      <a href={href} className="font-medium text-salvia underline underline-offset-4">
        {label}
      </a>
    </p>
  );
}
