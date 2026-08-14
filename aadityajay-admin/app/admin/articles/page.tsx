'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';
import { logAudit } from '@/lib/audit';
import { ARTICLE_CATEGORIES, type Article, type ArticleCategory, type ArticleStatus } from '@/lib/types';
import { PageHeader } from '@/components/admin/page-header';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { EmptyState, LoadingState } from '@/components/admin/empty-states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  FileText,
  Trash2,
  Pencil,
  Eye,
  ExternalLink,
} from 'lucide-react';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    let q = supabase.from('articles').select('*').order('created_at', { ascending: false });
    if (status !== 'all') q = q.eq('status', status);
    if (category !== 'all') q = q.eq('category', category);
    const { data, error } = await q;
    if (error) {
      toast.error('Failed to load articles');
    } else {
      setArticles((data as Article[]) ?? []);
    }
    setLoading(false);
  }, [status, category]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = articles.filter((a) =>
    search ? a.title.toLowerCase().includes(search.toLowerCase()) : true
  );

  async function handleDelete() {
    if (!deleteTarget) return;
    const { error } = await supabase.from('articles').delete().eq('id', deleteTarget.id);
    if (error) {
      toast.error('Failed to delete article');
      return;
    }
    await logAudit({
      action: 'delete',
      target_type: 'article',
      target_id: deleteTarget.id,
      details: `Deleted article "${deleteTarget.title}"`,
    });
    setArticles((prev) => prev.filter((a) => a.id !== deleteTarget.id));
    toast.success('Article deleted');
    setDeleteTarget(null);
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow="Content"
        title="Articles"
        description="Investigations, politics, society, and interviews."
        actions={
          <Link href="/admin/articles/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              New Article
            </Button>
          </Link>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card/60 border-border"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-44 bg-card/60 border-border">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {ARTICLE_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-36 bg-card/60 border-border">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <LoadingState label="Loading articles…" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-12 h-12" />}
          title="No articles found"
          description="Adjust your filters or create a new article to get started."
          action={
            <Link href="/admin/articles/new">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                New Article
              </Button>
            </Link>
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <Card className="hidden md:block overflow-hidden bg-card/40 border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-center">Views</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/articles/${a.id}`} className="font-medium hover:text-primary transition-colors">
                        {a.title}
                      </Link>
                      {a.external_link && (
                        <a
                          href={a.external_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center ml-2 text-xs text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{a.category}</td>
                    <td className="px-4 py-3">
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
                    </td>
                    <td className="px-4 py-3 text-center text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {a.view_count}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {formatDate(a.published_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/articles/${a.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteTarget(a)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((a) => (
              <Card key={a.id} className="p-4 bg-card/40 border-border">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Link href={`/admin/articles/${a.id}`} className="font-medium hover:text-primary transition-colors flex-1">
                    {a.title}
                  </Link>
                  <span
                    className={cn(
                      'text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border flex-shrink-0',
                      a.status === 'published'
                        ? 'bg-primary/10 text-primary border-primary/25'
                        : 'bg-secondary text-muted-foreground border-border'
                    )}
                  >
                    {a.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span>{a.category}</span>
                  <span className="inline-flex items-center gap-1"><Eye className="w-3 h-3" />{a.view_count}</span>
                  <span>{formatDate(a.published_at)}</span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/articles/${a.id}`}>
                    <Button variant="outline" size="sm" className="border-border">
                      <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border text-destructive hover:text-destructive"
                    onClick={() => setDeleteTarget(a)}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete this article?"
        description={`"${deleteTarget?.title}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
}
