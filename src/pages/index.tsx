import type { GetStaticProps } from "next";
import { signIn } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FacebookSVG } from "../components/ui/icons/FacebookSVG";
import { InstagramSVG } from "../components/ui/icons/InstagramSVG";
import { LinkedinSVG } from "../components/ui/icons/LinkedinSVG";
import { TwitterSVG } from "../components/ui/icons/TwitterSVG";

const Landing = () => {
  return (
    <>
      <Head>
        <title>Next Spotify Manager</title>
        <meta name="description" content="A very cool Spotify Manager" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
          className="mt-16 w-max rounded-full bg-primary px-10 py-3 font-semibold  text-gray-900 no-underline"
          onClick={() => signIn("spotify", { callbackUrl: "/home" })}
        >
          Get Started
        </button>
      </div>
    </section>
  );
};
interface LanguageProps{
  selectedLanguage:string;
  setSelectedLanguage: (language:string) => void;
}
const Footer = () => {
  const router = useRouter();

  return (
    <footer className="pb-4 text-gray-400">
      <div className=" flex justify-center pt-3 pb-5">
        <span className="mt-4 inline-flex items-center justify-end sm:mt-0">
          <p className=" mr-4 text-sm text-gray-400 sm:ml-4 sm:mt-0   sm:border-gray-800">
            Dario Puddinu 2023
          </p>
          <a className="text-gray-400">
            <FacebookSVG></FacebookSVG>
          </a>
          <a className="ml-3 text-gray-400">
            <TwitterSVG></TwitterSVG>
          </a>
          <a className="ml-3 text-gray-400">
            <InstagramSVG></InstagramSVG>
          </a>
          <a className="ml-3 text-gray-400">
            <LinkedinSVG></LinkedinSVG>
          </a>
          <button
            className="btn-primary btn"
            onClick={() =>
              router.push({ pathname: "/index" }, router.asPath, {
                locale: "it",
              })
            }
          >
            It
          </button>
        </span>
      </div>
    </footer>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["landing"])),
  },
});
