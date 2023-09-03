import * as Switch from "@radix-ui/react-switch";
import { useTranslation } from "next-i18next";
import { useTheme } from "next-themes";
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
    <div className="flex items-center justify-between">
      <label className="grow font-semibold" htmlFor="theme">
        {t("change_theme")}
      </label>
      <Switch.Root
        onCheckedChange={toggleTheme}
        checked={theme === "dark"}
        className="relative h-[25px] w-[42px] cursor-default rounded-full bg-base-100 outline-none "
        id="theme"
      >
        <Switch.Thumb className="block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-base-300 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px] " />
      </Switch.Root>
    </div>
  );
};

export default ThemeSwitcher;
