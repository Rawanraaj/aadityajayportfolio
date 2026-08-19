"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Premium 2-layer custom cursor for Public Site (aadityajay-frontend):
 * - Layer 1: Precise press-red dot (#C81E3A) at exact mouse position (no lag).
 * - Layer 2: Trailing off-white ring (#F5F1EA) with smooth lerp easing + magnetic pull
 *   near interactive elements (links, buttons, cards).
 * - Desktop/fine-pointer only with zero layout shift and GPU transform acceleration.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only enable on desktop with fine pointer and non-touch
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (!finePointer || isTouchDevice) return;

    setEnabled(true);
    document.body.classList.add("cursors-enabled");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let rafId = 0;

    // Magnetic parameters for public site
    const MAGNETIC_RADIUS = 55;
    const LERP_FACTOR = 0.16; // Smooth trailing lag

    let currentTarget: HTMLElement | null = null;
    let isHovering = false;

    function onMouseMove(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;

      // Dynamic ref lookup ensures non-null access on every frame
      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }

      // Check hovered element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest<HTMLElement>(
          "a, button, [role='button'], input, textarea, select, [data-magnetic], .cursor-hover"
        );
        currentTarget = interactive;
        isHovering = !!interactive;
      }
    }

    function onMouseLeave() {
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (dot) dot.style.opacity = "0";
      if (ring) ring.style.opacity = "0";
    }

    function onMouseEnter() {
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (dot) dot.style.opacity = "1";
      if (ring) ring.style.opacity = "1";
    }

    function loop() {
      let targetX = mx;
      let targetY = my;
      let scale = 1;
      let isMagneticActive = false;

      if (currentTarget) {
        const rect = currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(mx - centerX, my - centerY);

        if (dist < MAGNETIC_RADIUS) {
          isMagneticActive = true;
          const pullStrength = (1 - dist / MAGNETIC_RADIUS) * 0.42;
          targetX = mx + (centerX - mx) * pullStrength;
          targetY = my + (centerY - my) * pullStrength;
          scale = 1.45;
        }
      }

      // Lerp ring towards target
      rx += (targetX - rx) * LERP_FACTOR;
      ry += (targetY - ry) * LERP_FACTOR;

      const ring = ringRef.current;
      if (ring) {
        ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${
          isHovering || isMagneticActive ? scale : 1
        })`;

        if (isHovering || isMagneticActive) {
          ring.style.borderColor = "rgba(200, 30, 58, 0.9)";
          ring.style.backgroundColor = "rgba(200, 30, 58, 0.12)";
        } else {
          ring.style.borderColor = "rgba(245, 241, 234, 0.4)";
          ring.style.backgroundColor = "transparent";
        }
      }

      rafId = requestAnimationFrame(loop);
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.body.classList.remove("cursors-enabled");
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        display: enabled ? "block" : "none",
        pointerEvents: "none",
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      {/* Precise red dot (no lag) */}
      <div
        ref={dotRef}
        style={{
          pointerEvents: "none",
          position: "fixed",
          top: 0,
          left: 0,
          width: "6px",
          height: "6px",
          marginLeft: "-3px",
          marginTop: "-3px",
          borderRadius: "50%",
          backgroundColor: "#c81e3a",
          boxShadow: "0 0 8px rgba(200, 30, 58, 0.8)",
          willChange: "transform",
          transition: "opacity 300ms ease",
        }}
      />

      {/* Trailing off-white ring with smooth lerp & magnetic expansion */}
      <div
        ref={ringRef}
        style={{
          pointerEvents: "none",
          position: "fixed",
          top: 0,
          left: 0,
          width: "28px",
          height: "28px",
          marginLeft: "-14px",
          marginTop: "-14px",
          borderRadius: "50%",
          border: "1.5px solid rgba(245, 241, 234, 0.4)",
          backgroundColor: "transparent",
          willChange: "transform",
          transition:
            "background-color 300ms ease, border-color 300ms ease, opacity 300ms ease",
        }}
      />
    </div>
  );
}
