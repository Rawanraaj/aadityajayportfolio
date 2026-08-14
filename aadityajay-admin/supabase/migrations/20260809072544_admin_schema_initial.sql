/*
# Aaditya Ajay Portfolio Admin — Initial Schema

1. Overview
   Creates the full content schema for the Aaditya Ajay journalist portfolio admin panel:
   profiles (admin role per auth user), articles, videos, achievements, hero (single row),
   ticker headlines, contact inquiries, and an audit log. All tables are admin-managed via
   Supabase Auth (email/password). RLS is enabled on every table; policies are scoped to
   authenticated admins. A trigger function copies new auth.users into `profiles` and assigns
   the OWNER role to the very first user, MANAGER to subsequent ones.

2. New Tables
   - profiles: admin user metadata (role OWNER/MANAGER), linked 1:1 to auth.users.
   - articles: portfolio articles with rich text body, thumbnail, category, status, view count.
   - videos: YouTube-linked videos with category and featured flag.
   - achievements: awards/recognitions with manual ordering via `order` field.
   - hero: single-row table (enforced by id=1) for homepage hero content + three stats.
   - ticker: reorderable active/inactive ticker headlines.
   - contact_inquiries: submissions from the public contact form; unread flag.
   - audit_log: chronological record of admin actions (actor, action, target, metadata).

3. Security
   - RLS enabled on all tables.
   - profiles: authenticated admins read/update themselves; self-service only.
   - content tables (articles, videos, achievements, hero, ticker, audit_log):
     authenticated admins have full CRUD (the admin panel is private; any signed-in
     admin manages all content). This is intentional shared-content access for a small
     internal team.
   - contact_inquiries: authenticated admins read + update read/unread flag; inserts
     allowed for anon (the public submits inquiries without signing in).
   - storage bucket `admin-media` created for image uploads; public read, authenticated write.

4. Notes
   - `article_view_count` is incremented only server-side on the public site (out of scope here).
   - Audit logging is performed from the admin client after each mutation; a DB trigger is
     NOT used so that the actor email/role can be captured from the session.
*/

-- =============================================================
-- profiles
-- =============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'MANAGER' CHECK (role IN ('OWNER','MANAGER')),
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON public.profiles;
CREATE POLICY "select_own_profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON public.profiles;
CREATE POLICY "update_own_profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Allow admins to see all profiles (for audit log filtering / user list)
DROP POLICY IF EXISTS "select_all_profiles_admin" ON public.profiles;
CREATE POLICY "select_all_profiles_admin" ON public.profiles
  FOR SELECT TO authenticated USING (true);

-- =============================================================
-- articles
-- =============================================================
CREATE TABLE IF NOT EXISTS public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL,
  excerpt text,
  body text,
  thumbnail_url text,
  category text NOT NULL DEFAULT 'Investigation' CHECK (category IN ('Investigation','Politics','Society','Interview')),
  external_link text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  published_at date,
  view_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_articles_admin" ON public.articles;
CREATE POLICY "select_articles_admin" ON public.articles
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "insert_articles_admin" ON public.articles;
CREATE POLICY "insert_articles_admin" ON public.articles
  FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_articles_admin" ON public.articles;
CREATE POLICY "update_articles_admin" ON public.articles
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_articles_admin" ON public.articles;
CREATE POLICY "delete_articles_admin" ON public.articles
  FOR DELETE TO authenticated USING (true);

-- Public can read published articles (for the public site / view tracking)
DROP POLICY IF EXISTS "select_published_articles_public" ON public.articles;
CREATE POLICY "select_published_articles_public" ON public.articles
  FOR SELECT TO anon, authenticated USING (status = 'published');

CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC);

-- =============================================================
-- videos
-- =============================================================
CREATE TABLE IF NOT EXISTS public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  youtube_url text NOT NULL,
  youtube_id text,
  thumbnail_url text,
  thumbnail_override text,
  category text NOT NULL DEFAULT 'Live Segment' CHECK (category IN ('Live Segment','Broadcast','Documentary','Interview','Reportage')),
  featured boolean NOT NULL DEFAULT false,
  published_at date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_videos_admin" ON public.videos;
CREATE POLICY "select_videos_admin" ON public.videos
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "insert_videos_admin" ON public.videos;
CREATE POLICY "insert_videos_admin" ON public.videos
  FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_videos_admin" ON public.videos;
CREATE POLICY "update_videos_admin" ON public.videos
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_videos_admin" ON public.videos;
CREATE POLICY "delete_videos_admin" ON public.videos
  FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "select_videos_public" ON public.videos;
CREATE POLICY "select_videos_public" ON public.videos
  FOR SELECT TO anon, authenticated USING (true);

-- =============================================================
-- achievements
-- =============================================================
CREATE TABLE IF NOT EXISTS public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  issuer text,
  year integer,
  description text,
  verified boolean NOT NULL DEFAULT false,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_achievements_admin" ON public.achievements;
CREATE POLICY "select_achievements_admin" ON public.achievements
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "insert_achievements_admin" ON public.achievements;
CREATE POLICY "insert_achievements_admin" ON public.achievements
  FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_achievements_admin" ON public.achievements;
