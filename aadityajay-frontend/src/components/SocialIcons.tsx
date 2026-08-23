"use client";

import React from "react";

// TODO: Replace with real social media URLs before final launch
export const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com/PLACEHOLDER",
    icon: FacebookIcon,
  },
  {
    name: "X (Twitter)",
    href: "https://x.com/PLACEHOLDER",
    icon: XIcon,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/PLACEHOLDER",
    icon: InstagramIcon,
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@PLACEHOLDER",
    icon: YouTubeIcon,
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@PLACEHOLDER",
    icon: TikTokIcon,
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/PLACEHOLDER",
    icon: WhatsAppIcon,
  },
];

export function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function YouTubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-1.37V9.12a6.34 6.34 0 1 0 6.34 6.34V9.3a8.28 8.28 0 0 0 4.77 1.49v-4.1a4.83 4.83 0 0 1-1-0.001z" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.233-1.237a9.96 9.96 0 0 0 4.779 1.221h.004c5.505 0 9.988-4.478 9.989-9.985 0-2.668-1.039-5.176-2.926-7.062A9.923 9.923 0 0 0 12.012 2zm5.8 13.9c-.244.685-1.42 1.306-1.956 1.385-.506.075-1.157.108-1.865-.117-.43-.137-1-.322-1.722-.635-3.04-1.316-5.018-4.408-5.17-4.61-.153-.203-1.236-1.644-1.236-3.136 0-1.493.776-2.228 1.052-2.528.275-.3.6-.375.8-.375.2 0 .4 0 .575.008.188.008.438-.07.688.53.25.6.85 2.073.925 2.223.075.15.125.325.025.525s-.15.3-.3.475c-.15.175-.316.392-.45.525-.15.15-.308.315-.133.615.175.3.777 1.28 1.67 2.075 1.15.1.02 2.062 1.62 2.337 1.845.275.225.438.188.6-.075.163-.263.688-.8.875-1.075.188-.275.375-.225.625-.125.25.1 1.588.75 1.863.888.275.138.462.2.525.313.063.113.063.663-.181 1.348z" />
    </svg>
  );
}

export default function SocialIcons({ className = "flex flex-wrap gap-2.5" }: { className?: string }) {
  return (
    <div className={className}>
      {socialLinks.map((s) => {
        const Icon = s.icon;
        return (
          <a
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.name}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-paper-50/20 bg-ink-900/60 text-paper-50/75 transition-all duration-200 hover:border-press hover:bg-press hover:text-paper-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-press"
          >
            <Icon className="h-4 w-4" />
          </a>
        );
      })}
    </div>
  );
}
