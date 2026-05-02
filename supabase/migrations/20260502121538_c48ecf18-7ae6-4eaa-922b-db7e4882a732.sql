-- Reassign AI-generated hero images to randomized real photos from the curated pool
WITH pool AS (
  SELECT name, row_number() OVER (ORDER BY random()) AS rn
  FROM storage.objects
  WHERE bucket_id = 'blog-images' AND name LIKE 'pool/%'
),
targets AS (
  SELECT id, row_number() OVER (ORDER BY synced_at) AS rn,
         (SELECT count(*) FROM pool) AS pool_count
  FROM blog_posts
  WHERE image_url LIKE '%/blog-images/%'
    AND image_url NOT LIKE '%/blog-images/pool/%'
)
UPDATE blog_posts bp
SET image_url = 'https://bvrejdrsrmvdknzoskxi.supabase.co/storage/v1/object/public/blog-images/' || p.name,
    updated_at = now()
FROM targets t
JOIN pool p ON p.rn = ((t.rn - 1) % t.pool_count) + 1
WHERE bp.id = t.id;