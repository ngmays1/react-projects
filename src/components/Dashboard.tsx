"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ExternalLink, 
  LayoutGrid, 
  Bookmark, 
  Sun, 
  Settings, 
  Terminal,
  Cpu,
  Tv,
  Shield,
  Cloud,
  Globe
} from 'lucide-react';

// --- Types & Interfaces ---
interface AppItem {
  id: string;
  name: string;
  url: string;
  icon: React.ReactNode;
  description: string;
  newTab?: boolean; // Set to true to open in new tab
}

interface BookmarkItem {
  name: string;
  url: string;
  newTab?: boolean;
}

interface BookmarkCategory {
  title: string;
  links: BookmarkItem[];
}

// --- YOUR DATA (Edit this section!) ---
const APPS: AppItem[] = [
  { 
    id: 'jellyfin', 
    name: 'jellyfin', 
    url: 'http://jellyfin:8096', 
    icon: <Terminal size={24} />, 
    description: 'media',
    newTab: true 
  },
  { 
    id: 'navidrome', 
    name: 'navidrome', 
    url: 'http://navidrome:8096:4533', 
    icon: <Cpu size={24} />, 
    description: 'music',
    newTab: true 
  },
  { 
    id: 'freshrss', 
    name: 'freshrss', 
    url: 'https://rssfeed:8085', 
    icon: <Tv size={24} />, 
    description: 'newsfeed',
    newTab: true 
  },
  { 
    id: 'romm', 
    name: 'romm', 
    url: 'http://games:8081', 
    icon: <Shield size={24} />, 
    description: 'retro gaming',
    newTab: true 
  },
  { 
    id: 'komga', 
    name: 'komga', 
    url: 'http://ereader:25600', 
    icon: <Cloud size={24} />, 
    description: 'ebooks',
    newTab: true 
  }
];

const BOOKMARKS: BookmarkCategory[] = [
  {
    title: 'Development',
    links: [
      { name: 'github', url: 'https://github.com/ngmays1', newTab: true },
      { name: 'linkedin', url: 'https://linkedin.com/in/nicolas-mays', newTab: true },
    ]
  },
  {
    title: 'Blogs',
    links: [
      { name: 'test', url: 'https://test.org', newTab: true },
      { name: 'test', url: 'https://test.org', newTab: true },
      { name: 'test', url: 'https://test.org', newTab: true },
    ]
  },
  {
    title: 'Fun',
    links: [
      { name: 'chess', url: 'https://www.chess.com/member/untiedlocs', newTab: true },
      { name: 'wikigacha', url: 'https://wikigacha.com', newTab: true },
      { name: 'outsmart', url: 'https://labs.davidbauer.ch', newTab: true },
    ]
  }
];

const HomeDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      // Default search engine (Google)
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  if (!time) return <div className="min-h-screen bg-[#141517]" />;

  return (
    <div className="min-h-screen bg-[#141517] text-[#c1c2c5] font-sans selection:bg-orange-500/30">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        
        {/* Header (Time & Date) */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="space-y-1">
            <h1 className="text-5xl font-extralight text-white tracking-tight">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </h1>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.2em]">
              {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#1a1b1e] border border-[#2c2e33] p-4 rounded-2xl shadow-xl">
            <div className="bg-orange-500/10 p-2 rounded-lg">
              <Sun className="text-orange-500" size={28} />
            </div>
            <div>
              <div className="text-xl font-bold text-white leading-tight">24°C</div>
              <div className="text-xs text-gray-500 font-bold uppercase">Clear Sky</div>
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-20 group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-600 group-focus-within:text-orange-500 transition-colors" />
          </div>
          <input
            type="text"
            className="w-full bg-[#1a1b1e] border-2 border-[#2c2e33] rounded-2xl py-5 pl-14 pr-6 text-white text-lg placeholder:text-gray-700 outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all shadow-2xl"
            placeholder="what are you looking for?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <main className="space-y-16">
          {/* Applications Grid */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px flex-1 bg-[#2c2e33]" />
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-gray-600">
                <LayoutGrid size={14} /> Applications
              </div>
              <div className="h-px flex-1 bg-[#2c2e33]" />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {APPS.map((app) => (
                <a 
                  key={app.id} 
                  href={app.url} 
                  target={app.newTab ? "_blank" : "_self"}
                  rel={app.newTab ? "noopener noreferrer" : ""}
                  className="group relative flex flex-col items-center justify-center p-6 bg-[#1a1b1e] border border-[#2c2e33] rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:bg-[#25262b] overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                  <div className="mb-4 text-gray-400 group-hover:text-orange-500 transition-colors duration-300">
                    {app.icon}
                  </div>
                  <span className="text-sm font-bold text-white mb-1">{app.name}</span>
                  <span className="text-[10px] text-gray-600 uppercase tracking-wider font-bold">
                    {app.description}
                  </span>
                </a>
              ))}
            </div>
          </section>

          {/* Bookmarks Section */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px flex-1 bg-[#2c2e33]" />
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-gray-600">
                <Bookmark size={14} /> Bookmarks
              </div>
              <div className="h-px flex-1 bg-[#2c2e33]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {BOOKMARKS.map((category) => (
                <div key={category.title} className="flex flex-col">
                  <h3 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                    {category.title}
                  </h3>
                  <div className="space-y-1">
                    {category.links.map((link) => (
                      <a 
                        key={link.name} 
                        href={link.url}
                        target={link.newTab ? "_blank" : "_self"}
                        rel={link.newTab ? "noopener noreferrer" : ""}
                        className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-[#1a1b1e] transition-all"
                      >
                        <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                          {link.name}
                        </span>
                        <ExternalLink size={12} className="text-gray-700 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 -translate-x-2" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <div className="fixed bottom-8 right-8">
          <button className="p-4 bg-[#1a1b1e] border border-[#2c2e33] rounded-full text-gray-600 hover:text-white hover:border-orange-500/50 hover:bg-[#25262b] transition-all shadow-2xl">
            <Settings size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;