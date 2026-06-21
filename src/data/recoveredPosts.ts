// Recovered legacy Wix posts rendered from in-repo markdown. These don't
// require a database row — BlogPost.tsx checks this map first, before the
// Supabase lookup, so they always render the full article body.

import { RECOVERED_POSTS_META, type RecoveredPostMeta } from "./recoveredPostsMeta";
import bodyChatGPT from "./recovered/chatgpt-picks-the-top-5-best-caribbean-carnivals.md?raw";
import bodyJamaica from "./recovered/your-ultimate-guide-to-jamaica-carnival-2025-everything-you-need-to-know.md?raw";
import bodyRihanna from "./recovered/carnival-queen-rihannas-stunning-return-to-crop-over-2024.md?raw";
import bodyBarbados from "./recovered/barbados-crop-over-2025-what-to-know-before-you-go.md?raw";

export type RecoveredPost = RecoveredPostMeta & { content: string };

const BODIES: Record<string, string> = {
  "chatgpt-picks-the-top-5-best-caribbean-carnivals": bodyChatGPT,
  "your-ultimate-guide-to-jamaica-carnival-2025-everything-you-need-to-know": bodyJamaica,
  "carnival-queen-rihannas-stunning-return-to-crop-over-2024": bodyRihanna,
  "barbados-crop-over-2025-what-to-know-before-you-go": bodyBarbados,
};

export const RECOVERED_POSTS: RecoveredPost[] = RECOVERED_POSTS_META.map(
  (meta) => ({ ...meta, content: BODIES[meta.slug] ?? "" }),
);

export const RECOVERED_POST_BY_SLUG: Record<string, RecoveredPost> =
  Object.fromEntries(RECOVERED_POSTS.map((p) => [p.slug, p]));

export { RECOVERED_POSTS_META };