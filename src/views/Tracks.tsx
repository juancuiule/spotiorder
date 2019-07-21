import React, { lazy, Suspense } from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { TrackData } from "../types";
import API from "../utils/api";

const Track = lazy(() =>
  import(/* webpackChunkName: "Track" */ "../components/Track")
);

const LoadingTrack = () => (
  <div>
    <div style={{ height: "60.5px" }} />
    <div
      style={{
        width: "100px",
        height: "100px",
        backgroundColor: "red"
      }}
    />
  </div>
);

const Tracks = withRouter(
  (props: RouteComponentProps<{ playlist_id: string }>) => {
    const {
      match: {
        params: { playlist_id }
      }
    } = props;

    const [tracks, setTracks] = React.useState<TrackData[]>([]);

    const load = React.useCallback(async () => {
      const items = await API.getTracksFromPlaylist(playlist_id);
      setTracks(items);
    }, [playlist_id]);

    React.useEffect(() => {
      load();
    }, [load, playlist_id]);

    return (
      <>
        {tracks.map(({ track }, i) => (
          <Suspense fallback={LoadingTrack}>
            <Track key={i} {...track} />
          </Suspense>
        ))}
      </>
    );
  }
);

export default Tracks;
