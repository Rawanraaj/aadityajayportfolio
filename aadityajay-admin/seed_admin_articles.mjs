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

const supabase = createClient(url, anonKey);

const articlesToInsert = [
  {
    title: "देवानगञ्ज घटना हुँदा सुनसरीमा थिएनन् दुवैजना एसपी",
    slug: "devanagunj-sp-absent",
    excerpt: "Both district police chiefs were absent from Sunsari when the Devanagunj incident unfolded — raising questions about accountability in the chain of command.",
    thumbnail_url: "https://www.publickhabar24.com/wp-content/uploads/2026/07/Screenshot_20260727_162918_Lite.jpg",
    category: "Investigation",
    external_link: "https://www.publickhabar24.com/11172.html",
    status: "published",
    published_at: "2026-07-27"
  },
  {
    title: "मिटर ब्याज पीडित : ९६ दिनदेखि माइतीघरमा न्याय खोज्दै सर्लाहीका महतो दम्पती",
    slug: "meter-interest-victims-sarlahi",
    excerpt: "A Sarlahi couple's 96-day fight for justice against predatory loan-shark interest rates, still unresolved.",
    thumbnail_url: "https://www.publickhabar24.com/wp-content/uploads/2026/07/photo-17_fdc7bfa9-1778x1000.jpg",
    category: "Investigation",
    external_link: "https://www.publickhabar24.com/10879.html",
    status: "published",
    published_at: "2026-07-08"
  },
  {
    title: "राधेराधेको खण्डहर १७ तले महल : 'गोविन्दाको भवन'ले चिनियो तर वास्तविकता रहस्यमै",
    slug: "mystery-mansion-govinda-bhawan",
    excerpt: "A 17-story ruin known locally as \"Govinda's mansion\" — famous by name, but its real story remains a mystery.",
    thumbnail_url: "https://www.publickhabar24.com/wp-content/uploads/2026/07/file_00000000fca8820e85ed8f4e25bf3e77-1024x683.png",
    category: "Investigation",
    external_link: "https://www.publickhabar24.com/11118.html",
    status: "published",
    published_at: "2026-07-24"
  },
  {
    title: "ओली र लेखकको बन्दीप्रत्यक्षीकरण रिटको सुनुवाइमा आज सरकारी वकिलले बहस गर्ने",
    slug: "oli-lekhak-habeas-corpus-hearing",
    excerpt: "Government lawyers set to argue today in the high-profile habeas corpus hearing involving Oli and Lekhak.",
    thumbnail_url: "https://www.publickhabar24.com/wp-content/uploads/2026/04/oli-lekhak_d0921b58.png",
    category: "Politics",
    external_link: "https://www.publickhabar24.com/10674.html",
    status: "published",
    published_at: "2026-04-06"
  },
  {
    title: "आईजीपीलाई खगेन्द्र सुनारको चुनौती : आरोप गलत लागे अदालत जानू, कठघरामा उभिएर जवाफ दिन तयार छु",
    slug: "igp-challenge-khagendra-sunar",
    excerpt: "A direct public challenge to the Inspector General of Police — daring him to court if the allegations are false.",
    thumbnail_url: "https://www.publickhabar24.com/wp-content/uploads/2026/08/photo_f4618c7e.jpg",
    category: "Politics",
    external_link: "https://www.publickhabar24.com/11597.html",
    status: "published",
    published_at: "2026-08-20"
  },
  {
    title: "'हामी कहाँ जाने ?' नदी किनारका सुकुम्बासीको सरकारसँग प्रश्न",
    slug: "squatters-riverside-question-government",
    excerpt: "Riverside squatter families confront the government with one urgent question: where are we supposed to go?",
    thumbnail_url: "https://www.publickhabar24.com/wp-content/uploads/2026/04/photo-6_11fdc2b1-1778x1000.jpg",
    category: "Society",
    external_link: "https://www.publickhabar24.com/10787.html",
    status: "published",
    published_at: "2026-04-24"
  },
  {
    title: "सुकुम्बासी बस्तीमा प्रदर्शन, सत्ताको आडमा 'डोजर आतङक' बन्द गर्न माग",
    slug: "squatter-settlement-protest-bulldozer",
    excerpt: "Protesters demand an end to power-backed \"bulldozer terror\" against squatter settlements.",
    thumbnail_url: "https://www.publickhabar24.com/wp-content/uploads/2026/04/photo-4_98607259-1778x1000.jpg",
    category: "Society",
    external_link: "https://www.publickhabar24.com/10774.html",
    status: "published",
    published_at: "2026-04-24"
  },
  {
    title: "संवैधानिक निकायमाथि प्रश्न उठाउँदा मर्यादाको ख्याल गर्नुपर्छ : रवि लामिछाने",
    slug: "ravi-lamichhane-constitutional-bodies",
    excerpt: "Ravi Lamichhane on the need for restraint and dignity when questioning constitutional bodies.",
    thumbnail_url: "https://www.publickhabar24.com/wp-content/uploads/2026/08/photo_ff3a55a1.png",
    category: "Interview",
    external_link: "https://www.publickhabar24.com/11600.html",
    status: "published",
    published_at: "2026-08-20"
  }
];

