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
} from 'lucide-react';

interface AppItem {
  id: string;
  name: string;
  url: string;
  icon: React.ReactNode;
  description: string;
  newTab?: boolean;
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

const APPS: AppItem[] = [
  { id: 'jellyfin',  name: 'jellyfin',  url: 'http://jellyfin:8096',        icon: <Terminal size={24} />, description: 'media',        newTab: true },
  { id: 'navidrome', name: 'navidrome', url: 'http://navidrome:4533',        icon: <Cpu size={24} />,      description: 'music',        newTab: true },
  { id: 'freshrss',  name: 'freshrss',  url: 'https://rssfeed:8085',         icon: <Tv size={24} />,       description: 'newsfeed',     newTab: true },
  { id: 'romm',      name: 'romm',      url: 'http://games:8081',            icon: <Shield size={24} />,   description: 'retro gaming', newTab: true },
  { id: 'komga',     name: 'komga',     url: 'http://ereader:25600',         icon: <Cloud size={24} />,    description: 'ebooks',       newTab: true },
];

const BOOKMARKS: BookmarkCategory[] = [
  {
    title: 'Development',
    links: [
      { name: 'github',   url: 'https://github.com/ngmays1',             newTab: true },
      { name: 'linkedin', url: 'https://linkedin.com/in/nicolas-mays',   newTab: true },
    ],
  },
  {
    title: 'Blogs',
    links: [
      { name: 'test', url: 'https://test.org', newTab: true },
      { name: 'test', url: 'https://test.org', newTab: true },
      { name: 'test', url: 'https://test.org', newTab: true },
    ],
  },
  {
    title: 'Fun',
    links: [
      { name: 'chess',    url: 'https://www.chess.com/member/untiedlocs', newTab: true },
      { name: 'wikigacha', url: 'https://wikigacha.com',                  newTab: true },
      { name: 'outsmart', url: 'https://labs.davidbauer.ch',              newTab: true },
    ],
  },
];

const C = {
  bg:          '#141517',
  surface:     '#1a1b1e',
  surfaceHover:'#25262b',
  border:      '#2c2e33',
  borderHover: 'rgba(249,115,22,0.4)',
  text:        '#c1c2c5',
  textPrimary: '#ffffff',
  textSecondary:'#9ca3af',
  textMuted:   '#4b5563',
  orange:      '#f97316',
  orangeBg:    'rgba(249,115,22,0.1)',
};

function AppCard({ app }: { app: AppItem }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={app.url}
      target={app.newTab ? '_blank' : '_self'}
      rel={app.newTab ? 'noopener noreferrer' : ''}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundColor: hovered ? C.surfaceHover : C.surface,
        border: `1px solid ${hovered ? C.borderHover : C.border}`,
        borderRadius: '16px',
        transition: 'all 0.3s',
        transform: hovered ? 'translateY(-4px)' : 'none',
        overflow: 'hidden',
        textDecoration: 'none',
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '3px',
        height: '100%',
        backgroundColor: C.orange,
        transform: hovered ? 'scaleY(1)' : 'scaleY(0)',
        transformOrigin: 'top',
        transition: 'transform 0.3s',
      }} />
      <div style={{ marginBottom: '16px', color: hovered ? C.orange : C.textSecondary, transition: 'color 0.3s' }}>
        {app.icon}
      </div>
      <span style={{ fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: '4px' }}>
        {app.name}
      </span>
      <span style={{ fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
        {app.description}
      </span>
    </a>
  );
}

function BookmarkLink({ link }: { link: BookmarkItem }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={link.url}
      target={link.newTab ? '_blank' : '_self'}
      rel={link.newTab ? 'noopener noreferrer' : ''}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px',
        borderRadius: '8px',
        backgroundColor: hovered ? C.surface : 'transparent',
        transition: 'background-color 0.2s',
        textDecoration: 'none',
      }}
    >
      <span style={{ fontSize: '14px', color: hovered ? C.textPrimary : C.textSecondary, transition: 'color 0.2s' }}>
        {link.name}
      </span>
      <ExternalLink
        size={12}
        style={{
          color: C.textMuted,
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateX(0)' : 'translateX(-8px)',
          transition: 'all 0.2s',
        }}
      />
    </a>
  );
}

function SectionDivider({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
      <div style={{ height: '1px', flex: 1, backgroundColor: C.border }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: C.textMuted }}>
        {icon}{label}
      </div>
      <div style={{ height: '1px', flex: 1, backgroundColor: C.border }} />
    </div>
  );
}

const HomeDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [time, setTime] = useState<Date | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [settingsHovered, setSettingsHovered] = useState(false);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  if (!time) return <div style={{ minHeight: '100vh', backgroundColor: C.bg }} />;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.bg, color: C.text, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '80px 24px' }}>

        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '64px', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 200, color: C.textPrimary, letterSpacing: '-0.02em', lineHeight: 1 }}>
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </h1>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: C.surface, border: `1px solid ${C.border}`, padding: '16px', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)' }}>
            <div style={{ backgroundColor: C.orangeBg, padding: '8px', borderRadius: '8px' }}>
              <Sun color={C.orange} size={28} />
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: C.textPrimary, lineHeight: 1.2 }}>24°C</div>
              <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase' }}>Clear Sky</div>
            </div>
          </div>
        </header>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ position: 'relative', maxWidth: '672px', margin: '0 auto 80px' }}>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '20px', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
            <Search size={20} color={searchFocused ? C.orange : C.textMuted} style={{ transition: 'color 0.2s' }} />
          </div>
          <input
            type="text"
            style={{
              width: '100%',
              backgroundColor: C.surface,
              border: `2px solid ${searchFocused ? 'rgba(249,115,22,0.5)' : C.border}`,
              borderRadius: '16px',
              padding: '20px 24px 20px 56px',
              color: C.textPrimary,
              fontSize: '18px',
              outline: 'none',
              boxShadow: searchFocused ? '0 0 0 4px rgba(249,115,22,0.05)' : '0 25px 50px -12px rgba(0,0,0,0.4)',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
            placeholder="what are you looking for?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </form>

        <main style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
          {/* Applications */}
          <section>
            <SectionDivider icon={<LayoutGrid size={14} />} label="Applications" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
              {APPS.map((app) => <AppCard key={app.id} app={app} />)}
            </div>
          </section>

          {/* Bookmarks */}
          <section>
            <SectionDivider icon={<Bookmark size={14} />} label="Bookmarks" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px' }}>
              {BOOKMARKS.map((category) => (
                <div key={category.title} style={{ display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '11px', fontWeight: 900, color: C.orange, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '6px', height: '6px', backgroundColor: C.orange, borderRadius: '50%', flexShrink: 0 }} />
                    {category.title}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {category.links.map((link, i) => <BookmarkLink key={`${link.name}-${i}`} link={link} />)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Settings button */}
        <div style={{ position: 'fixed', bottom: '32px', right: '32px' }}>
          <button
            onMouseEnter={() => setSettingsHovered(true)}
            onMouseLeave={() => setSettingsHovered(false)}
            style={{
              padding: '16px',
              backgroundColor: settingsHovered ? C.surfaceHover : C.surface,
              border: `1px solid ${settingsHovered ? 'rgba(249,115,22,0.5)' : C.border}`,
              borderRadius: '50%',
              color: settingsHovered ? C.textPrimary : C.textMuted,
              cursor: 'pointer',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Settings size={22} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default HomeDashboard;
