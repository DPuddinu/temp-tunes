import { getCookie } from "cookies-next";
import type { OptionsType } from "cookies-next/lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { langKey } from "~/hooks/use-language";
import type { Language } from "~/types/page-types";

export function spliceArray(array: unknown[], size: number) {
  const newArray = [];
  while (array.length) {
    newArray.push(array.splice(0, size));
  }
  return newArray;
}

export const getPageProps = async(translations: string[], { req, res }: OptionsType) => {
  const language = getCookie(langKey, { req, res }) as Language;

  return {
    props: {
      //prettier- ignore
      ...(await serverSideTranslations(language ?? "en", translations)),
    },
  };
};
