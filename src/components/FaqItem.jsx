"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

export default function FaqItem({ question, answers }) {
  const [open, setOpen] = useState(false);
  const answerId = useId();
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-white shadow-[0_2px_10px_rgba(16,44,66,0.035)] transition-colors duration-200 ${open ? "border-brand/20" : "border-brand/10 hover:border-brand/20"}`}
    >
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={answerId}
          onClick={() => setOpen((current) => !current)}
          className="text-ink focus-visible:outline-brand flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-[16px] leading-6 font-semibold transition-colors hover:bg-lime-50/50 focus-visible:outline-2 focus-visible:outline-offset-[-3px] sm:px-6 sm:py-5 sm:text-[18px]"
        >
          <span>{question}</span>
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
            <div className="border-brand/10 border-t px-5 pt-4 pb-5 text-[15px] leading-7 text-[#34485a] sm:px-6">
              {answers.map((answer, index) => (
                <p key={index} className={index ? "mt-3" : undefined}>
                  {answer}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
