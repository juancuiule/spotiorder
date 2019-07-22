import React, { lazy, Suspense } from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { TrackData, AudioFeature } from "../types";
import API from "../utils/api";

import sortby from "lodash.sortby";

const Track = lazy(() =>
  import(/* webpackChunkName: "Track" */ "../components/Track")
);

const LoadingTrack = () => (
  <div>
    {/* <div style={{ height: "60.5px" }} />
    <div
      style={{
        width: "100px",
        height: "100px",
        backgroundColor: "red"
      }}
    /> */}
  </div>
);

interface TrackWithFeature extends TrackData {
  feature?: AudioFeature;
}

const options = [
  "acousticness",
  "danceability",
  "duration_ms",
  "energy",
  "instrumentalness",
  "liveness",
  "loudness",
  "speechiness",
  "tempo",
  "valence"
];

const Tracks = withRouter(
  (props: RouteComponentProps<{ playlist_id: string }>) => {
    const {
      match: {
        params: { playlist_id }
      }
    } = props;

    const [tracks, setTracks] = React.useState<(TrackWithFeature)[]>([]);

    const loadTracks = React.useCallback(async () => {
      const items = await API.getTracksFromPlaylist(playlist_id);
      setTracks(items);
    }, [playlist_id]);

    const loadAudioFeatures = React.useCallback(async () => {
      const ids = tracks.map(t => t.track.id);
      const items = await API.getAudioFeatures(...ids);
      setTracks(prevTracks =>
        prevTracks.map(track => ({
          ...track,
          feature: items.find(i => i.id === track.track.id)
        }))
      );
    }, [tracks]);

    React.useEffect(() => {
      loadTracks();
    }, [loadTracks, playlist_id]);

    React.useEffect(() => {
      if (tracks.length !== 0) {
        loadAudioFeatures();
      }
    }, [tracks, loadAudioFeatures]);

    const reverse = (x: any[]) => x.reverse();
    const id = (x: any[]) => x;

    const [order, setOrder] = React.useState(false);

    const orderBy = React.useCallback(
      (key: string) => {
        const fn = order ? reverse : id;
        setTracks(prevTracks => fn(sortby(prevTracks, `feature.${key}`)));
      },
      [order]
    );

    const [selectedOption, setSelectedOption] = React.useState("acousticness");

    React.useEffect(() => {
      orderBy(selectedOption);
    }, [orderBy, selectedOption]);

    return (
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <select
          style={{
            width: "45%"
          }}
          value={selectedOption}
          onChange={e => setSelectedOption(e.target.value)}
        >
          {options.map(option => (
            <option value={option}>{option}</option>
          ))}
        </select>
        <button style={{ width: "45%" }} onClick={() => setOrder(x => !x)}>
          Change order
        </button>
        {tracks.map(({ track, feature }, i) => {
          return (
            <Suspense key={track.id} fallback={<LoadingTrack />}>
              <Track {...track} features={feature} keyToShow={selectedOption} />
            </Suspense>
          );
        })}
      </div>
    );
  }
);

export default Tracks;