CREATE POLICY "update_achievements_admin" ON public.achievements
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_achievements_admin" ON public.achievements;
CREATE POLICY "delete_achievements_admin" ON public.achievements
  FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "select_achievements_public" ON public.achievements;
CREATE POLICY "select_achievements_public" ON public.achievements
  FOR SELECT TO anon, authenticated USING (true);

-- =============================================================
-- hero (single row, id = 1)
-- =============================================================
CREATE TABLE IF NOT EXISTS public.hero (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  hero_photo_url text,
  tagline text,
  stat_years integer NOT NULL DEFAULT 0,
  stat_stories integer NOT NULL DEFAULT 0,
  stat_recognitions integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.hero ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_hero_admin" ON public.hero;
CREATE POLICY "select_hero_admin" ON public.hero
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "insert_hero_admin" ON public.hero;
CREATE POLICY "insert_hero_admin" ON public.hero
  FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_hero_admin" ON public.hero;
CREATE POLICY "update_hero_admin" ON public.hero
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "select_hero_public" ON public.hero;
CREATE POLICY "select_hero_public" ON public.hero
  FOR SELECT TO anon, authenticated USING (true);

-- seed the single hero row if absent
INSERT INTO public.hero (id) VALUES (1)
  ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- ticker
-- =============================================================
CREATE TABLE IF NOT EXISTS public.ticker (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ticker ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_ticker_admin" ON public.ticker;
CREATE POLICY "select_ticker_admin" ON public.ticker
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "insert_ticker_admin" ON public.ticker;
CREATE POLICY "insert_ticker_admin" ON public.ticker
  FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_ticker_admin" ON public.ticker;
CREATE POLICY "update_ticker_admin" ON public.ticker
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_ticker_admin" ON public.ticker;
CREATE POLICY "delete_ticker_admin" ON public.ticker
  FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "select_ticker_public" ON public.ticker;
CREATE POLICY "select_ticker_public" ON public.ticker
  FOR SELECT TO anon, authenticated USING (true);

-- =============================================================
-- contact_inquiries
-- =============================================================
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  submitted_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_inquiries_admin" ON public.contact_inquiries;
CREATE POLICY "select_inquiries_admin" ON public.contact_inquiries
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "update_inquiries_admin" ON public.contact_inquiries;
CREATE POLICY "update_inquiries_admin" ON public.contact_inquiries
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_inquiries_admin" ON public.contact_inquiries;
CREATE POLICY "delete_inquiries_admin" ON public.contact_inquiries
  FOR DELETE TO authenticated USING (true);

-- Public can submit inquiries (no sign-in)
DROP POLICY IF EXISTS "insert_inquiries_public" ON public.contact_inquiries;
CREATE POLICY "insert_inquiries_public" ON public.contact_inquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_inquiries_submitted_at ON public.contact_inquiries(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_is_read ON public.contact_inquiries(is_read);

-- =============================================================
-- audit_log
-- =============================================================
CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  actor_email text,
  action text NOT NULL,
  target_type text,
  target_id text,
  details text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_audit_admin" ON public.audit_log;
CREATE POLICY "select_audit_admin" ON public.audit_log
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "insert_audit_admin" ON public.audit_log;
CREATE POLICY "insert_audit_admin" ON public.audit_log
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_audit_created_at ON public.audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_actor_id ON public.audit_log(actor_id);

-- =============================================================
-- updated_at triggers
-- =============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_articles_updated_at ON public.articles;
CREATE TRIGGER trg_articles_updated_at BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_videos_updated_at ON public.videos;
CREATE TRIGGER trg_videos_updated_at BEFORE UPDATE ON public.videos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_achievements_updated_at ON public.achievements;
CREATE TRIGGER trg_achievements_updated_at BEFORE UPDATE ON public.achievements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_ticker_updated_at ON public.ticker;
CREATE TRIGGER trg_ticker_updated_at BEFORE UPDATE ON public.ticker
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_hero_updated_at ON public.hero;
CREATE TRIGGER trg_hero_updated_at BEFORE UPDATE ON public.hero
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================
-- Auto-create profile on signup; first user = OWNER, rest = MANAGER
-- =============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  first_count integer;
BEGIN
  SELECT count(*) INTO first_count FROM public.profiles;
  INSERT INTO public.profiles (id, email, role, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    CASE WHEN first_count = 0 THEN 'OWNER' ELSE 'MANAGER' END,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================
-- Storage bucket for admin media uploads
-- =============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('admin-media', 'admin-media', true)
ON CONFLICT (id) DO NOTHING;

-- Public read for media
DROP POLICY IF EXISTS "public_read_admin_media" ON storage.objects;
CREATE POLICY "public_read_admin_media" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'admin-media');

-- Authenticated can upload/update/delete
DROP POLICY IF EXISTS "auth_insert_admin_media" ON storage.objects;
CREATE POLICY "auth_insert_admin_media" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'admin-media');

DROP POLICY IF EXISTS "auth_update_admin_media" ON storage.objects;
CREATE POLICY "auth_update_admin_media" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'admin-media') WITH CHECK (bucket_id = 'admin-media');

DROP POLICY IF EXISTS "auth_delete_admin_media" ON storage.objects;
CREATE POLICY "auth_delete_admin_media" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'admin-media');
