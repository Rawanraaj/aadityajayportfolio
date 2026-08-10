"use client";

import type { ReactNode } from "react";

type Props = {
  items: string[];
  /** px speed of the scroll — higher = slower duration per loop */
  speed?: number;
  className?: string;
  itemClassName?: string;
  separator?: ReactNode;
  label?: ReactNode;
};

/**
 * Seamless CSS marquee. Renders the list twice inside one track and
 * translates the track by -50%, so the second copy lands exactly where
 * the first began — no visible seam, single consistent direction.
 * Duration scales with content width so the perceived speed is constant.
 */
const DEFAULT_TICKER = [
  "Aaditya Ajay · Chairman, Public Khabar 24",
  "Reporting Stories That Matter — Nepal's Streets to Front Pages",
  "Investigative Journalism · Public Interest Coverage",
  "Public Khabar 24 · On-The-Ground Truth",
];

export default function Marquee({
  items,
  speed = 60,
  className = "",
  itemClassName = "",
  separator,
  label,
}: Props) {
  const activeItems = items && items.length > 0 ? items : DEFAULT_TICKER;
  const doubled = [...activeItems, ...activeItems];
  const sep = separator ?? <span className="mr-4 text-press">/</span>;

  return (
    <div className={`group relative flex overflow-hidden ${className}`}>
      {label && (
        <div className="eyebrow flex shrink-0 items-center gap-2 border-r border-paper-50/15 px-5 text-press">
          {label}
        </div>
      )}
      <div className="relative flex overflow-hidden">
        {/* measure via aria — track width is intrinsic (w-max) */}
        <div
          className="flex w-max whitespace-nowrap will-change-transform"
          style={{
            animation: `marqueeX ${speed}s linear infinite`,
          }}
        >
          {doubled.map((item, i) => (
            <span
              key={i}
              className={`mx-6 inline-flex items-center ${itemClassName}`}
            >
              {sep}
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
