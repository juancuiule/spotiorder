import { TrackData, Playlist, AudioFeature } from "../types";

const API = {
  base: "https://api.spotify.com/v1",
  token: "",
  setToken: function(token: string) {
    this.token = token;
  },
  get: async function<T>(url: string) {
    return (await fetch(`${API.base}${url}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${API.token}`
      }
    }).then(r => r.json())) as T;
  },
  getTracksFromPlaylist: async (playlist_id: string) => {
    const { items } = await API.get<{ items: TrackData[] }>(
      `/playlists/${playlist_id}/tracks`
    );
    return items;
  },
  getPlaylistsFromUser: async (username: string) => {
    const { items } = await API.get<{ items: Playlist[]; next: string }>(
      `/users/${username}/playlists?limit=50`
    );
    return items;
  },
  getAudioFeatures: async (...ids: string[]) => {
    const { audio_features } = await API.get<{
      audio_features: AudioFeature[];
    }>(`/audio-features?ids=${ids}`);
    return audio_features
  }
};

export default API;
