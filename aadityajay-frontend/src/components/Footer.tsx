"use client";

import { site } from "@/data/site";
import { navLinks } from "@/data/nav";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="grain-overlay relative border-t border-paper-50/15 bg-ink-950 py-14">
      <div className="mx-auto max-w-editorial px-6 md:px-10">
        <div className="grid grid-cols-12 gap-y-10">
          <div className="col-span-12 md:col-span-5">
            <div className="font-display text-3xl font-black text-paper-50">
              Aaditya Ajay
            </div>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-paper-50/55">
              {site.role}. {site.tagline}
            </p>
          </div>

          <div className="col-span-6 md:col-span-3 md:col-start-7">
            <div className="eyebrow mb-4 text-paper-50/45">Sections</div>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-paper-50/70 transition-colors hover:text-press"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-6 md:col-span-3">
            <div className="eyebrow mb-4 text-paper-50/45">Elsewhere</div>
            <ul className="space-y-2">
              <li>
                <a
                  href={site.outletSite}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-paper-50/70 transition-colors hover:text-press"
                >
                  Public Khabar 24 →
                </a>
              </li>
              <li>
                <a
                  href={site.socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-paper-50/70 transition-colors hover:text-press"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href={site.socials.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-paper-50/70 transition-colors hover:text-press"
                >
                  X / Twitter
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-sm text-paper-50/70 transition-colors hover:text-press"
                >
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-paper-50/10 pt-6 md:flex-row md:items-center">
          <span className="text-[0.62rem] uppercase tracking-eyebrow-2 text-paper-50/40">
            © {year} Aaditya Ajay. All rights reserved.
          </span>
          <span className="text-[0.62rem] uppercase tracking-eyebrow-2 text-paper-50/40">
            Editorial portfolio · Nepal
          </span>
        </div>
      </div>
    </footer>
  );
}
