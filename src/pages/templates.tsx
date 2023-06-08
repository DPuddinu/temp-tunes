import MainLayout from "~/components/MainLayout";
import type { PageWithLayout } from "~/types/page-types";

const Templates: PageWithLayout = () => {
  return <div>
   TODO
  </div>
}

Templates.getLayout = (page) => <MainLayout>{page}</MainLayout>;
export default Templates