import { supabase } from './supabase-client';
import type { Profile } from './types';

export async function logAudit(entry: {
  action: string;
  target_type?: string;
  target_id?: string;
  details?: string;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase.from('audit_log').insert({
    actor_id: user.id,
    actor_email: user.email,
    action: entry.action,
    target_type: entry.target_type ?? null,
    target_id: entry.target_id ?? null,
    details: entry.details ?? null,
  });

  if (error) {
    console.error('Failed to write audit log:', error.message);
  }
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  return data as Profile | null;
}
