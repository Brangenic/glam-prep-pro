import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogDescription, DialogOverlay, DialogPortal, DialogTitle } from "@/components/ui/dialog";
import { setLightboxOpen } from "@/lib/lightboxLayer";
import { JAMAICA_GALLERY, JAMAICA_GALLERY_HEADING, JAMAICA_GALLERY_NOTE } from "@/data/jamaicaPage";

/**
 * Inside Glam Hub Jamaica. Same masonry pattern as the homepage gallery,
 * with a lightbox to view each photo larger. Photos and alt text come from
 * src/data/jamaicaPage.ts, the same source as the prerendered body.
 */
const JamaicaGallery = () => {
  const [open, setOpen] = useState<number | null>(null);
  const count = JAMAICA_GALLERY.length;
  const current = open === null ? null : JAMAICA_GALLERY[open];
  const step = (d: number) => setOpen((i) => (i === null ? i : (i + d + count) % count));

  // Hide the cookie banner, Ask JADE and the sticky booking bar while a
  // photo is open, and restore them untouched when it closes.
  const isOpen = open !== null;
  useEffect(() => {
    setLightboxOpen(isOpen);
    return () => setLightboxOpen(false);
  }, [isOpen]);

  if (count === 0) return null;

  return (
    <section className="section-y border-t border-border" aria-labelledby="jamaica-gallery-heading">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-3 text-center">
          Our Work
        </p>
        <h2
          id="jamaica-gallery-heading"
          className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-center"
        >
          {JAMAICA_GALLERY_HEADING}
        </h2>
        <p className="font-body text-sm text-muted-foreground text-center max-w-2xl mx-auto mb-10">
          {JAMAICA_GALLERY_NOTE}
        </p>
        <div className="columns-2 sm:columns-3 gap-2 sm:gap-3 lg:gap-4">
          {JAMAICA_GALLERY.map((img, i) => (
            <figure key={img.src} className="mb-2 sm:mb-3 lg:mb-4 break-inside-avoid overflow-hidden rounded-xl sm:rounded-2xl">
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`View larger photo ${i + 1} of ${count}`}
                className="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <img
                  src={img.src}
                  srcSet={img.srcSet}
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 33vw, 50vw"
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto block hover:scale-105 transition-transform duration-700"
                />
              </button>
            </figure>
          ))}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogPortal>
          {/* Above the cookie banner (z-60), Ask JADE and the sticky bar (z-50). */}
          <DialogOverlay className="z-[70]" data-testid="lightbox-overlay" />
          <DialogPrimitive.Content
            data-testid="lightbox"
            className="lightbox-safe fixed inset-0 z-[80] flex items-center justify-center focus:outline-none"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") step(1);
              if (e.key === "ArrowLeft") step(-1);
            }}
          >
            <DialogTitle className="sr-only">
              {JAMAICA_GALLERY_HEADING}, photo {(open ?? 0) + 1} of {count}
            </DialogTitle>
            <DialogDescription className="sr-only">{current?.alt}</DialogDescription>
            {current && (
              <div className="relative max-w-3xl">
                <img
                  src={current.src}
                  alt={current.alt}
                  width={current.width}
                  height={current.height}
                  className="lightbox-photo block h-auto w-auto max-w-full rounded-lg object-contain"
                />
                <DialogPrimitive.Close
                  aria-label="Close photo"
                  className="absolute right-2 top-2 h-11 w-11 inline-flex items-center justify-center rounded-full bg-background/80 text-foreground shadow hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </DialogPrimitive.Close>
                {count > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label="Previous photo"
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-11 w-11 inline-flex items-center justify-center rounded-full bg-background/80 text-foreground shadow hover:bg-background"
                    >
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label="Next photo"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-11 w-11 inline-flex items-center justify-center rounded-full bg-background/80 text-foreground shadow hover:bg-background"
                    >
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </>
                )}
              </div>
            )}
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </section>
  );
};

export default JamaicaGallery;
