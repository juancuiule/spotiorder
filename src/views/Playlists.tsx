import React from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { Playlist } from "../types";
import { Link } from "react-router-dom";
import API from "../utils/api";

const PlaylistsList = withRouter(
  (props: RouteComponentProps<{ username: string }>) => {
    const {
      match: {
        params: { username }
      }
    } = props;

    const [playlists, setPlaylists] = React.useState<Playlist[]>([]);

    const loadPlaylists = React.useCallback(async () => {
      const items = await API.getPlaylistsFromUser(username);
      setPlaylists(items);
    }, [username]);

    React.useEffect(() => {
      loadPlaylists();
    }, [loadPlaylists]);

    return (
      <>
        {playlists.map(p => {
          return (
            <Link key={p.id} to={`/tracks/${p.id}`}>
              <img
                alt={p.id}
                src={p.images[0].url}
                style={{
                  height: "100px",
                  width: "100px",
                }}
              />
            </Link>
          );
        })}
      </>
    );
  }
);

export default PlaylistsList;
