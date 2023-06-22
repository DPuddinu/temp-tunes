import { useTranslation, type TFunction } from "next-i18next";
import { TimeRangeArray} from "~/types/spotify-types";
import type { TimeRangeType } from "~/types/spotify-types";

type GreetingsProps = {
  name: string | undefined | null;
  timeRange: TimeRangeType;
  selectTimeRange: (range: TimeRangeType) => void;
};
function Greetings({ name, timeRange, selectTimeRange }: GreetingsProps) {
  const { t } = useTranslation("home");

  return (
    <div className="">
      <div className="p-2">
        <div className="flex flex-col sm:flex-row">
          <h1 className="text-2xl font-bold text-base-content md:text-3xl">
            {`${salute(t)},`}&nbsp;
          </h1>
          <h1 className="text-2xl font-bold text-base-content md:text-3xl">{`${
            name ?? ""
          } 👋🏻`}</h1>
        </div>
        <p className="mt-2 font-medium text-base-content">{t("recap.title")}</p>
        <select
          className="select select-sm mt-4 w-32 bg-base-300"
          value={timeRange}
          onChange={(e) => selectTimeRange(e.target.value as TimeRangeType)}
        >
          {TimeRangeArray.map((range, i) => (
            <option className="mt-1 p-1" key={i} value={range}>
              {t(range)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function salute(t: TFunction) {
  const hours = new Date().getHours();
  if (hours >= 0 && hours <= 12) return t("morning");
  if (hours >= 13 && hours <= 17) return t("afternoon");
  if (hours >= 18 && hours <= 22) return t("evening");
  return t("night");
}

export default Greetings