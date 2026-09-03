// Shared meta text fitting. Search results truncate a <title> past roughly
// 60 characters and a meta description past roughly 160, so every surface
// that emits head metadata runs its text through these helpers first.
//
// Both the React pages and the build-time prerender scripts import from
// here, so a title or description can never be fitted on one surface and
// left long on the other.

export const TITLE_MAX = 60;
export const DESC_MAX = 160;
export const DESC_MIN = 140;

const collapse = (s: string) =>
  s.replace(/\s*—\s*/g, ", ").replace(/,\s*,/g, ",").replace(/\s+/g, " ").trim();

/**
 * Length as a crawler sees it. Titles and descriptions are HTML escaped
 * when written into the head, and "&" becomes "&amp;", so the budget has
 * to be measured on the escaped string or an ampersand quietly pushes a
 * title past 60 characters.
 */
const escapedLength = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;").length;

/** Trim text until its escaped length fits the budget, on a word boundary. */
function fitEscaped(text: string, max: number): string {
  let out = text;
  while (escapedLength(out) > max) {
    const cut = out.lastIndexOf(" ");
    if (cut <= 0) return out.slice(0, max);
    out = out.slice(0, cut).replace(/[\s,;:.\-–|]+$/, "");
  }
  return out;
}

/** Trim to `max` characters on a word boundary, never mid-word. */
function trimToWord(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max + 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut.slice(0, max)).replace(
    /[\s,;:.\-–|]+$/,
    "",
  );
}

/**
 * Fit a page title to 60 characters. The primary keyword sits at the front,
 * so the suffix is dropped before any of the substantive title is cut.
 */
export function fitTitle(title: string, suffix = ""): string {
  const base = collapse(title);
  if (suffix) {
    const joined = `${base}${suffix}`;
    if (escapedLength(joined) <= TITLE_MAX) return joined;
  }
  if (escapedLength(base) <= TITLE_MAX) return base;
  return fitEscaped(base, TITLE_MAX);
}

/**
 * Fit a meta description to between 140 and 160 characters.
 *
 * Long text is trimmed at the last sentence boundary that still leaves at
 * least 140 characters, so a tightened description ends cleanly rather
 * than mid-clause. Short text is topped up from `extra`, which callers
 * pass as the next lines of real page content, never invented copy.
 */
export function fitDescription(description: string, extra = ""): string {
  let text = collapse(description);

  if (text.length < DESC_MIN && extra) {
    const more = collapse(extra);
    if (more && !text.includes(more.slice(0, 40))) {
      text = collapse(`${text} ${more}`);
    }
  }

  if (escapedLength(text) <= DESC_MAX) return text;

  // Prefer a sentence boundary inside the 140 to 160 window.
  const window = fitEscaped(text, DESC_MAX);
  const sentenceEnd = Math.max(
    window.lastIndexOf(". "),
    window.lastIndexOf("! "),
    window.lastIndexOf("? "),
  );
  if (sentenceEnd >= DESC_MIN - 1) return text.slice(0, sentenceEnd + 1).trim();

  // Otherwise a clause boundary, then a word boundary.
  const clauseEnd = Math.max(window.lastIndexOf(", "), window.lastIndexOf("; "));
  if (clauseEnd >= DESC_MIN - 1) return text.slice(0, clauseEnd).trim() + ".";

  const trimmed = fitEscaped(text, DESC_MAX - 1);
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

/**
 * Flatten the opening of a markdown post body into plain prose, for use as
 * top-up text when a stored meta description is too short to fill the
 * snippet. Headings, images, links and formatting marks are stripped.
 */
export function plainTextExcerpt(markdown?: string | null, max = 220): string {
  if (!markdown) return "";
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^#{1,6}\s+.*$/gm, " ")
    .replace(/[*_`>#]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.slice(0, max);
}

/**
 * House style forbids the em dash. Blog bodies are synced from an external
 * source, so copy arriving that way is normalised at render time on both
 * the React surface and the prerendered surface.
 */
export function deEmDash(text: string): string {
  return text.replace(/\s*—\s*/g, ", ").replace(/,\s*,/g, ",");
}
