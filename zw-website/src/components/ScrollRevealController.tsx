"use client";

import { useEffect } from "react";

const revealGroups = [
  ".manifesto-grid > *",
  ".platform-list article",
  ".story-copy > *",
  ".section-heading > *",
  ".filter-tabs",
  ".product-editorial article",
  ".solution-feature > *",
  ".industry-index-heading > *",
  ".industry-index-list button",
  ".case-title > *",
  ".case-metrics > *",
  ".brand-films button",
  ".season-tabs button",
  ".season-intro > *",
  ".season-videos button",
  ".season-coming > *",
  ".history-showcase",
  ".news-list article",
  ".contact-copy > *",
  ".lead-form > *",
  "footer > *",
];

export function ScrollRevealController() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = new Set<HTMLElement>();

    for (const selector of revealGroups) {
      document.querySelectorAll<HTMLElement>(selector).forEach((element, index) => {
        element.classList.add("scroll-reveal");
        element.style.setProperty("--reveal-delay", `${Math.min(index, 5) * 70}ms`);
        elements.add(element);
      });
    }

    if (reducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: "0px 0px -9% 0px",
        threshold: 0.08,
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return null;
}
