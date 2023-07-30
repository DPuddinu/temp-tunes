import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import MainLayout from "~/components/MainLayout";
import CreateTemplate from "~/components/template/CreateTemplate";
import TemplateLayout from "~/components/template/TemplatePageLayout";
import { type Language, type PageWithLayout } from "~/types/page-types";
import { langKey } from "~/hooks/use-language";

const Templates: PageWithLayout = () => {
  return (
    <section className="flex justify-center">
      <CreateTemplate />
    </section>
  );
};

Templates.getLayout = (page) => (
  <MainLayout>
    <TemplateLayout title="create">{page}</TemplateLayout>
  </MainLayout>
);
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
