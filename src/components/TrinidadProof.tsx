import { TRINIDAD_HISTORY_SENTENCE, TRINIDAD_PRESS_STORY } from "@/data/pressCoverage";

export default function TrinidadProof() {
  if (!TRINIDAD_PRESS_STORY) return null;
  const published = new Date(`${TRINIDAD_PRESS_STORY.publishedDate}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  return <section className="container mx-auto max-w-3xl px-4 py-10">
    <h2 className="font-display text-2xl mb-4">Trinidad since {new Date(TRINIDAD_PRESS_STORY.publishedDate).getUTCFullYear()}</h2>
    <p className="font-body leading-relaxed mb-3">{TRINIDAD_HISTORY_SENTENCE}</p>
    <p className="font-body leading-relaxed">{TRINIDAD_PRESS_STORY.outlet}, {published}: {TRINIDAD_PRESS_STORY.summary} <a href={TRINIDAD_PRESS_STORY.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">Read the article</a>.</p>
  </section>;
}