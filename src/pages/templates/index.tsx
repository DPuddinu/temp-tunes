import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";
import MainLayout from "~/components/MainLayout";
import TemplateList from "~/components/template/TemplateList";
import TemplateLayout from "~/components/template/TemplatePageLayout";
import { ErrorSVG } from "~/components/ui/icons";
import { TemplatesSkeleton } from "~/components/ui/skeletons/TemplatesSkeleton";
import { type Language } from "~/core/settingsStore";
import { langKey } from "~/hooks/use-language";
import { useToast } from "~/hooks/use-toast";
import { type PageWithLayout } from "~/types/page-types";
import { api } from "~/utils/api";

const Templates: PageWithLayout = () => {
  const { setMessage } = useToast();
  const { t } = useTranslation("templates");
  const { data, isLoading } = api.template.getCurrentUserTemplates.useQuery(
    undefined,
    {
      onError() {
        const msg = t("error");
        setMessage(msg);
      },
    }
  );

  return (
    <div className="flex flex-col items-center">
      {data && <TemplateList data={data} />}
      {data && data.length === 0 && (
        <div className="max-w-xs rounded-xl bg-base-200 p-4">
          <div className="flex w-full justify-center">
            <ErrorSVG />
          </div>
          <p className="mt-2 text-center">{t("empty")}</p>
        </div>
      )}
      {isLoading && <TemplatesSkeleton />}
    </div>
  );
};

Templates.getLayout = (page) => (
  <MainLayout>
    <TemplateLayout title="my_templates">{page}</TemplateLayout>
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
