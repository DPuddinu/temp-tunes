import type { GetServerSideProps } from "next";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import MainLayout from "~/components/MainLayout";
import TemplateLayout from "~/components/template/TemplatePageLayout";
import type { PageWithLayout } from "~/types/page-types";
import { getPageProps } from "~/utils/helpers";
import { ImportTemplateForm } from ".";

const ImportTemplateById: PageWithLayout = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  // console.log(router.route);

  const id = searchParams.get("id");
  // console.log(id);
  return <>{id ? <ImportTemplateForm id={id} /> : <ImportTemplateForm />}</>;
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
