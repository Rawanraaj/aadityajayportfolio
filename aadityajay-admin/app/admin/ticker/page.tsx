'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';
import { logAudit } from '@/lib/audit';
import { type Ticker } from '@/lib/types';
import { PageHeader } from '@/components/admin/page-header';
import { ReorderableList } from '@/components/admin/reorderable-list';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { TickerDialog } from '@/components/admin/ticker-dialog';
import { EmptyState, LoadingState } from '@/components/admin/empty-states';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Newspaper, Pencil, Trash2 } from 'lucide-react';

export default function TickerPage() {
  const [items, setItems] = useState<Ticker[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState<Ticker | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Ticker | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ticker')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      toast.error('Failed to load ticker headlines: ' + error.message);
    } else {
      setItems((data as Ticker[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleReorder = useCallback(
    async (next: Ticker[]) => {
      setItems(next);
      const updates = next.map((item, i) => ({ id: item.id, order: i }));
      const { error } = await supabase.from('ticker').upsert(
        updates.map((u) => ({ id: u.id, order: u.order })),
        { onConflict: 'id' }
      );
      if (error) {
        toast.error('Failed to save order: ' + error.message);
        load();
      } else {
        await logAudit({
          action: 'update',
          target_type: 'ticker',
          details: 'Reordered ticker headlines',
        });
      }
    },
    [load]
  );

  async function toggleActive(item: Ticker) {
    const nextState = !item.is_active;
    const { error } = await supabase
      .from('ticker')
      .update({ is_active: nextState })
      .eq('id', item.id);

    if (error) {
      toast.error('Failed to update status');
      return;
    }

    setItems((prev) =>
      prev.map((x) => (x.id === item.id ? { ...x, is_active: nextState } : x))
    );

    await logAudit({
      action: 'update',
      target_type: 'ticker',
      target_id: item.id,
      details: `${nextState ? 'Activated' : 'Deactivated'} ticker item "${item.text.substring(0, 25)}..."`,
    });

    toast.success(nextState ? 'Headline activated' : 'Headline deactivated');
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const { error } = await supabase.from('ticker').delete().eq('id', deleteTarget.id);
    if (error) {
      toast.error('Failed to delete ticker item');
      return;
    }

    await logAudit({
      action: 'delete',
      target_type: 'ticker',
      target_id: deleteTarget.id,
      details: `Deleted ticker item "${deleteTarget.text.substring(0, 25)}..."`,
    });

    setItems((prev) => prev.filter((x) => x.id !== deleteTarget.id));
    toast.success('Ticker item deleted');
    setDeleteTarget(null);
  }

  return (
    <div className="animate-fade-in pb-20">
      <PageHeader
        eyebrow="Homepage Marquee"
        title="Ticker Headlines"
        description="Manage breaking news ticker items shown at the bottom of the hero section — drag items to reorder."
        actions={
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Headline
          </Button>
        }
      />

      {loading ? (
        <LoadingState label="Loading ticker items…" />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Newspaper className="w-12 h-12" />}
          title="No ticker headlines yet"
          description="Add breaking news headlines to display in the animated hero marquee."
          action={
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Headline
            </Button>
          }
        />
      ) : (
        <ReorderableList
          items={items}
          onReorder={handleReorder}
          renderItem={(item) => (
            <Card className="p-4 bg-card/40 border-border group hover:border-border/80 transition-colors">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-display text-base font-semibold truncate text-foreground">
                      {item.text}
                    </p>
                    {item.is_active ? (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground text-[10px]">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Order position: {item.order + 1}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <label className="flex items-center gap-1.5 cursor-pointer mr-1">
                    <Switch
                      checked={item.is_active}
                      onCheckedChange={() => toggleActive(item)}
                    />
                    <span className="text-[11px] text-muted-foreground hidden sm:inline">
                      Active
                    </span>
                  </label>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={() => setEditTarget(item)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => setDeleteTarget(item)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          )}
        />
      )}

      <TickerDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSaved={load}
      />

      <TickerDialog
        open={!!editTarget}
        onOpenChange={(o) => !o && setEditTarget(null)}
        ticker={editTarget}
        onSaved={load}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete ticker headline?"
        description={`"${deleteTarget?.text.substring(0, 40)}..." will be permanently removed.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
}
