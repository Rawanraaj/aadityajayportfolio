'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';
import { logAudit } from '@/lib/audit';
import { type Achievement } from '@/lib/types';
import { PageHeader } from '@/components/admin/page-header';
import { ReorderableList } from '@/components/admin/reorderable-list';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { AchievementDialog } from '@/components/admin/achievement-dialog';
import { EmptyState, LoadingState } from '@/components/admin/empty-states';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Trophy, Pencil, Trash2, BadgeCheck } from 'lucide-react';

export default function AchievementsPage() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState<Achievement | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Achievement | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('order', { ascending: true });
    if (error) {
      toast.error('Failed to load achievements');
    } else {
      setItems((data as Achievement[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleReorder = useCallback(
    async (next: Achievement[]) => {
      setItems(next);
      const updates = next.map((item, i) => ({ id: item.id, order: i }));
      const { error } = await supabase.from('achievements').upsert(
        updates.map((u) => ({ id: u.id, order: u.order })),
        { onConflict: 'id' }
      );
      if (error) {
        toast.error('Failed to save order');
        load();
      }
    },
    [load]
  );

  async function toggleVerified(a: Achievement) {
    const { error } = await supabase
      .from('achievements')
      .update({ verified: !a.verified })
      .eq('id', a.id);
    if (error) {
      toast.error('Failed to toggle verified');
      return;
    }
    setItems((prev) => prev.map((x) => (x.id === a.id ? { ...x, verified: !a.verified } : x)));
    await logAudit({
      action: 'update',
      target_type: 'achievement',
      target_id: a.id,
      details: `${!a.verified ? 'Verified' : 'Unverified'} "${a.title}"`,
    });
    toast.success(!a.verified ? 'Marked as verified' : 'Removed verified');
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const { error } = await supabase.from('achievements').delete().eq('id', deleteTarget.id);
    if (error) {
      toast.error('Failed to delete achievement');
      return;
    }
    await logAudit({
      action: 'delete',
      target_type: 'achievement',
      target_id: deleteTarget.id,
      details: `Deleted achievement "${deleteTarget.title}"`,
    });
    setItems((prev) => prev.filter((x) => x.id !== deleteTarget.id));
    toast.success('Achievement deleted');
    setDeleteTarget(null);
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow="Recognition"
        title="Achievements"
        description="Awards and recognitions — drag to reorder."
        actions={
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Achievement
          </Button>
        }
      />

      {loading ? (
        <LoadingState label="Loading achievements…" />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Trophy className="w-12 h-12" />}
          title="No achievements yet"
          description="Add awards, fellowships, and recognitions to showcase credentials."
          action={
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Achievement
            </Button>
          }
        />
      ) : (
        <ReorderableList items={items} onReorder={handleReorder}
          renderItem={(a) => (
            <Card className="p-4 bg-card/40 border-border group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display text-base font-semibold truncate">{a.title}</h3>
                    {a.verified && (
                      <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {a.issuer && <span>{a.issuer}</span>}
                    {a.issuer && a.year && <span> · </span>}
                    {a.year && <span>{a.year}</span>}
                  </p>
                  {a.description && (
                    <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{a.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <label className="flex items-center gap-1.5 cursor-pointer mr-1">
                    <Switch checked={a.verified} onCheckedChange={() => toggleVerified(a)} />
                    <span className="text-[11px] text-muted-foreground hidden sm:inline">Verified</span>
                  </label>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={() => setEditTarget(a)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => setDeleteTarget(a)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          )}
        />
      )}

      <AchievementDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSaved={load}
      />
      <AchievementDialog
        open={!!editTarget}
        onOpenChange={(o) => !o && setEditTarget(null)}
        achievement={editTarget}
        onSaved={load}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete this achievement?"
        description={`"${deleteTarget?.title}" will be permanently removed.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
}
