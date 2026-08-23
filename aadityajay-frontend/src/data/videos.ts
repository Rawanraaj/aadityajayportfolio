export type VideoItem = {
  id: string;
  title: string;
  outlet: string;
  date: string;
  duration: string;
  /** Pexels or custom/youtube poster thumbnail */
  poster: string;
  youtubeId: string;
  featured?: boolean;
};

export type Video = VideoItem;

export const videos: VideoItem[] = [
  {
    id: "v1",
    title: "On the Ground: Covering the Kathmandu Civic Protests",
    outlet: "Public Khabar 24 · Live Segment",
    date: "May 2025",
    duration: "08:42",
    poster:
      "https://images.pexels.com/photos/8961065/pexels-photo-8961065.jpeg?auto=compress&cs=tinysrgb&w=1600",
    youtubeId: "scMbinQ6w2M",
  },
  {
    id: "v2",
    title: "Prime Time Interview — Federal Budget Explained",
    outlet: "Public Khabar 24 · Broadcast",
    date: "March 2025",
    duration: "21:15",
    poster:
      "https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=1600",
    youtubeId: "scMbinQ6w2M",
  },
  {
    id: "v3",
    title: "Field Report: Inside a Reconstruction Village",
    outlet: "Public Khabar 24 · Documentary",
    date: "January 2025",
    duration: "14:03",
    poster:
      "https://images.pexels.com/photos/2083158/pexels-photo-2083158.jpeg?auto=compress&cs=tinysrgb&w=1600",
    youtubeId: "scMbinQ6w2M",
  },
];
