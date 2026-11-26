import { isTitleTrimmed, TITLE_MAX } from "@/lib/metaText";
import { BLOG_TITLE_BASELINE } from "@/data/blogTitleBaseline";

export class SyncedBlogTitleError extends Error {}
export function assertSyncedBlogTitle(slug: string, title: string) {
  const baseline = BLOG_TITLE_BASELINE[slug];
  if (baseline && title === baseline.title) return;
  if (isTitleTrimmed(title)) throw new SyncedBlogTitleError(`TODO(Kibwe): Synced blog ${slug} has a title over ${TITLE_MAX} characters: ${title}`);
}