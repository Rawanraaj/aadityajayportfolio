"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    // 1. Update ScrollTrigger on Lenis scroll
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // 2. Sync Lenis document height with ScrollTrigger refreshes
    const onScrollTriggerRefresh = () => {
      lenis.resize();
    };
    ScrollTrigger.addEventListener("refresh", onScrollTriggerRefresh);

    // 3. Drive Lenis solely via GSAP Ticker (single unified RAF source)
    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    // 4. Smooth scroll for anchor links
    function handleAnchor(e: Event) {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link) return;
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -70, duration: 1.4 });
    }
    document.addEventListener("click", handleAnchor);

    // 5. Recalculate document dimensions dynamically when content/images/fonts change
    const refreshAll = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };

    window.addEventListener("load", refreshAll);
    const refreshTimer = setTimeout(refreshAll, 600);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        lenis.resize();
        ScrollTrigger.refresh();
      });
      resizeObserver.observe(document.body);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      clearTimeout(refreshTimer);
      window.removeEventListener("load", refreshAll);
      document.removeEventListener("click", handleAnchor);
      ScrollTrigger.removeEventListener("refresh", onScrollTriggerRefresh);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
