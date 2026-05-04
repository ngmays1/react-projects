import { useState } from 'react';

interface SongCardProps {
  trackName: string;
  artistName: string;
  listenCount: number;
  caaReleaseMbid?: string;
  caaId?: number;
}

export default function SongCard({ trackName, artistName, listenCount, caaReleaseMbid, caaId }: SongCardProps) {
  const [hovered, setHovered] = useState(false);

  const imageUrl = (caaReleaseMbid && caaId)
    ? `https://archive.org/download/mbid-${caaReleaseMbid}/mbid-${caaReleaseMbid}-${caaId}_thumb500.jpg`
    : 'https://placehold.co/400x400/1a1a1a/white?text=♫';

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: 'relative', aspectRatio: '1', width: '100%', overflow: 'hidden', borderRadius: '16px', backgroundColor: '#1f2937', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <img
          src={imageUrl}
          alt={trackName}
          style={{ height: '100%', width: '100%', objectFit: 'cover', transition: 'transform 0.7s', transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/1a1a1a/white?text=♫'; }}
        />
        <div style={{ position: 'absolute', bottom: '8px', left: '8px', backgroundColor: '#ea580c', color: 'white', fontSize: '10px', fontWeight: 900, padding: '4px 8px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>{listenCount}</span>
          <span style={{ opacity: 0.7, fontSize: '8px' }}>PLAYS</span>
        </div>
      </div>
      <div style={{ marginTop: '20px', paddingLeft: '4px', paddingRight: '4px', minHeight: '64px' }}>
        <p style={{ fontSize: '15px', fontWeight: 900, color: 'white', lineHeight: 1.1, margin: '0 0 4px', textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.03em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {trackName}
        </p>
        <p style={{ fontSize: '13px', fontWeight: 500, color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
          {artistName}
        </p>
      </div>
    </div>
  );
}
