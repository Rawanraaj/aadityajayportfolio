export type AdminRole = 'OWNER' | 'MANAGER';

export type ArticleCategory = 'Investigation' | 'Politics' | 'Society' | 'Interview';
export type ArticleStatus = 'draft' | 'published';

export type VideoCategory =
  | 'Live Segment'
  | 'Broadcast'
  | 'Documentary'
  | 'Interview'
  | 'Reportage';

export interface Profile {
  id: string;
  email: string;
  role: AdminRole;
  display_name: string | null;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  thumbnail_url: string | null;
  category: ArticleCategory;
  external_link: string | null;
  status: ArticleStatus;
  published_at: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  title: string;
  youtube_url: string;
  youtube_id: string | null;
  thumbnail_url: string | null;
  thumbnail_override: string | null;
  category: VideoCategory;
  featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  issuer: string | null;
  year: number | null;
  description: string | null;
  verified: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Hero {
  id: number;
  hero_photo_url: string | null;
  tagline: string | null;
  stat_years: number;
  stat_stories: number;
  stat_recognitions: number;
  updated_at: string;
}

export interface Ticker {
  id: string;
  text: string;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  submitted_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  details: string | null;
  created_at: string;
}

export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  'Investigation',
  'Politics',
  'Society',
  'Interview',
];

export const VIDEO_CATEGORIES: VideoCategory[] = [
  'Live Segment',
  'Broadcast',
  'Documentary',
  'Interview',
  'Reportage',
];
