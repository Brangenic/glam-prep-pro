import { createClient } from '@supabase/supabase-js';
const url = 'https://bvrejdrsrmvdknzoskxi.supabase.co';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sb = createClient(url, key);
const slug = '2025-carnival-makeup-guide-50-looks-to-show-your-mua';
const { data, error } = await sb.from('blog_posts').select('content,title,published_date,meta_description').eq('slug', slug).single();
if (error) { console.error(error); process.exit(1); }
let content = data.content;

// Identify first two images. The first is markdown image at top:
const img1Re = /!\[Woman in vibrant blue feathered headdress[^\]]*\]\(https:\/\/static\.wixstatic\.com\/[^)]+\)/;
const img2Re = /\[!\[Woman in colorful, feathered costume[^\]]*\]\(https:\/\/static\.wixstatic\.com\/[^)]+\)\]\(https:\/\/www\.pinterest\.com\/[^)]+\)/;

if (!img1Re.test(content)) { console.error('img1 not found'); process.exit(2); }
if (!img2Re.test(content)) { console.error('img2 not found'); process.exit(3); }

const newImageUrl = 'https://bvrejdrsrmvdknzoskxi.supabase.co/storage/v1/object/public/blog-images/2025-carnival-makeup-guide-50-looks-to-show-your-mua-2026.webp';
const replacement = `![2026 Carnival Makeup Guide cover by Carnival Glam Hub](${newImageUrl})`;

// Remove img1, replace img2 with the new one (so it appears once near the top instead of twice).
// Actually instructions: remove first two images and put the new image in their place. So replace img1 with new image, remove img2.
content = content.replace(img1Re, replacement);
content = content.replace(img2Re, '');

// Replace 2025 -> 2026 globally
content = content.replace(/2025/g, '2026');

const newTitle = data.title.replace(/2025/g, '2026');
const newPublished = (data.published_date || '').replace(/2025/g, '2026');
const newMeta = data.meta_description ? data.meta_description.replace(/2025/g,'2026') : null;

const newImageColumn = newImageUrl;

const { error: uerr } = await sb.from('blog_posts').update({
  content,
  title: newTitle,
  published_date: newPublished,
  image_url: newImageColumn,
  meta_description: newMeta,
  updated_at: new Date().toISOString(),
}).eq('slug', slug);
if (uerr) { console.error(uerr); process.exit(4); }
console.log('OK title=', newTitle, 'published=', newPublished, 'image=', newImageColumn);
