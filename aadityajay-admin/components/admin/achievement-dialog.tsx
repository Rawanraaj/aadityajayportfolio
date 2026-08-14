'use client';

import { useState, useEffect, FormEvent } from 'react';
import { supabase } from '@/lib/supabase-client';
import { logAudit } from '@/lib/audit';
import { type Achievement } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AchievementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  achievement?: Achievement | null;
  onSaved: () => void;
}

export function AchievementDialog({
  open,
  onOpenChange,
  achievement,
  onSaved,
}: AchievementDialogProps) {
  const isEdit = !!achievement;
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [year, setYear] = useState<string>('');
  const [description, setDescription] = useState('');
  const [verified, setVerified] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(achievement?.title ?? '');
      setIssuer(achievement?.issuer ?? '');
      setYear(achievement?.year?.toString() ?? '');
      setDescription(achievement?.description ?? '');
      setVerified(achievement?.verified ?? false);
    }
  }, [open, achievement]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    setSaving(true);
    const payload = {
      title: title.trim(),
      issuer: issuer.trim() || null,
      year: year ? parseInt(year, 10) : null,
      description: description.trim() || null,
      verified,
    };

    if (isEdit && achievement) {
      const { error } = await supabase
        .from('achievements')
        .update(payload)
        .eq('id', achievement.id);
      setSaving(false);
      if (error) {
        toast.error('Failed to save: ' + error.message);
        return;
      }
      await logAudit({
        action: 'update',
        target_type: 'achievement',
        target_id: achievement.id,
        details: `Updated achievement "${payload.title}"`,
      });
      toast.success('Achievement updated');
    } else {
      const { data, error } = await supabase
        .from('achievements')
        .insert(payload)
        .select('id')
        .maybeSingle();
      setSaving(false);
      if (error || !data) {
        toast.error('Failed to create: ' + (error?.message ?? 'unknown'));
        return;
      }
      await logAudit({
        action: 'create',
        target_type: 'achievement',
        target_id: data.id,
        details: `Created achievement "${payload.title}"`,
      });
      toast.success('Achievement added');
    }
    onSaved();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEdit ? 'Edit Achievement' : 'Add Achievement'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Award or recognition name…"
              className="bg-background-soft border-border"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Issuer</Label>
              <Input
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="Organization…"
                className="bg-background-soft border-border"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Year</Label>
              <Input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2024"
                className="bg-background-soft border-border"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description…"
              rows={3}
              className="bg-background-soft border-border resize-none"
            />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border bg-background-soft/50 px-4 py-3">
            <div>
              <Label className="text-sm font-medium">Verified</Label>
              <p className="text-[11px] text-muted-foreground mt-0.5">Shows a verified badge.</p>
            </div>
            <Switch checked={verified} onCheckedChange={setVerified} />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border"
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEdit ? 'Save Changes' : 'Add Achievement'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
