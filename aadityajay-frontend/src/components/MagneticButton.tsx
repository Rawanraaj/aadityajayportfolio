"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: "a" | "button";
  href?: string;
  onClick?: () => void;
  ariaLabel?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

export default function MagneticButton({
  children,
  className = "",
  strength = 0.35,
  as = "a",
  href,
  onClick,
  ariaLabel,
  type = "button",
  disabled = false,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function onMove(e: React.MouseEvent) {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    setOffset({ x: relX * strength, y: relY * strength });
  }

  function onLeave() {
    setOffset({ x: 0, y: 0 });
  }

  const shared = {
    ref: ref as never,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    className,
    style: {
      transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
    },
    "aria-label": ariaLabel,
  } as const;

  if (as === "button") {
    return (
      <button {...shared} onClick={onClick} type={type} disabled={disabled}>
        {children}
      </button>
    );
  }
  return (
    <a {...shared} href={href} onClick={onClick}>
      {children}
    </a>
  );
}
