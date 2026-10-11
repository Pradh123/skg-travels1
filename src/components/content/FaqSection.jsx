import FaqItem from "./FaqItem";

export default function FaqSection({ items = [] }) {
  if (!items.length) return null;
  return (
    <section
      className="mx-auto w-full max-w-[1100px] px-4 pb-10 sm:px-6"
      aria-label="Frequently Asked Questions"
    >
      <div className="py-5 sm:py-8">
        <h2 className="mb-6 text-center text-xl leading-tight font-semibold text-[#2c3e50] sm:mb-8 sm:text-2xl">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {items.map((item, index) => (
            <FaqItem
              key={`${item.title || item.heading}-${index}`}
              number={index + 1}
              question={item.title || item.heading}
              answers={item.paragraphs || []}
              answerHtml={item.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
