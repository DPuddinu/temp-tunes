import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { Language } from "~/types/page-types";
export const langKey = "nsm_lang";
const defaultLanguage: Language = "en"
const maxAge = 60 * 60 * 24;

export const useLanguage = () => {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("en")

  const setLang = (lang: Language) => {
    setLanguage(lang)
    setCookie(langKey, lang, { maxAge: maxAge });
    router.push({ pathname: router.route }, router.asPath, {
      locale: language,
    });
  }

  useEffect(() => {
    const lang = getCookie(langKey) as Language
    if (lang) {
      setLanguage(lang ?? defaultLanguage)
      setCookie(langKey, lang ?? defaultLanguage, { maxAge: maxAge });
    }

  }, [language])


  return {
    language: language, setLanguage: setLang
  }
}