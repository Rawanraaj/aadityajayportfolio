'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';
import { PageHeader } from '@/components/admin/page-header';
import { LoadingState } from '@/components/admin/empty-states';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/format';
import {
  FileText,
  Video as VideoIcon,
  Trophy,
  Inbox,
  TrendingUp,
  ArrowUpRight,
  Eye,
  PencilLine,
} from 'lucide-react';

interface Stats {
  publishedArticles: number;
  draftArticles: number;
  totalVideos: number;
  totalAchievements: number;
  unreadInquiries: number;
  topArticles: { id: string; title: string; view_count: number; status: string }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [articles, videos, achievements, inquiries] = await Promise.all([
        supabase.from('articles').select('id, status, view_count, title'),
        supabase.from('videos').select('id', { count: 'exact', head: true }),
        supabase.from('achievements').select('id', { count: 'exact', head: true }),
        supabase
          .from('contact_inquiries')
          .select('id', { count: 'exact', head: true })
          .eq('is_read', false),
      ]);

      const articleRows = articles.data ?? [];
      const published = articleRows.filter((a) => a.status === 'published').length;
      const drafts = articleRows.filter((a) => a.status === 'draft').length;
      const top = [...articleRows]
        .sort((a, b) => (b.view_count ?? 0) - (a.view_count ?? 0))
        .slice(0, 5)
        .map((a) => ({
          id: a.id,
          title: a.title,
          view_count: a.view_count ?? 0,
          status: a.status,
        }));

      setStats({
        publishedArticles: published,
        draftArticles: drafts,
        totalVideos: videos.count ?? 0,
        totalAchievements: achievements.count ?? 0,
        unreadInquiries: inquiries.count ?? 0,
        topArticles: top,
      });
      setLoading(false);
    }
    load();
  }, []);

  const QUICK_LINKS = [
    { label: 'Articles', href: '/admin/articles', icon: FileText, desc: 'Write & manage stories' },
    { label: 'Videos', href: '/admin/videos', icon: VideoIcon, desc: 'YouTube segments & docs' },
    { label: 'Achievements', href: '/admin/achievements', icon: Trophy, desc: 'Awards & recognitions' },
    { label: 'Hero', href: '/admin/hero', icon: TrendingUp, desc: 'Homepage hero & stats' },
    { label: 'Ticker', href: '/admin/ticker', icon: Inbox, desc: 'Headline ticker' },
    { label: 'Inquiries', href: '/admin/inquiries', icon: Inbox, desc: 'Contact submissions' },
  ];

  if (loading) return <LoadingState label="Loading overview…" />;

  const statCards = [
    {
      label: 'Published Articles',
      value: stats?.publishedArticles ?? 0,
      sub: `${stats?.draftArticles ?? 0} drafts`,
      icon: FileText,
      href: '/admin/articles',
    },
    {
      label: 'Videos',
      value: stats?.totalVideos ?? 0,
      sub: 'All segments',
      icon: VideoIcon,
      href: '/admin/videos',
    },
    {
      label: 'Achievements',
      value: stats?.totalAchievements ?? 0,
      sub: 'Awards logged',
      icon: Trophy,
      href: '/admin/achievements',
    },
    {
      label: 'Unread Inquiries',
      value: stats?.unreadInquiries ?? 0,
      sub: stats?.unreadInquiries ? 'Needs attention' : 'All read',
      icon: Inbox,
      href: '/admin/inquiries',
      alert: (stats?.unreadInquiries ?? 0) > 0,
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="A snapshot of everything across the portfolio."
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href}>
              <Card
                className={cn(
                  'group p-4 sm:p-5 bg-card/60 border-border hover:border-primary/40 transition-all hover:bg-card relative overflow-hidden',
                  s.alert && 'border-primary/40'
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={cn(
                      'w-9 h-9 rounded-md flex items-center justify-center',
                      s.alert
                        ? 'bg-primary/15 text-primary'
                        : 'bg-secondary text-muted-foreground group-hover:text-primary transition-colors'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                <p className="text-[11px] text-muted-foreground/70 mt-0.5">{s.sub}</p>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Top articles */}
        <Card className="lg:col-span-2 p-5 sm:p-6 bg-card/60 border-border">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="font-display text-lg font-semibold">Top Viewed Articles</h3>
          </div>
          {stats && stats.topArticles.length > 0 ? (
            <div className="space-y-1">
              {stats.topArticles.map((a, i) => (
                <Link
                  key={a.id}
                  href={`/admin/articles/${a.id}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-secondary/60 transition-colors group"
                >
                  <span className="font-display text-lg font-bold text-muted-foreground/50 w-6">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {a.title}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {a.view_count}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border',
                      a.status === 'published'
                        ? 'bg-primary/10 text-primary border-primary/25'
                        : 'bg-secondary text-muted-foreground border-border'
                    )}
                  >
                    {a.status}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No articles yet. Create your first one.
            </p>
          )}
        </Card>

        {/* Quick links */}
        <Card className="p-5 sm:p-6 bg-card/60 border-border">
          <div className="flex items-center gap-2 mb-4">
            <PencilLine className="w-4 h-4 text-primary" />
            <h3 className="font-display text-lg font-semibold">Quick Links</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_LINKS.map((q) => {
              const Icon = q.icon;
              return (
                <Link
                  key={q.href}
                  href={q.href}
                  className="group rounded-md border border-border bg-background-soft/50 p-3 hover:border-primary/40 hover:bg-secondary/60 transition-all"
                >
                  <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary mb-2 transition-colors" />
                  <p className="text-sm font-medium">{q.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{q.desc}</p>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground mt-8 text-center">
        Last loaded {formatDate(new Date())}
      </p>
    </div>
  );
}
