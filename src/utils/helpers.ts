import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { type GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { pages } from "~/components/MainLayout";
import { langKey } from "~/hooks/use-language";
import { authOptions } from "~/server/auth";
import type { Language } from "~/types/page-types";
const redirectKey = 'redirectUrl';
const authKey = 'next-auth.session-token'

export function spliceArray(array: unknown[], size: number) {
  const newArray = [];
  while (array.length) {
    newArray.push(array.splice(0, size));
  }
  return newArray;
}

function redirectTo(url: string) {
  console.log("redirecting to --> ", url);
  return {
    redirect: {
      destination: url,
      permanent: false,
    },
  }
}

export const getPageProps = async (translations: string[], { req, res, params }: GetServerSidePropsContext) => {

  const language = getCookie(langKey, { req, res }) as Language;
  const url = req.url
  const session = await getServerSession(req, res, authOptions);
  const redirectUrl = getCookie(redirectKey, { req, res }) as string;

  if (!session && url && pages.filter(page => url.includes(page.url)).length > 0) {
    console.log('saving url', url);
    setCookie(redirectKey, url, { req, res })
  }

  if (session && redirectUrl) {
    console.log('deleting url', redirectUrl);
    deleteCookie(redirectKey, { req, res })
    return redirectTo(redirectUrl)
  }

  if (url?.includes("callbackUrl") || params?.callbackUrl && session) {
    return redirectTo('/home')
  }
  if (session?.tokenExpired) {
    console.log('expired token or session undefined')
    deleteCookie(authKey, { req, res })
  }

  return {
    props: {
      //prettier- ignore
      ...(await serverSideTranslations(language ?? "en", translations)),
    },
  };
};
