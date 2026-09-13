"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const slide = {
  enter: (direction) => ({ opacity: 0, x: direction * 32 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction * -32 }),
};

export default function TestimonialsCarousel({ items }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();
  const visible = [items[index], items[(index + 1) % items.length]];

  function changeTestimonial(nextIndex, nextDirection) {
    setDirection(nextDirection);
    setIndex((nextIndex + items.length) % items.length);
  }

  return (
    <div className="testimonials-carousel">
      <div className="testimonials-controls">
        <button type="button" aria-label="Previous testimonial" onClick={() => changeTestimonial(index - 1, -1)}>
          <ChevronLeft size={21} aria-hidden="true" />
        </button>
        <button type="button" aria-label="Next testimonial" onClick={() => changeTestimonial(index + 1, 1)}>
          <ChevronRight size={21} aria-hidden="true" />
        </button>
      </div>
      <div className="testimonials-stage" aria-live="polite">
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={index}
            className="testimonials-track"
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
          >
            {visible.map((item, position) => (
              <blockquote key={`${item.name}-${position}`} className="theme-card testimonial-card">
                <div className="testimonial-stars" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={15} fill="currentColor" aria-hidden="true" />
                  ))}
                </div>
                <h3>{item.trip}</h3>
                <p>“{item.quote}”</p>
                <cite>{item.name}</cite>
              </blockquote>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="testimonials-dots" aria-label="Choose testimonial">
        {items.map((item, dotIndex) => (
          <button
            key={item.name}
            type="button"
            aria-label={`Show testimonial ${dotIndex + 1}`}
            aria-current={dotIndex === index ? "true" : undefined}
            onClick={() => {
              if (dotIndex !== index) changeTestimonial(dotIndex, dotIndex > index ? 1 : -1);
            }}
          />
        ))}
      </div>
    </div>
  );
}
