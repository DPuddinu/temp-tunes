import type { GetServerSideProps } from "next";
import MainLayout from "~/components/layouts/MainLayout";
import TemplateLayout from "~/components/layouts/TemplateLayout";
import ImportTemplateForm from "~/components/template/ImportTemplateForm";
import { type PageWithLayout } from "~/types/page-types";
import { getPageProps } from "~/utils/helpers";

const ImportTemplate: PageWithLayout = () => {
  return <ImportTemplateForm />;
};

ImportTemplate.getLayout = (page) => (
  <MainLayout>
    <TemplateLayout title="import_template">{page}</TemplateLayout>
  </MainLayout>
);

export default ImportTemplate;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getPageProps(["templates", "common"], context);
};
