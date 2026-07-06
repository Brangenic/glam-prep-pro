UPDATE public.blog_posts
SET content = replace(
  content,
  E'**Reserve your Trinidad Carnival 2027 spot:** [carnivalglamhub.masos.app/events](https://carnivalglamhub.masos.app/events) · WhatsApp [+1 876 509 0997](https://wa.me/18765090997)',
  E'**Reserve your Trinidad Carnival 2027 spot:**\n\n[Reserve My Spot](https://carnivalglamhub.masos.app/events)\n\n[WhatsApp Us](https://wa.me/18765090997)'
)
WHERE slug = 'tribe-carnival-2027-elysia-band-launch';