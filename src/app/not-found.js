import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-brand-dark text-sm font-bold tracking-[.2em] uppercase">
        404 · Page not found
      </p>
      <h1 className="mt-3 text-4xl font-extrabold">This route isn’t available</h1>
      <p className="mt-4 text-slate-600">Explore our services or return home to plan your ride.</p>
      <Link
        href="/"
        className="bg-brand hover:bg-brand-dark mt-7 rounded-lg px-6 py-3 font-bold text-white"
      >
        Back to home
      </Link>
    </main>
  );
}