async function seed() {
  console.log("Starting Article Import process...");

  // Try signing in with admin email / default owner credentials
  const adminEmail = process.env.ADMIN_EMAIL || "admin@aadityajay.com";
  const adminPass = process.env.ADMIN_PASSWORD || "AadityaAdmin2026!";

  let authUser = null;
  let { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPass
  });

  if (signInErr) {
    console.log(`Could not sign in as ${adminEmail} (${signInErr.message}). Attempting signup...`);
    const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPass,
      options: { data: { display_name: "Aaditya Ajay (Admin)" } }
    });

    if (signUpErr) {
      console.error("SignUp error:", signUpErr.message);
    } else {
      authUser = signUpData.user;
      console.log("Admin account created:", authUser?.email);
    }
  } else {
    authUser = signInData.user;
    console.log("Signed in as admin:", authUser?.email);
  }

  // 1. Clear existing placeholder rows in articles table
  console.log("Clearing existing articles table...");
  const { error: delErr } = await supabase.from('articles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delErr) {
    console.log("Delete notice (if empty or restricted):", delErr.message);
  }

  // 2. Insert 8 curated articles
  console.log("Inserting 8 curated articles...");
  const { data: inserted, error: insErr } = await supabase.from('articles').insert(articlesToInsert).select();

  if (insErr) {
    console.error("Insertion failed:", insErr.message);
    process.exit(1);
  }

  console.log(`\nSUCCESSFULLY INSERTED ${inserted.length} ARTICLES!`);
  inserted.forEach((item, index) => {
    console.log(`${index + 1}. [${item.category}] ${item.title} (Slug: ${item.slug}, Date: ${item.published_at})`);
  });

  // Verify by querying public read endpoint
  const { data: verifyArticles, error: verifyErr } = await supabase.from('articles').select('id, title, slug, status').eq('status', 'published');
  console.log(`\nVerification Query: Found ${verifyArticles?.length} published articles in public DB.`);

  // Cleanup script files
  try {
    if (fs.existsSync('import_articles.mjs')) fs.unlinkSync('import_articles.mjs');
    if (fs.existsSync('test_connect.mjs')) fs.unlinkSync('test_connect.mjs');
    if (fs.existsSync('check_auth_user.mjs')) fs.unlinkSync('check_auth_user.mjs');
    if (fs.existsSync('seed_admin_articles.mjs')) fs.unlinkSync('seed_admin_articles.mjs');
    console.log("\nCleaned up temporary import scripts.");
  } catch (e) {
    console.warn("Cleanup warning:", e.message);
  }
}

seed();
