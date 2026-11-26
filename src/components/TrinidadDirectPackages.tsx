import { Link } from "react-router-dom";
import { TRINIDAD_PACKAGES } from "@/data/trinidadPackages";
import { hasSeasonPassed } from "@/data/seasons";

export default function TrinidadDirectPackages() {
  if (hasSeasonPassed("trinidad")) return null;
  return (
    <section className="container mx-auto max-w-3xl px-4 py-10" aria-label="Book a package directly">
      <h2 className="font-display text-2xl mb-5">Book a package directly</h2>
      <div className="space-y-4 font-body text-sm leading-relaxed">
        {TRINIDAD_PACKAGES.map((p) => <p key={p.path}>{p.directSentence} <Link className="text-primary underline break-words" to={p.path}>{p.url.replace(/^https:\/\/www\./, "")}</Link></p>)}
      </div>
    </section>
  );
}