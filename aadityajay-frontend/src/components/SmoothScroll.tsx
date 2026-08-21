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

    // 4. Hard Safety-Net Clamp on Page Scroll Height
    const clampScrollHeight = () => {
      const footer = document.querySelector("footer");
      if (!footer) return;

      const footerBottom = footer.getBoundingClientRect().bottom + window.scrollY;
      const targetHeight = Math.ceil(footerBottom + 20); // 20px safety buffer
      const currentScrollHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );

      if (currentScrollHeight > targetHeight + 50) {
        document.body.style.maxHeight = `${targetHeight}px`;
        document.body.style.overflow = "hidden";
        document.documentElement.style.maxHeight = `${targetHeight}px`;
        document.documentElement.style.overflow = "hidden";
        const main = document.querySelector("main");
        if (main) {
          main.style.maxHeight = `${targetHeight}px`;
          main.style.overflow = "hidden";
        }
        lenis.resize();
      }
    };

    // 5. Layout refresh & clamp triggers
    const refreshLayout = () => {
      ScrollTrigger.refresh();
      lenis.resize();
      clampScrollHeight();
    };

    window.addEventListener("load", refreshLayout);
    const timer1 = setTimeout(refreshLayout, 500);
    const timer2 = setTimeout(refreshLayout, 1500);

    ScrollTrigger.addEventListener("refresh", clampScrollHeight);

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(refreshLayout, 200);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(resizeTimer);
      window.removeEventListener("load", refreshLayout);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleAnchor);
      ScrollTrigger.removeEventListener("refresh", clampScrollHeight);
      document.body.style.maxHeight = "";
      document.body.style.overflow = "";
      document.documentElement.style.maxHeight = "";
      document.documentElement.style.overflow = "";
      const main = document.querySelector("main");
      if (main) {
        main.style.maxHeight = "";
        main.style.overflow = "";
      }
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
