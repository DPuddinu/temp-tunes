import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import MainLayout from "~/components/MainLayout";
import CreateTemplate from "~/components/template/CreateTemplate";
import TemplateLayout from "~/components/template/TemplateLayout";
import { Language } from "~/core/settingsStore";
import { langKey } from "~/hooks/use-language";
import { useToast } from "~/hooks/use-toast";
import { PageWithLayout } from "~/types/page-types";

const Templates: PageWithLayout = () => {
  const { setMessage } = useToast();
  const { t } = useTranslation("templates");

  return (
    <section>
      <CreateTemplate />
    </section>
  );
};

Templates.getLayout = (page) => (
  <MainLayout>
    <TemplateLayout>{page}</TemplateLayout>
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