import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { Language } from "~/types/page-types";
export const langKey = "nsm_lang";
const defaultLanguage: Language = "en"

export const useLanguage = () => {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("en")

  const setLang = (lang: Language) => {
    setLanguage(lang)
    setCookie(langKey, lang, { maxAge: 60 * 6 * 24 });
    router.push({ pathname: router.route }, router.asPath, {
      locale: language,
    });
  }

  useEffect(() => {
    const lang = getCookie(langKey) as Language
    setLanguage(lang ?? defaultLanguage)
    setCookie(langKey, lang ?? defaultLanguage, { maxAge: 60 * 6 * 24 });
  }, [language])


  return {
    language: language, setLanguage: setLang
  }
}