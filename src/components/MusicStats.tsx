import React, { useEffect, useState } from 'react';
import Carousel from './Carousel';
import SongCard from './SongCard';
import AlbumCard from './AlbumCard';

export default function MusicStats({ username = import.meta.env.VITE_LISTENBRAINZ_USERNAME }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const songUrl = `https://api.listenbrainz.org/1/stats/user/${username}/recordings?range=week&count=5`;
        const albumUrl = `https://api.listenbrainz.org/1/stats/user/${username}/release-groups?range=week&count=3`;

        const [songsRes, albumsRes] = await Promise.all([fetch(songUrl), fetch(albumUrl)]);

        if (songsRes.status === 404 || albumsRes.status === 404) {
          setData({ recordings: [], albums: [] });
          setLoading(false);
          return;
        }

        const songsData = await songsRes.json();
        const albumsData = await albumsRes.json();

        setData({
          recordings: songsData.payload.recordings || [],
          albums: albumsData.payload.release_groups || [],
        });
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [username]);

  if (loading) return (
    <div style={{ padding: '48px', textAlign: 'center', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', color: '#9ca3af' }}>
      Loading Soundtrack...
    </div>
  );

  if (error) return (
    <div style={{ padding: '48px', textAlign: 'center', fontSize: '12px', color: '#ef4444', fontFamily: 'monospace' }}>
      ERROR_FETCHING_DATA
    </div>
  );

  return (
    <div style={{ width: '100%', maxWidth: '1152px', margin: '0 auto', padding: '64px 24px', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Weekly Singles */}
      <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '80px' }}>
        <div style={{ width: '100%', maxWidth: '480px', display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px' }}>
          <div style={{ height: '1px', flex: 1, backgroundColor: 'rgba(255,255,255,0.05)' }} />
          <h2 style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5em', color: '#9ca3af', whiteSpace: 'nowrap', margin: 0 }}>
            Weekly Singles
          </h2>
          <div style={{ height: '1px', flex: 1, backgroundColor: 'rgba(255,255,255,0.05)' }} />
        </div>
        <div style={{ width: '100%', maxWidth: '240px' }}>
          <Carousel>
            {data.recordings.map((song: any, i: number) => (
              <SongCard
                key={i}
                trackName={song.track_name}
                artistName={song.artist_name}
                listenCount={song.listen_count}
                caaReleaseMbid={song.caa_release_mbid}
                caaId={song.caa_id}
              />
            ))}
          </Carousel>
        </div>
      </section>

      {/* Heavy Rotation */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5em', color: '#9ca3af', whiteSpace: 'nowrap', margin: 0 }}>
            Heavy Rotation
          </h2>
          <div style={{ height: '1px', flex: 1, backgroundColor: 'rgba(255,255,255,0.05)' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px' }}>
          {data.albums.map((album: any, i: number) => (
            <AlbumCard
              key={i}
              albumName={album.release_group_name}
              artistName={album.artist_name}
              listenCount={album.listen_count}
              caaReleaseMbid={album.caa_release_mbid}
              caaId={album.caa_id}
            />
          ))}
        </div>
      </section>

    </div>
  );
}
