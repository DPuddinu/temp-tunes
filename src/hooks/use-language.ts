import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { type Language } from "~/core/settingsStore";
export const langKey = "nsm_lang";

export const useLanguage = () => {
  const router = useRouter();
  const language = getCookie(langKey) as Language

  useEffect(() => {
    if (!language) setCookie(langKey, 'en', { maxAge: 60 * 60 * 24 });
  }, [language])

  const setLang = (lang: Language) => {
    setCookie(langKey, lang);
    router.push({ pathname: router.route }, router.asPath, {
      locale: language,
    });
  }
  return {
    language: language ? language : 'en', setLanguage: setLang
  }
}