"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

export default function FaqItem({ question, answers = [], answerHtml, number }) {
  const [open, setOpen] = useState(false);
  const answerId = useId();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const closeWhenAnotherOpens = (event) => {
      if (event.detail !== answerId) setOpen(false);
    };
    window.addEventListener("skg:faq-open", closeWhenAnotherOpens);
    return () => window.removeEventListener("skg:faq-open", closeWhenAnotherOpens);
  }, [answerId]);

  function toggle() {
    if (!open) window.dispatchEvent(new CustomEvent("skg:faq-open", { detail: answerId }));
    setOpen(!open);
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white transition-colors duration-200 ${open ? "border-lime-300 shadow-[0_6px_22px_rgba(16,44,66,0.06)]" : "border-slate-200 shadow-[0_2px_10px_rgba(16,44,66,0.025)] hover:border-lime-300"}`}
    >
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={answerId}
          onClick={toggle}
          className={`text-ink focus-visible:outline-brand flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-4 text-left text-base leading-6 font-semibold transition-colors hover:bg-lime-50/50 focus-visible:outline-2 focus-visible:outline-offset-[-3px] sm:gap-4 sm:px-6 sm:py-5 sm:text-[18px] ${open ? "bg-lime-50/40" : ""}`}
        >
          {number && (
            <span
              aria-hidden="true"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-50 text-xs font-bold text-teal-700"
            >
              {String(number).padStart(2, "0")}
            </span>
          )}
          <span className="min-w-0 flex-1 break-words">{question}</span>
          <span className="text-brand-dark grid h-8 w-8 shrink-0 place-items-center rounded-full bg-lime-50">
            {open ? <Minus size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={answerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100 px-4 pt-4 pb-5 text-left text-[15px] leading-7 text-[#34485a] sm:px-6 sm:pb-6">
              {answerHtml ? (
                <div
                  className="cms-rich-content"
                  dangerouslySetInnerHTML={{ __html: answerHtml }}
                />
              ) : (
                answers.map((answer, index) => (
                  <p key={index} className={index ? "mt-3" : undefined}>
                    {answer}
                  </p>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
