'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';
import { logAudit } from '@/lib/audit';
import { slugify } from '@/lib/format';
import {
  ARTICLE_CATEGORIES,
  type Article,
  type ArticleCategory,
  type ArticleStatus,
} from '@/lib/types';
import { PageHeader } from '@/components/admin/page-header';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { ImageUpload } from '@/components/admin/image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Save,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  thumbnail_url: string | null;
  category: ArticleCategory;
  external_link: string;
  status: ArticleStatus;
  published_at: string;
}

const EMPTY: FormData = {
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  thumbnail_url: null,
  category: 'Investigation',
  external_link: '',
  status: 'draft',
  published_at: new Date().toISOString().slice(0, 10),
};

export default function ArticleEditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;
  const isNew = id === 'new';

  const [form, setForm] = useState<FormData>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);

  const formRef = useRef(form);
  formRef.current = form;
  const articleIdRef = useRef<string | null>(isNew ? null : id);

  // Load existing
  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error || !data) {
        toast.error('Article not found');
        router.replace('/admin/articles');
        return;
      }
      const a = data as Article;
      setForm({
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt ?? '',
        body: a.body ?? '',
        thumbnail_url: a.thumbnail_url,
        category: a.category,
        external_link: a.external_link ?? '',
        status: a.status,
        published_at: a.published_at ?? new Date().toISOString().slice(0, 10),
      });
      setLoading(false);
    })();
  }, [id, isNew, router]);

  // Slug auto-generation from title
  useEffect(() => {
    if (!slugEdited) {
      setForm((f) => ({ ...f, slug: slugify(f.title) }));
    }
  }, [form.title, slugEdited]);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  // Build payload
  const buildPayload = useCallback((f: FormData, statusOverride?: ArticleStatus) => {
    return {
      title: f.title.trim() || 'Untitled',
      slug: f.slug.trim() || slugify(f.title) || `article-${Date.now()}`,
      excerpt: f.excerpt.trim() || null,
      body: f.body || null,
      thumbnail_url: f.thumbnail_url,
      category: f.category,
      external_link: f.external_link.trim() || null,
      status: statusOverride ?? f.status,
      published_at: f.published_at || null,
    };
  }, []);

  // Manual save
  const handleSave = useCallback(
    async (statusOverride?: ArticleStatus) => {
      const f = formRef.current;
      if (!f.title.trim()) {
        toast.error('Title is required');
        return;
      }
      setSaving(true);
      const payload = buildPayload(f, statusOverride);

      if (articleIdRef.current) {
        const { data, error } = await supabase
          .from('articles')
          .update(payload)
          .eq('id', articleIdRef.current)
          .select('id')
          .maybeSingle();
        setSaving(false);
        if (error) {
          toast.error('Save failed: ' + error.message);
          return;
        }
        await logAudit({
          action: 'update',
          target_type: 'article',
          target_id: articleIdRef.current,
          details: `Updated article "${payload.title}"`,
        });
        toast.success('Article saved');
      } else {
        const { data, error } = await supabase
          .from('articles')
          .insert(payload)
          .select('id')
          .maybeSingle();
        setSaving(false);
        if (error || !data) {
          toast.error('Create failed: ' + (error?.message ?? 'unknown'));
          return;
        }
        articleIdRef.current = data.id;
        await logAudit({
          action: 'create',
          target_type: 'article',
          target_id: data.id,
          details: `Created article "${payload.title}"`,
        });
        toast.success('Article created');
        router.replace(`/admin/articles/${data.id}`);
      }
    },
    [buildPayload, router]
  );

  // Autosave (drafts only, every ~30s when changed)
  useEffect(() => {
    if (isNew && !articleIdRef.current) return; // don't autosave before first manual save of new article
    let timer: ReturnType<typeof setInterval>;
    let lastSnapshot = JSON.stringify(formRef.current);

    timer = setInterval(async () => {
      const current = JSON.stringify(formRef.current);
      if (current === lastSnapshot) return;
      lastSnapshot = current;
      if (!articleIdRef.current) return;

      setAutosaveStatus('saving');
      const payload = buildPayload(formRef.current);
      payload.status = 'draft'; // autosave always keeps draft state
      const { error } = await supabase
        .from('articles')
        .update(payload)
        .eq('id', articleIdRef.current);
      if (error) {
        setAutosaveStatus('error');
      } else {
        setAutosaveStatus('saved');
        setTimeout(() => setAutosaveStatus('idle'), 2000);
      }
    }, 30000);

    return () => clearInterval(timer);
  }, [isNew, buildPayload]);

  async function handleDelete() {
    if (!articleIdRef.current) return;
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', articleIdRef.current);
    if (error) {
      toast.error('Delete failed');
      return;
    }
    await logAudit({
      action: 'delete',
      target_type: 'article',
      target_id: articleIdRef.current,
      details: `Deleted article "${form.title}"`,
    });
    toast.success('Article deleted');
    router.replace('/admin/articles');
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
          href="/admin/articles"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to articles
        </Link>
        <PageHeader
          eyebrow={isNew ? 'New Article' : 'Edit Article'}
          title={form.title || 'Untitled'}
          actions={
            <div className="flex items-center gap-2 flex-wrap">
              {autosaveStatus !== 'idle' && (
                <span className="text-xs text-muted-foreground flex items-center gap-1.5 mr-1">
                  {autosaveStatus === 'saving' && <Loader2 className="w-3 h-3 animate-spin" />}
                  {autosaveStatus === 'saved' && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                  {autosaveStatus === 'error' && <AlertCircle className="w-3 h-3 text-destructive" />}
                  {autosaveStatus === 'saving' ? 'Autosaving…' : autosaveStatus === 'saved' ? 'Saved' : 'Save error'}
                </span>
              )}
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
                onClick={() => handleSave('draft')}
                disabled={saving}
                variant="outline"
                className="border-border"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Draft
              </Button>
              <Button
                onClick={() => handleSave('published')}
                disabled={saving}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {form.status === 'published' ? 'Update & Publish' : 'Publish'}
              </Button>
            </div>
          }
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-5">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Title</Label>
            <Input
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Article headline…"
              className="bg-card/60 border-border text-lg font-display"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Excerpt</Label>
            <Textarea
              value={form.excerpt}
              onChange={(e) => update('excerpt', e.target.value)}
              placeholder="A short summary shown in cards and previews…"
              rows={3}
              className="bg-card/60 border-border resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Body</Label>
            <RichTextEditor
              value={form.body}
              onChange={(html) => update('body', html)}
              placeholder="Write your story…"
            />
          </div>
        </div>

        {/* Sidebar column */}
        <div className="space-y-5">
          <Card className="p-5 bg-card/60 border-border space-y-5">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Status</Label>
              <div className="flex items-center gap-3">
                <Switch
                  checked={form.status === 'published'}
                  onCheckedChange={(checked) =>
                    update('status', checked ? 'published' : 'draft')
                  }
                />
                <span className={form.status === 'published' ? 'text-primary font-medium' : 'text-muted-foreground'}>
                  {form.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => update('category', v as ArticleCategory)}
              >
                <SelectTrigger className="bg-background-soft border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ARTICLE_CATEGORIES.map((c) => (
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
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => {
                  setSlugEdited(true);
                  update('slug', e.target.value);
                }}
                placeholder="url-friendly-slug"
                className="bg-background-soft border-border text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                External Link (optional)
              </Label>
              <Input
                type="url"
                value={form.external_link}
                onChange={(e) => update('external_link', e.target.value)}
                placeholder="https://…"
                className="bg-background-soft border-border text-sm"
              />
              <p className="text-[11px] text-muted-foreground">
                Links to the original publication instead of an on-site article.
              </p>
            </div>
          </Card>

          <Card className="p-5 bg-card/60 border-border">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground block mb-3">
              Thumbnail
            </Label>
            <ImageUpload
              value={form.thumbnail_url}
              onChange={(url) => update('thumbnail_url', url)}
              folder="article-thumbnails"
              aspect="wide"
            />
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this article?"
        description={`"${form.title}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
}
