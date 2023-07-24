import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import MainLayout from "~/components/MainLayout";
import TemplateLayout from "~/components/template/TemplatePageLayout";
import { useToast } from "~/hooks/use-toast";
import type { PageWithLayout } from "~/types/page-types";
import { api } from "~/utils/api";


const ImportTemplate: PageWithLayout = () => {
  const router = useRouter();
  const { setMessage } = useToast();
  const { t } = useTranslation("templates");

  //TODO add custom error messages
  const InputType = z.object({
    id: z.string().min(25).max(25)
  });

  const { isLoading, data: templateData } =
    api.template.importTemplateById.useQuery(
      { id: router.query.id?.toString() ?? "" },
      {
        onError(err) {
          const error = t(err.message)
          setMessage(error);
        },
        enabled: router.query.id !== undefined,
      }
    );
  
  return (
    <div>
      <div className="join">
        <div>
          <div>
            <input
              className="input-bordered input join-item"
              placeholder="Search"
            />
          </div>
        </div>
        <div className="indicator">
          <button className="join-item btn">Import</button>
        </div>
      </div>
    </div>
  );
};

ImportTemplate.getLayout = (page) => (
  <MainLayout>
    <TemplateLayout>{page}</TemplateLayout>
  </MainLayout>
);

export default ImportTemplate