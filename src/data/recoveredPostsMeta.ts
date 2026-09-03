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
      "ChatGPT Picks the Top 5 Best Caribbean Carnivals, Here's My Wild Take!",
    author: "Carnival Chaser",
    publishedDate: "2024-09-15",
    coverImage:
      "https://static.wixstatic.com/media/477465_5d9a216d559442279bb4e143c2de0ad1~mv2.jpg",
    excerpt:
      "ChatGPT ranked the top Caribbean Carnivals, here's a Carnival chaser's honest take on Trinidad, Crop Over, Jamaica, Spicemas and Saint Lucia.",
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
      "Everything you need to know about Jamaica Carnival, dates, where to stay, fetes to hit, Carnival makeup, and the dos and don'ts.",
    category: "Jamaica Carnival",
    tags: [
      "Jamaica Carnival",
      "GenX Carnival",
      "Carnival in Jamaica",
      "Xodus Carnival",
    ],
    metaDescription:
      "Everything you need to know about Jamaica Carnival, dates, where to stay, fetes to hit, Carnival makeup, and the dos and don'ts.",
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
      "Rihanna's showstopping Crop Over return, broken down look by look, the costumes, the beauty, and why she is Carnival royalty.",
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
  {
    slug: "10-tips-for-trinidad-carnival-jouvert",
    title: "10 Tips for Trinidad Carnival J'ouvert",
    author: "Carnival Chaser",
    publishedDate: "2026-06-19",
    coverImage:
      "https://static.wixstatic.com/media/477465_3333540afbef4f60a48b009fbc85bc60~mv2.jpg",
    excerpt:
      "First time doing J'ouvert at Trinidad Carnival 2027? Here's how to survive and enjoy Trinidad's wildest Carnival event, from outfits to safety and glam that lasts.",
    category: "Carnival Tips",
    tags: ["Carnival Tips", "Jouvert", "Trinidad Carnival", "Carnival Do's and Don'ts"],
    metaDescription:
      "Ten things to know before your first Trinidad J'ouvert: what to wear, how to protect your hair and skin, what to bring, and how to survive the pre-dawn mud and paint.",
    readTime: "5 min read",
  },
  {
    slug: "dont-make-these-5-rookie-mistakes-trinidad-carnival-2027",
    title: "Don't Make These 5 Rookie Mistakes: Trinidad Carnival 2027",
    author: "Shanique Singh",
    publishedDate: "2026-06-20",
    coverImage:
      "https://static.wixstatic.com/media/477465_8616a66eef5a4afaaff222aa9ba5a238~mv2.jpg",
    excerpt:
      "Insider tips for Trinidad Carnival 2027 first-timers. From shoe choices to fete essentials, learn the ropes from a seasoned masquerader and model, and avoid the rookie pitfalls.",
    category: "Carnival Tips",
    tags: ["Carnival Tips", "Trinidad Carnival", "Carnival Do's and Don'ts", "Carnival Glam Hub"],
    metaDescription:
      "Insider tips for Trinidad Carnival 2027 first-timers. From shoe choices to fete essentials, learn the ropes from a seasoned masquerader and model, and avoid the rookie pitfalls.",
    readTime: "5 min read",
  },
  {
    slug: "is-trinidad-carnival-safe",
    title: "Is Trinidad Carnival Safe? The Real Talk You Never Knew You Needed",
    author: "Carnival Glam Hub",
    publishedDate: "2026-06-17",
    coverImage:
      "https://static.wixstatic.com/media/477465_d867c068593945b4999d3ae7c72d3ef6~mv2.jpg",
    excerpt:
      "Is Trinidad Carnival 2027 safe? We cut through the noise with real, practical safety advice for masqueraders, from cash tactics to ride-share moves and squad goals.",
    category: "Carnival Tips",
    tags: ["Carnival Tips", "Trinidad Carnival", "Travel Tips", "Carnival Do's and Don'ts"],
    metaDescription:
      "Is Trinidad Carnival 2027 safe? We cut through the noise with real, practical safety advice for masqueraders, from cash tactics to ride-share moves and squad goals.",
    readTime: "6 min read",
  },
  {
    slug: "how-to-put-on-your-carnival-wire-bra",
    title: "How to Put On Your Carnival Wire Bra",
    author: "Carnival Glam Hub",
    publishedDate: "2026-06-16",
    coverImage:
      "https://static.wixstatic.com/media/477465_ae49750d61e4486c9bb571455a196957~mv2.jpg",
    excerpt:
      "Carnival wire bras cause 90% of costume malfunctions. Here are four must-know tips to put yours on right and avoid wardrobe disasters on the road.",
    category: "Carnival Tips",
    tags: ["Carnival Tips", "Carnival Wire Bra", "Trinidad Carnival", "Carnival Do's and Don'ts"],
    metaDescription:
      "Carnival wire bras cause 90% of costume malfunctions. Here are four must-know tips to put yours on right and avoid wardrobe disasters on the road.",
    readTime: "4 min read",
  },
  {
    slug: "comfort-queen-or-hot-gyal",
    title: "Comfort Queen or Hot Gyal? A Carnival Footwear Guide",
    author: "Mary Esdelle",
    publishedDate: "2026-06-18",
    coverImage:
      "https://static.wixstatic.com/media/477465_25db9dd2b93b40089c6a0adf739f9e08~mv2.jpg",
    excerpt:
      "Heels or flats for the road? A real-talk Carnival footwear guide for Trinidad Carnival 2027, block heels, peep-toe booties, platforms and the half-and-half move.",
    category: "Carnival Tips",
    tags: ["Carnival Tips", "Trinidad Carnival", "Carnival Shoes", "Carnival Do's and Don'ts"],
    metaDescription:
      "Heels or flats for the road? A real-talk Carnival footwear guide for Trinidad Carnival 2027, block heels, peep-toe booties, platforms and the half-and-half move.",
    readTime: "4 min read",
  },
  {
    slug: "trinidad-carnival-2027-first-time-masquerader-guide",
    title:
      "Trinidad Carnival 2027: Dates, Costumes, Hotels, Makeup & What First-Time Masqueraders Need to Know",
    author: "Carnival Glam Hub",
    publishedDate: "2026-06-22",
    coverImage: "/blog/trinidad-2027/road-1.jpg",
    excerpt:
      "Planning Trinidad Carnival 2027? Dates, bands, hotels, budgets and how to plan your Carnival-morning makeup, hair and photos. A first-timer's guide from Carnival Glam Hub.",
    category: "Trinidad Carnival",
    tags: [
      "Trinidad Carnival",
      "Carnival Tips",
      "Carnival Glam Hub",
      "Trinidad Carnival 2027",
    ],
    metaDescription:
      "Planning Trinidad Carnival 2027? Dates, bands, hotels, budgets and how to plan your Carnival-morning makeup, hair and photos. A first-timer's guide from Carnival Glam Hub.",
    readTime: "8 min read",
  },
];

export const RECOVERED_POST_SLUGS: Set<string> = new Set(
  RECOVERED_POSTS_META.map((p) => p.slug),
);