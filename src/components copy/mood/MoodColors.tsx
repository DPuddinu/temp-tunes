import type { Mood } from "src/types/spotify-types";

const colorsMap = new Map<keyof Mood, string>();
colorsMap.set("acousticness", "#c2410c");
colorsMap.set("danceability", "#2563eb");
colorsMap.set("duration_ms", "#15803d");
colorsMap.set("instrumentalness", "#c2410c");
colorsMap.set("valence", "#f59e0b");
colorsMap.set("energy", "#b91c1c");

export default colorsMap;
