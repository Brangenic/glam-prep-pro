// Journal posts that live in this repository rather than the blog_posts
// table: the three posts rendered by their own React page, plus the
// recovered Wix posts.
//
// Every published_date here is a fixed ISO date (yyyy-mm-dd). Never a
// computed or current date: a post dated "today" would always look newer
// than any real post and permanently win the Latest Post hero on /blogs.
// src/test/blogHero.test.ts fails if that ever comes back.
//
// Kept free of image imports so the Node prerender scripts can read it.
// The /blogs page attaches the hero images for the React posts itself.

import { RECOVERED_POSTS_META } from "./recoveredPostsMeta";

export type ManualBlogPost = {
  external_id: string;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  slug: string;
  post_url: string;
  author_name: string | null;
  author_avatar_url: string | null;
  published_date: string;
  read_time: string | null;
};

/**
 * Publication dates of the posts rendered by their own React page. The
 * article pages read their datePublished and visible date from here, so
 * the article and its /blogs card can never disagree.
 *
 * Sources: the DATE_PUBLISHED each article page already carried, which
 * matches the commit that first added the article to this repository
 * (21 June 2026 for the two Glam Hub guides, 29 May 2026 for the airlift
 * editorial).
 */
export const REACT_POST_PUBLISHED_DATES = {
  "is-professional-carnival-makeup-worth-it": "2026-06-21",
  "how-far-in-advance-to-book-carnival-makeup": "2026-06-21",
  "caribbean-carnival-has-an-airlift-problem": "2026-05-29",
} as const;

export type ReactPostSlug = keyof typeof REACT_POST_PUBLISHED_DATES;

export const MANUAL_POSTS: ManualBlogPost[] = [
  {
    external_id: "manual-is-professional-carnival-makeup-worth-it",
    title: "Is Professional Carnival Makeup Worth It?",
    excerpt:
      "Makeup only runs US$170 to US$200 for a single day. Here is what you are really paying for, and whether it is worth it once Carnival is over.",
    image_url: null,
    slug: "is-professional-carnival-makeup-worth-it",
    post_url: "/blogs/is-professional-carnival-makeup-worth-it",
    author_name: "Carnival Glam Hub",
    author_avatar_url: null,
    published_date: REACT_POST_PUBLISHED_DATES["is-professional-carnival-makeup-worth-it"],
    read_time: "6 min read",
  },
  {
    external_id: "manual-how-far-in-advance-to-book-carnival-makeup",
    title: "How Far In Advance Should I Book My Carnival Makeup Artist?",
    excerpt:
      "When to book your Carnival makeup artist, why the 4am to 8am slots go first, and how to lock in a smooth Carnival morning. A Glam Hub guide.",
    image_url: null,
    slug: "how-far-in-advance-to-book-carnival-makeup",
    post_url: "/blogs/how-far-in-advance-to-book-carnival-makeup",
    author_name: "Carnival Glam Hub",
    author_avatar_url: null,
    published_date: REACT_POST_PUBLISHED_DATES["how-far-in-advance-to-book-carnival-makeup"],
    read_time: "5 min read",
  },
  {
    external_id: "manual-caribbean-carnival-has-an-airlift-problem",
    title:
      "The Caribbean Carnival economy doesn't have a demand problem. It has an airlift problem.",
    excerpt:
      "Masqueraders are ready to spend, but flights into the region are the bottleneck. An editorial on Carnival's airlift problem.",
    image_url: null,
    slug: "caribbean-carnival-has-an-airlift-problem",
    post_url: "/blogs/caribbean-carnival-has-an-airlift-problem",
    author_name: "Carnival Glam Hub",
    author_avatar_url: null,
    published_date: REACT_POST_PUBLISHED_DATES["caribbean-carnival-has-an-airlift-problem"],
    read_time: "7 min read",
  },
  ...RECOVERED_POSTS_META.map((p) => ({
    external_id: `manual-${p.slug}`,
    title: p.title,
    excerpt: p.excerpt,
    image_url: p.coverImage,
    slug: p.slug,
    post_url: `/blogs/${p.slug}`,
    author_name: p.author,
    author_avatar_url: null,
    published_date: p.publishedDate,
    read_time: p.readTime,
  })),
];
