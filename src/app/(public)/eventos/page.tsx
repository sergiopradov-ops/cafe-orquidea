import type { Metadata } from "next";

import { LeadForm } from "@/components/booking/lead-form";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Catering para eventos",
  description: "Cotiza catering de brunch, coffee break y postres para tu evento.",
};

export default function EventosPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl">Catering para eventos</h1>
      <p className="mt-4 text-lg text-cafe/80">
        Texto provisional: paquetes, número mínimo de invitados y zona de
        cobertura.
      </p>
      <div className="mt-8 rounded-2xl border border-orquidea-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl">Solicita tu cotización</h2>
        <LeadForm type="catering" />
      </div>
      <p className="mt-6 text-sm">
        ¿Prefieres WhatsApp?{" "}
        <a
          href={whatsappLink("Hola, quiero cotizar catering para un evento.")}
          className="font-medium text-orquidea-700 underline"
        >
          Escríbenos aquí
        </a>
      </p>
    </section>
  );
}
