import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim();
});

const url = env['NEXT_PUBLIC_SUPABASE_URL'];
const anonKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

console.log("=================== SUPABASE REAL-WORLD AUDIT ===================");
console.log("Supabase Target URL:", url);

const supabase = createClient(url, anonKey);

async function audit() {
  // 1. Table schema check
  const candidateTables = [
    'articles', 'videos', 'achievements', 'hero', 'ticker', 
    'contact_inquiries', 'profiles', 'audit_log',
    'products', 'orders', 'order_items', 'reviews', 
    'wholesale_inquiries', 'coupons', 'promo_banners', 
    'site_content', 'conversations', 'messages', 
    'push_subscriptions', 'return_requests'
  ];

  console.log("\n--- SECTION 1: PUBLIC DATABASE TABLES ---");
  const existingTables = [];
  const missingTables = [];

  for (const table of candidateTables) {
    const { data, error } = await supabase.from(table).select('count', { count: 'exact', head: true });
    if (error) {
      if (error.code === 'PGRST301' || error.message.includes('relation') || error.code === '42P01') {
        missingTables.push(table);
      } else {
        // Table exists but RLS or permissions error
        existingTables.push({ table, status: `Exists (RLS Notice: ${error.message})` });
      }
    } else {
      existingTables.push({ table, status: 'Exists (Accessible)' });
    }
  }

  console.log("Existing Tables Found:", existingTables);
  console.log("Non-existent Tables:", missingTables);

  // 2. Articles Row Count & Sample Check
  console.log("\n--- SECTION 2: ARTICLES ROW COUNT ---");
  const { data: articles, error: artErr } = await supabase.from('articles').select('id, title, slug, category, status, published_at');
  if (artErr) {
    console.error("Error querying articles:", artErr.message);
  } else {
    console.log(`Articles Count in Supabase DB: ${articles.length}`);
    articles.forEach((a, i) => console.log(`${i+1}. [${a.category}] ${a.title} (${a.published_at})`));
  }

  // 3. Profiles Check
  console.log("\n--- SECTION 3: PROFILES CHECK ---");
  const { data: profiles, error: profErr } = await supabase.from('profiles').select('*');
  console.log("Profiles Result:", { profiles, profErr });

  // 4. Contact Inquiries Check
  console.log("\n--- SECTION 4: CONTACT INQUIRIES CHECK ---");
  const { data: inquiries, error: inqErr } = await supabase.from('contact_inquiries').select('*');
  console.log("Contact Inquiries Result:", { inquiries, inqErr });
}

audit();
