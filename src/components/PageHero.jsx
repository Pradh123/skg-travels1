import Link from "next/link";

export default function PageHero({ title, eyebrow = "SKG Travels", description, parent }) {
  return (
    <section className="from-ink relative overflow-hidden bg-gradient-to-br via-cyan-900 to-emerald-800 px-4 py-14 text-white sm:py-20">
      <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full border-[55px] border-white/5" />
      <div className="absolute -bottom-24 left-[10%] h-64 w-64 rounded-full bg-lime-400/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl text-center">
        <p className="text-xs font-bold tracking-[.25em] text-lime-300 uppercase">{eyebrow}</p>
        <h1 className="mx-auto mt-3 max-w-4xl text-3xl leading-tight font-extrabold sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:text-lg">
            {description}
          </p>
        )}
        <nav
          aria-label="Breadcrumb"
          className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm"
        >
          <Link href="/" className="hover:text-lime-300">
            Home
          </Link>
          {parent && (
            <>
              <span>/</span>
              <Link href={parent.href} className="hover:text-lime-300">
                {parent.label}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-lime-300" aria-current="page">
            {title}
          </span>
        </nav>
      </div>
    </section>
  );
}
