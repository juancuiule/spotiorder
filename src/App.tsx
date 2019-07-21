import React, { lazy, Suspense } from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { getHashParams, login } from "./utils/spotify_auth";
import API from "./utils/api";

const Home = lazy(() => import("./views/Home"));
const Playlists = lazy(() => import("./views/Playlists"));
const Tracks = lazy(() => import("./views/Tracks"));

const App: React.FC = () => {
  React.useEffect(() => {
    const params = getHashParams();
    if (params !== undefined) {
      const access_token = params.access_token;
      localStorage.setItem("spotify_auth_token", access_token);
      API.setToken(access_token);
    } else {
      const storageToken = localStorage.getItem("spotify_auth_token");
      if (storageToken !== null) {
        API.setToken(storageToken);
      } else {
        login();
      }
    }
  }, []);

  return (
    <>
      <Router>
        <Suspense fallback={<div>loading...</div>}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/playlists/:username" component={Playlists} />
            <Route exact path="/tracks/:playlist_id" component={Tracks} />
          </Switch>
        </Suspense>
      </Router>
    </>
  );
};

export default App;

//   const [orderedTracks, setOrderedTracks] = React.useState<string[]>([]);

//   const [zipped, setZipped] = React.useState<
//     Array<{ track: Track; audio_feature: AudioFeature }>
//   >([]);
//
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
