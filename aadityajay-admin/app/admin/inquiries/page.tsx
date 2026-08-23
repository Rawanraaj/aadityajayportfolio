'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';
import { logAudit } from '@/lib/audit';
import { type ContactInquiry } from '@/lib/types';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState, LoadingState } from '@/components/admin/empty-states';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Mail, MailOpen, Trash2, Eye, Calendar, User, Tag } from 'lucide-react';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [viewTarget, setViewTarget] = useState<ContactInquiry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactInquiry | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_inquiries')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      toast.error('Failed to load contact inquiries: ' + error.message);
    } else {
      setInquiries((data as ContactInquiry[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleRead(item: ContactInquiry, e?: React.MouseEvent) {
    if (e) e.stopPropagation();
    const nextState = !item.is_read;
    const { error } = await supabase
      .from('contact_inquiries')
      .update({ is_read: nextState })
      .eq('id', item.id);

    if (error) {
      toast.error('Failed to update read status');
      return;
    }

    setInquiries((prev) =>
      prev.map((x) => (x.id === item.id ? { ...x, is_read: nextState } : x))
    );

    if (viewTarget && viewTarget.id === item.id) {
      setViewTarget((prev) => (prev ? { ...prev, is_read: nextState } : null));
    }

    toast.success(nextState ? 'Marked as read' : 'Marked as unread');
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const { error } = await supabase
      .from('contact_inquiries')
      .delete()
      .eq('id', deleteTarget.id);

    if (error) {
      toast.error('Failed to delete inquiry');
      return;
    }

    await logAudit({
      action: 'delete',
      target_type: 'inquiry',
      target_id: deleteTarget.id,
      details: `Deleted contact inquiry from ${deleteTarget.name} (${deleteTarget.email})`,
    });

    setInquiries((prev) => prev.filter((x) => x.id !== deleteTarget.id));
    if (viewTarget && viewTarget.id === deleteTarget.id) {
      setViewTarget(null);
    }
    toast.success('Inquiry deleted');
    setDeleteTarget(null);
  }

  function handleOpenView(item: ContactInquiry) {
    setViewTarget(item);
    if (!item.is_read) {
      toggleRead(item);
    }
  }

  const filteredInquiries = inquiries.filter((item) => {
    if (filter === 'unread') return !item.is_read;
    if (filter === 'read') return item.is_read;
    return true;
  });

  const unreadCount = inquiries.filter((x) => !x.is_read).length;

  return (
    <div className="animate-fade-in pb-20">
      <PageHeader
        eyebrow="Inbox"
        title="Contact Inquiries"
        description="Public leads, interview requests, and press messages submitted via the website contact form."
        actions={
          <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="all">
                All ({inquiries.length})
              </TabsTrigger>
              <TabsTrigger value="unread" className="relative">
                Unread
                {unreadCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />

      {loading ? (
        <LoadingState label="Loading messages…" />
      ) : filteredInquiries.length === 0 ? (
        <EmptyState
          icon={<Mail className="w-12 h-12" />}
          title={filter === 'all' ? 'No inquiries received yet' : `No ${filter} inquiries`}
          description="Submissions from the public site's contact section will appear here."
        />
      ) : (
        <div className="space-y-3">
          {filteredInquiries.map((item) => (
            <Card
              key={item.id}
              onClick={() => handleOpenView(item)}
              className={`p-4 transition-all cursor-pointer group ${
                !item.is_read
                  ? 'bg-card/90 border-primary/40 shadow-sm'
                  : 'bg-card/30 border-border opacity-85 hover:opacity-100'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-semibold text-foreground text-base truncate">
                      {item.name}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      &lt;{item.email}&gt;
                    </span>
                    {!item.is_read && (
                      <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">
                        New
                      </Badge>
                    )}
                  </div>

                  {item.subject && (
                    <p className="text-sm font-medium text-foreground/90 truncate">
                      {item.subject}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                    {new Date(item.submitted_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={(e) => toggleRead(item, e)}
                      title={item.is_read ? 'Mark as unread' : 'Mark as read'}
                    >
                      {item.is_read ? (
                        <MailOpen className="w-4 h-4" />
                      ) : (
                        <Mail className="w-4 h-4 text-primary" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenView(item);
                      }}
                      title="View Message"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(item);
                      }}
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* View Message Detail Dialog */}
      <Dialog open={!!viewTarget} onOpenChange={(o) => !o && setViewTarget(null)}>
        <DialogContent className="bg-card border-border sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-center justify-between gap-2 pr-6">
              <DialogTitle className="font-display text-xl">
                {viewTarget?.subject || 'Contact Inquiry'}
              </DialogTitle>
              {viewTarget && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleRead(viewTarget)}
                  className="text-xs h-7 border-border"
                >
                  {viewTarget.is_read ? <Mail className="w-3.5 h-3.5 mr-1" /> : <MailOpen className="w-3.5 h-3.5 mr-1" />}
                  {viewTarget.is_read ? 'Mark Unread' : 'Mark Read'}
                </Button>
              )}
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Submitted on{' '}
              {viewTarget &&
                new Date(viewTarget.submitted_at).toLocaleString('en-US', {
                  dateStyle: 'full',
                  timeStyle: 'short',
                })}
            </DialogDescription>
          </DialogHeader>

          {viewTarget && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-background-soft border border-border text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <User className="w-3.5 h-3.5" />
                    <span>Sender Name</span>
                  </div>
                  <p className="font-semibold text-foreground">{viewTarget.name}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Address</span>
                  </div>
                  <a
                    href={`mailto:${viewTarget.email}`}
                    className="font-semibold text-primary hover:underline block truncate"
                  >
                    {viewTarget.email}
                  </a>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Message Content
                </p>
                <div className="p-4 rounded-lg bg-background-soft border border-border text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans min-h-[120px]">
                  {viewTarget.message}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete inquiry?"
        description={`Message from "${deleteTarget?.name}" will be permanently removed.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
}
