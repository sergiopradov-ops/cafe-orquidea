import type { Metadata } from "next";

import { LeadForm } from "@/components/booking/lead-form";
import { PageHero } from "@/components/layout/page-hero";
import { WhatsAppCta } from "@/components/layout/whatsapp-cta";
import { Photo } from "@/components/media/photo";
import { media } from "@/content/media";

export const metadata: Metadata = {
  title: "Foodtruck",
  description: "Aparta el foodtruck de café Orquídea para tu evento, festival o carrera.",
};

export default function FoodtruckPage() {
  return (
    <>
      <PageHero eyebrow="Foodtruck" title="La barra de café, sobre ruedas.">
        <p>
          Café de especialidad y repostería sin azúcar en tu evento, festival,
          oficina o carrera. Aparta tu fecha y te confirmamos disponibilidad.
        </p>
      </PageHero>

      <div className="container-page grid gap-14 py-16 lg:grid-cols-2 lg:py-24">
        <div className="relative min-h-[360px] overflow-hidden rounded-3xl lg:min-h-full">
          <Photo item={media.foodtruck} icon="truck" tone="salvia" />
        </div>

        <div className="rounded-3xl bg-crema-claro p-6 sm:p-10">
          <h2 className="text-3xl">Solicita una fecha</h2>
          <p className="mt-2 mb-8 text-sm text-tinta/70">
            Capacidad por hora y zona de cobertura: por confirmar con Orquídea.
          </p>
          <LeadForm type="foodtruck" />
          <WhatsAppCta message="Hola, quiero reservar el foodtruck para un evento." label="Escríbenos aquí" />
        </div>
      </div>
    </>
  );
}
