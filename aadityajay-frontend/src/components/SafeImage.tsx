"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
  className?: string;
}

export default function SafeImage({
  src,
  alt,
  fill,
  className = "",
  fallbackSrc,
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);

  // If no src or onError triggered, render branded editorial placeholder
  if (error || !src) {
    if (fallbackSrc && !error) {
      return (
        <Image
          {...props}
          src={fallbackSrc}
          alt={alt || "Media thumbnail"}
          fill={fill}
          className={className}
          onError={() => setError(true)}
        />
      );
    }

    return (
      <div
        className={`relative flex items-center justify-center bg-gradient-to-br from-ink-950 via-[#0b1120] to-ink-900 overflow-hidden ${
          fill ? "absolute inset-0 w-full h-full" : "w-full h-full min-h-[200px]"
        } ${className}`}
      >
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #F5F1EA 1px, transparent 1px), linear-gradient(to bottom, #F5F1EA 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center gap-2 text-center p-4">
          <div className="w-10 h-10 rounded-full border border-press/40 bg-press/10 flex items-center justify-center font-display font-bold text-press text-sm tracking-widest shadow-inner">
            Aa
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-paper-50/40">
            Public Khabar 24
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-press/40 via-press to-press/40" />
      </div>
    );
  }

  return (
    <Image
      {...props}
      src={src}
      alt={alt || "Article image"}
      fill={fill}
      className={className}
      onError={() => setError(true)}
    />
  );
}
