import type { Metadata } from "next";

import { Icon } from "@/components/brand/icons";
import { PageHero } from "@/components/layout/page-hero";
import { WhatsAppCta } from "@/components/layout/whatsapp-cta";
import { ButtonLink } from "@/components/ui/button-link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Visítanos",
  description: `Orquídea, café de especialidad en ${siteConfig.address}. Horarios y cómo llegar.`,
};

export default function VisitanosPage() {
  return (
    <>
      <PageHero eyebrow="Visítanos" title="Te esperamos en la Condesa.">
        <p>Café de especialidad y repostería sin azúcar, keto y sin gluten.</p>
      </PageHero>

      <div className="container-page grid gap-6 py-16 md:grid-cols-3 lg:py-24">
        <div className="rounded-3xl bg-crema-claro p-8">
          <Icon name="pin" className="h-8 w-8 text-cafe" />
          <h2 className="mt-6 text-3xl">Dirección</h2>
          <p className="mt-3 text-lg">{siteConfig.address}</p>
          <div className="mt-6">
            <ButtonLink href={siteConfig.mapsUrl} variant="outline" external>
              Abrir en Google Maps
            </ButtonLink>
          </div>
        </div>

        <div className="rounded-3xl bg-crema-claro p-8">
          <Icon name="clock" className="h-8 w-8 text-cafe" />
          <h2 className="mt-6 text-3xl">Horario</h2>
          {siteConfig.hours.map((h) => (
            <p key={h.days} className="mt-3 text-lg">
              {h.days}
              <br />
              {h.time}
            </p>
          ))}
          <p className="mt-3 text-sm text-tinta/60">Fines de semana: por confirmar.</p>
        </div>

        <div className="rounded-3xl bg-salvia p-8 text-crema">
          <Icon name="people" className="h-8 w-8 text-durazno" />
          <h2 className="mt-6 text-3xl">Escríbenos</h2>
          <ul className="mt-3 space-y-2 text-lg">
            <li>
              <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                {siteConfig.instagramHandle}
              </a>
            </li>
            {siteConfig.email ? (
              <li>
                <a href={`mailto:${siteConfig.email}`} className="break-all underline underline-offset-4">
                  {siteConfig.email}
                </a>
              </li>
            ) : null}
            <li>
              <a href={siteConfig.phone.href} className="underline underline-offset-4">
                Tel. {siteConfig.phone.display}
              </a>
            </li>
          </ul>
          <WhatsAppCta message="Hola, tengo una pregunta." label="Escríbenos por WhatsApp" variant="button" />
        </div>
      </div>
    </>
  );
}
