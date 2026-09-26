export default function SectionCard({ heading, paragraphs, index = 0 }) {
  if (!paragraphs?.length) return null;
  return (
    <article
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 ${index % 2 ? "lg:translate-y-5" : ""}`}
    >
      <span className="bg-brand mb-5 block h-1 w-12 rounded-full" />
      <h2 className="text-ink text-xl font-extrabold sm:text-2xl">{heading}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
        {paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
