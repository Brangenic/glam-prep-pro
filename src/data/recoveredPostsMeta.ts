// Metadata for blog posts that were recreated from the legacy Wix site.
// Kept body-free so Node-only scripts (sitemap, prerender) can import it
// without needing Vite's ?raw loader. The full bodies live alongside in
// src/data/recoveredPosts.ts.

export type RecoveredPostMeta = {
  slug: string;
  title: string;
  author: string;
  publishedDate: string; // ISO yyyy-mm-dd
  coverImage: string;
  excerpt: string;
  category: string;
  tags: string[];
  metaDescription: string;
  readTime: string;
};

export const RECOVERED_POSTS_META: RecoveredPostMeta[] = [
  {
    slug: "chatgpt-picks-the-top-5-best-caribbean-carnivals",
    title:
      "ChatGPT Picks the Top 5 Best Caribbean Carnivals — Here's My Wild Take!",
    author: "Carnival Chaser",
    publishedDate: "2024-09-15",
    coverImage:
      "https://static.wixstatic.com/media/477465_5d9a216d559442279bb4e143c2de0ad1~mv2.jpg",
    excerpt:
      "ChatGPT ranked the top Caribbean Carnivals — here's a Carnival chaser's honest take on Trinidad, Crop Over, Jamaica, Spicemas and Saint Lucia.",
    category: "Caribbean Carnivals",
    tags: ["Carnival Tips", "Carnival Do's and Don'ts", "Travel Tips"],
    metaDescription:
      "Explore ChatGPT's top picks for the best Caribbean Carnivals, from the epic road marches in Trinidad to the Dancehall-Soca of Jamaica. Insider tips, must-attend fetes, and why these Carnivals are a must for every Carnival chaser.",
    readTime: "7 min read",
  },
  {
    slug: "your-ultimate-guide-to-jamaica-carnival-2025-everything-you-need-to-know",
    title:
      "Your Ultimate Guide to Jamaica Carnival 2025: Everything You Need to Know",
    author: "Jade Amiel",
    publishedDate: "2025-01-26",
    coverImage:
      "https://static.wixstatic.com/media/477465_a6095efb7ff846228e5a9a603caea64c~mv2.png",
    excerpt:
      "Everything you need to know about Jamaica Carnival — dates, where to stay, fetes to hit, Carnival makeup, and the dos and don'ts.",
    category: "Jamaica Carnival",
    tags: [
      "Jamaica Carnival",
      "GenX Carnival",
      "Carnival in Jamaica",
      "Xodus Carnival",
    ],
    metaDescription:
      "Everything you need to know about Jamaica Carnival — dates, where to stay, fetes to hit, Carnival makeup, and the dos and don'ts.",
    readTime: "6 min read",
  },
  {
    slug: "carnival-queen-rihannas-stunning-return-to-crop-over-2024",
    title: "Carnival Queen: Rihanna's Stunning Return to Crop Over 2024",
    author: "Carnival Chaser",
    publishedDate: "2024-08-06",
    coverImage:
      "https://static.wixstatic.com/media/477465_63eed778f7644b009bf3f8ad3f634b92~mv2.jpg",
    excerpt:
      "Rihanna's stunning return to the 2024 Crop Over Festival in Barbados, in a custom costume by Lauren Austin of Aura Experience.",
    category: "Carnival Band Review",
    tags: [
      "Carnival Glam Hub",
      "Crop Over",
      "Barbados Carnival",
      "Rihanna",
      "Soca Music",
    ],
    metaDescription:
      "Rihanna's stunning return to the 2024 Crop Over Festival in Barbados, in a custom costume by Lauren Austin of Aura Experience. Why Crop Over is a must-do for every Carnival Chaser.",
    readTime: "5 min read",
  },
  {
    slug: "barbados-crop-over-2025-what-to-know-before-you-go",
    title: "Barbados Crop Over 2025: What to Know Before You Go",
    author: "Carnival Chaser",
    publishedDate: "2025-05-29",
    coverImage:
      "https://static.wixstatic.com/media/477465_f64bba7b59bc410282d0e27d701838a3~mv2.jpg",
    excerpt:
      "Planning Crop Over 2025? From where to stay and what to eat to glam tips and road-day hacks, here's your ultimate guide to enjoying Barbados' biggest carnival like a pro.",
    category: "Crop Over",
    tags: ["Crop Over", "Barbados Carnival", "Carnival Tips"],
    metaDescription:
      "Planning Crop Over 2025? From where to stay and what to eat to glam tips and road-day hacks, here's your ultimate guide to enjoying Barbados' biggest carnival like a pro.",
    readTime: "6 min read",
  },
];

export const RECOVERED_POST_SLUGS: Set<string> = new Set(
  RECOVERED_POSTS_META.map((p) => p.slug),
);