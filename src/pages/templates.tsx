import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import MainLayout from "~/components/MainLayout";
import CreateTemplate from "~/components/template/CreateTemplate";
import { MyTemplates } from "~/components/template/MyTemplates";
import { } from "~/components/ui/icons/ArrowUpSVG";
import { } from "~/components/ui/icons/DeleteSVG";
import type { Language } from "~/core/settingsStore";
import { langKey } from "~/hooks/use-language";
import type { PageWithLayout } from "~/types/page-types";

const Templates: PageWithLayout = () => {
  return (
    <div className="flex justify-between flex-col min-h-20">
      <MyTemplates/>
      {/* <CreateTemplate/> */}
      <section id="discover"></section>
      <section id=""></section>
    </div>
  );
};

Templates.getLayout = (page) => <MainLayout>{page}</MainLayout>;
export default Templates;



export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const language = getCookie(langKey, { req, res }) as Language;

  return {
    props: {
      //prettier- ignore
      ...(await serverSideTranslations(language ?? "en", [
        "templates",
        "common",
      ])),
    },
  };
};
