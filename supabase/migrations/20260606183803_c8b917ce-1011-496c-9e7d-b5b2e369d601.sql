-- 1. Add rollback column for hero image rehost
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS image_url_legacy text;

-- 2. Anchor rewrite + typo fix inside a single transaction with diagnostics
DO $$
DECLARE
  v_before_dead int;
  v_before_typo int;
  v_after_dead int;
  v_after_typo int;
  v_after_glam_any int;
  v_slug text;
  v_pattern text;
  v_replacement text;
BEGIN
  SELECT count(*) INTO v_before_dead
  FROM public.blog_posts
  WHERE content LIKE '%glam.carnivalglamhub.com/post/%';

  SELECT count(*) INTO v_before_typo
  FROM public.blog_posts
  WHERE content LIKE '%flawless.nd ready%';

  RAISE NOTICE 'BEFORE: posts with glam.carnivalglamhub.com/post links=%, posts with typo=%',
    v_before_dead, v_before_typo;

  -- (a) For each live slug, rewrite matching anchors to canonical /blogs/{slug}
  FOR v_slug IN SELECT slug FROM public.blog_posts WHERE slug IS NOT NULL LOOP
    v_pattern := 'href=(["''])https?://glam\.carnivalglamhub\.com/post/' ||
                 regexp_replace(v_slug, '([.+*?()\[\]{}|^$\\])', '\\\1', 'g') ||
                 '/?\1';
    v_replacement := 'href=\1https://www.carnivalglamhub.com/blogs/' || v_slug || '\1';
    UPDATE public.blog_posts
      SET content = regexp_replace(content, v_pattern, v_replacement, 'g')
      WHERE content ~ v_pattern;
  END LOOP;

  -- (b) Unwrap remaining anchors that still point to glam.carnivalglamhub.com/post/...
  -- (these are the 27 orphaned slugs with no live row). Lazy quantifier .*? supported in Postgres regex.
  UPDATE public.blog_posts
    SET content = regexp_replace(
      content,
      '<a\s+[^>]*href=["'']https?://glam\.carnivalglamhub\.com/post/[^"'']*["''][^>]*>(.*?)</a>',
      '\1',
      'g'
    )
  WHERE content ~ '<a\s+[^>]*href=["'']https?://glam\.carnivalglamhub\.com/post/';

  -- (c) Typo fix
  UPDATE public.blog_posts
    SET content = replace(content, 'flawless.nd ready', 'flawless and ready')
    WHERE content LIKE '%flawless.nd ready%';

  SELECT count(*) INTO v_after_dead
  FROM public.blog_posts
  WHERE content LIKE '%glam.carnivalglamhub.com/post/%';

  SELECT count(*) INTO v_after_typo
  FROM public.blog_posts
  WHERE content LIKE '%flawless.nd ready%';

  SELECT count(*) INTO v_after_glam_any
  FROM public.blog_posts
  WHERE content LIKE '%glam.carnivalglamhub.com%';

  RAISE NOTICE 'AFTER: posts with glam.carnivalglamhub.com/post links=%, posts with typo=%, posts with any glam.carnivalglamhub.com reference=%',
    v_after_dead, v_after_typo, v_after_glam_any;
END $$;