"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { videos } from "@/data/videos";
import type { VideoItem } from "@/data/videos";

gsap.registerPlugin(ScrollTrigger);

export default function Media() {
  const [active, setActive] = useState<VideoItem | null>(null);
  const root = useRef<HTMLElement | null>(null);
  const [featured, ...supporting] = videos;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReduced) return;

      // featured video scales/zooms subtly as the scene enters
      gsap.from("[data-featured-video]", {
        scale: 1.12,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-featured-video]",
          start: "top 85%",
          once: true,
        },
      });

      // supporting cards fan in with a stagger + slight rotation
      gsap.from("[data-support-card]", {
        y: 80,
        opacity: 0,
        rotateZ: () => gsap.utils.random(-3, 3),
        duration: 1,
        stagger: 0.14,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-support-grid]",
          start: "top 80%",
          once: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="media"
      ref={root}
      className="grain-overlay relative bg-ink-950 py-24 md:py-32"
    >
      <div className="mx-auto max-w-editorial px-6 md:px-10">
        <div className="mb-12 flex flex-col gap-6 border-b border-paper-50/15 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow text-press">04 / Media</span>
            <h2 className="display-tight mt-3 font-display text-5xl font-bold text-paper-50 md:text-7xl">
              On air &amp;
              <span className="italic text-paper-300"> on camera</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-paper-50/60">
            Television segments, live broadcasts, and field documentaries from
            Public Khabar 24.
          </p>
        </div>

        {/* Featured video — full-bleed cinematic */}
        <button
          type="button"
          onClick={() => setActive(featured)}
          data-featured-video
          aria-label={`Play: ${featured.title}`}
          className="group relative block w-full cursor-pointer overflow-hidden bg-ink-800 text-left will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-press"
        >
          <div className="relative aspect-[16/9] w-full md:aspect-[21/9]">
            <Image
              src={featured.poster}
              alt={featured.title}
              fill
              sizes="100vw"
              priority
              className="object-cover opacity-70 transition-all duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-hover:opacity-85"
            />
            {/* dark cinematic overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/30" />
            <div className="absolute inset-0 ring-1 ring-inset ring-paper-50/10" />

            {/* play button */}
            <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-paper-50/50 transition-all duration-500 group-hover:scale-110 group-hover:border-press group-hover:bg-press/90">
              <span className="ml-1.5 h-0 w-0 border-y-[12px] border-l-[20px] border-y-transparent border-l-paper-50" />
            </div>

            {/* caption block */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 md:flex-row md:items-end md:justify-between md:p-10">
              <div className="max-w-2xl">
                <span className="bg-press px-2.5 py-1 text-[0.58rem] uppercase tracking-eyebrow-2 text-paper-50">
                  Featured · {featured.outlet}
                </span>
                <h3 className="mt-4 font-display text-3xl font-bold leading-tight text-paper-50 md:text-5xl">
                  {featured.title}
                </h3>
              </div>
              <div className="flex items-center gap-4 text-[0.62rem] uppercase tracking-eyebrow-2 text-paper-50/55">
                <span>{featured.date}</span>
                <span className="h-px w-6 bg-paper-50/30" />
                <span>{featured.duration}</span>
              </div>
            </div>
          </div>
        </button>

        {/* Supporting videos — asymmetric, not uniform */}
        <div
          data-support-grid
          className="mt-6 grid grid-cols-12 gap-4 md:mt-10 md:gap-6"
        >
          {supporting.map((video) => (
            <button
              key={video.id}
              type="button"
              onClick={() => setActive(video)}
              data-support-card
              aria-label={`Play: ${video.title}`}
              className="group relative col-span-12 cursor-pointer sm:col-span-6 md:col-span-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-press"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-ink-800">
                <Image
                  src={video.poster}
                  alt={video.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover opacity-75 transition-all duration-700 group-hover:scale-[1.05] group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 to-transparent" />
                <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-paper-50/40 transition-all duration-500 group-hover:scale-110 group-hover:border-press group-hover:bg-press/80">
                  <span className="ml-1 h-0 w-0 border-y-[8px] border-l-[14px] border-y-transparent border-l-paper-50" />
                </div>
                <span className="absolute left-4 top-4 bg-ink-950/80 px-2.5 py-1 text-[0.56rem] uppercase tracking-eyebrow-2 text-paper-50">
                  {video.outlet}
                </span>
                {/* duration tag */}
                <span className="absolute bottom-4 right-4 bg-ink-950/80 px-2 py-1 font-display text-[0.62rem] text-paper-50/80">
                  {video.duration}
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <h3 className="font-display text-lg font-bold leading-tight text-paper-50 transition-colors group-hover:text-paper-200">
                  {video.title}
                </h3>
                <span className="shrink-0 text-[0.58rem] uppercase tracking-eyebrow-2 text-paper-50/45">
                  {video.date}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/95 p-4 md:p-10"
          onClick={() => setActive(null)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setActive(null)}
              className="absolute -top-10 right-0 flex h-8 w-8 items-center justify-center text-paper-50 transition-colors hover:text-press"
            >
              ✕
            </button>
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${active.youtubeId}?autoplay=1`}
                title={active.title}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <h3 className="font-display text-xl font-bold text-paper-50">
                {active.title}
              </h3>
              <span className="text-[0.62rem] uppercase tracking-eyebrow-2 text-paper-50/55">
                {active.outlet}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
