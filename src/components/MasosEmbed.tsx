interface MasosEmbedProps {
  url: string;
  title?: string;
}

/**
 * Embeds the live MasOS booking page as an iframe with a transparent
 * full-coverage anchor overlay so any click opens the MasOS URL in a new tab.
 */
const MasosEmbed = ({ url, title = "Book your glam" }: MasosEmbedProps) => (
  <section
    aria-label="Live booking"
    className="relative w-full"
    style={{ height: "85vh" }}
  >
    <iframe
      src={url}
      title={title}
      className="absolute inset-0 w-full h-full border-0"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={title}
      className="absolute inset-0 z-10 block"
      style={{ background: "transparent" }}
    />
  </section>
);

export default MasosEmbed;