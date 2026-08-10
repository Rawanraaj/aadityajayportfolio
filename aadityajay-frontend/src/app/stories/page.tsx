import { getPublishedArticles } from "@/lib/supabase";
import StoriesArchiveClient from "./StoriesArchiveClient";

export const revalidate = 120;

export default async function StoriesArchive() {
  const articles = await getPublishedArticles();
  return <StoriesArchiveClient articles={articles} />;
}
