import { isTitleTrimmed, TITLE_MAX } from "@/lib/metaText";

export class SyncedBlogTitleError extends Error {}
export function assertSyncedBlogTitle(slug: string, title: string) {
  if (isTitleTrimmed(title)) throw new SyncedBlogTitleError(`TODO(Kibwe): Synced blog ${slug} has a title over ${TITLE_MAX} characters: ${title}`);
}