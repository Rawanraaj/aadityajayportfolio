"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { outletBlurb } from "@/data/outlet";
import { site } from "@/data/site";

gsap.registerPlugin(ScrollTrigger);

export default function Outlet() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReduced) return;

      // dramatic zoom-out reveal of the masthead card
      gsap.from("[data-masthead]", {
        scale: 1.18,
        opacity: 0,
        duration: 1.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-masthead]",
          start: "top 85%",
          once: true,
        },
      });

      // title clip reveal
      gsap.from("[data-outlet-title] > span", {
        yPercent: 115,
        duration: 1.1,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: {
          trigger: "[data-outlet-title]",
          start: "top 80%",
          once: true,
        },
      });

      // blurb rise
      gsap.from("[data-outlet-blurb]", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-outlet-blurb]",
          start: "top 82%",
          once: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="outlet"
      ref={root}
      className="grain-overlay relative bg-ink-950 py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-editorial grid-cols-12 gap-x-4 gap-y-10 px-6 md:px-10">
        <div className="col-span-12 flex items-baseline gap-4">
          <span className="eyebrow text-press">06 / The Outlet</span>
          <span className="h-px flex-1 bg-paper-50/15" />
        </div>

        <div className="col-span-12 md:col-span-7">
          <h2
            data-outlet-title
            className="display-tight font-display font-bold text-paper-50"
          >
            <span className="mask-line block text-5xl md:text-7xl">
              <span className="mask-inner block">Public Khabar</span>
            </span>
            <span className="mask-line block text-5xl text-press md:text-7xl">
              <span className="mask-inner block">24</span>
            </span>
          </h2>
          <p
            data-outlet-blurb
            className="mt-8 max-w-xl text-base leading-[1.7] text-paper-50/70"
          >
            {outletBlurb}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={site.outletSite}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-3 bg-press px-6 py-3.5 text-[0.7rem] uppercase tracking-eyebrow-2 text-paper-50 transition-colors hover:bg-paper-50 hover:text-ink-950"
            >
              Visit the live site
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
            <span className="font-display text-sm italic text-paper-50/50">
              Aaditya Ajay serves as Chairman.
            </span>
          </div>
        </div>

        {/* Masthead card — pushed contrast: darker, sharper, more presence */}
        <div className="col-span-12 md:col-span-4 md:col-start-9">
          <div
            data-masthead
            className="relative border border-press/30 bg-ink-950 p-8 text-paper-50 will-change-transform"
            style={{ boxShadow: "0 30px 60px -30px rgba(200,30,58,0.35)" }}
          >
            <div className="eyebrow text-press">Masthead</div>
            <div className="mt-5 font-display text-3xl font-black leading-[0.95] tracking-tightest text-paper-50">
              PUBLIC
              <br />
              KHABAR 24
            </div>
            <div className="mt-1 h-1 w-16 bg-press" />
            <div className="mt-7 space-y-3 text-[0.64rem] uppercase tracking-eyebrow-2 text-paper-50/60">
              <div className="flex justify-between border-b border-paper-50/15 pb-2">
                <span>Chairman</span>
                <span className="text-paper-50">Aaditya Ajay</span>
              </div>
              <div className="flex justify-between border-b border-paper-50/15 pb-2">
                <span>Founded</span>
                <span className="text-paper-50">2014</span>
              </div>
              <div className="flex justify-between">
                <span>Base</span>
                <span className="text-paper-50">Kathmandu, NP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
