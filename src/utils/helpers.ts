import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { type GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { pages } from "~/components/MainLayout";
import { langKey } from "~/hooks/use-language";
import { authOptions } from "~/server/auth";
import type { Language } from "~/types/page-types";
const redirectKey = 'redirectUrl';

export function spliceArray(array: unknown[], size: number) {
  const newArray = [];
  while (array.length) {
    newArray.push(array.splice(0, size));
  }
  return newArray;
}

export const getPageProps = async (translations: string[], { req, res, params }: GetServerSidePropsContext) => {

  const language = getCookie(langKey, { req, res }) as Language;
  const url = req.url
  const session = await getServerSession(req, res, authOptions);
  const redirectUrl = getCookie(redirectKey, { req, res }) as string;

  if (!session && url && pages.filter(page => url.includes(page.url)).length > 0) {
    setCookie(redirectKey, url, { req, res })
  }

  if (session && redirectUrl) {
    deleteCookie(redirectKey, { req, res })
    return {
      redirect: {
        destination: redirectUrl,
        permanent: false,
      },
    }
  }

  if (url?.includes("callbackUrl") || params?.callbackUrl && session) {
    return {
      redirect: {
        destination: '/home',
        permanent: false,
      },
    }
  }
  if (session?.tokenExpired || !session && url !== '/') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      //prettier- ignore
      ...(await serverSideTranslations(language ?? "en", translations)),
    },
  };
};
