"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { featuredArticles, categories } from "@/data/articles";
import type { Article, Category } from "@/data/articles";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedStories() {
  const [active, setActive] = useState<Category>("All");
  const root = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    if (active === "All") return featuredArticles;
    return featuredArticles.filter((a) => a.category === active);
  }, [active]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;
      const track = trackRef.current;
      const pin = pinRef.current;
      if (!track || !pin) return;

      // only run the pinned horizontal scroll-jack on wide screens
      const mq = window.matchMedia("(min-width: 768px)");
      let st: ScrollTrigger | undefined;
      function setup() {
        if (st) st.kill();
        if (!track) return;
        gsap.set(track, { x: 0 });
        if (!mq.matches) return;
        const getDistance = () => track.scrollWidth - window.innerWidth + 80;
        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${getDistance()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        st = tween.scrollTrigger;
      }
      setup();
      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, root);
    return () => ctx.revert();
  }, [filtered]);

  return (
    <section id="stories" ref={root} className="grain-overlay relative bg-ink-950">
      {/* Section header */}
      <div className="mx-auto max-w-editorial px-6 pt-24 md:px-10 md:pt-32">
        <div className="mb-10 flex flex-col gap-6 border-b border-paper-50/15 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow text-press">03 / Featured Stories</span>
            <h2 className="display-tight mt-3 font-display text-5xl font-bold text-paper-50 md:text-7xl">
              Front
              <span className="italic text-paper-300"> pages</span>
            </h2>
            <p className="mt-3 text-[0.66rem] uppercase tracking-eyebrow-2 text-paper-50/45">
              A curated highlight reel · full archive below
            </p>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-paper-50/60">
            Scroll to flip through a stack of front pages — investigations, field reports, and
            interviews.
          </p>
        </div>

        {/* category filter tabs — selected state always visible */}
        <div className="mb-12 flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = active === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                aria-pressed={isActive}
                className={`border px-4 py-2 text-[0.66rem] uppercase tracking-eyebrow-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-press focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 ${
                  isActive
                    ? "border-press bg-press text-paper-50"
                    : "border-paper-50/20 text-paper-50/60 hover:border-paper-50/50 hover:text-paper-50"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop: pinned horizontal gallery. Mobile: vertical stack. */}
      <div ref={pinRef} className="relative h-auto w-full md:h-[100svh] md:min-h-[560px]">
        <div
          ref={trackRef}
          className="flex flex-col gap-6 px-6 pb-24 md:absolute md:left-0 md:top-1/2 md:flex-row md:-translate-y-1/2 md:items-center md:gap-10 md:px-10 md:pb-0 will-change-transform"
        >
          {filtered.length === 0 ? (
            <div className="flex h-[60svh] items-center justify-center md:h-auto">
              <p className="font-display text-2xl italic text-paper-50/40">
                No stories in this category yet.
              </p>
            </div>
          ) : (
            <>
              {filtered.map((article, i) => (
                <StoryCard key={article.id} article={article} index={i} />
              ))}
              <EndCard />
            </>
          )}
        </div>

        <div className="pointer-events-none absolute bottom-10 left-1/2 z-10 hidden -translate-x-1/2 md:block">
          <div className="flex items-center gap-3 text-[0.6rem] uppercase tracking-eyebrow-2 text-paper-50/40">
            <span>Scroll</span>
            <span className="h-px w-16 bg-paper-50/20" />
            <span>→</span>
          </div>
        </div>
      </div>

      {/* View All Stories CTA */}
      <div className="border-t border-paper-50/10 bg-ink-900">
        <div className="mx-auto flex max-w-editorial flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center md:px-10 md:py-12">
          <div>
            <h3 className="font-display text-2xl font-bold text-paper-50 md:text-3xl">
              500+ stories published.
            </h3>
            <p className="mt-2 max-w-md text-sm text-paper-50/60">
              This is a curated selection. Browse the full archive for the complete body of work.
            </p>
          </div>
          <Link
            href="/stories"
            className="group inline-flex shrink-0 items-center gap-3 border border-paper-50/25 px-6 py-3.5 text-[0.7rem] uppercase tracking-eyebrow-2 text-paper-50 transition-colors hover:border-press hover:bg-press focus:outline-none focus-visible:ring-2 focus-visible:ring-press focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900"
          >
            View All Stories
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function StoryCard({ article, index }: { article: Article; index: number }) {
  const isLead = !!article.featured;
  return (
    <article
      className="group relative shrink-0 cursor-pointer"
      style={{ width: "min(84vw, 560px)" }}
    >
      <Link href={article.href} className="block" aria-label={article.title}>
        <div
          className={`relative overflow-hidden bg-ink-800 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 ${
            isLead ? "aspect-[4/5]" : "aspect-[5/6]"
          }`}
        >
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(min-width: 768px) 560px, 84vw"
            className="object-cover opacity-90 transition-all duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05] group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/25 to-transparent" />
          <div className="absolute inset-0 ring-1 ring-inset ring-paper-50/10 transition-colors duration-500 group-hover:ring-press/40" />

          <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center border border-paper-50/30 bg-ink-950/60 font-display text-xs text-paper-50/70 backdrop-blur-sm">
            {String(index + 1).padStart(2, "0")}
          </div>
          <span className="absolute left-5 top-5 bg-press px-2.5 py-1 text-[0.6rem] uppercase tracking-eyebrow-2 text-paper-50">
            {article.category}
          </span>

          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            <div className="mb-3 flex items-center gap-3 text-[0.6rem] uppercase tracking-eyebrow-2 text-paper-50/55">
              <span>{article.date}</span>
              <span className="h-px w-6 bg-paper-50/30" />
              <span>{article.readTime}</span>
            </div>
            <h3
              className={`display-tight font-display font-bold text-paper-50 transition-colors group-hover:text-paper-200 ${
                isLead ? "text-2xl md:text-4xl" : "text-xl md:text-3xl"
              }`}
            >
              {article.title}
            </h3>
            <p className="mt-3 hidden max-w-md text-sm leading-relaxed text-paper-50/70 md:block">
              {article.excerpt}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-eyebrow-2 text-press transition-all group-hover:gap-3">
              Read story
              <span className="inline-block h-px w-8 bg-press transition-all duration-300 group-hover:w-12" />
            </span>
          </div>
          <div className="absolute -bottom-px left-0 h-1 w-1/3 bg-press" />
        </div>
      </Link>
    </article>
  );
}

function EndCard() {
  return (
    <div className="shrink-0" style={{ width: "min(60vw, 360px)" }}>
      <div className="flex aspect-[5/6] flex-col items-center justify-center gap-6 border border-paper-50/15 bg-ink-900 p-8 text-center">
        <span className="eyebrow text-press">End of stack</span>
        <p className="font-display text-2xl italic leading-snug text-paper-50">
          More reporting published weekly in Public Khabar 24.
        </p>
        <Link
          href="/stories"
          className="group border border-paper-50/25 px-5 py-3 text-[0.66rem] uppercase tracking-eyebrow-2 text-paper-50 transition-colors hover:border-press hover:bg-press"
        >
          Browse full archive →
        </Link>
      </div>
    </div>
  );
}
