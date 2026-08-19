"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Admin Panel Custom Cursor (aadityajay-admin):
 * - Snappier lerp response (0.35) for instant feedback in dense admin workflows.
 * - Tight magnetic radius (~22px) preventing cursor jump in form fields & data tables.
 * - Neutral/Standard cursor behavior on destructive actions (Delete, Remove, Danger buttons)
 *   so there is zero magnetic pull risk on irreversible actions.
 * - Desktop fine-pointer only with GPU acceleration and touch safety.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Desktop & fine-pointer check
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

    // Admin-specific tuning parameters
    const MAGNETIC_RADIUS = 22; // Tight radius for dense admin controls
    const LERP_FACTOR = 0.35; // Snappy responsiveness

    let currentTarget: HTMLElement | null = null;
    let isHovering = false;
    let isDestructive = false;

    function checkIfDestructive(el: HTMLElement): boolean {
      if (
        el.matches(
          "[data-destructive], .bg-destructive, .text-destructive, [variant='destructive'], .destructive, .btn-danger"
        )
      ) {
        return true;
      }
      const ariaLabel = (el.getAttribute("aria-label") || "").toLowerCase();
      const title = (el.getAttribute("title") || "").toLowerCase();
      const text = (el.textContent || "").trim().toLowerCase();
      if (
        ariaLabel.includes("delete") ||
        ariaLabel.includes("remove") ||
        title.includes("delete") ||
        title.includes("remove") ||
        (text.length < 20 && (text.includes("delete") || text.includes("remove")))
      ) {
        return true;
      }
      return false;
    }

    function onMouseMove(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;

      // Dynamic ref lookup ensures non-null access on every frame
      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }

      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest<HTMLElement>(
          "a, button, [role='button'], input, textarea, select, [data-magnetic], .cursor-hover"
        );
        currentTarget = interactive;
        isHovering = !!interactive;

        if (interactive) {
          isDestructive = checkIfDestructive(interactive);
        } else {
          isDestructive = false;
        }
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

      // Disable magnetic pull completely if hovering a destructive element
      if (currentTarget && !isDestructive) {
        const rect = currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(mx - centerX, my - centerY);

        if (dist < MAGNETIC_RADIUS) {
          isMagneticActive = true;
          const pullStrength = (1 - dist / MAGNETIC_RADIUS) * 0.3;
          targetX = mx + (centerX - mx) * pullStrength;
          targetY = my + (centerY - my) * pullStrength;
          scale = 1.25;
        }
      }

      // Snappy lerp
      rx += (targetX - rx) * LERP_FACTOR;
      ry += (targetY - ry) * LERP_FACTOR;

      const ring = ringRef.current;
      if (ring) {
        ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${
          isHovering ? scale : 1
        })`;

        if (isDestructive) {
          // Destructive element hover: alert red ring without magnetic pull
          ring.style.borderColor = "rgba(220, 38, 38, 0.8)";
          ring.style.backgroundColor = "rgba(220, 38, 38, 0.08)";
        } else if (isHovering || isMagneticActive) {
          ring.style.borderColor = "rgba(200, 30, 58, 0.85)";
          ring.style.backgroundColor = "rgba(200, 30, 58, 0.1)";
        } else {
          ring.style.borderColor = "rgba(240, 235, 225, 0.35)";
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
      {/* Precision center dot */}
      <div
        ref={dotRef}
        style={{
          pointerEvents: "none",
          position: "fixed",
          top: 0,
          left: 0,
          width: "5px",
          height: "5px",
          marginLeft: "-2.5px",
          marginTop: "-2.5px",
          borderRadius: "50%",
          backgroundColor: "#c81e3a",
          boxShadow: "0 0 6px rgba(200, 30, 58, 0.7)",
          willChange: "transform",
          transition: "opacity 200ms ease",
        }}
      />

      {/* Responsive ring */}
      <div
        ref={ringRef}
        style={{
          pointerEvents: "none",
          position: "fixed",
          top: 0,
          left: 0,
          width: "20px",
          height: "20px",
          marginLeft: "-10px",
          marginTop: "-10px",
          borderRadius: "50%",
          border: "1.5px solid rgba(240, 235, 225, 0.35)",
          backgroundColor: "transparent",
          willChange: "transform",
          transition:
            "background-color 200ms ease, border-color 200ms ease, opacity 200ms ease",
        }}
      />
    </div>
  );
}
