DO $$
DECLARE
  v_before_post int;
  v_before_any int;
  v_after_post int;
  v_after_any int;
  v_slug text;
  v_pattern text;
  v_replacement text;
BEGIN
  SELECT count(*) INTO v_before_post
    FROM public.blog_posts WHERE content LIKE '%glam.carnivalglamhub.com/post/%';
  SELECT count(*) INTO v_before_any
    FROM public.blog_posts WHERE content LIKE '%glam.carnivalglamhub.com%';
  RAISE NOTICE 'BEFORE: /post/ refs=% any glam refs=%', v_before_post, v_before_any;

  -- (a) Markdown link rewrite for live slugs: ](https://glam.../post/{slug}[/]) -> ](https://www.carnivalglamhub.com/blogs/{slug})
  FOR v_slug IN SELECT slug FROM public.blog_posts WHERE slug IS NOT NULL LOOP
    v_pattern := '\]\(https?://glam\.carnivalglamhub\.com/post/' ||
                 regexp_replace(v_slug, '([.+*?()\[\]{}|^$\\])', '\\\1', 'g') ||
                 '/?\)';
    v_replacement := '](https://www.carnivalglamhub.com/blogs/' || v_slug || ')';
    UPDATE public.blog_posts
      SET content = regexp_replace(content, v_pattern, v_replacement, 'g')
      WHERE content ~ v_pattern;
  END LOOP;

  -- (b) Unwrap any remaining Markdown link to glam.carnivalglamhub.com (orphans + hashtag refs).
  -- Capture the char before '[' to avoid eating image syntax '![alt](url)'.
  UPDATE public.blog_posts
    SET content = regexp_replace(
      content,
      '(^|[^!])\[([^\]]*)\]\(https?://glam\.carnivalglamhub\.com/[^)]*\)',
      '\1\2',
      'g'
    )
  WHERE content ~ '\[([^\]]*)\]\(https?://glam\.carnivalglamhub\.com/';

  -- (c) Belt-and-braces: handle the rare image-link case `![...](glam...)` too -> drop entirely (would 404 anyway)
  UPDATE public.blog_posts
    SET content = regexp_replace(
      content,
      '!\[[^\]]*\]\(https?://glam\.carnivalglamhub\.com/[^)]*\)',
      '',
      'g'
    )
  WHERE content ~ '!\[[^\]]*\]\(https?://glam\.carnivalglamhub\.com/';

  -- (d) Final sweep: any bare https://glam.carnivalglamhub.com URL left in text -> replace host with canonical.
  UPDATE public.blog_posts
    SET content = regexp_replace(
      content,
      'https?://glam\.carnivalglamhub\.com',
      'https://www.carnivalglamhub.com',
      'g'
    )
  WHERE content LIKE '%glam.carnivalglamhub.com%';

  SELECT count(*) INTO v_after_post
    FROM public.blog_posts WHERE content LIKE '%glam.carnivalglamhub.com/post/%';
  SELECT count(*) INTO v_after_any
    FROM public.blog_posts WHERE content LIKE '%glam.carnivalglamhub.com%';
  RAISE NOTICE 'AFTER: /post/ refs=% any glam refs=%', v_after_post, v_after_any;
END $$;