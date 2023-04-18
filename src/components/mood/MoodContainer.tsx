import { useTranslation } from "next-i18next";
import React from "react";
import type { Mood } from "src/types/spotify-types";
import colors from "./MoodColors";
import MoodRow from "./MoodRow";

const moodKeys: (keyof Mood)[] = [
  "acousticness",
  "danceability",
  "energy",
  "valence",
  "instrumentalness",
];

const MoodContainer = ({ mood }: { mood: Mood }) => {
  const { t } = useTranslation("home");

  return (
    <div>
      {moodKeys.map((key) => (
        <MoodRow
          key={key}
          color={colors.get(key) ?? ""}
          value={toPercentage(mood[key])}
          label={`${t("moodKeys." + key)}`}
        />
      ))}
    </div>
  );
};

export default MoodContainer;

function toPercentage(value: number): number {
  return Math.ceil(value * 100);
}
