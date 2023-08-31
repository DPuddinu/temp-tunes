import type { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import MainLayout from "~/components/ui/layouts/MainLayout";
import TemplateLayout from "~/components/ui/layouts/TemplateLayout";
import type { PageWithLayout } from "~/types/page-types";
import { getPageProps } from "~/utils/helpers";

const ImportTemplateForm = dynamic(
  () => import("~/components/template/ImportTemplateForm")
);

const ImportTemplateById: PageWithLayout = () => {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  return <ImportTemplateForm id={id} />;
};

ImportTemplateById.getLayout = (page) => (
  <MainLayout>
    <TemplateLayout title="import_template">{page}</TemplateLayout>
  </MainLayout>
);
export default ImportTemplateById;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getPageProps(["templates", "common"], context);
};
