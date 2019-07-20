export type Image = {
  height: number;
  url: string;
  width: number;
};

export type NumericKey =
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

export interface Playlist {
  collaborative: boolean;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: {
    display_name: string;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
  };
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  type: string;
  uri: string;
}

export interface Track {
  added_at: string
  added_by: {
    external_urls: {
      spotify: string
    }
    href: string
    id: string
    type: string
    uri: string
  }
  is_local: boolean
  track: {
    id: string
    name: string
    album: {
      images: Image[]
    }
  }
}

export interface AudioFeature {
  analysis_url: string
  id: string
  track_href: string
  type: string
  uri: string
  acousticness: number
  danceability: number
  duration_ms: number
  energy: number
  instrumentalness: number
  key: number
  liveness: number
  loudness: number
  mode: number
  speechiness: number
  tempo: number
  time_signature: number
  valence: number
}