import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SafeImage from "@/components/SafeImage";
import { getArticleById } from "@/lib/supabase";
import ArticleViewTracker from "./ArticleViewTracker";

export const revalidate = 120;

export default async function StoryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const article = await getArticleById(params.id);

  if (!article) {
    return (
      <main className="min-h-[100svh] bg-ink-950 flex flex-col justify-between">
        <Navbar />
        <div className="mx-auto max-w-editorial px-6 py-32 text-center">
          <h1 className="font-display text-4xl font-bold text-paper-50 mb-4">
            Story Not Found
          </h1>
          <p className="text-paper-50/60 mb-8">
            The requested article could not be found or has been archived.
          </p>
          <Link
            href="/stories"
            className="border border-paper-50/20 px-6 py-3 text-xs uppercase tracking-eyebrow-2 text-paper-50 hover:bg-press transition"
          >
            ← Back to All Stories
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-[100svh] bg-ink-950">
      <ArticleViewTracker articleId={article.id} />
      <Navbar />

      {/* Header */}
      <article className="grain-overlay relative border-b border-paper-50/10 bg-ink-900 pt-32 pb-16 px-6 md:px-10 md:pt-40">
        <div className="mx-auto max-w-editorial">
          <Link
            href="/stories"
            className="mb-6 inline-flex items-center gap-2 text-[0.66rem] uppercase tracking-eyebrow-2 text-paper-50/55 transition-colors hover:text-press"
          >
            <span>←</span> Back to all stories
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-press px-2.5 py-1 text-[0.6rem] uppercase tracking-eyebrow-2 text-paper-50 font-semibold">
              {article.category}
            </span>
            <span className="text-[0.6rem] uppercase tracking-eyebrow-2 text-paper-50/55">
              {article.date} · {article.readTime}
            </span>
            {article.viewCount !== undefined && article.viewCount > 0 && (
              <span className="text-[0.6rem] font-mono bg-paper-50/10 text-paper-50/70 px-2 py-0.5 rounded">
                👁 {article.viewCount} reads
              </span>
            )}
          </div>

          <h1 className="display-tight font-display text-4xl md:text-6xl font-bold text-paper-50 leading-tight">
            {article.title}
          </h1>

          <p className="mt-6 text-base md:text-xl text-paper-50/75 leading-relaxed font-sans max-w-3xl">
            {article.excerpt}
          </p>
        </div>
      </article>

      {/* Cover Image */}
      <div className="mx-auto max-w-editorial px-6 md:px-10 py-10">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink-800 border border-paper-50/10 rounded-lg">
          <SafeImage
            src={article.image}
            alt={article.title}
            fill
            priority
            sizes="(min-width: 1024px) 1100px, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Article Body Content */}
      <section className="mx-auto max-w-editorial px-6 md:px-10 pb-24">
        <div className="max-w-3xl space-y-6 text-paper-50/80 leading-relaxed text-base">
          <p>
            Reporting by <strong className="text-paper-50">Aaditya Ajay</strong> for{" "}
            <em>Public Khabar 24</em>.
          </p>
          <p>
            {article.excerpt}
          </p>
          <div className="p-6 my-8 border-l-2 border-press bg-white/5 italic font-display text-xl text-paper-50">
            "Accountability and verified truth are the bedrocks of investigative journalism."
          </div>
          <p>
            This article represents on-the-ground investigative reporting conducted across Nepal.
            Full syndication and press releases can be referenced via Public Khabar 24 official desk filings.
          </p>
        </div>

        <div className="mt-16 pt-8 border-t border-paper-50/10 flex justify-between items-center">
          <Link
            href="/stories"
            className="text-xs uppercase tracking-eyebrow-2 text-press hover:underline font-semibold"
          >
            ← Explore More Stories
          </Link>
          <Link
            href="/#contact"
            className="text-xs uppercase tracking-eyebrow-2 text-paper-50/60 hover:text-paper-50 transition"
          >
            Submit a Lead / Tip →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
