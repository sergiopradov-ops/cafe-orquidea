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
        className="mt-8 inline-block rounded-full bg-orquidea-700 px-6 py-3 font-medium text-white hover:bg-orquidea-900"
      >
        {label}
      </a>
    );
  }

  return (
    <p className="mt-6 text-sm">
      ¿Prefieres WhatsApp?{" "}
      <a href={href} className="font-medium text-orquidea-700 underline">
        {label}
      </a>
    </p>
  );
}
