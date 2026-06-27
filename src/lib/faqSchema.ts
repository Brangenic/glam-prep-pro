// Generic FAQ schema extractor. Parses a `## Frequently Asked Questions`
// (or `## FAQ`) section out of a markdown blog post and returns a
// schema.org FAQPage JSON-LD object suitable for `<script
// type="application/ld+json">` injection.
//
// Q&A format expected in the source markdown:
//
//   ## Frequently Asked Questions
//
//   **Is the question?**
//   Answer paragraph, possibly multi-line until the next blank line or
//   the next bold question.
//
//   **Next question?**
//   Next answer.
//
// Anything outside the FAQ section (until the next `## ` heading) is
// ignored. Returns null when no FAQ section is found or no Q&A pairs
// could be parsed.

export type FaqItem = { question: string; answer: string };

const SECTION_RE = /^##\s+(?:Frequently\s+Asked\s+Questions|FAQ|FAQs)\b[^\n]*\n([\s\S]*?)(?=\n##\s|$)/im;

export function extractFaqItems(markdown: string | null | undefined): FaqItem[] {
  if (!markdown) return [];
  const m = markdown.match(SECTION_RE);
  if (!m) return [];
  const body = m[1];
  const items: FaqItem[] = [];
  // Split on lines starting with **...?** (bold question line).
  const qRe = /^\s*\*\*([^\n*][^\n]*?)\*\*\s*$/gm;
  const matches: Array<{ q: string; start: number; end: number }> = [];
  let mm: RegExpExecArray | null;
  while ((mm = qRe.exec(body)) !== null) {
    matches.push({ q: mm[1].trim(), start: mm.index, end: mm.index + mm[0].length });
  }
  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i];
    const next = matches[i + 1];
    const answer = body
      .slice(cur.end, next ? next.start : body.length)
      .replace(/^\s+|\s+$/g, "")
      .replace(/\s+\n\s+/g, " ")
      .replace(/\n+/g, " ");
    if (cur.q && answer) items.push({ question: cur.q, answer });
  }
  return items;
}

export function buildFaqSchema(markdown: string | null | undefined) {
  const items = extractFaqItems(markdown);
  if (items.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: { "@type": "Answer", text: it.answer },
    })),
  };
}