import { createClient } from "@supabase/supabase-js";
import { featuredArticles, archiveArticles, Article } from "@/data/articles";
import { videos as staticVideos, Video } from "@/data/videos";
import { achievements as staticAchievements, Achievement } from "@/data/achievements";
import { tickerItems as staticTickerItems } from "@/data/nav";
import { site as staticSite, heroStats as staticHeroStats } from "@/data/site";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qbybwgcijfzqioxdmham.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFieWJ3Z2NpamZ6cWlveGRtaGFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNTk1NjgsImV4cCI6MjEwMTgzNTU2OH0.jLzK985rO3tPrq2p5qhBDxZo4LeZvmne2Bch8MCda3I";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type HeroData = {
  tagline: string;
  heroPhotoUrl: string | null;
  stats: { value: number; suffix: string; label: string }[];
};

/**
 * Fetch hero singleton from Supabase.
 * Returns static fallback if query fails or row is empty.
 */
export async function getHeroData(): Promise<HeroData> {
  try {
    const { data, error } = await supabase
      .from("hero")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) {
      console.warn("Supabase hero query failed or empty, using fallback data.");
      return {
        tagline: staticSite.tagline,
        heroPhotoUrl: null,
        stats: staticHeroStats,
      };
    }

    const stats = [
      { value: data.stat_years || 0, suffix: "+", label: "Years Reporting" },
      { value: data.stat_stories || 0, suffix: "+", label: "Stories Published" },
      { value: data.stat_recognitions || 0, suffix: "", label: "National Recognitions" },
    ];

    // Only use Supabase stats if they have real values (not all zeros from seed row)
    const hasRealStats = stats.some((s) => s.value > 0);

    return {
      tagline: data.tagline || staticSite.tagline,
      heroPhotoUrl: data.hero_photo_url || null,
      stats: hasRealStats ? stats : staticHeroStats,
    };
  } catch (err) {
    console.error("Error fetching hero data from Supabase:", err);
    return {
      tagline: staticSite.tagline,
      heroPhotoUrl: null,
      stats: staticHeroStats,
    };
  }
}

/**
 * Fetch published articles from Supabase.
 * Returns static fallback if Supabase query fails or returns empty set.
 */
export async function getPublishedArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn("Supabase articles query empty or offline, using fallback data.");
      return archiveArticles;
    }

    return data.map((item: any) => ({
      id: item.id?.toString() || item.slug || `art-${Date.now()}`,
      title: item.title || "Untitled Story",
      excerpt: item.excerpt || item.summary || "",
      category: item.category || "Investigation",
      date: item.published_at || item.date || "2025",
      readTime: item.read_time || item.readTime || "7 min read",
      image:
        item.thumbnail_url ||
        item.image_url ||
        item.image ||
        "https://images.pexels.com/photos/6621337/pexels-photo-6621337.jpeg?auto=compress&cs=tinysrgb&w=1200",
      featured: Boolean(item.featured),
      href: item.external_link || `/stories/${item.id || item.slug}`,
      viewCount: item.view_count || 0,
    }));
  } catch (err) {
    console.error("Error fetching articles from Supabase:", err);
    return archiveArticles;
  }
}

/**
 * Fetch single article by ID or slug.
 */
export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .or(`id.eq.${id},slug.eq.${id}`)
      .single();

    if (error || !data) {
      // Find in static archive fallback
      const found = archiveArticles.find((a) => a.id === id || a.href.endsWith(id));
      return found || null;
    }

    return {
      id: data.id?.toString() || id,
      title: data.title || "Untitled Story",
      excerpt: data.excerpt || "",
      category: data.category || "Investigation",
      date: data.published_at || data.date || "2025",
      readTime: data.read_time || "7 min read",
      image:
        data.thumbnail_url ||
        data.image_url ||
        data.image ||
        "https://images.pexels.com/photos/6621337/pexels-photo-6621337.jpeg?auto=compress&cs=tinysrgb&w=1200",
      featured: Boolean(data.featured),
      href: data.external_link || `/stories/${data.id || id}`,
      viewCount: data.view_count || 0,
    };
  } catch (err) {
    console.error("Error fetching article by ID:", err);
    const found = archiveArticles.find((a) => a.id === id || a.href.endsWith(id));
    return found || null;
  }
}

/**
 * Atomically increment view count on an article.
 */
export async function incrementArticleViews(id: string): Promise<void> {
  if (!id) return;
  try {
    const { error } = await supabase.rpc("increment_article_views", { article_id: id });
    if (error) {
      const { data } = await supabase
        .from("articles")
        .select("view_count")
        .eq("id", id)
        .single();
      if (data) {
        await supabase
          .from("articles")
          .update({ view_count: (data.view_count || 0) + 1 })
          .eq("id", id);
      }
    }
  } catch (e) {
    // Non-blocking error
  }
}

/**
 * Fetch media & video broadcasts.
 */
export async function getVideos(): Promise<Video[]> {
  try {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return staticVideos;
    }

    return data.map((item: any) => {
      const yId = item.youtube_id || item.youtubeId || "scMbinQ6w2M";
      const posterUrl =
        item.thumbnail_override ||
        item.thumbnail_url ||
        item.poster ||
        `https://img.youtube.com/vi/${yId}/maxresdefault.jpg`;

      const formattedDate = item.published_at
        ? new Date(item.published_at).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })
        : item.date || "2025";

      return {
        id: item.id?.toString() || `vid-${Date.now()}`,
        title: item.title || "Broadcast Video",
        category: item.category || "Live Segment",
        duration: item.duration || "10:00",
        date: formattedDate,
        outlet: item.outlet || `Public Khabar 24 · ${item.category || "Broadcast"}`,
        youtubeId: yId,
        poster: posterUrl,
        featured: Boolean(item.featured),
        description: item.description || "",
      };
    });
  } catch (err) {
    return staticVideos;
  }
}

/**
 * Fetch achievements.
 */
export async function getAchievements(): Promise<Achievement[]> {
  try {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("year", { ascending: false });

    if (error || !data || data.length === 0) {
      return staticAchievements;
    }

    return data.map((item: any) => ({
      id: item.id?.toString() || `ach-${Date.now()}`,
      title: item.title || "",
      year: item.year || "2025",
      body: item.body || item.description || "",
      seal: item.seal || item.organization || "",
      icon: (item.icon || "award") as Achievement["icon"],
    }));
  } catch (err) {
    return staticAchievements;
  }
}

/**
 * Fetch Marquee ticker headlines.
 */
export async function getTickerItems(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("ticker")
      .select("text, is_active, order")
      .eq("is_active", true)
      .order("order", { ascending: true });

    if (error || !data || data.length === 0) {
      return staticTickerItems;
    }

    return data.map((item: any) => item.text).filter(Boolean);
  } catch (err) {
    return staticTickerItems;
  }
}
