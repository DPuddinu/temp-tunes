import { useTranslation } from "next-i18next";

type GreetingsProps = {
  name: string;
};
function Greetings({ name }: GreetingsProps) {
  const { t } = useTranslation("home");

  return (
    <div className="mb-4 px-2">
      <div className="flex flex-col sm:flex-row">
        <h2 className="text-2xl font-bold text-base-content md:text-3xl ">
          {`${salute(t)} ${name}`}&nbsp;
        </h2>
      </div>
    </div>
  );
}

function salute(t: any) {
  const hours = new Date().getHours();
  if (hours >= 0 && hours <= 12) return t("morning");
  if (hours >= 13 && hours <= 17) return t("afternoon");
  if (hours >= 18 && hours <= 22) return t("evening");
  return t("night");
}

export default Greetings;
