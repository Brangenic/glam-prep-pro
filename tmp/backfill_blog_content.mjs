import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;

if (!supabaseUrl || !serviceRoleKey || !firecrawlApiKey) {
  throw new Error('Missing required environment variables');
}

const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

const cleanMarkdown = (markdown) => {
  if (!markdown) return '';
  return markdown
    .replace(/!\[]\(data:image\/svg\+xml[^\n]*\n?/g, '')
    .replace(/!\[Close Button Icon\][^\n]*\n?/gi, '')
    .replace(/Smartarget Apps are hidden[\s\S]*?top of page\n?/gi, '')
    .replace(/loadbalancer\.visitor-analytics\.io[\s\S]*?ERR_BLOCKED_BY_CLIENT[\s\S]*?Reload\n?/gi, '')
    .replace(/bottom of page[\s\S]*$/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

const scrapeContent = async (url) => {
  const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${firecrawlApiKey}`,
      'Content-Type': 'application/json',
    },
    signal: AbortSignal.timeout(45000),
    body: JSON.stringify({
      url,
      formats: ['markdown'],
      onlyMainContent: true,
      waitFor: 3000,
    }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(`Firecrawl error ${response.status}`);
  }

  const raw = payload?.data?.markdown ?? payload?.markdown ?? '';
  return cleanMarkdown(raw);
};

const { data: missingRows, error: missingError } = await supabase
  .from('blog_posts')
  .select('external_id, title, post_url')
  .is('content', null)
  .order('synced_at', { ascending: false })
  .limit(20);

if (missingError) {
  throw new Error(`Failed to read missing rows: ${missingError.message}`);
}

if (!missingRows?.length) {
  console.log('No missing blog content rows found.');
  process.exit(0);
}

let success = 0;
let failed = 0;

for (const row of missingRows) {
  try {
    const content = await scrapeContent(row.post_url);
    if (!content || content.length < 280) {
      failed += 1;
      console.log(`SKIP short content: ${row.title}`);
      continue;
    }

    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ content })
      .eq('external_id', row.external_id);

    if (updateError) {
      failed += 1;
      console.log(`UPDATE FAILED: ${row.title} -> ${updateError.message}`);
      continue;
    }

    success += 1;
    console.log(`UPDATED: ${row.title} (${content.length} chars)`);
  } catch (err) {
    failed += 1;
    console.log(`FAILED: ${row.title} -> ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}

console.log(`Done. Success: ${success}, Failed: ${failed}, Processed: ${missingRows.length}`);
