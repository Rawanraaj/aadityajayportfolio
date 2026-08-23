import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim();
});

const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['NEXT_PUBLIC_SUPABASE_ANON_KEY']);

async function testAdmin() {
  console.log("Checking if admin login works...");
  // Let's test standard admin credentials or check session
  const { data: sessionData } = await supabase.auth.getSession();
  console.log("Current session:", sessionData);
}

testAdmin();
