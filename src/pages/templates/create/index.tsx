import type { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import MainLayout from "~/components/ui/layouts/MainLayout";
import TemplateLayout from "~/components/ui/layouts/TemplateLayout";
import { type PageWithLayout } from "~/types/page-types";
import { getPageProps } from "~/utils/helpers";

const CreateTemplate = dynamic(
  () => import("~/components/template/CreateTemplate")
);

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getPageProps(["templates", "common"], context);
};
