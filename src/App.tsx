import React from 'react';
import './App.css';

import { Playlist, Track, AudioFeature } from './types';
import { login, getHashParams } from './auth';

type NumericKey =
  | 'acousticness'
  | 'danceability'
  | 'duration_ms'
  | 'energy'
  | 'instrumentalness'
  | 'key'
  | 'liveness'
  | 'loudness'
  | 'mode'
  | 'speechiness'
  | 'tempo'
  | 'time_signature'
  | 'valence';

const App: React.FC = () => {
  const [username, setUsername] = React.useState('');

  const [playlists, setPlaylists] = React.useState<Playlist[]>([]);
  const [tracks, setTracks] = React.useState<Track[]>([]);

  const [token, setToken] = React.useState('');

  React.useEffect(() => {
    const params = getHashParams();
    console.log(params);
    if (params !== undefined) {
      const access_token = params.access_token;
      setToken(access_token);
    } else {
      login();
    }
  }, []);

  const search = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { items } = (await fetch(
      `https://api.spotify.com/v1/users/${username}/playlists?limit=50`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
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
        Authorization: `Bearer ${token}`
      }
    }).then(r => r.json())) as { items: Track[] };
    setTracks(items);
  };

  const [orderedTracks, setOrderedTracks] = React.useState<string[]>([]);

  const keys: NumericKey[] = [
    'acousticness',
    'danceability',
    'duration_ms',
    'energy',
    'instrumentalness',
    'key',
    'liveness',
    'loudness',
    'mode',
    'speechiness',
    'tempo',
    'time_signature',
    'valence'
  ];

  const [zipped, setZipped] = React.useState<
    Array<{ track: Track; audio_feature: AudioFeature }>
  >([]);
  const getAudioFeatures = React.useCallback(async () => {
    const ids = tracks.map(t => t.track.id).join(',');
    const { audio_features } = (await fetch(
      `https://api.spotify.com/v1/audio-features?ids=${ids}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    ).then(r => r.json())) as { audio_features: AudioFeature[] };

    const zip = tracks.map((t, i) => ({
      track: t,
      audio_feature: audio_features[i]
    }));

    setZipped(zip);
  }, [tracks, token]);

  const [keyOrderBy, setKeyOrderBy] = React.useState<NumericKey>('loudness');
  const order = React.useCallback(() => {
    const ordered = zipped
      .sort((a, b) => {
        return a.audio_feature[keyOrderBy] - b.audio_feature[keyOrderBy];
      })
      .map(x => x.track.track.name);

    setOrderedTracks(ordered);
  }, [zipped, keyOrderBy]);

  React.useEffect(order, [keyOrderBy]);

  React.useEffect(() => {
    if (tracks.length !== 0) {
      getAudioFeatures();
    }
  }, [tracks, getAudioFeatures]);

  return (
    <div className="App">
      <header className="App-header">
        {tracks.length === 0 && playlists.length === 0 ? (
          <>
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
          </>
        ) : null}

        {tracks.length === 0 && playlists.length !== 0 ? (
          <>
            <p>Playlists</p>
            <div
              style={{
                width: '80%',
                margin: '15px auto',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
              {playlists.map(p => {
                return (
                  <div key={p.id} onClick={searchTracks(p.tracks.href)}>
                    <img
                      alt={p.id}
                      src={p.images[0].url}
                      style={{
                        height: '100px',
                        width: '100px',
                        margin: '3px'
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </>
        ) : null}
        {tracks.length !== 0 ? (
          <>
            <p>Tracks</p>
            <div>
              <label>Order by: </label>
              <select
                id="order-key"
                value={keyOrderBy}
                onChange={e => setKeyOrderBy(e.target.value as NumericKey)}
              >
                {keys.map(k => {
                  return (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  );
                })}
              </select>
            </div>
            <div
              style={{
                width: '80%',
                margin: '15px auto',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
              <ul style={{ fontSize: '10px', textAlign: 'left' }}>
                {tracks.map((t, i) => (
                  <li key={t.track.id + i}>{t.track.name}</li>
                ))}
              </ul>
              <ul style={{ fontSize: '10px', textAlign: 'left' }}>
                {orderedTracks.map((t, i) => (
                  <li key={t + i}>{t}</li>
                ))}
              </ul>
            </div>
          </>
        ) : null}
      </header>
    </div>
  );
};

export default App;
