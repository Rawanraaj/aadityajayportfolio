'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';
import { type AuditLog } from '@/lib/types';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState, LoadingState } from '@/components/admin/empty-states';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ShieldCheck, Search, Clock, User, FileText, Filter } from 'lucide-react';

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('audit_log')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load audit logs: ' + error.message);
    } else {
      setLogs((data as AuditLog[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredLogs = logs.filter((log) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      (log.actor_email && log.actor_email.toLowerCase().includes(q)) ||
      log.action.toLowerCase().includes(q) ||
      (log.target_type && log.target_type.toLowerCase().includes(q)) ||
      (log.details && log.details.toLowerCase().includes(q))
    );
  });

  function getActionBadge(action: string) {
    const act = action.toLowerCase();
    if (act === 'create') {
      return (
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 uppercase text-[10px]">
          Create
        </Badge>
      );
    }
    if (act === 'update') {
      return (
        <Badge className="bg-sky-500/10 text-sky-400 border-sky-500/20 uppercase text-[10px]">
          Update
        </Badge>
      );
    }
    if (act === 'delete') {
      return (
        <Badge className="bg-destructive/10 text-destructive border-destructive/20 uppercase text-[10px]">
          Delete
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-muted-foreground uppercase text-[10px]">
        {action}
      </Badge>
    );
  }

  return (
    <div className="animate-fade-in pb-20">
      <PageHeader
        eyebrow="Security & Governance"
        title="Audit Log"
        description="Chronological record of all administrative actions, content updates, and changes."
        actions={
          <div className="relative w-64 sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search logs by email, action, details…"
              className="pl-9 bg-card border-border text-sm"
            />
          </div>
        }
      />

      {loading ? (
        <LoadingState label="Loading audit logs…" />
      ) : filteredLogs.length === 0 ? (
        <EmptyState
          icon={<ShieldCheck className="w-12 h-12" />}
          title={query ? 'No matching audit records' : 'No audit records yet'}
          description={
            query
              ? `No audit entries matched "${query}".`
              : 'Administrative actions across articles, videos, hero, and ticker will be recorded here.'
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <Card key={log.id} className="p-4 bg-card/40 border-border hover:border-border/80 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {getActionBadge(log.action)}
                    {log.target_type && (
                      <Badge variant="outline" className="text-[10px] text-muted-foreground capitalize">
                        {log.target_type}
                      </Badge>
                    )}
                    <span className="text-xs font-semibold text-foreground truncate">
                      {log.actor_email || 'System User'}
                    </span>
                  </div>

                  <p className="text-sm text-foreground/90 font-medium leading-relaxed">
                    {log.details || `${log.action} action on ${log.target_type || 'system'}`}
                  </p>

                  {log.target_id && (
                    <p className="text-[11px] text-muted-foreground font-mono">
                      Target ID: {log.target_id}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-muted-foreground whitespace-nowrap pt-2 sm:pt-0 border-t sm:border-t-0 border-border/30">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  {new Date(log.created_at).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
