import { useRouter } from "next/router";
import { Language, useSettingsStore } from "~/core/settingsStore";

export const useLanguage = () => {
  const router = useRouter();
  const {language, setLanguage} = useSettingsStore()

  const setLang = (lang: Language) => {
    setLanguage(lang);
    router.push({ pathname: router.route }, router.asPath, {
      locale: lang,
    });
  }
  return {
    language, setLanguage: setLang
  }
}