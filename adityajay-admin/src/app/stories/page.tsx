"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { archiveArticles, categories } from "@/data/articles";
import type { Category } from "@/data/articles";

const PAGE_SIZE = 6;

export default function StoriesArchive() {
  const [active, setActive] = useState<Category>("All");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    if (active === "All") return archiveArticles;
    return archiveArticles.filter((a) => a.category === active);
  }, [active]);

  // reset paging when filter changes
  function selectCategory(cat: Category) {
    setActive(cat);
    setVisible(PAGE_SIZE);
  }

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  return (
    <main className="min-h-[100svh] bg-ink-950">
      <Navbar />
      {/* Hero strip */}
      <header className="grain-overlay relative border-b border-paper-50/10 bg-ink-900 px-6 pb-12 pt-32 md:px-10 md:pb-16 md:pt-40">
        <div className="mx-auto max-w-editorial">
          <Link
            href="/#stories"
            className="mb-6 inline-flex items-center gap-2 text-[0.66rem] uppercase tracking-eyebrow-2 text-paper-50/55 transition-colors hover:text-press"
          >
            <span>←</span> Back to homepage
          </Link>
          <span className="eyebrow text-press">Full Archive</span>
          <h1 className="display-tight mt-3 font-display text-5xl font-bold text-paper-50 md:text-7xl">
            The complete
            <span className="italic text-paper-300"> archive</span>
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-paper-50/60">
            {archiveArticles.length} selected stories across investigation, politics, society, and
            interviews — published in Public Khabar 24 and syndicated outlets.
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="sticky top-0 z-30 border-b border-paper-50/10 bg-ink-950/90 px-6 py-4 backdrop-blur-md md:px-10">
        <div className="mx-auto flex max-w-editorial flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = active === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => selectCategory(cat)}
                aria-pressed={isActive}
                className={`border px-4 py-2 text-[0.66rem] uppercase tracking-eyebrow-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-press focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 ${
                  isActive
                    ? "border-press bg-press text-paper-50"
                    : "border-paper-50/20 text-paper-50/60 hover:border-paper-50/50 hover:text-paper-50"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-editorial px-6 py-14 md:px-10 md:py-20">
        {shown.length === 0 ? (
          <div className="flex h-[40svh] items-center justify-center">
            <p className="font-display text-2xl italic text-paper-50/40">
              No stories in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((article) => (
              <ArchiveCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {/* Load more */}
        {hasMore && (
          <div className="mt-14 flex justify-center">
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="group inline-flex items-center gap-3 border border-paper-50/25 px-6 py-3.5 text-[0.7rem] uppercase tracking-eyebrow-2 text-paper-50 transition-colors hover:border-press hover:bg-press focus:outline-none focus-visible:ring-2 focus-visible:ring-press focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
            >
              Load more stories
              <span className="inline-block transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
            </button>
          </div>
        )}
        {!hasMore && shown.length > PAGE_SIZE && (
          <p className="mt-14 text-center text-[0.62rem] uppercase tracking-eyebrow-2 text-paper-50/40">
            End of archive — {filtered.length} stories shown
          </p>
        )}
      </div>

      <Footer />
    </main>
  );
}

function ArchiveCard({ article }: { article: (typeof archiveArticles)[number] }) {
  return (
    <article className="group cursor-pointer">
      <Link href={article.href} className="block" aria-label={article.title}>
        <div className="relative aspect-[16/11] overflow-hidden bg-ink-800">
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover opacity-85 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05] group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent" />
          <div className="absolute inset-0 ring-1 ring-inset ring-paper-50/10 transition-colors duration-500 group-hover:ring-press/40" />
          <span className="absolute left-3 top-3 bg-press px-2.5 py-1 text-[0.58rem] uppercase tracking-eyebrow-2 text-paper-50">
            {article.category}
          </span>
        </div>
        <div className="mt-4">
          <div className="mb-2 flex items-center gap-2 text-[0.58rem] uppercase tracking-eyebrow-2 text-paper-50/45">
            <span>{article.date}</span>
            <span>·</span>
            <span>{article.readTime}</span>
          </div>
          <h3 className="font-display text-xl font-bold leading-tight text-paper-50 transition-colors group-hover:text-paper-200">
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-paper-50/60">
            {article.excerpt}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-[0.66rem] uppercase tracking-eyebrow-2 text-press transition-all group-hover:gap-3">
            Read story
            <span className="inline-block h-px w-7 bg-press transition-all duration-300 group-hover:w-10" />
          </span>
        </div>
      </Link>
    </article>
  );
}
