import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import MainLayout from "~/components/MainLayout";
import CreateTemplate from "~/components/template/CreateTemplate";
import TemplateLayout from "~/components/template/TemplatePageLayout";
import type { Language } from "~/core/settingsStore";
import { langKey } from "~/hooks/use-language";
import { useToast } from "~/hooks/use-toast";
import { type PageWithLayout } from "~/types/page-types";
import { api } from "~/utils/api";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const TemplateById: PageWithLayout = () => {
  const router = useRouter();
  const { setMessage } = useToast();

  const { isLoading, data: templateData } = api.template.getTemplateById.useQuery(
    { id: router.query.id?.toString() ?? '' },
    {
      onSuccess(data){
        // console.log(data);
      },
      onError() {
        setMessage(`Error: can't get template`);
      },
      enabled: router.query.id !== undefined,
    }
  );
  return (
    <section className="flex justify-center">
      <CreateTemplate
        data={{
          id: templateData?.id ?? '',
          name: templateData?.name ?? '',
          entries: templateData?.templateEntries ?? [],
          description: templateData?.description ?? ''
        }}
      />
    </section>
  );
};

TemplateById.getLayout = (page) => (
  <MainLayout>
    <TemplateLayout>{page}</TemplateLayout>
  </MainLayout>
);

export default TemplateById;

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