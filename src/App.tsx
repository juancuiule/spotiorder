import React, { lazy, Suspense } from "react";

import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { getHashParams, login } from "./utils/spotify_auth";
import API from "./utils/api";

const Home = lazy(() =>
  import(/* webpackChunkName: "HomeView" */ "./views/Home")
);
const Playlists = lazy(() =>
  import(/* webpackChunkName: "PlaylistsView" */ "./views/Playlists")
);
const Tracks = lazy(() =>
  import(/* webpackChunkName: "TracksView" */ "./views/Tracks")
);

const App: React.FC = () => {
  const [logged, setLogged] = React.useState(false);

  React.useEffect(() => {
    const params = getHashParams();
    if (params !== undefined) {
      const access_token = params.access_token;
      localStorage.setItem("spotify_auth_token", access_token);
      API.setToken(access_token);
      setLogged(true);
    } else {
      const savedToken = localStorage.getItem("spotify_auth_token");
      if (savedToken !== null) {
        API.setToken(savedToken);
        setLogged(true);
      } else {
        login();
      }
    }
  }, []);

  return logged ? (
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
  ) : null;
};

export default App;