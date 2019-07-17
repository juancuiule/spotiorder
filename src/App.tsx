import React from 'react';
import './App.css';

import { TOKEN } from './config';

import { Playlist, Track, AudioFeautre } from './types';
import { string } from 'prop-types';

const App: React.FC = () => {
  const [username, setUsername] = React.useState('');

  const [playlists, setPlaylists] = React.useState<Playlist[]>([]);
  const [tracks, setTracks] = React.useState<Track[]>([]);

  const search = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { items } = (await fetch(
      `https://api.spotify.com/v1/users/${username}/playlists?limit=50`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`
        }
      }
    ).then(r => r.json())) as { items: Playlist[]; next: string };
    setPlaylists(items);
  };

  const searchTracks = (href: string) => async () => {
    const { items } = (await fetch(href, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`
      }
    }).then(r => r.json())) as { items: Track[] };
    setTracks(items);
  };

  const [orderedTracks, setOrderedTracks] = React.useState<string[]>([])

  const getAudioFeatures = React.useCallback(async () => {
    const ids = tracks.map(t => t.track.id).join(',');
    const { audio_features } = (await fetch(
      `https://api.spotify.com/v1/audio-features?ids=${ids}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`
        }
      }
    ).then(r => r.json())) as { audio_features: AudioFeautre[] };

    const zip = tracks.map((t, i) => ({
      track: t,
      audio_feature: audio_features[i]
    }))

    const ordered = zip.sort((a, b) => {
      return a.audio_feature.tempo - b.audio_feature.tempo
    }).map(x => x.track.track.name)

    setOrderedTracks(ordered)
  }, [tracks]);

  React.useEffect(() => {
    getAudioFeatures();
  }, [tracks, getAudioFeatures]);

  return (
    <div className="App">
      <header className="App-header">
        <p>Search by username</p>
        <form onSubmit={search}>
          <input
            autoFocus
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <button>Search</button>
        </form>
        <div
          style={{
            width: '80%',
            margin: '15px auto',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap'
          }}
        >
          {tracks.length === 0
            ? playlists.map(p => {
                return (
                  <div onClick={searchTracks(p.tracks.href)}>
                    <img
                      src={p.images[0].url}
                      style={{
                        height: '100px',
                        width: '100px',
                        margin: '3px'
                      }}
                    />
                  </div>
                );
              })
            : null}
          <ul style={{ fontSize: '10px', textAlign: 'left' }}>
            {tracks.map(t => (
              <li>{t.track.name}</li>
            ))}
          </ul>
          <ul style={{ fontSize: '10px', textAlign: 'left' }}>
            {orderedTracks.map(t => (
              <li>{t}</li>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
};

export default App;
