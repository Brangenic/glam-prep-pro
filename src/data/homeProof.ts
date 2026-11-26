import { FACES_FORMATTED, STATS_STARTED_YEAR } from "./glamHubStats";
import { FULL_SERVICE_SLUGS, LITE_SLUGS } from "./hubTiers";
import { PRESS_STORIES } from "./pressCoverage";

export const HOME_FACES_PROOF = `${FACES_FORMATTED}+ faces since ${STATS_STARTED_YEAR}`;
export const HOME_TERRITORY_COUNT = FULL_SERVICE_SLUGS.length + LITE_SLUGS.length;
export const HOME_PROOF_LINE = `${HOME_FACES_PROOF} · ${HOME_TERRITORY_COUNT} territories · Band neutral`;
export const HOME_FEATURED_OUTLET = PRESS_STORIES.find((story) => story.outletDomain === "teenvogue.com")?.outlet;
export const HOME_COVERAGE_PATH = "/press";