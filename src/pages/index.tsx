import type { GetServerSideProps } from "next";
import { signIn } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "~/hooks/use-language";
import styles from "~/styles/index.module.css";
import { Languages, type Language } from "~/types/page-types";
import { getPageProps } from "~/utils/helpers";
import { cn } from "~/utils/utils";
import {
  InstagramSVG,
  LinkedinSVG,
  TwitterSVG,
} from "../components/ui/icons/index";

const Landing = () => {
  return (
    <>
      <main className="flex min-h-screen flex-col bg-zinc-800">
        <section className="flex grow flex-col pb-0">
          <div className="p-10 sm:p-16">
            <p className="tracking-super-wide m-0 text-center text-2xl font-bold sm:mb-16 sm:text-6xl md:text-5xl">
              <span className="text-slate-100 ">Temp</span>
              <span className="text-primary">Tunes </span>
            </p>
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
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  return (
    <section className="flex grow flex-col text-center text-gray-800 md:text-left">
      <div
        className={cn(
          "grid grow place-items-center p-10 pb-16 text-white",
          styles.diagonal
        )}
      >
        <div className="grid gap-2 text-center">
          <p className="mb-2 text-2xl font-extrabold">{t("create")}</p>
          <p className="text-xl">{t("templates-1")}</p>
          <p className="text-xl">{t("templates-2")}</p>
        </div>
      </div>
      <div className="grid grow place-items-center p-10 pt-16 pb-16 font-medium text-white">
        <div className="grid gap-2 text-center">
          <p className="mb-2 text-2xl font-extrabold">{t("explore")}</p>
          <p className="text-xl">{t("stats-1")}</p>
          <p className="text-xl">{t("stats-2")}</p>
          <p className="text-xl">{t("stats-3")}</p>
        </div>
      </div>
      <div
        className={cn(
          "grid flex-grow place-items-center p-10  pb-16 text-white",
          styles.diagonalgreen
        )}
      >
        <div className="grid gap-2 text-center">
          <p className="mb-2 text-2xl font-extrabold ">{t("surprise")}</p>
          <p className="text-xl">{t("share")}</p>
        </div>
      </div>
      <div className="mb-8 flex w-full grow items-center justify-center">
        <button
          className="mt-16 w-52 rounded-full bg-primary px-10 py-3 font-bold text-white "
          onClick={() =>
            signIn("spotify", { callbackUrl: callbackUrl ?? "/home" })
          }
        >
          {t("getstarted")}
        </button>
      </div>
    </section>
  );
};

const Footer = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <footer className="mb-10 pb-4 text-gray-400">
      <div className="flex flex-col items-center justify-center gap-5 ">
        <span className="text-center text-sm text-gray-400 ">
          Dario Puddinu
        </span>
        <span className="inline-flex items-center gap-4 sm:mt-0">
          <a href="https://twitter.com/PudduThe/" className=" text-gray-400">
            <TwitterSVG />
          </a>
          <a
            href="https://www.instagram.com/thepuddu/"
            className=" text-gray-400"
          >
            <InstagramSVG />
          </a>
          <a
            href="https://www.linkedin.com/in/dario-puddinu-2b1056160/"
            className=" text-gray-400"
          >
            <LinkedinSVG />
          </a>
        </span>
        <select
          value={language}
          className="select-bordered select select-sm w-32 bg-base-200 bg-opacity-30"
          onChange={(e) => setLanguage(e.target.value as Language)}
        >
          {Languages.map((lang) => (
            <option
              value={lang}
              key={lang}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getPageProps(["landing"], context);
};
