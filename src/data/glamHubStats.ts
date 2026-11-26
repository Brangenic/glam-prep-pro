// Update once a year after the Carnival season. Every surface reads from here.
export const FACES_SINCE_2017 = 15000;
export const STATS_COUNTED_TO_YEAR = 2026;
export const NEW_CLIENTS_PER_YEAR = 1000;
export const CLIENTS_IN_LATEST_YEAR = 1000;
export const STATS_STARTED_YEAR = 2017;

const formatCount = (count: number) => count.toLocaleString("en-GB");
export const FACES_FORMATTED = formatCount(FACES_SINCE_2017);
export const STATS_SHORT_PHRASE = `more than ${FACES_FORMATTED} faces since ${STATS_STARTED_YEAR}`;
export const STATS_SHORT = `More than ${FACES_FORMATTED} faces since ${STATS_STARTED_YEAR}.`;
export const STATS_HEADLINE = `More than ${FACES_FORMATTED} faces since ${STATS_STARTED_YEAR}, with about ${formatCount(NEW_CLIENTS_PER_YEAR)} new clients every year.`;
export const STATS_LATEST_YEAR = `In ${STATS_COUNTED_TO_YEAR}, more than ${formatCount(CLIENTS_IN_LATEST_YEAR)} people booked with Carnival Glam Hub.`;
export const STATS_HOW_WE_COUNT = `Our count includes Carnival mornings in every territory, band launches and band shoots. Our first seasons, from ${STATS_STARTED_YEAR}, were kept in spreadsheets and on our first website, before our current booking platform.`;
export const STATS_LLMS_SECTION = `<!-- generated-glam-hub-stats:start -->\n${STATS_HEADLINE}\n${STATS_LATEST_YEAR}\n${STATS_HOW_WE_COUNT}\n<!-- generated-glam-hub-stats:end -->`;

/** Vite substitutes this data-derived text in dev and build HTML, before prerendering. */
export function renderStatsHtml(html: string): string {
  return html.split("__GLAM_HUB_STATS_HEADLINE__").join(STATS_HEADLINE);
}