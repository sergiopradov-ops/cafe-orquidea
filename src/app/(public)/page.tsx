import Link from "next/link";

import { Icon, type IconName } from "@/components/brand/icons";
import { SectionHeading } from "@/components/layout/section-heading";
import { Photo } from "@/components/media/photo";
import { ProductCard } from "@/components/shop/product-card";
import { ButtonLink } from "@/components/ui/button-link";
import { media } from "@/content/media";
import { siteConfig } from "@/lib/site";
import { listFeaturedProducts } from "@/server/modules/catalog/catalog.service";

const cravings: Array<{ label: string; icon: IconName; href: string }> = [
  { label: "Bebidas de café", icon: "cup", href: "/panaderia#bebidas-cafe" },
  { label: "Bebidas sin café", icon: "leaf", href: "/panaderia#bebidas-sin-cafe" },
  { label: "Smoothies", icon: "iced", href: "/panaderia#smoothies" },
  { label: "Alimentos", icon: "table", href: "/panaderia#alimentos" },
  { label: "Panadería", icon: "bread", href: "/panaderia#panaderia" },
  { label: "Pasteles", icon: "cake", href: "/panaderia#pasteles" },
];

const eventServices: Array<{ title: string; text: string; icon: IconName }> = [
  {
    title: "Desayunos y brunch",
    text: "Café de especialidad y repostería sin azúcar para empezar el día con tu gente.",
    icon: "table",
  },
  {
    title: "Coffee break",
    text: "Para juntas, capacitaciones y eventos de oficina. Llegamos, servimos y recogemos.",
    icon: "cup",
  },
  {
    title: "Celebraciones",
    text: "Cumpleaños, baby showers y reuniones familiares con mesa de postres.",
    icon: "cake",
  },
  {
    title: "Foodtruck",
    text: "Llevamos la barra de café a tu evento, festival o carrera.",
    icon: "truck",
  },
];

const steps = [
  {
    n: "01",
    title: "Nos cuentas",
    text: "Qué celebras, cuántas personas, dónde y cuándo. Con el formulario o por mensaje.",
  },
  {
    n: "02",
    title: "Te cotizamos",
    text: "Te proponemos menú y servicio, y te mandamos la cotización por escrito.",
  },
  {
    n: "03",
    title: "Llegamos y servimos",
    text: "El día del evento llegamos antes, montamos y servimos como lo platicamos.",
  },
  {
    n: "04",
    title: "Nos lo llevamos",
    text: "Al terminar recogemos todo. Tú solo disfrutas la sobremesa.",
  },
];

