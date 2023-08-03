import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import MainLayout from "~/components/MainLayout";
import CreateTemplateSkeleton from "~/components/template/CreateTemplateSkeleton";
import TemplateLayout from "~/components/template/TemplatePageLayout";
import { langKey } from "~/hooks/use-language";
import { useToast } from "~/hooks/use-toast";
import { type Language, type PageWithLayout } from "~/types/page-types";
import { api } from "~/utils/api";

const CreateTemplate = dynamic(
  () => import("~/components/template/CreateTemplate"),
  {
    loading: () => <CreateTemplateSkeleton />,
  }
);


const TemplateById: PageWithLayout = () => {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  const { setMessage } = useToast();

  // prettier-ignore
  const { isLoading, data: templateData } = api.template.getTemplateById.useQuery(
      { id: id ?? "" },
      {
        queryKey: ["template.getTemplateById", { id: id ?? ""}],
        onError() {
          setMessage(`Error: can't get template`);
        },
        enabled: id !== undefined,
      }
    );
  return (
    <section className="flex justify-center">
      {isLoading && <CreateTemplateSkeleton />}
      {templateData && (
        <CreateTemplate
          data={{
            id: templateData?.id ?? "",
            name: templateData?.name ?? "",
            entries: templateData?.templateEntries ?? [],
            description: templateData?.description ?? "",
          }}
        />
      )}
    </section>
  );
};

TemplateById.getLayout = (page) => (
  <MainLayout>
    <TemplateLayout title="details">{page}</TemplateLayout>
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
