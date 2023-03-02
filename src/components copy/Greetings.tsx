import { useTranslation } from "next-i18next";
import type { TimeRangeType } from "src/types/spotify-types";
import { TimeRangeArray } from "src/types/spotify-types";

type Props = {
  name: string;
  timeRange: TimeRangeType;
  selectTimeRange: (range: TimeRangeType) => void;
};
export function Greetings({ name, timeRange, selectTimeRange }: Props) {
  const { t } = useTranslation("home");

  const saluteClassName = "text-2xl font-bold text-slate-100 md:text-3xl";

  return (
    <div className="rounded-xl bg-base-300 bg-gradient-to-l p-4 shadow">
      <div className="p-2">
        <div className="flex flex-col sm:flex-row">
          <h1 className={saluteClassName}>{`${salute()},`}</h1>
          <h1 className={saluteClassName}>{`${name} 👋🏻`}</h1>
        </div>
        <p className="mt-2 text-primary-content">{t("recap.title")}</p>
        <select
          className="select select-sm mt-4"
          value={timeRange}
          onChange={(e) => selectTimeRange(e.target.value as TimeRangeType)}
        >
          {TimeRangeArray.map((range, i) => (
            <option className="p-1" key={i} value={range}>
              {t(range)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  function salute() {
    const hours = new Date().getHours();
    if (hours >= 0 && hours <= 12) return t("morning");
    if (hours >= 13 && hours <= 17) return t("afternoon");
    if (hours >= 18 && hours <= 22) return t("evening");
    return t("night");
  }
}
