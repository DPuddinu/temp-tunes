import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import type { Mood } from "~/types/spotify-types";
import { api } from "~/utils/api";
import RecapCard from "../RecapCard";

interface MoodRowProps {
  color: string;
  label: string;
  value: number;
}

const MoodCard = () => {
  //prettier-ignore
  const { data, isLoading, isError } = api.spotify_user.getMood.useQuery(undefined, { refetchOnWindowFocus: false});
  const { t } = useTranslation("home");

  return (
    <RecapCard key={"card-moody"} loading={isLoading}>
      <RecapCard.Header key={"mood-header"}>
        <p>{t("recap.mood")}</p>
      </RecapCard.Header>
      <RecapCard.Container key={"container-mood"} error={isError}>
        {data && (
          <div>
            {moodKeys.map((key) => (
              <MoodCard.MoodRow
                key={key}
                color={colorsMap.get(key) ?? ""}
                value={toPercentage(data[key])}
                label={`${t("moodKeys." + key)}`}
              />
            ))}
          </div>
        )}
      </RecapCard.Container>
    </RecapCard>
  );
};

MoodCard.MoodRow = function MoodRow({ color, value, label }: MoodRowProps) {
  const [tempValue, setTempValue] = useState(0);

  useEffect(() => {
    animateValue(tempValue, value, setTempValue);
  }, []);

  function animateValue(
    from: number,
    to: number,
    reducerFn: (num: number) => void
  ) {
    if (from === to) return;

    setTimeout(() => {
      reducerFn(from);
      animateValue(from + 1, to, reducerFn);
    }, 24);
  }

  return (
    <div className="mb-2 flex gap-2 p-2 ">
      <div className="w-1/2 grow text-accent-content">{label}</div>
      <div
        className="w-1/2 min-w-[30px] rounded-full text-center font-bold text-accent-content"
        style={{ width: `${tempValue}%`, background: `${color}` }}
      >
        {tempValue}%
      </div>
    </div>
  );
};

function toPercentage(value: number): number {
  return Math.ceil(value * 100);
}

const colorsMap = new Map<keyof Mood, string>();
colorsMap.set("acousticness", "#c2410c");
colorsMap.set("danceability", "#2563eb");
colorsMap.set("duration_ms", "#15803d");
colorsMap.set("instrumentalness", "#c2410c");
colorsMap.set("valence", "#f59e0b");
colorsMap.set("energy", "#b91c1c");

const moodKeys: (keyof Mood)[] = [
  "acousticness",
  "danceability",
  "energy",
  "valence",
  "instrumentalness",
];

export default MoodCard;
