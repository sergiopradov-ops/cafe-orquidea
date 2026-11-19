import type { Metadata } from "next";

import { Icon } from "@/components/brand/icons";
import { LeadForm } from "@/components/booking/lead-form";
import { PageHero } from "@/components/layout/page-hero";
import { WhatsAppCta } from "@/components/layout/whatsapp-cta";
import { cakeFlavorLabels, cakeSizeLabels } from "@/lib/schemas/lead";

export const metadata: Metadata = {
  title: "Pasteles por pedido",
  description:
    "Cotiza tu pastel sin gluten y sin azúcar: de 5 a 20 personas, en vainilla, cacao, zanahoria o plátano.",
};

export default function PastelesPage() {
  return (
    <>
      <PageHero eyebrow="Pasteles" title="Tu pastel, por pedido.">
        <p>
          Sin gluten y sin azúcar, hecho para tu fecha. Elige tamaño y sabor,
          cuéntanos si hay alergias y cómo lo imaginas. Te mandamos la
          cotización. Pídelo con al menos 48 horas de anticipación.
        </p>
      </PageHero>

      <div className="container-page grid gap-14 py-16 lg:grid-cols-[1fr_1.2fr] lg:py-24">
        <div>
          <h2 className="text-4xl">Cómo lo hacemos</h2>
          <ul className="mt-8 space-y-8">
            <li className="flex gap-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-durazno-claro text-cafe">
                <Icon name="cake" className="h-7 w-7" />
              </span>
              <div>
                <h3 className="text-2xl">Tamaños</h3>
                <p className="mt-1 text-tinta/75">
                  {Object.values(cakeSizeLabels).join(" · ")}
                </p>
              </div>
            </li>
            <li className="flex gap-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-durazno-claro text-cafe">
                <Icon name="bread" className="h-7 w-7" />
              </span>
              <div>
                <h3 className="text-2xl">Sabores</h3>
                <p className="mt-1 text-tinta/75">
                  {Object.values(cakeFlavorLabels).join(" · ")}
                </p>
              </div>
            </li>
            <li className="flex gap-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-durazno-claro text-cafe">
                <Icon name="wheatOff" className="h-7 w-7" />
              </span>
              <div>
                <h3 className="text-2xl">Sin gluten y sin azúcar</h3>
                <p className="mt-1 text-tinta/75">
                  Harina de almendra y fruto del monje. Si hay alguna alergia,
                  dínoslo en el formulario.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="rounded-3xl bg-crema-claro p-6 shadow-[0_1px_0_rgba(43,42,36,0.06)] sm:p-10">
          <h2 className="text-3xl">Cotiza tu pastel</h2>
          <p className="mt-2 mb-8 text-sm text-tinta/70">Te respondemos en menos de 24 horas hábiles.</p>
          <LeadForm type="pastel" />
          <WhatsAppCta message="Hola, quiero cotizar un pastel." label="Escríbenos aquí" />
        </div>
      </div>
    </>
  );
}
