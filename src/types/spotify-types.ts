import type { RecapCardHeaderCva } from "@components/cva/RecapCardHeaderCva";
import { type VariantProps } from "cva";
import z from "zod";
import type { PlaylistSchema, TrackSchema } from "./zod-schemas";

export type Playlist = z.infer<typeof PlaylistSchema>;
export type Track = z.infer<typeof TrackSchema>;

export type GetPlaylistResponseType = {
  items: Playlist[];
  next: string;
};
export type GetTracksResponseType = {
  items: {
    track: Track;
  }[];
  next: string;
};
export type LastPage = {
  nextCursor: string;
  items: Playlist[];
};
export type TopItem = {
  href: string;
  items: TopArtists[] | TopTracks[];
  limit: number;
  next: string;
  previous: string;
  total: number;
};

export type Generic = {
  href: string;
  name: string;
  images: Image[];
  uri: string;
  id: string;
};
export type Restrictions = {
  reason: string;
};
export type LinkedFrom = {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name?: string;
  type: string;
  uri: string;
};

export type ExternalUrls = {
  spotify: string;
};
export type Recommendations = {
  seeds: Seed[];
  tracks: Track[];
};

export type Seed = {
  afterFilteringSize: number;
  afterRelinkingSize: number;
  href: string;
  id: string;
  initialPoolSize: number;
  type: string;
};
export type Artist = {
  genres: string[];
  name: string;
  images: Image[];
  uri: string;
  id: string;
};

export type TopArtists = {
  items: Artist[];
} & TopUser;

export type TopUser = {
  href: string;
  total: number;
  offest: number;
  next: string;
};

export type Mood = {
  danceability: number;
  energy: number;
  acousticness: number;
  instrumentalness: number;
  valence: number;
  tempo: number;
  duration_ms: number;
};

export type TopTracks = {
  items: Track[];
} & TopUser;

export type Image = {
  height: number;
  url: string;
  width: number;
};

export const TopTypeArray = ["tracks", "artists"] as const;
export const TopTypeEnum = z.enum(TopTypeArray);
export type TopType = z.infer<typeof TopTypeEnum>;
export const TimeRangeArray = [
  "short_term",
  "medium_term",
  "long_term",
] as const;
export const TimeRangeEnum = z.enum(TimeRangeArray);
export type TimeRangeType = z.infer<typeof TimeRangeEnum>;
export type RecapSelectItemPropsType = { onClick?: () => void } & VariantProps<
  typeof RecapCardHeaderCva
>;

export const TagSpotifyTypeArray = ["track", "playlist"] as const;
export type TagSpotifyType = (typeof TagSpotifyTypeArray)[number];

export interface AudioFeatures {
  audio_features: Mood[];
}


