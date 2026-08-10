"use client";

import { useEffect } from "react";
import { incrementArticleViews } from "@/lib/supabase";

export default function ArticleViewTracker({ articleId }: { articleId: string }) {
  useEffect(() => {
    if (articleId) {
      incrementArticleViews(articleId);
    }
  }, [articleId]);

  return null;
}
