export type Article = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
  href: string;
};

export const categories = [
  "All",
  "Investigation",
  "Politics",
  "Society",
  "Interview",
] as const;

export type Category = (typeof categories)[number];

// Curated highlight reel shown on the homepage "Front Pages" stack.
export const featuredArticles: Article[] = [
  {
    id: "lead",
    title: "Behind Closed Doors: Investigating Kathmandu's Land-Deal Network",
    excerpt:
      "A six-month probe into the shell companies and political fixers quietly reshaping ownership of the capital's last public plots — and the residents paying the price.",
    category: "Investigation",
    date: "June 2025",
    readTime: "14 min read",
    image:
      "https://images.pexels.com/photos/6621337/pexels-photo-6621337.jpeg?auto=compress&cs=tinysrgb&w=1600",
    featured: true,
    href: "/stories/lead",
  },
  {
    id: "a2",
    title: "The Untold Story of the 2023 Melamchi Flood Aftermath",
    excerpt:
      "Two years on, families in the river valley are still waiting for the reconstruction money that was announced, then quietly re-routed.",
    category: "Society",
    date: "April 2025",
    readTime: "9 min read",
    image:
      "https://images.pexels.com/photos/5833767/pexels-photo-5833767.jpeg?auto=compress&cs=tinysrgb&w=1200",
    href: "/stories/a2",
  },
  {
    id: "a3",
    title: "Voices from Mustang: A Community Living on the Climate Edge",
    excerpt:
      "High-altitude herders describe a shifting snowline, drying springs, and a way of life that may not survive the next generation.",
    category: "Society",
    date: "March 2025",
    readTime: "11 min read",
    image:
      "https://images.pexels.com/photos/2083158/pexels-photo-2083158.jpeg?auto=compress&cs=tinysrgb&w=1200",
    href: "/stories/a3",
  },
  {
    id: "a4",
    title: "Exclusive Interview: The Former Minister Who Blew the Whistle",
    excerpt:
      "In his first sit-down since resigning, he names names — and explains why he waited until now to talk.",
    category: "Interview",
    date: "February 2025",
    readTime: "7 min read",
    image:
      "https://images.pexels.com/photos/5186985/pexels-photo-5186985.jpeg?auto=compress&cs=tinysrgb&w=1200",
    href: "/stories/a4",
  },
  {
    id: "a5",
    title: "How a Single Audit Trail Exposed a Provincial Budget Hole",
    excerpt:
      "A line-item buried on page 247 told a different story than the press release. Here's how we found it.",
    category: "Politics",
    date: "January 2025",
    readTime: "6 min read",
    image:
      "https://images.pexels.com/photos/669454/pexels-photo-669454.jpeg?auto=compress&cs=tinysrgb&w=1200",
    href: "/stories/a5",
  },
];

// Back-compat alias for any homepage import.
export const articles = featuredArticles;

// Full archive — used by /stories. Adds depth behind the "500+" claim.
export const archiveArticles: Article[] = [
  ...featuredArticles,
  {
    id: "a6",
    title: "Inside the Press Gallery: Access, Influence, and the Rules of the House",
    excerpt:
      "A look at how parliamentary access works in practice — and which stories never make it past the gallery door.",
    category: "Politics",
    date: "December 2024",
    readTime: "8 min read",
    image:
      "https://images.pexels.com/photos/5186816/pexels-photo-5186816.jpeg?auto=compress&cs=tinysrgb&w=1200",
    href: "/stories/a6",
  },
  {
    id: "a7",
    title: "Counting the Cost: Reconstruction Money That Never Reached the Site",
    excerpt:
      "Tracing disbursed reconstruction funds through three districts — and finding where the trail goes cold.",
    category: "Investigation",
    date: "November 2024",
    readTime: "12 min read",
    image:
      "https://images.pexels.com/photos/2153215/pexels-photo-2153215.jpeg?auto=compress&cs=tinysrgb&w=1200",
    href: "/stories/a7",
  },
  {
    id: "a8",
    title: "Conversation with a Border Beat Reporter",
    excerpt:
      "Twenty years on the Nepal-India border, filing on smuggling, transit, and the people who live between two systems.",
    category: "Interview",
    date: "October 2024",
    readTime: "10 min read",
    image:
      "https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=1200",
    href: "/stories/a8",
  },
  {
    id: "a9",
    title: "The Forgotten Schools of the Far West",
    excerpt:
      "Six schools, no teachers for two terms. A field report on what 'universal enrolment' looks like on the ground.",
    category: "Society",
    date: "September 2024",
    readTime: "9 min read",
    image:
      "https://images.pexels.com/photos/256431/pexels-photo-256431.jpeg?auto=compress&cs=tinysrgb&w=1200",
    href: "/stories/a9",
  },
  {
    id: "a10",
    title: "Who Watches the Watchmen? Nepal's Anti-Corruption Body Under Review",
    excerpt:
      "The agency meant to investigate graft has its own questions to answer. Here's what the filings show.",
    category: "Investigation",
    date: "August 2024",
    readTime: "13 min read",
    image:
      "https://images.pexels.com/photos/26153698/pexels-photo-26153698.jpeg?auto=compress&cs=tinysrgb&w=1200",
    href: "/stories/a10",
  },
  {
    id: "a11",
    title: "Election Year: Mapping the Money Behind the Billboards",
    excerpt:
      "An open-source audit of campaign ad spend across three provinces — and the donors who don't appear on any filing.",
    category: "Politics",
    date: "July 2024",
    readTime: "11 min read",
    image:
      "https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=1200",
    href: "/stories/a11",
  },
];
