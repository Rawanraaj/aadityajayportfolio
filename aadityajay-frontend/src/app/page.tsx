import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import FeaturedStories from "@/components/FeaturedStories";
import Media from "@/components/Media";
import Achievements from "@/components/Achievements";
import Outlet from "@/components/Outlet";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

import {
  getPublishedArticles,
  getVideos,
  getAchievements,
  getTickerItems,
} from "@/lib/supabase";

export const revalidate = 120; // Incremental Static Regeneration every 2 minutes

export default async function Page() {
  const [articles, videosList, achievementItems, tickerList] = await Promise.all([
    getPublishedArticles(),
    getVideos(),
    getAchievements(),
    getTickerItems(),
  ]);

  return (
    <main className="relative">
      <Navbar />
      <Hero tickerList={tickerList} />
      <About />
      <FeaturedStories articles={articles} />
      <Media videoList={videosList} />
      <Achievements achievementItems={achievementItems} />
      <Outlet />
      <Contact />
      <Footer />
    </main>
  );
}
