import { Link } from "react-router-dom";
import { HOME_COVERAGE_PATH, HOME_PROOF_LINE } from "@/data/homeProof";
import { PRESS_OUTLETS } from "@/data/pressCoverage";

const FounderProof = () => (
  <div data-home-proof="founder" className="mt-6 border-t border-border py-3 text-center font-body text-muted-foreground">
    <p className="text-xs leading-5">{HOME_PROOF_LINE}</p>
    <div className="mt-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-[11px] leading-4">
      {PRESS_OUTLETS.map((outlet) => (
        <Link key={outlet.name} to={`${HOME_COVERAGE_PATH}#story-${outlet.anchorId}`} className="hover:text-primary transition-colors">
          {outlet.name}
        </Link>
      ))}
      <Link to={HOME_COVERAGE_PATH} className="underline underline-offset-2 hover:text-primary transition-colors">See all coverage →</Link>
    </div>
  </div>
);

export default FounderProof;