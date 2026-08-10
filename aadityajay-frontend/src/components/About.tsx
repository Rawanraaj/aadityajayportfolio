"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { aboutBio, aboutPullQuote, aboutStats } from "@/data/site";
import AnimatedCounter from "@/components/AnimatedCounter";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReduced) {
        document
          .querySelector(".spotlight-text")
          ?.classList.add("is-lit");
        return;
      }

      // Beat 1: spotlight sweep across the pull-quote on enter
      const quoteEl = document.querySelector(".spotlight-text");
      ScrollTrigger.create({
        trigger: "[data-quote-scene]",
        start: "top 70%",
        once: true,
        onEnter: () => quoteEl?.classList.add("is-lit"),
      });

      // Beat 1: big quote scales/subtle zoom as it scrolls through
      gsap.fromTo(
        "[data-quote-text]",
        { scale: 0.96 },
        {
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-quote-scene]",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );

      // Beat 2: bio paragraphs + stats rise in as their own beat
      gsap.from("[data-bio-beat] > *", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-bio-beat]",
          start: "top 75%",
          once: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={root} className="relative bg-ink-950">
      {/* BEAT 1 — full-viewport pull-quote as its own scene */}
      <div
        data-quote-scene
        className="grain-overlay relative flex h-[100svh] min-h-[560px] items-center justify-center overflow-hidden px-6"
      >
        {/* oversized faint background word for depth */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[28vw] font-bold leading-none text-paper-50/[0.03] md:text-[22vw]"
        >
          TRUTH
        </span>

        <blockquote
          data-quote-text
          className="relative z-10 max-w-5xl text-center will-change-transform"
        >
          <span className="eyebrow mb-8 block text-press">
            01 / The Principle
          </span>
          <p className="spotlight-text font-display text-[8vw] font-500 italic leading-[1.05] md:text-[5.5vw] lg:text-[5rem]">
            &ldquo;{aboutPullQuote}&rdquo;
          </p>
          <footer className="mt-10 text-[0.62rem] uppercase tracking-eyebrow-2 text-paper-50/45">
            Aaditya Ajay — on the craft of reporting
          </footer>
        </blockquote>
      </div>

      {/* BEAT 2 — bio + stats rise in */}
      <div className="relative bg-ink-900">
        <div className="mx-auto grid max-w-editorial grid-cols-12 gap-x-4 gap-y-12 px-6 py-24 md:px-10 md:py-32">
          <div className="col-span-12 flex items-baseline gap-4">
            <span className="eyebrow text-press">02 / About</span>
            <span className="h-px flex-1 bg-paper-50/15" />
          </div>

          <div data-bio-beat className="col-span-12 md:col-span-5 md:pr-8">
            <h2 className="display-tight font-display text-5xl font-bold text-paper-50 md:text-6xl">
              A decade of
              <br />
              <span className="italic text-press">on-the-ground</span>
              <br />
              journalism.
            </h2>

            {/* embedded mini pull-quote for rhythm */}
            <p className="mt-10 border-l-2 border-press pl-5 font-display text-xl italic leading-snug text-paper-200">
              &ldquo;{aboutPullQuote}&rdquo;
            </p>
          </div>

          <div
            data-bio-beat
            className="col-span-12 md:col-span-6 md:col-start-7"
          >
            <div className="space-y-5">
              {aboutBio.map((para, i) => (
                <p
                  key={i}
                  className={`text-base leading-[1.7] text-paper-50/75 ${
                    i === 0 ? "text-lg text-paper-50" : ""
                  }`}
                >
                  {para}
                </p>
              ))}
            </div>

            <div className="mt-12 grid grid-cols-3 gap-x-6 gap-y-8 border-t border-paper-50/15 pt-8">
              {aboutStats.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    className="font-display text-4xl font-bold text-paper-50"
                  />
                  <span className="mt-2 text-[0.58rem] uppercase leading-tight tracking-eyebrow-2 text-paper-50/55">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
