import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
import { signIn } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { Languages, type Language } from "~/core/settingsStore";
import { langKey, useLanguage } from "~/hooks/use-language";
import {
  FacebookSVG,
  InstagramSVG,
  LinkedinSVG,
  TwitterSVG,
} from "../components/ui/icons/index";
const Landing = () => {
  const router = useRouter();
  useEffect(() => {
    if (router.asPath.includes("callbackUrl")) {
      router.push("/home");
    }
  }, [router]);

  return (
    <>
      <main className="flex min-h-screen flex-col bg-zinc-800">
        <section className="flex grow flex-col pb-0">
          <div className="p-10 sm:p-16">
            <h1 className="tracking-super-wide m-0 text-center text-2xl font-bold sm:mb-16 sm:text-6xl md:text-5xl">
              <span className="text-slate-100 ">Next </span>
              <span className="text-primary">Spotify </span>
              <span className="text-slate-100 ">Manager</span>
            </h1>
          </div>
          <Features />
        </section>
        <Footer />
      </main>
    </>
  );
};

export default Landing;

const Features = () => {
  const { t } = useTranslation("landing");
  return (
    <section className="flex grow flex-col text-center text-gray-800 md:text-left">
      <div className=" diagonal grid grow place-items-center p-10 pb-16 text-white">
        <div className="grid gap-2 text-center">
          <h1 className="mb-2 text-2xl font-extrabold">{t("create")}</h1>
          <h2 className="text-xl">{t("templates-1")}</h2>
          <h2 className="text-xl">{t("templates-2")}</h2>
        </div>
      </div>
      <div className="grid grow place-items-center p-10 pt-16 pb-16 font-medium text-white">
        <div className="grid gap-2 text-center">
          <h1 className="mb-2 text-2xl font-extrabold">{t("explore")}</h1>
          <h2 className="text-xl">{t("stats-1")}</h2>
          <h2 className="text-xl">{t("stats-2")}</h2>
          <h2 className="text-xl">{t("stats-3")}</h2>
        </div>
      </div>
      <div className="diagonal-green grid flex-grow place-items-center p-10  pb-16 text-white">
        <div className="grid gap-2 text-center">
          <h1 className="mb-2 text-2xl font-extrabold ">{t("surprise")}</h1>
          <h2 className="text-xl">{t("share")}</h2>
        </div>{" "}
      </div>
      <div className="mb-8 flex w-full grow items-center justify-center">
        <button
          className="mt-16 w-52 rounded-full bg-primary px-10 py-3 font-semibold  text-gray-900 no-underline"
          onClick={() => signIn("spotify", { callbackUrl: `/home` })}
        >
          {t("getstarted")}
        </button>
      </div>
    </section>
  );
};

const Footer = () => {
  const { language, setLanguage } = useLanguage();
  const ref = useRef<HTMLSelectElement>(null);

  return (
    <footer className="mb-10 pb-4 text-gray-400">
      <div className=" flex flex-col items-center justify-center gap-5 ">
        <span className="text-center text-sm text-gray-400 ">
          Dario Puddinu
        </span>
        <span className="inline-flex w-32 items-center justify-around sm:mt-0">
          <a className="text-gray-400">
            <FacebookSVG />
          </a>
          <a className="ml-3 text-gray-400">
            <TwitterSVG />
          </a>
          <a className="ml-3 text-gray-400">
            <InstagramSVG />
          </a>
          <a className="ml-3 text-gray-400">
            <LinkedinSVG />
          </a>
        </span>
        <select
          ref={ref}
          value={language}
          className="select-bordered select select-sm w-32 bg-base-200 bg-opacity-30"
          onChange={(e) => setLanguage(e.target.value as Language)}
        >
          {Languages.map((lang) => (
            <option
              value={lang}
              key={lang}
              selected={lang === ref.current?.value}
              className="bg-base-300 focus:bg-red-200"
            >
              {lang}
            </option>
          ))}
        </select>
      </div>
    </footer>
  );
};

//prettier-ignore
export const getServerSideProps: GetServerSideProps = async ({req, res}) => {
  const language = getCookie(langKey, { req, res }) as Language;
  return {
    props: {
      ...(await serverSideTranslations(language ?? "en", ["landing"]))},
  };
};
