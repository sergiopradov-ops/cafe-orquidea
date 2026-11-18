import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
  className?: string;
};

/** Encabezado de páginas internas (deja espacio para el header fijo). */
export function PageHero({ eyebrow, title, children, className }: Props) {
  return (
    <section className={cn("bg-arena pt-32 pb-14 sm:pt-40 sm:pb-20", className)}>
      <div className="container-page">
        <p className="eyebrow text-cafe">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-5xl leading-[1.05] sm:text-6xl">{title}</h1>
        {children ? (
          <div className="mt-6 max-w-2xl text-lg leading-relaxed text-tinta/80">{children}</div>
        ) : null}
      </div>
    </section>
  );
}
