"use client";

import React from "react";

export const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/1K15Scqmwp/",
    icon: FacebookIcon,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/aaditya_ajay/",
    icon: InstagramIcon,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@publickhabar2463",
    icon: YouTubeIcon,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@aadityaajay07",
    icon: TikTokIcon,
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/9779816846265",
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
      <path d="M12.53 0.02C13.84 0 15.14 0.01 16.44 0c0.08 1.53 0.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-0.05-2.89-0.35-4.2-0.97-0.57-0.26-1.1-0.59-1.62-0.93-0.01 3.44 0.01 6.88-0.02 10.32-0.12 1.68-0.72 3.36-1.78 4.68-1.72 2.2-4.57 3.46-7.34 3.18-1.73-0.13-3.4-0.85-4.69-2.01-2.17-1.86-3.22-4.93-2.58-7.75 0.49-2.27 2-4.27 4.02-5.42 1.75-1.02 3.88-1.38 5.89-0.95 0.04 1.54-0.07 3.08-0.11 4.62-1.15-0.38-2.5-0.27-3.52 0.37-0.74 0.44-1.31 1.12-1.62 1.9-0.26 0.6-0.2 1.28-0.18 1.92 0.25 1.81 1.97 3.32 3.8 3.18 1.2-0.03 2.35-0.71 3.01-1.69 0.22-0.35 0.42-0.73 0.44-1.15 0.15-2.1 0.09-4.2 0.1-6.3 0.01-3.42-0.01-6.83 0.02-10.24z" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-0.297-0.149-1.758-0.867-2.03-0.967-0.273-0.099-0.471-0.148-0.67 0.15-0.197 0.297-0.767 0.966-0.94 1.164-0.173 0.199-0.347 0.223-0.644 0.075-0.297-0.15-1.255-0.463-2.39-1.475-0.883-0.788-1.48-1.761-1.653-2.059-0.173-0.297-0.018-0.458 0.13-0.606 0.134-0.133 0.298-0.347 0.446-0.52 0.149-0.174 0.198-0.298 0.298-0.497 0.099-0.198 0.05-0.371-0.025-0.52-0.075-0.149-0.669-1.612-0.916-2.207-0.242-0.579-0.487-0.501-0.669-0.51-0.173-0.008-0.371-0.01-0.57-0.01-0.198 0-0.52 0.074-0.792 0.372-0.272 0.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074 0.149 0.198 2.096 3.2 5.077 4.487 0.709 0.306 1.262 0.489 1.694 0.625 0.712 0.227 1.36 0.195 1.871 0.118 0.571-0.085 1.758-0.719 2.006-1.413 0.248-0.694 0.248-1.289 0.173-1.413-0.074-0.124-0.272-0.198-0.57-0.347zM12.05 21.785h-0.003a9.87 9.87 0 0 1-5.031-1.378l-0.361-0.214-3.741 0.981 0.998-3.648-0.235-0.374a9.86 9.86 0 0 1-1.51-5.26c0.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-0.003 5.45-4.437 9.884-9.885 9.884zM20.52 3.449C18.24 1.245 15.24 0.004 12.045 0 5.463 0 0.104 5.334 0.101 11.893c-0.001 2.096 0.547 4.142 1.588 5.945L0.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h0.005c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411z" />
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
