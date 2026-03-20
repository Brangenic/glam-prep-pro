-- Clean Wix/Smartarget junk from all blog_posts content
UPDATE blog_posts
SET content = regexp_replace(
  regexp_replace(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            content,
            E'\\[!\\[.*?\\]\\(https://smartarget\\.online[^\\]]*\\)\\]\\([^)]*\\)\\s*', '', 'g'
          ),
          E'Skip to Main Content\\s*', '', 'gi'
        ),
        E'!\\[\\]\\(https://static\\.wixstatic\\.com/media/[^)]*?fill/w_\\d+,h_1200[^)]*\\)\\s*', '', 'g'
      ),
      E'^Search\\s*$', '', 'gm'
    ),
    E'bottom of page[\\s\\S]*$', '', 'gi'
  ),
  E'\\n{3,}', E'\n\n', 'g'
)
WHERE content IS NOT NULL
AND (content ILIKE '%smartarget%' OR content ILIKE '%skip to main content%');