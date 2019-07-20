import React from "react";
import "./App.css";

// import { Playlist, Track, AudioFeature, NumericKey } from './types';
// import { login, getHashParams } from './auth';

// const keys: NumericKey[] = [
//   'acousticness',
//   'danceability',
//   'duration_ms',
//   'energy',
//   'instrumentalness',
//   'key',
//   'liveness',
//   'loudness',
//   'mode',
//   'speechiness',
//   'tempo',
//   'time_signature',
//   'valence'
// ];

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  withRouter,
  RouteComponentProps
} from "react-router-dom";
import { getHashParams, login } from "./auth";
import { Playlist, Track } from "./types";

const Home = withRouter((props: RouteComponentProps) => {
  const [username, setUsername] = React.useState("");
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: validae username
    props.history.push(`/playlists/${username}`);
  };
  return (
    <>
      <p>Search by username</p>
      <form onSubmit={submit}>
        <input
          autoFocus
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <button>Search</button>
      </form>
    </>
  );
});

const PlaylistsList = withRouter(
  (props: RouteComponentProps<{ username: string }> & { token: string }) => {
    const {
      token,
      match: {
        params: { username }
      }
    } = props;
    console.log(username);
    const [playlists, setPlaylists] = React.useState<Playlist[]>([]);

    const load = React.useCallback(async () => {
      const { items } = (await fetch(
        `https://api.spotify.com/v1/users/${username}/playlists?limit=50`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      ).then(r => r.json())) as { items: Playlist[]; next: string };
      setPlaylists(items);
    }, [token, username]);

    React.useEffect(() => {
      load();
    }, [load, username]);
    return (
      <>
        {playlists.map(p => {
          console.log(p);
          return (
            <Link to={`/tracks/${p.id}`}>
              <img
                alt={p.id}
                src={p.images[0].url}
                style={{
                  height: "100px",
                  width: "100px",
                  margin: "3px"
                }}
              />
            </Link>
          );
        })}
      </>
    );
  }
);

const Tracks = withRouter(
  (props: RouteComponentProps<{ playlist_id: string }> & { token: string }) => {
    const {
      token,
      match: {
        params: { playlist_id }
      }
    } = props;
    console.log(playlist_id);
    const [tracks, setTracks] = React.useState<Track[]>([]);

    const load = React.useCallback(async () => {
      const href = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
      console.log(href);
      const { items } = (await fetch(href, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }).then(r => r.json())) as { items: Track[] };
      setTracks(items);
      console.log(items);
      
    }, [playlist_id, token]);

    React.useEffect(() => {
      load();
    }, [load, playlist_id]);

    return (
      <>
        <ul style={{ fontSize: "10px", textAlign: "left" }}>
          {tracks.map((t, i) => (
            <li key={t.track.id + i}>
              <img src={t.track.album.images[0].url || ''}/>
              {t.track.name}
            </li>
          ))}
        </ul>
      </>
    );
  }
);

const App: React.FC = () => {
  const [token, setToken] = React.useState("");

  React.useEffect(() => {
    const params = getHashParams();
    if (params !== undefined) {
      const access_token = params.access_token;
      setToken(access_token);
    } else {
      login();
    }
  }, []);

  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route
            exact
            path="/playlists/:username"
            render={props => <PlaylistsList {...props} token={token} />}
          />
          <Route
            exact
            path="/tracks/:playlist_id"
            render={props => <Tracks {...props} token={token} />}
          />
        </Switch>
      </Router>
    </>
  );
};

//   const [orderedTracks, setOrderedTracks] = React.useState<string[]>([]);

//   const [zipped, setZipped] = React.useState<
//     Array<{ track: Track; audio_feature: AudioFeature }>
//   >([]);
//   const getAudioFeatures = React.useCallback(async () => {
//     const ids = tracks.map(t => t.track.id).join(',');
//     const { audio_features } = (await fetch(
//       `https://api.spotify.com/v1/audio-features?ids=${ids}`,
//       {
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         }
//       }
//     ).then(r => r.json())) as { audio_features: AudioFeature[] };

//     const zip = tracks.map((t, i) => ({
//       track: t,
//       audio_feature: audio_features[i]
//     }));

//     setZipped(zip);
//   }, [tracks, token]);

//   const [keyOrderBy, setKeyOrderBy] = React.useState<NumericKey>('loudness');
//   const order = React.useCallback(() => {
//     const ordered = zipped
//       .sort((a, b) => {
//         return a.audio_feature[keyOrderBy] - b.audio_feature[keyOrderBy];
//       })
//       .map(x => x.track.track.name);

//     setOrderedTracks(ordered);
//   }, [zipped, keyOrderBy]);

//   React.useEffect(order, [keyOrderBy]);

//   React.useEffect(() => {
//     if (tracks.length !== 0) {
//       getAudioFeatures();
//     }
//   }, [tracks, getAudioFeatures]);

//         {tracks.length !== 0 ? (
//           <>
//             <p>Tracks</p>
//             <div>
//               <label>Order by: </label>
//               <select
//                 id="order-key"
//                 value={keyOrderBy}
//                 onChange={e => setKeyOrderBy(e.target.value as NumericKey)}
//               >
//                 {keys.map(k => {
//                   return (
//                     <option key={k} value={k}>
//                       {k}
//                     </option>
//                   );
//                 })}
//               </select>
//             </div>
//             <div
//               style={{
//                 width: '80%',
//                 margin: '15px auto',
//                 display: 'flex',
//                 flexDirection: 'row',
//                 flexWrap: 'wrap'
//               }}
//             >
//               <ul style={{ fontSize: '10px', textAlign: 'left' }}>
//                 {tracks.map((t, i) => (
//                   <li key={t.track.id + i}>{t.track.name}</li>
//                 ))}
//               </ul>
//               <ul style={{ fontSize: '10px', textAlign: 'left' }}>
//                 {orderedTracks.map((t, i) => (
//                   <li key={t + i}>{t}</li>
//                 ))}
//               </ul>
//             </div>
//           </>
//         ) : null}
//       </header>
//     </div>
//   );
// };

export default App;
