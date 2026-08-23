import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env line by line
const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if (k && v) env[k.trim()] = v.trim();
});

const url = env['NEXT_PUBLIC_SUPABASE_URL'];
const anonKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

console.log("Connecting to Supabase at:", url);

const supabase = createClient(url, anonKey);

async function checkSchemaAndData() {
  // Test articles
  const { data: articles, error: artErr } = await supabase.from('articles').select('*');
  console.log("\n--- Articles Query ---");
  if (artErr) console.error("Articles error:", artErr);
  else console.log(`Found ${articles.length} articles:`, articles.map(a => ({ id: a.id, title: a.title, status: a.status })));

  // Test other public tables
  const tables = ['articles', 'videos', 'achievements', 'hero', 'ticker', 'contact_inquiries', 'profiles', 'audit_log'];
  console.log("\n--- Checking Table Access ---");
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('count', { count: 'exact', head: true });
    if (error) {
      console.log(`Table ${t}: Error (${error.message})`);
    } else {
      console.log(`Table ${t}: Accessible`);
    }
  }
}

checkSchemaAndData();
