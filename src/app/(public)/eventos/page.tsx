import type { Metadata } from "next";

import { Icon, type IconName } from "@/components/brand/icons";
import { LeadForm } from "@/components/booking/lead-form";
import { PageHero } from "@/components/layout/page-hero";
import { WhatsAppCta } from "@/components/layout/whatsapp-cta";

export const metadata: Metadata = {
  title: "Catering para eventos",
  description:
    "Desayunos, coffee breaks y mesas de postres sin azúcar, keto y sin gluten para tus eventos en CDMX.",
};

const offer: Array<{ title: string; text: string; icon: IconName }> = [
  { title: "Desayunos y brunch", text: "Café de especialidad y repostería para empezar el día.", icon: "table" },
  { title: "Coffee break", text: "Para juntas, capacitaciones y eventos de oficina.", icon: "cup" },
  { title: "Mesa de postres", text: "Sin azúcar, keto y sin gluten, para que todos coman.", icon: "cake" },
];

export default function EventosPage() {
  return (
    <>
      <PageHero eyebrow="Catering" title="Llevamos Orquídea a tu evento.">
        <p>
          Cuéntanos qué celebras, cuántas personas y dónde. Te respondemos con una
          propuesta y la cotización por escrito.
        </p>
      </PageHero>

      <div className="container-page grid gap-14 py-16 lg:grid-cols-[1fr_1.2fr] lg:py-24">
        <div>
          <h2 className="text-4xl">Qué podemos llevar</h2>
          <ul className="mt-8 space-y-8">
            {offer.map((o) => (
              <li key={o.title} className="flex gap-5">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-durazno-claro text-cafe">
                  <Icon name={o.icon} className="h-7 w-7" />
                </span>
                <div>
                  <h3 className="text-2xl">{o.title}</h3>
                  <p className="mt-1 text-tinta/75">{o.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm text-tinta/70">
            Paquetes, número mínimo de invitados y zona de cobertura: por confirmar
            con Orquídea.
          </p>
        </div>

        <div className="rounded-3xl bg-crema-claro p-6 shadow-[0_1px_0_rgba(43,42,36,0.06)] sm:p-10">
          <h2 className="text-3xl">Solicita tu cotización</h2>
          <p className="mt-2 mb-8 text-sm text-tinta/70">Te respondemos en menos de 24 horas hábiles.</p>
          <LeadForm type="catering" />
          <WhatsAppCta message="Hola, quiero cotizar catering para un evento." label="Escríbenos aquí" />
        </div>
      </div>
    </>
  );
}