export default async function HomePage() {
  const favorites = (await listFeaturedProducts()).slice(0, 4);

  return (
    <>
      {/* Portada */}
      <section className="relative flex min-h-[92svh] items-end overflow-hidden bg-salvia text-crema">
        <Photo
          item={media.hero}
          icon="cup"
          tone="salvia"
          priority
          sizes="100vw"
          className="md:justify-end md:pr-[10%]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-salvia-oscuro/90 via-salvia-oscuro/30 to-transparent" />
        <div className="relative container-page pt-32 pb-14 sm:pb-20">
          <p className="eyebrow text-crema/80">Café de especialidad · Condesa, CDMX</p>
          <h1 className="mt-5 max-w-3xl text-5xl leading-[1.05] sm:text-7xl">
            Magia y paz
            <br />
            en cada sorbo.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-crema/85">
            Repostería sin azúcar, keto y sin gluten, café de especialidad y una
            mesa para quedarse un rato.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/panaderia" variant="light">
              Ver el menú
            </ButtonLink>
            <ButtonLink href="/eventos" variant="outline-light">
              Cotiza tu evento
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Antojos */}
      <section className="container-page py-20">
        <SectionHeading title="Busca tu antojo" link={{ href: "/panaderia", label: "Ver el menú" }} />
        <ul className="mt-10 grid grid-cols-3 gap-6 sm:grid-cols-6">
          {cravings.map((c) => (
            <li key={c.label}>
              <Link href={c.href} className="group flex flex-col items-center gap-3 text-center">
                <span className="flex aspect-square w-full max-w-32 items-center justify-center rounded-full bg-crema-claro text-cafe shadow-[inset_0_0_0_1px_rgba(91,70,54,0.08)] transition-colors group-hover:bg-durazno-claro">
                  <Icon name={c.icon} className="h-1/2 w-1/2" />
                </span>
                <span className="text-sm">{c.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Tres formas */}
      <section className="container-page pb-24">
        <h2 className="text-4xl sm:text-5xl">Tres formas de vivir Orquídea.</h2>
        <div className="mt-10 grid gap-4 lg:grid-cols-2 lg:grid-rows-2">
          <ExperienceCard
            href="/contacto"
            title="El café"
            text={`Ven a ${siteConfig.address}. Café de especialidad y repostería para quedarte o para llevar.`}
            cta="Cómo llegar"
            image={media.cafe}
            icon="cup"
            tone="durazno"
            className="min-h-[420px] lg:row-span-2 lg:min-h-[640px]"
          />
          <ExperienceCard
            href="/eventos"
            title="Catering"
            text="Desayunos, coffee breaks y mesas de postres para tus eventos."
            cta="Cotiza tu evento"
            image={media.catering}
            icon="table"
            tone="arena"
            className="min-h-[300px]"
          />
          <ExperienceCard
            href="/foodtruck"
            title="Foodtruck"
            text="La barra de café sobre ruedas, para tu evento o festival."
            cta="Aparta una fecha"
            image={media.foodtruck}
            icon="truck"
            tone="salvia"
            className="min-h-[300px]"
          />
        </div>
      </section>

      {/* Manifiesto */}
      <section className="bg-arena py-24 text-center">
        <div className="container-page max-w-4xl">
          <h2 className="text-4xl sm:text-5xl">Café de especialidad, sin azúcar y sin gluten.</h2>
          <p className="mx-auto mt-8 max-w-3xl text-xl leading-relaxed text-tinta/80 sm:text-2xl">
            Para los que cuidan lo que comen y no quieren renunciar al pan de la
            tarde. Keto, sin gluten y sin azúcar, con el mismo cuidado que ponemos
            en cada taza.
          </p>
          <ul className="mt-10 flex flex-wrap justify-center gap-3">
            {siteConfig.highlights.map((h) => (
              <li key={h} className="rounded-full border border-cafe/25 px-4 py-2 text-sm">
                {h}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Eventos */}
      <section className="bg-salvia py-24 text-crema">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="max-w-xl text-4xl sm:text-5xl">Orquídea en tus eventos</h2>
            <ButtonLink href="/eventos" variant="light">
              Cuéntanos tu evento
            </ButtonLink>
          </div>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-crema/15 sm:grid-cols-2 lg:grid-cols-4">
            {eventServices.map((s) => (
              <li key={s.title} className="bg-salvia p-8">
                <Icon name={s.icon} className="h-10 w-10 text-durazno" />
                <h3 className="mt-6 text-2xl">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-crema/75">{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Definición */}
      <section className="container-page py-24">
        <div className="mx-auto max-w-3xl">
          <p className="font-display text-6xl sm:text-7xl">Sobremesa</p>
          <p className="mt-2 font-display text-xl text-cafe italic">sustantivo</p>
          <p className="mt-6 text-2xl leading-relaxed text-tinta/85 sm:text-3xl">
            El tiempo que te quedas en la mesa después de comer, platicando. En
            Orquídea no tiene prisa.
          </p>
        </div>
      </section>

      {/* Favoritos */}
      <section className="container-page pb-24">
        <SectionHeading title="Los favoritos" link={{ href: "/panaderia", label: "Ver todo el menú" }} />
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {favorites.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Cómo trabajamos */}
      <section className="bg-crema-claro py-24">
        <div className="container-page">
          <h2 className="text-4xl sm:text-5xl">Cómo funciona el catering</h2>
          <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <li key={s.n} className="border-t border-cafe/20 pt-6">
                <p className="font-display text-5xl text-cafe/50">{s.n}</p>
                <h3 className="mt-4 text-2xl">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-tinta/75">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12">
            <ButtonLink href="/eventos">Cuéntanos tu evento</ButtonLink>
          </div>
        </div>
      </section>

      {/* Comunidad */}
      <section className="container-page grid items-center gap-10 py-24 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Photo item={media.comunidad} icon="runner" tone="durazno" />
        </div>
        <div>
          <p className="eyebrow text-cafe">Comunidad</p>
          <h2 className="mt-4 text-4xl sm:text-5xl">Club de corredores y algo más.</h2>
          <p className="mt-6 text-lg leading-relaxed text-tinta/80">
            Orquídea también es punto de encuentro: salidas a correr, talleres y
            eventos de la comunidad. Las fechas las publicamos en Instagram.
          </p>
          <div className="mt-8">
            <ButtonLink href={siteConfig.instagram} variant="outline" external>
              Síguenos en {siteConfig.instagramHandle}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Visítanos */}
      <section className="bg-durazno-claro py-20">
        <div className="container-page grid gap-10 md:grid-cols-[1.2fr_1fr_1fr] md:items-center">
          <h2 className="text-4xl sm:text-5xl">Te esperamos en la Condesa.</h2>
          <div className="flex gap-4">
            <Icon name="pin" className="mt-1 h-6 w-6 shrink-0 text-cafe" />
            <div>
              <p className="font-medium">{siteConfig.address}</p>
              <a href={siteConfig.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline underline-offset-4">
                Abrir en Google Maps
              </a>
            </div>
          </div>
          <div className="flex gap-4">
            <Icon name="clock" className="mt-1 h-6 w-6 shrink-0 text-cafe" />
            <div>
              {siteConfig.hours.map((h) => (
                <p key={h.days}>
                  <span className="font-medium">{h.days}</span>
                  <br />
                  {h.time}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

type ExperienceCardProps = {
  href: string;
  title: string;
  text: string;
  cta: string;
  image: (typeof media)[keyof typeof media];
  icon: IconName;
  tone: "salvia" | "durazno" | "arena";
  className?: string;
};

function ExperienceCard({ href, title, text, cta, image, icon, tone, className }: ExperienceCardProps) {
  return (
    <Link
      href={href}
      className={`group relative flex items-end overflow-hidden rounded-2xl text-crema ${className ?? ""}`}
    >
      <Photo item={image} icon={icon} tone={tone} className="transition-transform duration-700 group-hover:scale-[1.03]" />
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-tinta/75 via-tinta/10 to-transparent" />
      <div className="relative p-8">
        <h3 className="text-4xl">{title}</h3>
        <p className="mt-2 max-w-sm text-sm text-crema/85">{text}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium">
          {cta}
          <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
