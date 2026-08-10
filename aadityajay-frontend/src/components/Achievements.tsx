"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { achievements } from "@/data/achievements";
import type { Achievement } from "@/data/achievements";

gsap.registerPlugin(ScrollTrigger);

function Icon({ name }: { name: Achievement["icon"] }) {
  const common = "h-9 w-9";
  if (name === "credential") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      >
        <rect x="4" y="3" width="16" height="18" />
        <line x1="8" y1="8" x2="16" y2="8" />
        <line x1="8" y1="12" x2="16" y2="12" />
        <circle cx="12" cy="17" r="2" />
      </svg>
    );
  }
  if (name === "award") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      >
        <circle cx="12" cy="9" r="6" />
        <path d="M8.5 14L7 22l5-3 5 3-1.5-8" />
      </svg>
    );
  }
  return (
    <svg
      className={common}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
    >
      <path d="M4 4h12a3 3 0 013 3v13H7a3 3 0 01-3-3V4z" />
      <line x1="8" y1="9" x2="14" y2="9" />
      <line x1="8" y1="13" x2="14" y2="13" />
    </svg>
  );
}

interface AchievementsProps {
  achievementItems?: Achievement[];
}

export default function Achievements({ achievementItems = achievements }: AchievementsProps) {
  const root = useRef<HTMLElement | null>(null);

  const activeItems = achievementItems && achievementItems.length > 0 ? achievementItems : achievements;

  useEffect(() => {
    if (!activeItems || activeItems.length === 0) return;

    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReduced) return;

      const wallEl = root.current?.querySelector("[data-credentials-wall]");
      if (wallEl) {
        // stamp/seal reveal: each card drops in with a stamp motion one at a time
        gsap.from("[data-credential]", {
          y: 70,
          opacity: 0,
          scale: 1.08,
          rotateZ: () => gsap.utils.random(-4, 4),
          duration: 0.9,
          stagger: 0.28,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wallEl,
            start: "top 75%",
            once: true,
          },
        });

        // the underline draws in after each card lands
        gsap.from("[data-credential-underline]", {
          scaleX: 0,
          duration: 0.8,
          stagger: 0.28,
          ease: "power2.out",
          delay: 0.3,
          transformOrigin: "left center",
          scrollTrigger: {
            trigger: wallEl,
            start: "top 75%",
            once: true,
          },
        });
      }

      const titleEl = root.current?.querySelector("[data-cred-title]");
      if (titleEl) {
        // big section title clip reveal
        gsap.from("[data-cred-title] > span", {
          yPercent: 115,
          duration: 1.1,
          stagger: 0.12,
          ease: "expo.out",
          scrollTrigger: {
            trigger: titleEl,
            start: "top 80%",
            once: true,
          },
        });
      }
    }, root);
    return () => ctx.revert();
  }, [activeItems]);

  return (
    <section
      id="achievements"
      ref={root}
      className="grain-overlay relative bg-ink-900 py-24 md:py-32"
    >
      <div className="mx-auto max-w-editorial px-6 md:px-10">
        <div className="mb-14 flex flex-col gap-6 border-b border-paper-50/15 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow text-press">05 / Credentials</span>
            <h2
              data-cred-title
              className="display-tight mt-3 font-display text-5xl font-bold text-paper-50 md:text-7xl"
            >
              <span className="mask-line block">
                <span className="mask-inner block">Stamped &amp;</span>
              </span>
              <span className="mask-line block italic text-paper-300">
                <span className="mask-inner block">certified.</span>
              </span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-paper-50/60">
            Formal credentials and awards marking a career built on verified,
            accountable reporting.
          </p>
        </div>

        {/* Credentials wall — identical card structure */}
        <div
          data-credentials-wall
          className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6"
        >
          {achievements.map((item) => (
            <article
              key={item.id}
              data-credential
              className="group relative flex flex-col border border-paper-50/12 bg-ink-950 p-8 transition-colors duration-500 hover:border-press/40 md:p-10"
            >
              {/* rotating wax-seal detail */}
              <div className="absolute right-6 top-6 flex h-14 w-14 rotate-[-8deg] items-center justify-center rounded-full border border-press/50 text-center transition-transform duration-700 group-hover:rotate-[6deg]">
                <div className="flex flex-col items-center">
                  <span className="font-display text-[0.5rem] italic leading-none text-press">
                    seal
                  </span>
                  <span className="font-display text-sm font-bold leading-none text-paper-50">
                    {item.year}
                  </span>
                </div>
              </div>

              {/* icon — identical treatment for all */}
              <div className="mb-8 text-press">
                <Icon name={item.icon} />
              </div>

              {/* year — identical format for all */}
              <span className="eyebrow text-paper-50/45">{item.year}</span>

              {/* title — identical treatment */}
              <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-paper-50">
                {item.title}
              </h3>

              {/* body — identical treatment */}
              <p className="mt-4 text-sm leading-relaxed text-paper-50/65">
                {item.body}
              </p>

              {/* identical underline that draws in */}
              <div
                data-credential-underline
                className="mt-8 h-px w-full origin-left bg-press"
              />

              {/* seal/issuer — identical treatment */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[0.62rem] uppercase tracking-eyebrow-2 text-paper-50/55">
                  {item.seal}
                </span>
                <span className="font-display text-xs italic text-press">
                  verified
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
