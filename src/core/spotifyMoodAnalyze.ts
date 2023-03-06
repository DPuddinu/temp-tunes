import type { Mood } from "src/types/spotify-types";

export function averageMood(moods: Mood[] | undefined) {
  const avgMood: Mood = {
    acousticness: 0,
    danceability: 0,
    energy: 0,
    instrumentalness: 0,
    duration_ms: 0,
    tempo: 0,
    valence: 0
  };
  if (!moods) return;

  // prettier-ignore add all
  moods.forEach((mood) =>
    Object.keys(avgMood).forEach(
      (key) =>
        (avgMood[key as keyof Mood] += mood ? mood[key as keyof Mood] : 0)
    )
  );
  // making the average
  Object.keys(avgMood).forEach(
    (key) =>
      (avgMood[key as keyof Mood] = avgMood[key as keyof Mood] / moods.length)
  );

  return avgMood;
}
