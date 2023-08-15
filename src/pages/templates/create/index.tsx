import type { GetServerSideProps } from "next";
import MainLayout from "~/components/MainLayout";
import CreateTemplate from "~/components/template/CreateTemplate";
import TemplateLayout from "~/components/template/TemplatePageLayout";
import { type PageWithLayout } from "~/types/page-types";
import { getPageProps } from "~/utils/helpers";

const Templates: PageWithLayout = () => {
  return (
    <section className="flex justify-center">
      <CreateTemplate />
    </section>
  );
};

Templates.getLayout = (page) => (
  <MainLayout>
    <TemplateLayout title="create_template">{page}</TemplateLayout>
  </MainLayout>
);
export default Templates;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  return getPageProps(["templates", "common"], { req, res });
};
