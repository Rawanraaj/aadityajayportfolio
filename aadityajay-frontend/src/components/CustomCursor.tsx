"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cinematic custom cursor: a small dot that trails a larger ring.
 * Ring scales up + fills press-red on hover over interactive targets.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;
    setEnabled(true);
    document.body.classList.add("cursors-enabled");

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    function onMove(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;
      if (dot) dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      const target = e.target as HTMLElement;
      setHovering(
        !!target.closest(
          "a, button, [role='button'], input, textarea, .cursor-hover",
        ),
      );
    }

    function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring) ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.body.classList.remove("cursors-enabled");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[200]">
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-press"
        style={{ marginLeft: "-3px", marginTop: "-3px" }}
      />
      <div
        ref={ringRef}
        className="absolute left-0 top-0 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-paper-50/40 transition-[width,height,background-color,border-color] duration-300"
        style={{
          marginLeft: "-18px",
          marginTop: "-18px",
          ...(hovering
            ? {
                width: "56px",
                height: "56px",
                marginLeft: "-28px",
                marginTop: "-28px",
                backgroundColor: "rgba(200,30,58,0.12)",
                borderColor: "rgba(200,30,58,0.9)",
              }
            : {}),
        }}
      />
    </div>
  );
}
