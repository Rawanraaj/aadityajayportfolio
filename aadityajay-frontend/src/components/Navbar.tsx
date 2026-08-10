"use client";

import { useEffect, useState } from "react";
import { navLinks } from "@/data/nav";
import { site } from "@/data/site";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("top");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // track which section is in view for nav highlighting
  useEffect(() => {
    const ids = ["top", ...navLinks.map((l) => l.href.replace("#", ""))];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-paper-50/10 bg-ink-900/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-editorial items-center justify-between px-6 py-4 md:px-10">
        <a href="#top" className="group flex items-baseline gap-2" aria-label="Home">
          <span className="font-display text-lg font-bold italic tracking-tight text-paper-50">
            Aa
          </span>
          <span className="hidden text-[0.65rem] uppercase tracking-eyebrow-1 text-paper-50/60 transition-colors group-hover:text-press sm:block">
            Aaditya Ajay
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = active === id;
            return (
              <li key={link.href} className="group relative">
                <a
                  href={link.href}
                  className={`relative text-[0.72rem] uppercase tracking-eyebrow-2 transition-colors duration-300 group-hover:text-paper-50 ${
                    isActive ? "text-paper-50" : "text-paper-50/70"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-press transition-all duration-500 ease-[cubic-bezier(0.77,0,0.18,1)] ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <a
          href="#contact"
          className="hidden items-center gap-2 border border-paper-50/20 px-4 py-2 text-[0.68rem] uppercase tracking-eyebrow-2 text-paper-50 transition-all duration-300 hover:border-press hover:bg-press hover:text-paper-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-press focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 md:inline-flex"
        >
          Press Inquiry
        </a>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col gap-1.5 p-1 md:hidden"
        >
          <span className={`h-px w-6 bg-paper-50 transition-transform duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`h-px w-6 bg-paper-50 transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`h-px w-6 bg-paper-50 transition-transform duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </nav>

      {/* mobile menu */}
      <div
        className={`overflow-hidden border-t border-paper-50/10 bg-ink-900 transition-[max-height] duration-500 ease-[cubic-bezier(0.77,0,0.18,1)] md:hidden ${
          open ? "max-h-[28rem]" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col px-6 py-4">
          {navLinks.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = active === id;
            return (
              <li key={link.href} className="border-b border-paper-50/5">
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between py-3.5 text-sm uppercase tracking-eyebrow-2 transition-colors ${
                    isActive ? "text-press" : "text-paper-50/80"
                  }`}
                >
                  {link.label}
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-press" />}
                </a>
              </li>
            );
          })}
          <li className="mt-2">
            <a
              href={site.outletSite}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="block py-3 text-sm uppercase tracking-eyebrow-2 text-press"
            >
              Visit {site.outlet} →
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
