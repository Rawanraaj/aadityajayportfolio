"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroStats, site } from "@/data/site";
import { tickerItems } from "@/data/nav";
import Marquee from "@/components/Marquee";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReduced) return;

      const lines = gsap.utils.toArray<HTMLElement>("[data-headline-line]");
      gsap.set(lines, { yPercent: 115 });
      gsap.to(lines, {
        yPercent: 0,
        duration: 1.3,
        stagger: 0.14,
        ease: "expo.out",
        delay: 0.25,
      });

      gsap.from("[data-portrait]", {
        clipPath: "inset(100% 0 0 0)",
        duration: 1.4,
        ease: "expo.out",
        delay: 0.45,
      });
      gsap.from("[data-stamp]", {
        scale: 0,
        rotate: -25,
        opacity: 0,
        duration: 0.7,
        ease: "back.out(2.2)",
        delay: 1.5,
      });
      gsap.from("[data-hero-fade]", {
        opacity: 0,
        y: 20,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out",
        delay: 1.1,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
      tl.to("[data-bg-layer]", { yPercent: 25, ease: "none" }, 0)
        .to("[data-portrait]", { yPercent: -12, ease: "none" }, 0)
        .to("[data-text-layer]", { yPercent: -55, ease: "none" }, 0)
        .to("[data-headline]", { scale: 0.92, ease: "none" }, 0)
        .to("[data-hero-overlay]", { opacity: 0.7, ease: "none" }, 0);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="top"
      className="grain-overlay relative min-h-[100svh] overflow-hidden bg-ink-950"
    >
      {/* BG layer */}
      <div data-bg-layer aria-hidden className="absolute inset-0 will-change-transform">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #F5F1EA 1px, transparent 1px), linear-gradient(to bottom, #F5F1EA 1px, transparent 1px)",
            backgroundSize: "calc(100% / 12) 100vh",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 70% 30%, rgba(200,30,58,0.10) 0%, transparent 55%), radial-gradient(100% 100% at 50% 100%, rgba(7,11,20,0.9) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Portrait — desktop: right-side bleed; mobile: top band above text */}
      <div
        data-portrait
        className="pointer-events-none absolute right-[-4%] top-1/2 z-0 h-[68vh] w-[46vw] max-w-[560px] -translate-y-1/2 will-change-transform md:top-1/2 md:h-[78vh] md:w-[40vw] md:right-[-2%]"
      >
        <div className="relative h-full w-full">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.pexels.com/photos/8961065/pexels-photo-8961065.jpeg?auto=compress&cs=tinysrgb&w=1200')",
              filter: "grayscale(0.35) contrast(1.12) brightness(0.82)",
              clipPath: "polygon(6% 0, 100% 0, 100% 94%, 0 100%)",
            }}
          />
          <div
            className="absolute inset-0 mix-blend-overlay"
            style={{
              background:
                "linear-gradient(125deg, rgba(245,241,234,0.22) 0%, transparent 45%), linear-gradient(280deg, rgba(7,11,20,0.7) 60%, transparent 100%)",
              clipPath: "polygon(6% 0, 100% 0, 100% 94%, 0 100%)",
            }}
          />
          <div className="absolute -bottom-1 -left-2 h-20 w-20 bg-press" />
          <div
            data-stamp
            className="absolute left-5 top-5 flex h-16 w-16 rotate-[-6deg] flex-col items-center justify-center border border-paper-50/40 bg-ink-950/70 text-center backdrop-blur-sm"
          >
            <span className="font-display text-[0.55rem] italic leading-none text-press">Est.</span>
            <span className="font-display text-base font-bold leading-none text-paper-50">2014</span>
          </div>
        </div>
      </div>

      <div data-hero-overlay aria-hidden className="pointer-events-none absolute inset-0 z-[1] bg-ink-950 opacity-0" />

      {/* Text layer */}
      <div
        data-text-layer
        className="relative z-10 flex min-h-[100svh] flex-col justify-center px-6 pb-24 pt-28 md:px-10 md:pb-20 md:pt-32"
      >
        <div className="mx-auto w-full max-w-editorial">
          <div data-hero-fade className="mb-5 flex items-center gap-3 md:mb-6 md:gap-4">
            <span className="eyebrow text-press">Reporter</span>
            <span className="h-px w-8 bg-paper-50/30 md:w-10" />
            <span className="eyebrow text-paper-50/60">Public Khabar 24 · Nepal</span>
          </div>

          <h1 data-headline className="display-tight font-display font-bold text-paper-50">
            <span className="mask-line block text-[8vw] italic font-normal text-paper-300 md:text-[3.4vw] lg:text-[2.6rem]">
              <span data-headline-line className="mask-inner block">Journalist</span>
            </span>
            <span className="mask-line mt-1 block text-[13vw] md:text-[12vw] lg:text-[10.5rem]">
              <span data-headline-line className="mask-inner block">Aaditya Ajay</span>
            </span>
          </h1>

          <div
            data-hero-fade
            className="mt-5 flex flex-col gap-2 md:mt-6 md:max-w-xl md:flex-row md:items-baseline md:gap-6"
          >
            <span className="font-display text-base italic text-press md:text-xl">{site.role}</span>
            <span className="hidden h-4 w-px bg-paper-50/30 md:block" />
            <p className="max-w-md text-sm leading-relaxed text-paper-50/70">{site.tagline}</p>
          </div>

          <div
            data-hero-fade
            className="mt-8 grid max-w-lg grid-cols-3 gap-3 border-t border-paper-50/15 pt-5 md:mt-10 md:gap-4 md:pt-6"
          >
            {heroStats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="font-display text-2xl font-bold text-paper-50 md:text-4xl">
                  {stat.value}
                  {stat.suffix}
                </span>
                <span className="mt-2 text-[0.55rem] uppercase leading-tight tracking-eyebrow-2 text-paper-50/55 md:text-[0.58rem]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seamless marquee ticker — bottom edge */}
      <div className="absolute inset-x-0 bottom-0 z-20">
        <div
          className="border-y border-paper-50/10 bg-ink-950/90"
          style={{ boxShadow: "0 -18px 40px -22px rgba(200,30,58,0.45)" }}
        >
          <Marquee
            items={tickerItems}
            speed={55}
            itemClassName="text-[0.68rem] uppercase tracking-eyebrow-2 text-paper-50/65"
            label={
              <>
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-press" />
                Breaking
              </>
            }
          />
        </div>
      </div>
    </section>
  );
}
