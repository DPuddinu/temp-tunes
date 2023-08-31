import * as Switch from "@radix-ui/react-switch";
import { useTheme } from "next-themes";
import { useTranslation } from "next-i18next";
import { useMounted } from "~/hooks/use-mounted";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const { t } = useTranslation("common");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return null;
  }

  return (
    <form>
      <div
        className="flex items-center"
        style={{ display: "flex", alignItems: "center" }}
      >
        <label className="pr-[15px] text-sm leading-none" htmlFor="theme">
          {t("change_theme")}
        </label>
        <Switch.Root
          className="relative h-[25px] w-[42px] cursor-default rounded-full bg-base-100 outline-none data-[state=checked]:bg-black"
          id="theme"
        >
          <Switch.Thumb
            className=" block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]"
            onClick={toggleTheme}
          />
        </Switch.Root>
      </div>
    </form>
  );
};

export default ThemeSwitcher;
