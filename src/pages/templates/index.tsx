import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import MainLayout from "~/components/MainLayout";
import TemplateLayout from "~/components/template/TemplatePageLayout";
import { ErrorSVG } from "~/components/ui/icons";
import { TemplatesSkeleton } from "~/components/ui/skeletons/TemplatesSkeleton";
import { langKey } from "~/hooks/use-language";
import { useToast } from "~/hooks/use-toast";
import { type Language, type PageWithLayout } from "~/types/page-types";
import { api } from "~/utils/api";

const TemplateList = dynamic(
  () => import("~/components/template/TemplateList"),
  {
    loading: () => <TemplatesSkeleton />,
  }
);

const Templates: PageWithLayout = () => {
  const { setMessage } = useToast();
  const { t } = useTranslation("templates");
  const { data, isLoading } = api.template.getCurrentUserTemplates.useQuery(
    undefined,
    {
      onError(error) {
        const msg = t(error.message);
        setMessage(msg);
      },
    }
  );

  return (
    <>
      {data && data.length === 0 && (
        <div className="flex justify-center">
          <div className="max-w-xs rounded-xl bg-base-200 p-4">
            <div className="flex w-full justify-center">
              <ErrorSVG />
            </div>
            <p className="mt-2 text-center">{t("empty")}</p>
          </div>
        </div>
      )}
      {data && <TemplateList data={data} />}
      {isLoading && <TemplatesSkeleton />}
    </>
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
