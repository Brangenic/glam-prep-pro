// Legacy posts placed a low-quality preview immediately before the full image.
// Both now point at one stored file, so the first of an identical adjacent pair
// is dropped. Shared by the React blog page and the prerendered body.
export const DUPLICATE_IMAGE_RE = /!\[[^\]]*\]\(([^)\s]+)\)[\s\\]*(?=!\[[^\]]*\]\(\1\))/g;
