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

    // 1. Update ScrollTrigger position on Lenis scroll
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // 2. Drive Lenis purely via GSAP Ticker
    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    // 3. Smooth scroll for anchor links
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

    // 4. One-time refresh after layout & images settle
    const refreshLayout = () => {
      ScrollTrigger.refresh();
      lenis.resize();
    };

    window.addEventListener("load", refreshLayout);
    const timer = setTimeout(refreshLayout, 1000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", refreshLayout);
      document.removeEventListener("click", handleAnchor);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
