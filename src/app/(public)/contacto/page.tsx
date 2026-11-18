import type { Metadata } from "next";

import { siteConfig, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Ubicación, horarios y contacto de Café Orquídea.",
};

export default function ContactoPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl">Contacto</h1>
      <dl className="mt-6 grid gap-4 text-lg">
        <div>
          <dt className="font-semibold">Dirección</dt>
          <dd className="text-cafe/80">Pendiente (dato del cliente)</dd>
        </div>
        <div>
          <dt className="font-semibold">Horario</dt>
          <dd className="text-cafe/80">Pendiente (dato del cliente)</dd>
        </div>
        {siteConfig.email ? (
          <div>
            <dt className="font-semibold">Correo</dt>
            <dd>
              <a href={`mailto:${siteConfig.email}`} className="underline">
                {siteConfig.email}
              </a>
            </dd>
          </div>
        ) : null}
      </dl>
      <a
        href={whatsappLink("Hola, tengo una pregunta.")}
        className="mt-8 inline-block rounded-full bg-orquidea-700 px-6 py-3 font-medium text-white hover:bg-orquidea-900"
      >
        Escríbenos por WhatsApp
      </a>
    </section>
  );
}
