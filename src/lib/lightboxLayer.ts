/**
 * While a photo lightbox is open, the floating layers (cookie banner, Ask
 * JADE launcher and chat panel, sticky mobile booking bar) are hidden with
 * visibility only. They stay mounted, so their state, including an
 * unanswered cookie choice, is exactly as it was when the lightbox closes.
 * The CSS rule lives in src/index.css.
 */
export const LIGHTBOX_OPEN_ATTR = "data-lightbox-open";
export const HIDE_UNDER_LIGHTBOX_ATTR = "data-hide-under-lightbox";
/** Props for a floating layer that must step aside for the lightbox. */
export const hideUnderLightbox = { [HIDE_UNDER_LIGHTBOX_ATTR]: "" } as const;

export function setLightboxOpen(open: boolean): void {
  if (typeof document === "undefined") return;
  if (open) document.documentElement.setAttribute(LIGHTBOX_OPEN_ATTR, "");
  else document.documentElement.removeAttribute(LIGHTBOX_OPEN_ATTR);
}
