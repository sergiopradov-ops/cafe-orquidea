import type { Metadata } from "next";

import { LeadForm } from "@/components/booking/lead-form";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Foodtruck",
  description: "Reserva el foodtruck de Café Orquídea para tu evento.",
};

export default function FoodtruckPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl">Foodtruck</h1>
      <p className="mt-4 text-lg text-cafe/80">
        Texto provisional: qué incluye, capacidad por hora y zona de cobertura.
      </p>
      {/* Sprint 4: calendario de disponibilidad + holds con TTL */}
      <div className="mt-8 rounded-2xl border border-orquidea-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl">Solicita una fecha</h2>
        <LeadForm type="foodtruck" />
      </div>
      <p className="mt-6 text-sm">
        ¿Prefieres WhatsApp?{" "}
        <a
          href={whatsappLink("Hola, quiero reservar el foodtruck para un evento.")}
          className="font-medium text-orquidea-700 underline"
        >
          Escríbenos aquí
        </a>
      </p>
    </section>
  );
}
