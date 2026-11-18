import Link from "next/link";

const units = [
  {
    href: "/panaderia",
    title: "Panadería",
    text: "Pan artesanal de masa madre, horneado todos los días.",
  },
  {
    href: "/eventos",
    title: "Catering",
    text: "Brunch, coffee break y mesas de postres para tus eventos.",
  },
  {
    href: "/foodtruck",
    title: "Foodtruck",
    text: "Llevamos el café y el pan a tu evento, oficina o festival.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <p className="text-sm tracking-widest text-orquidea-700 uppercase">
          Café · Pan · Eventos
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl sm:text-6xl">
          Pan artesanal y café para tus días y tus eventos
        </h1>
        <p className="mt-5 max-w-xl text-lg text-cafe/80">
          Texto provisional: aquí va la propuesta de valor de Café Orquídea.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/panaderia"
            className="rounded-full bg-orquidea-700 px-6 py-3 font-medium text-white hover:bg-orquidea-900"
          >
            Ver el menú
          </Link>
          <Link
            href="/eventos"
            className="rounded-full border border-orquidea-700 px-6 py-3 font-medium text-orquidea-700 hover:bg-orquidea-50"
          >
            Cotiza tu evento
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-20 sm:grid-cols-3">
        {units.map((u) => (
          <Link
            key={u.href}
            href={u.href}
            className="rounded-2xl border border-orquidea-100 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h2 className="text-2xl">{u.title}</h2>
            <p className="mt-2 text-cafe/80">{u.text}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
