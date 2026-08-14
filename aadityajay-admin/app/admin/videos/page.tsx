'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';
import { logAudit } from '@/lib/audit';
import { type Video } from '@/lib/types';
import { PageHeader } from '@/components/admin/page-header';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { EmptyState, LoadingState } from '@/components/admin/empty-states';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Plus,
  Video as VideoIcon,
  Trash2,
  Pencil,
  Star,
  ExternalLink,
} from 'lucide-react';

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Video | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast.error('Failed to load videos');
    } else {
      setVideos((data as Video[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleFeatured(v: Video) {
    let update: { featured: boolean };
    if (v.featured) {
      update = { featured: false };
    } else {
      // unfeature all others, then feature this one
      await supabase.from('videos').update({ featured: false }).eq('featured', true);
      update = { featured: true };
    }
    const { error } = await supabase.from('videos').update(update).eq('id', v.id);
    if (error) {
      toast.error('Failed to toggle featured');
      return;
    }
    setVideos((prev) =>
      prev.map((x) =>
        x.id === v.id
          ? { ...x, featured: !v.featured }
          : update.featured === true
          ? { ...x, featured: false }
          : x
      )
    );
    await logAudit({
      action: 'update',
      target_type: 'video',
      target_id: v.id,
      details: `${!v.featured ? 'Featured' : 'Unfeatured'} video "${v.title}"`,
    });
    toast.success(!v.featured ? 'Marked as featured' : 'Removed featured');
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const { error } = await supabase.from('videos').delete().eq('id', deleteTarget.id);
    if (error) {
      toast.error('Failed to delete video');
      return;
    }
    await logAudit({
      action: 'delete',
      target_type: 'video',
      target_id: deleteTarget.id,
      details: `Deleted video "${deleteTarget.title}"`,
    });
    setVideos((prev) => prev.filter((v) => v.id !== deleteTarget.id));
    toast.success('Video deleted');
    setDeleteTarget(null);
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow="Media"
        title="Videos"
        description="YouTube segments, broadcasts, and documentaries."
        actions={
          <Link href="/admin/videos/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              New Video
            </Button>
          </Link>
        }
      />

      {loading ? (
        <LoadingState label="Loading videos…" />
      ) : videos.length === 0 ? (
        <EmptyState
          icon={<VideoIcon className="w-12 h-12" />}
          title="No videos yet"
          description="Add your first YouTube video to populate the Media section."
          action={
            <Link href="/admin/videos/new">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                New Video
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((v) => (
            <Card
              key={v.id}
              className={cn(
                'group overflow-hidden bg-card/40 border-border hover:border-primary/40 transition-all',
                v.featured && 'border-primary/40 ring-1 ring-primary/20'
              )}
            >
              <div className="relative aspect-video bg-background-soft overflow-hidden">
                {v.thumbnail_override || v.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={v.thumbnail_override || v.thumbnail_url || ''}
                    alt={v.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <VideoIcon className="w-8 h-8 opacity-50" />
                  </div>
                )}
                {v.featured && (
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-primary text-primary-foreground px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 fill-current" />
                    Featured
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <Link
                    href={`/admin/videos/${v.id}`}
                    className="font-medium text-sm hover:text-primary transition-colors line-clamp-2"
                  >
                    {v.title}
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {v.category} · {formatDate(v.published_at)}
                </p>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Switch
                      checked={v.featured}
                      onCheckedChange={() => toggleFeatured(v)}
                    />
                    <span className="text-xs text-muted-foreground">Featured</span>
                  </label>
                  <div className="flex items-center gap-1">
                    <a
                      href={v.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <Link href={`/admin/videos/${v.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteTarget(v)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete this video?"
        description={`"${deleteTarget?.title}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
}
