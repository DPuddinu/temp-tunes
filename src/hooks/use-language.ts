import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import type { Language } from "~/types/page-types";
export const langKey = "nsm_lang";

export const useLanguage = () => {
  const router = useRouter();
  const language = getCookie(langKey) as Language

  useEffect(() => {
    if (!language) setCookie(langKey, 'en', { maxAge: 60 * 6 * 24 });
  }, [language])

  const setLang = (lang: Language) => {
    setCookie(langKey, lang, { maxAge: 60 * 6 * 24 });
    router.push({ pathname: router.route }, router.asPath, {
      locale: language,
    });
  }
  return {
    language: language ? language : 'en', setLanguage: setLang
  }
}