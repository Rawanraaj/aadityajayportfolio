"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { featuredArticles, archiveArticles, Article } from "@/data/articles";
import { videos, Video } from "@/data/videos";
import { achievements, Achievement } from "@/data/achievements";
import { outlets, OutletItem } from "@/data/outlet";
import { site as initialSite } from "@/data/site";

// Mock initial contact inquiries
type ContactMessage = {
  id: string;
  senderName: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
  starred: boolean;
  category: "Lead / Tip" | "Interview" | "General" | "Press";
};

const initialMessages: ContactMessage[] = [
  {
    id: "msg-1",
    senderName: "Anonymous Source",
    email: "secure_tip@proton.me",
    subject: "Encrypted Files regarding Municipal Land Allocation",
    message: "I have uploaded financial spreadsheets and meeting minutes from the 2024 urban planning committee. Please review the attached hash.",
    date: "10 mins ago",
    read: false,
    starred: true,
    category: "Lead / Tip",
  },
  {
    id: "msg-2",
    senderName: "Kiran Sharma",
    email: "kiran@kantipureditorial.com",
    subject: "Invitation: Panel Discussion on Climate Journalism",
    message: "Hi Aaditya, we would love to have you as a keynote speaker at the upcoming Himalayan Environmental Summit in Pokhara next month.",
    date: "2 hours ago",
    read: false,
    starred: false,
    category: "Interview",
  },
  {
    id: "msg-3",
    senderName: "Maya Adhikari",
    email: "m.adhikari@tribhuvan.edu.np",
    subject: "Reference request for Mustang Climate Report",
    message: "Respected Aaditya sir, our research department is citing your March 2025 Mustang field report. Could we get access to high-res photograph permissions?",
    date: "1 day ago",
    read: true,
    starred: false,
    category: "General",
  },
  {
    id: "msg-4",
    senderName: "Bishal Thapa",
    email: "bishal.press@reporters.org",
    subject: "Press Freedom Award 2025 Nomination",
    message: "Congratulations! Your investigative series on provincial budget transparency has been shortlisted for the 2025 Journalism Excellence Award.",
    date: "3 days ago",
    read: true,
    starred: true,
    category: "Press",
  },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "stories" | "media" | "achievements" | "outlets" | "inbox" | "settings"
  >("overview");

  // State collections
  const [articlesList, setArticlesList] = useState<Article[]>(archiveArticles);
  const [videosList, setVideosList] = useState<Video[]>(videos);
  const [achievementsList, setAchievementsList] = useState<Achievement[]>(achievements);
  const [outletsList, setOutletsList] = useState<OutletItem[]>(outlets);
  const [messagesList, setMessagesList] = useState<ContactMessage[]>(initialMessages);
  const [siteSettings, setSiteSettings] = useState(initialSite);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [articleCategory, setArticleCategory] = useState("All");

  // Modals & Notifications
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Unread messages count
  const unreadCount = messagesList.filter((m) => !m.read).length;

  // Handler for adding/updating article
  const handleSaveArticle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const category = formData.get("category") as string;
    const date = formData.get("date") as string;
    const readTime = formData.get("readTime") as string;
    const image = formData.get("image") as string;
    const featured = formData.get("featured") === "on";

    if (editingArticle) {
      setArticlesList((prev) =>
        prev.map((a) =>
          a.id === editingArticle.id
            ? { ...a, title, excerpt, category, date, readTime, image, featured }
            : a
        )
      );
      showToast("Article updated successfully!");
    } else {
      const newArt: Article = {
        id: `art-${Date.now()}`,
        title,
        excerpt,
        category,
        date: date || "Just now",
        readTime: readTime || "5 min read",
        image: image || "https://images.pexels.com/photos/6621337/pexels-photo-6621337.jpeg?auto=compress&cs=tinysrgb&w=1200",
        featured,
        href: `/stories/${Date.now()}`,
      };
      setArticlesList([newArt, ...articlesList]);
      showToast("New article published!");
    }
    setIsArticleModalOpen(false);
    setEditingArticle(null);
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm("Are you sure you want to delete this story?")) {
      setArticlesList(articlesList.filter((a) => a.id !== id));
      showToast("Story deleted.");
    }
  };

  const toggleFeaturedArticle = (id: string) => {
    setArticlesList(
      articlesList.map((a) => (a.id === id ? { ...a, featured: !a.featured } : a))
    );
    showToast("Featured status updated!");
  };

  // Handler for video modal
  const handleSaveVideo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const duration = formData.get("duration") as string;
    const date = formData.get("date") as string;
    const outlet = formData.get("outlet") as string;
    const youtubeId = formData.get("youtubeId") as string;
    const description = formData.get("description") as string;

    if (editingVideo) {
      setVideosList(
        videosList.map((v) =>
          v.id === editingVideo.id
            ? { ...v, title, category, duration, date, outlet, youtubeId, description }
            : v
        )
      );
      showToast("Media video updated!");
    } else {
      const newVid: Video = {
        id: `vid-${Date.now()}`,
        title,
        category,
        duration: duration || "12:30",
        date: date || "2025",
        outlet: outlet || "National Broadcast",
        youtubeId: youtubeId || "dQw4w9WgXcQ",
        thumbnail: `https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=800`,
        description,
      };
      setVideosList([newVid, ...videosList]);
      showToast("New video broadcast added!");
    }
    setIsVideoModalOpen(false);
    setEditingVideo(null);
  };

  const handleDeleteVideo = (id: string) => {
    if (confirm("Are you sure you want to remove this media entry?")) {
      setVideosList(videosList.filter((v) => v.id !== id));
      showToast("Media entry removed.");
    }
  };

  // Message handlers
  const toggleMessageRead = (id: string) => {
    setMessagesList(
      messagesList.map((m) => (m.id === id ? { ...m, read: !m.read } : m))
    );
  };

  const toggleMessageStarred = (id: string) => {
    setMessagesList(
      messagesList.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m))
    );
  };

  const handleDeleteMessage = (id: string) => {
    setMessagesList(messagesList.filter((m) => m.id !== id));
    showToast("Message deleted.");
  };

  // Filtered articles
  const filteredArticles = articlesList.filter((art) => {
    const matchesCat = articleCategory === "All" || art.category === articleCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#070b14] text-[#f5f1ea] flex flex-col font-sans selection:bg-[#c81e3a] selection:text-white">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-50 bg-[#c81e3a] text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 border border-red-500/40 text-sm font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP BAR / HEADER */}
      <header className="h-16 border-b border-white/10 bg-[#0b1120]/90 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#c81e3a] flex items-center justify-center font-bold text-white tracking-widest text-sm shadow-lg shadow-red-900/40">
              AA
            </div>
            <div>
              <h1 className="font-semibold text-sm tracking-wide text-white flex items-center gap-2">
                Aaditya Ajay <span className="text-xs text-[#c81e3a] bg-[#c81e3a]/15 px-2 py-0.5 rounded font-mono uppercase font-bold">Admin Portal</span>
              </h1>
              <p className="text-[11px] text-gray-400">Editorial & CMS Command Center</p>
            </div>
          </div>
        </div>

        {/* Global Search & User status */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-3 py-1.5 w-64 text-xs text-gray-300 focus-within:border-[#c81e3a]/60 transition">
            <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search stories, media, leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-xs text-white placeholder-gray-500"
            />
          </div>

          <button
            onClick={() => setActiveTab("inbox")}
            className="relative p-2 rounded-full hover:bg-white/10 text-gray-300 transition"
            title="Reader Inquiries & Whistleblower Leads"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#c81e3a] text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition"
          >
            <span>Live Site</span>
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <div className="flex items-center gap-2 border-l border-white/10 pl-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-red-600 p-[1px]">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-amber-200">
                AA
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="text-xs font-medium text-white leading-tight">Aaditya Ajay</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Editor Active
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-16 md:w-64 border-r border-white/10 bg-[#090e1b] flex flex-col justify-between p-2 md:p-4 shrink-0">
          <nav className="space-y-1.5">
            {[
              { id: "overview", label: "Dashboard", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
              { id: "stories", label: "Stories & Articles", count: articlesList.length, icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
              { id: "media", label: "Media & Broadcasts", count: videosList.length, icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
              { id: "achievements", label: "Impact & Awards", count: achievementsList.length, icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
              { id: "outlets", label: "Press Outlets", count: outletsList.length, icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
              { id: "inbox", label: "Leads & Inbox", count: unreadCount, badgeColor: "bg-[#c81e3a]", icon: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" },
              { id: "settings", label: "Site Config & Bio", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                  activeTab === tab.id
                    ? "bg-[#c81e3a] text-white shadow-md shadow-red-900/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                  </svg>
                  <span className="hidden md:inline">{tab.label}</span>
                </div>
                {tab.count !== undefined && (
                  <span
                    className={`hidden md:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      tab.badgeColor ? `${tab.badgeColor} text-white` : "bg-white/10 text-gray-300"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="pt-4 border-t border-white/10 text-[11px] text-gray-500 hidden md:block">
            <p className="font-semibold text-gray-400">Journalism Portal v2.4</p>
            <p>Environment: Production</p>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#070b14] space-y-6">
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#0b1120] to-slate-900 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-wide">
                    Welcome back, {siteSettings.name}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1 max-w-xl">
                    Here is your editorial overview. 11 published stories active, 4 new whistleblower inquiries pending review, and 12 national impact recognition milestones.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditingArticle(null);
                      setIsArticleModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#c81e3a] hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-lg shadow-red-900/40 transition flex items-center gap-2"
                  >
                    <span>+ New Story</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingVideo(null);
                      setIsVideoModalOpen(true);
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-lg text-xs font-semibold transition flex items-center gap-2"
                  >
                    <span>+ New Broadcast</span>
                  </button>
                </div>
              </div>

              {/* STATS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Published Stories", val: articlesList.length, change: "+2 this month", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
                  { title: "Video Broadcasts", val: videosList.length, change: "15.4K Total Views", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
                  { title: "National Recognition", val: achievementsList.length, change: "12 Awards Won", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
                  { title: "Unread Leads / Inbox", val: unreadCount, change: `${messagesList.length} total messages`, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
                ].map((stat, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${stat.bg} flex flex-col justify-between`}>
                    <div className="text-xs text-gray-400 font-medium">{stat.title}</div>
                    <div className="text-3xl font-extrabold text-white my-2">{stat.val}</div>
                    <div className={`text-[11px] font-semibold ${stat.color}`}>{stat.change}</div>
                  </div>
                ))}
              </div>

              {/* READERSHIP & IMPACT GRAPH (SVG) */}
              <div className="p-6 rounded-2xl bg-[#0b1120] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Monthly Impact & Reader Engagement</h3>
                    <p className="text-xs text-gray-400">Total readership reach across investigation stories & syndications (2025)</p>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    ↗ +34% Engagement Growth
                  </span>
                </div>

                <div className="h-44 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-white/10">
                  {[
                    { month: "Jan", height: "45%", val: "42K" },
                    { month: "Feb", height: "60%", val: "68K" },
                    { month: "Mar", height: "85%", val: "112K" },
                    { month: "Apr", height: "55%", val: "59K" },
                    { month: "May", height: "70%", val: "84K" },
                    { month: "Jun", height: "100%", val: "145K (Lead Probe)" },
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                      <div className="opacity-0 group-hover:opacity-100 transition absolute -top-7 text-[10px] font-mono bg-red-950 text-red-200 px-2 py-0.5 rounded shadow">
                        {bar.val}
                      </div>
                      <div
                        style={{ height: bar.height }}
                        className="w-full max-w-[48px] bg-gradient-to-t from-red-900 via-[#c81e3a] to-red-400 rounded-t-md group-hover:brightness-125 transition-all cursor-pointer"
                      />
                      <span className="text-[11px] text-gray-400 font-medium">{bar.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RECENT STORIES & UNREAD LEADS SPLIT */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Featured Stories Overview */}
                <div className="p-6 rounded-2xl bg-[#0b1120] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">Recent Top Stories</h3>
                    <button onClick={() => setActiveTab("stories")} className="text-xs text-[#c81e3a] hover:underline font-semibold">
                      View all ({articlesList.length}) →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {articlesList.slice(0, 4).map((art) => (
                      <div key={art.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-3 hover:border-white/20 transition">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img src={art.image} alt={art.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                          <div className="truncate">
                            <h4 className="text-xs font-semibold text-white truncate">{art.title}</h4>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                              <span className="bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded font-mono">{art.category}</span>
                              <span>{art.date}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFeaturedArticle(art.id)}
                          className={`text-xs px-2.5 py-1 rounded font-medium transition ${
                            art.featured ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-white/5 text-gray-400"
                          }`}
                        >
                          {art.featured ? "★ Featured" : "Standard"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Whistleblower Leads Overview */}
                <div className="p-6 rounded-2xl bg-[#0b1120] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      Recent Leads & Messages
                      {unreadCount > 0 && <span className="bg-[#c81e3a] text-white text-[10px] px-2 py-0.5 rounded-full">{unreadCount} unread</span>}
                    </h3>
                    <button onClick={() => setActiveTab("inbox")} className="text-xs text-[#c81e3a] hover:underline font-semibold">
                      Open Inbox →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {messagesList.slice(0, 4).map((msg) => (
                      <div
                        key={msg.id}
                        onClick={() => setActiveTab("inbox")}
                        className={`p-3 rounded-xl border transition cursor-pointer ${
                          !msg.read ? "bg-red-950/20 border-red-500/30" : "bg-white/5 border-white/5 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white">{msg.senderName}</span>
                          <span className="text-[10px] text-gray-400">{msg.date}</span>
                        </div>
                        <p className="text-xs font-medium text-gray-200 mt-1 truncate">{msg.subject}</p>
                        <p className="text-[11px] text-gray-400 truncate">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STORIES & ARTICLES MANAGER */}
          {activeTab === "stories" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Manage Stories & Articles</h2>
                  <p className="text-xs text-gray-400">Add, edit, features, and organize investigative reports.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingArticle(null);
                    setIsArticleModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#c81e3a] hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-lg shadow-red-900/40 transition flex items-center gap-2 self-start"
                >
                  <span>+ Add New Story</span>
                </button>
              </div>

              {/* Filter Pills & Search */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#0b1120] border border-white/10">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  {["All", "Investigation", "Politics", "Society", "Interview"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setArticleCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        articleCategory === cat
                          ? "bg-[#c81e3a] text-white"
                          : "bg-white/5 text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-gray-400 font-mono">
                  Showing {filteredArticles.length} of {articlesList.length} articles
                </div>
              </div>

              {/* Articles Table */}
              <div className="rounded-xl border border-white/10 bg-[#0b1120] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 text-gray-400 font-mono uppercase text-[10px] border-b border-white/10">
                      <tr>
                        <th className="p-3.5">Cover & Title</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Date</th>
                        <th className="p-3.5">Read Time</th>
                        <th className="p-3.5 text-center">Featured</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300">
                      {filteredArticles.map((art) => (
                        <tr key={art.id} className="hover:bg-white/5 transition">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <img src={art.image} alt="" className="w-10 h-10 rounded object-cover shrink-0" />
                              <div className="max-w-md">
                                <div className="font-semibold text-white line-clamp-1">{art.title}</div>
                                <div className="text-[11px] text-gray-400 line-clamp-1">{art.excerpt}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-white/10 text-gray-200">
                              {art.category}
                            </span>
                          </td>
                          <td className="p-3.5 whitespace-nowrap text-gray-400">{art.date}</td>
                          <td className="p-3.5 whitespace-nowrap text-gray-400">{art.readTime}</td>
                          <td className="p-3.5 text-center whitespace-nowrap">
                            <button
                              onClick={() => toggleFeaturedArticle(art.id)}
                              className={`px-2.5 py-1 rounded text-[10px] font-bold transition ${
                                art.featured ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "bg-white/5 text-gray-400"
                              }`}
                            >
                              {art.featured ? "★ Featured" : "Standard"}
                            </button>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingArticle(art);
                                  setIsArticleModalOpen(true);
                                }}
                                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteArticle(art.id)}
                                className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded text-[11px] transition"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MEDIA & BROADCASTS */}
          {activeTab === "media" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Media & Video Broadcasts</h2>
                  <p className="text-xs text-gray-400">Manage video interviews, documentaries, and TV appearances.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingVideo(null);
                    setIsVideoModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#c81e3a] hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-lg shadow-red-900/40 transition flex items-center gap-2 self-start"
                >
                  <span>+ Add Video Broadcast</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videosList.map((vid) => (
                  <div key={vid.id} className="rounded-xl border border-white/10 bg-[#0b1120] overflow-hidden flex flex-col justify-between group">
                    <div>
                      <div className="relative aspect-video bg-slate-900 overflow-hidden">
                        <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        <span className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-[10px] px-2 py-0.5 rounded">
                          {vid.duration}
                        </span>
                        <span className="absolute top-2 left-2 bg-[#c81e3a] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          {vid.category}
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-bold text-sm text-white line-clamp-2">{vid.title}</h3>
                        <p className="text-xs text-gray-400 line-clamp-2">{vid.description}</p>
                        <div className="text-[11px] text-gray-400 pt-2 flex items-center justify-between border-t border-white/5">
                          <span>{vid.outlet}</span>
                          <span>{vid.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-white/5 border-t border-white/5 flex items-center justify-between">
                      <a
                        href={`https://youtube.com/watch?v=${vid.youtubeId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-gray-300 hover:text-white underline"
                      >
                        Watch Video ↗
                      </a>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingVideo(vid);
                            setIsVideoModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(vid.id)}
                          className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded text-[11px] transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: IMPACT & ACHIEVEMENTS */}
          {activeTab === "achievements" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Impact & Awards Recognition</h2>
                  <p className="text-xs text-gray-400">Awards, honors, and milestones recorded in profile.</p>
                </div>
              </div>

              <div className="space-y-4">
                {achievementsList.map((ach) => (
                  <div key={ach.id} className="p-4 rounded-xl bg-[#0b1120] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {ach.year}
                        </span>
                        <h3 className="font-bold text-sm text-white">{ach.title}</h3>
                      </div>
                      <div className="text-xs text-gray-400 font-medium">{ach.organization}</div>
                      <p className="text-xs text-gray-300">{ach.description}</p>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => showToast("Achievement updated!")}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs transition"
                      >
                        Edit Entry
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PRESS OUTLETS */}
          {activeTab === "outlets" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Press Outlets & Syndications</h2>
                  <p className="text-xs text-gray-400">Media publications featuring Aaditya Ajay's work.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {outletsList.map((outlet) => (
                  <div key={outlet.name} className="p-4 rounded-xl bg-[#0b1120] border border-white/10 space-y-2">
                    <div className="font-bold text-white text-sm">{outlet.name}</div>
                    <div className="text-xs text-[#c81e3a] font-mono">{outlet.role}</div>
                    <p className="text-xs text-gray-400">{outlet.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: INBOX / LEADS */}
          {activeTab === "inbox" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Leads & Reader Messages Inbox</h2>
                  <p className="text-xs text-gray-400">Encrypted whistleblower tips, interview requests, and reader messages.</p>
                </div>
                <div className="text-xs text-gray-400 font-mono">
                  {unreadCount} Unread | {messagesList.length} Total
                </div>
              </div>

              <div className="space-y-3">
                {messagesList.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-5 rounded-2xl border transition space-y-3 ${
                      !msg.read ? "bg-red-950/15 border-red-500/40" : "bg-[#0b1120] border-white/10"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleMessageStarred(msg.id)}
                          className={`text-base ${msg.starred ? "text-amber-400" : "text-gray-600 hover:text-gray-400"}`}
                        >
                          ★
                        </button>
                        <div>
                          <div className="font-bold text-sm text-white flex items-center gap-2">
                            {msg.senderName}
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-gray-300">
                              {msg.category}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 font-mono">{msg.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className="text-xs text-gray-400">{msg.date}</span>
                        <button
                          onClick={() => toggleMessageRead(msg.id)}
                          className={`px-2.5 py-1 rounded text-xs transition ${
                            msg.read ? "bg-white/5 text-gray-400" : "bg-emerald-500/20 text-emerald-300 font-bold"
                          }`}
                        >
                          {msg.read ? "Mark Unread" : "Mark Read"}
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded text-xs transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-xs text-gray-200 mb-1">{msg.subject}</h4>
                      <p className="text-xs text-gray-300 leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5 font-mono">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: SITE CONFIG & BIO */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-lg font-bold text-white">Editorial Profile & Site Configuration</h2>
                <p className="text-xs text-gray-400">Update author bio, headlines, and social media handles.</p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast("Profile settings saved successfully!");
                }}
                className="p-6 rounded-2xl bg-[#0b1120] border border-white/10 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Author Name</label>
                    <input
                      type="text"
                      defaultValue={siteSettings.name}
                      onChange={(e) => setSiteSettings({ ...siteSettings, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#c81e3a] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Role Title</label>
                    <input
                      type="text"
                      defaultValue={siteSettings.role}
                      onChange={(e) => setSiteSettings({ ...siteSettings, role: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#c81e3a] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Tagline</label>
                  <input
                    type="text"
                    defaultValue={siteSettings.tagline}
                    onChange={(e) => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#c81e3a] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Editorial Bio</label>
                  <textarea
                    rows={4}
                    defaultValue={siteSettings.bio[0]}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-white focus:border-[#c81e3a] outline-none leading-relaxed"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#c81e3a] hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-lg transition"
                  >
                    Save Configuration Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* ARTICLE MODAL (CREATE / EDIT) */}
      <AnimatePresence>
        {isArticleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b1120] border border-white/15 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-bold text-base text-white">
                  {editingArticle ? "Edit Article" : "Publish New Story"}
                </h3>
                <button
                  onClick={() => setIsArticleModalOpen(false)}
                  className="text-gray-400 hover:text-white text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveArticle} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-gray-300 mb-1">Story Headline / Title</label>
                  <input
                    name="title"
                    required
                    defaultValue={editingArticle?.title || ""}
                    placeholder="e.g. Behind Closed Doors: Investigating Kathmandu's Land Deals"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-[#c81e3a]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-300 mb-1">Excerpt / Lead Paragraph</label>
                  <textarea
                    name="excerpt"
                    required
                    rows={3}
                    defaultValue={editingArticle?.excerpt || ""}
                    placeholder="Brief summary of the investigative findings..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-[#c81e3a]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-gray-300 mb-1">Category</label>
                    <select
                      name="category"
                      defaultValue={editingArticle?.category || "Investigation"}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-[#c81e3a]"
                    >
                      <option value="Investigation">Investigation</option>
                      <option value="Politics">Politics</option>
                      <option value="Society">Society</option>
                      <option value="Interview">Interview</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-300 mb-1">Estimated Read Time</label>
                    <input
                      name="readTime"
                      defaultValue={editingArticle?.readTime || "8 min read"}
                      placeholder="e.g. 10 min read"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-[#c81e3a]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-gray-300 mb-1">Publication Date</label>
                    <input
                      name="date"
                      defaultValue={editingArticle?.date || "August 2025"}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-[#c81e3a]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-300 mb-1">Cover Image URL</label>
                    <input
                      name="image"
                      defaultValue={editingArticle?.image || ""}
                      placeholder="https://images.pexels.com/..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-[#c81e3a]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    defaultChecked={editingArticle?.featured || false}
                    className="w-4 h-4 accent-[#c81e3a] rounded"
                  />
                  <label htmlFor="featured" className="text-gray-300 font-medium cursor-pointer">
                    Feature on Front Page Stack
                  </label>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsArticleModalOpen(false)}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#c81e3a] hover:bg-red-700 text-white rounded-lg font-semibold shadow-lg transition"
                  >
                    {editingArticle ? "Save Changes" : "Publish Story"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIDEO MODAL (CREATE / EDIT) */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b1120] border border-white/15 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-bold text-base text-white">
                  {editingVideo ? "Edit Video Entry" : "Add Media Broadcast"}
                </h3>
                <button
                  onClick={() => setIsVideoModalOpen(false)}
                  className="text-gray-400 hover:text-white text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveVideo} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-gray-300 mb-1">Broadcast Title</label>
                  <input
                    name="title"
                    required
                    defaultValue={editingVideo?.title || ""}
                    placeholder="e.g. Panel Discussion on Anti-Corruption Filings"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-[#c81e3a]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-gray-300 mb-1">Media Outlet / Channel</label>
                    <input
                      name="outlet"
                      defaultValue={editingVideo?.outlet || "National TV"}
                      placeholder="e.g. Kantipur TV"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-[#c81e3a]"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-300 mb-1">Category</label>
                    <input
                      name="category"
                      defaultValue={editingVideo?.category || "TV Interview"}
                      placeholder="e.g. TV Interview / Documentary"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-[#c81e3a]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-gray-300 mb-1">Video Duration</label>
                    <input
                      name="duration"
                      defaultValue={editingVideo?.duration || "14:20"}
                      placeholder="e.g. 14:20"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-[#c81e3a]"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-300 mb-1">YouTube Video ID</label>
                    <input
                      name="youtubeId"
                      defaultValue={editingVideo?.youtubeId || ""}
                      placeholder="e.g. dQw4w9WgXcQ"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-[#c81e3a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    name="description"
                    rows={2}
                    defaultValue={editingVideo?.description || ""}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-[#c81e3a]"
                  />
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsVideoModalOpen(false)}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#c81e3a] hover:bg-red-700 text-white rounded-lg font-semibold shadow-lg transition"
                  >
                    Save Broadcast
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
