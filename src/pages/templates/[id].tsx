import type { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import MainLayout from "~/components/layouts/MainLayout";
import TemplateLayout from "~/components/layouts/TemplateLayout";
import CreateTemplateSkeleton from "~/components/template/CreateTemplateSkeleton";
import { useToast } from "~/hooks/use-toast";
import { type PageWithLayout } from "~/types/page-types";
import { api } from "~/utils/api";
import { getPageProps } from "~/utils/helpers";

const CreateTemplate = dynamic(
  () => import("~/components/template/CreateTemplate"),
  {
    loading: () => <CreateTemplateSkeleton />,
  }
);

const TemplateById: PageWithLayout = () => {
  const searchParams = useSearchParams();
  const { t } = useTranslation("templates");

  const id = searchParams.get("id");
  const { setMessage } = useToast();

  // prettier-ignore
  const { isLoading, data: templateData } = api.template.getById.useQuery(
    { id: Number(id ?? -1) },
    {
      queryKey: ["template.getById", { id: Number(id ?? -1) }],
      onError() {
        setMessage(t('error'));
      },
      enabled: id !== undefined,
    }
  );
  return (
    <section className="flex justify-center">
      {isLoading && <CreateTemplateSkeleton />}
      {templateData && <CreateTemplate data={templateData} />}
    </section>
  );
};

TemplateById.getLayout = (page) => (
  <MainLayout>
    <TemplateLayout title="details">{page}</TemplateLayout>
  </MainLayout>
);

export default TemplateById;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getPageProps(["templates", "common"], context);
};
