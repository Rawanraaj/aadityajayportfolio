'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { logAudit } from '@/lib/audit';
import { type Ticker } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface TickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticker?: Ticker | null;
  onSaved: () => void;
}

export function TickerDialog({
  open,
  onOpenChange,
  ticker,
  onSaved,
}: TickerDialogProps) {
  const [text, setText] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const isEdit = !!ticker;

  useEffect(() => {
    if (ticker) {
      setText(ticker.text);
      setIsActive(ticker.is_active);
    } else {
      setText('');
      setIsActive(true);
    }
  }, [ticker, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) {
      toast.error('Ticker headline text is required');
      return;
    }

    setSaving(true);

    if (isEdit) {
      const { error } = await supabase
        .from('ticker')
        .update({
          text: text.trim(),
          is_active: isActive,
        })
        .eq('id', ticker.id);

      setSaving(false);

      if (error) {
        toast.error('Failed to update ticker item: ' + error.message);
        return;
      }

      await logAudit({
        action: 'update',
        target_type: 'ticker',
        target_id: ticker.id,
        details: `Updated ticker item "${text.trim().substring(0, 30)}..."`,
      });

      toast.success('Ticker headline updated');
    } else {
      // Get highest order
      const { data: existing } = await supabase
        .from('ticker')
        .select('order')
        .order('order', { ascending: false })
        .limit(1);

      const nextOrder = existing && existing.length > 0 ? (existing[0].order || 0) + 1 : 0;

      const { data, error } = await supabase
        .from('ticker')
        .insert({
          text: text.trim(),
          is_active: isActive,
          order: nextOrder,
        })
        .select()
        .single();

      setSaving(false);

      if (error) {
        toast.error('Failed to create ticker item: ' + error.message);
        return;
      }

      await logAudit({
        action: 'create',
        target_type: 'ticker',
        target_id: data.id,
        details: `Created ticker item "${text.trim().substring(0, 30)}..."`,
      });

      toast.success('Ticker headline added');
    }

    onOpenChange(false);
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {isEdit ? 'Edit Ticker Headline' : 'Add Ticker Headline'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Headlines appear in the animated breaking news ticker at the bottom of the hero section.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Headline Text
              </Label>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter ticker headline text…"
                rows={3}
                className="bg-background-soft border-border resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Active Status</Label>
                <p className="text-xs text-muted-foreground">
                  Inactive headlines will be hidden from the public marquee.
                </p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isEdit ? 'Save Changes' : 'Add Headline'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
