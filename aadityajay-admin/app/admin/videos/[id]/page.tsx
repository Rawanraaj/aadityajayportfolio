'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';
import { logAudit } from '@/lib/audit';
import { youtubeIdFromUrl, youtubeThumb, formatDate } from '@/lib/format';
import { VIDEO_CATEGORIES, type Video, type VideoCategory } from '@/lib/types';
import { PageHeader } from '@/components/admin/page-header';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { ImageUpload } from '@/components/admin/image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Save, Trash2, Loader2, Youtube, Star } from 'lucide-react';

interface FormData {
  title: string;
  youtube_url: string;
  thumbnail_override: string | null;
  category: VideoCategory;
  featured: boolean;
  published_at: string;
}

const EMPTY: FormData = {
  title: '',
  youtube_url: '',
  thumbnail_override: null,
  category: 'Live Segment',
  featured: false,
  published_at: new Date().toISOString().slice(0, 10),
};

export default function VideoEditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;
  const isNew = id === 'new';

  const [form, setForm] = useState<FormData>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const videoIdRef = useRef<string | null>(isNew ? null : id);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error || !data) {
        toast.error('Video not found');
        router.replace('/admin/videos');
        return;
      }
      const v = data as Video;
      setForm({
        title: v.title,
        youtube_url: v.youtube_url,
        thumbnail_override: v.thumbnail_override,
        category: v.category,
        featured: v.featured,
        published_at: v.published_at ?? new Date().toISOString().slice(0, 10),
      });
      setLoading(false);
    })();
  }, [id, isNew, router]);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const youtubeId = youtubeIdFromUrl(form.youtube_url);
  const autoThumb = youtubeId ? youtubeThumb(youtubeId) : null;
  const displayThumb = form.thumbnail_override || autoThumb;

  const handleSave = useCallback(async () => {
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!form.youtube_url.trim()) {
      toast.error('YouTube URL is required');
      return;
    }
    const yId = youtubeIdFromUrl(form.youtube_url);
    if (!yId) {
      toast.error('Could not parse a YouTube video ID from that URL');
      return;
    }

    setSaving(true);
    const payload = {
      title: form.title.trim(),
      youtube_url: form.youtube_url.trim(),
      youtube_id: yId,
      thumbnail_url: youtubeThumb(yId),
      thumbnail_override: form.thumbnail_override,
      category: form.category,
      featured: form.featured,
      published_at: form.published_at || null,
    };

    if (form.featured) {
      await supabase.from('videos').update({ featured: false }).eq('featured', true);
    }

    if (videoIdRef.current) {
      const { error } = await supabase
        .from('videos')
        .update(payload)
        .eq('id', videoIdRef.current);
      setSaving(false);
      if (error) {
        toast.error('Save failed: ' + error.message);
        return;
      }
      await logAudit({
        action: 'update',
        target_type: 'video',
        target_id: videoIdRef.current,
        details: `Updated video "${payload.title}"`,
      });
      toast.success('Video saved');
    } else {
      const { data, error } = await supabase
        .from('videos')
        .insert(payload)
        .select('id')
        .maybeSingle();
      setSaving(false);
      if (error || !data) {
        toast.error('Create failed: ' + (error?.message ?? 'unknown'));
        return;
      }
      videoIdRef.current = data.id;
      await logAudit({
        action: 'create',
        target_type: 'video',
        target_id: data.id,
        details: `Created video "${payload.title}"`,
      });
      toast.success('Video created');
      router.replace(`/admin/videos/${data.id}`);
    }
  }, [form, router]);

  async function handleDelete() {
    if (!videoIdRef.current) return;
    const { error } = await supabase.from('videos').delete().eq('id', videoIdRef.current);
    if (error) {
      toast.error('Delete failed');
      return;
    }
    await logAudit({
      action: 'delete',
      target_type: 'video',
      target_id: videoIdRef.current,
      details: `Deleted video "${form.title}"`,
    });
    toast.success('Video deleted');
    router.replace('/admin/videos');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-20">
      <div className="mb-6">
        <Link
          href="/admin/videos"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to videos
        </Link>
        <PageHeader
          eyebrow={isNew ? 'New Video' : 'Edit Video'}
          title={form.title || 'Untitled'}
          actions={
            <div className="flex items-center gap-2 flex-wrap">
              {!isNew && (
                <Button
                  variant="outline"
                  onClick={() => setDeleteOpen(true)}
                  className="border-border text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Video
              </Button>
            </div>
          }
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Title</Label>
            <Input
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Video title…"
              className="bg-card/60 border-border text-lg font-display"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">YouTube URL</Label>
            <div className="relative">
              <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="url"
                value={form.youtube_url}
                onChange={(e) => update('youtube_url', e.target.value)}
                placeholder="https://youtube.com/watch?v=…"
                className="bg-card/60 border-border pl-10"
              />
            </div>
            {youtubeId && (
              <p className="text-[11px] text-green-500 flex items-center gap-1">
                <Star className="w-3 h-3" />
                Detected video ID: {youtubeId}
              </p>
            )}
          </div>

          {displayThumb && (
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Thumbnail Preview</Label>
              <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={displayThumb} alt="Thumbnail" className="w-full h-full object-cover" />
                {form.thumbnail_override && (
                  <span className="absolute top-2 right-2 text-[10px] uppercase tracking-wider bg-primary text-primary-foreground px-2 py-1 rounded-full">
                    Custom
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <Card className="p-5 bg-card/60 border-border space-y-5">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => update('category', v as VideoCategory)}
              >
                <SelectTrigger className="bg-background-soft border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VIDEO_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Publish Date</Label>
              <Input
                type="date"
                value={form.published_at}
                onChange={(e) => update('published_at', e.target.value)}
                className="bg-background-soft border-border"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Featured</Label>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Shown as the large hero video.
                  </p>
                </div>
                <Switch
                  checked={form.featured}
                  onCheckedChange={(checked) => update('featured', checked)}
                />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-card/60 border-border">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground block mb-3">
              Thumbnail Override (optional)
            </Label>
            <ImageUpload
              value={form.thumbnail_override}
              onChange={(url) => update('thumbnail_override', url)}
              folder="video-thumbnails"
              aspect="video"
            />
            <p className="text-[11px] text-muted-foreground mt-2">
              Leave empty to use the YouTube auto-generated thumbnail.
            </p>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this video?"
        description={`"${form.title}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
}
