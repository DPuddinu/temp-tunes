import { useRouter } from "next/router";
import MainLayout from "~/components/MainLayout";
import CreateTemplate from "~/components/template/CreateTemplate";
import { useToast } from "~/hooks/use-toast";
import { type PageWithLayout } from "~/types/page-types";
import { api } from "~/utils/api";

const TemplateById: PageWithLayout = () => {
  const router = useRouter();
  const { setMessage } = useToast();

  const { isLoading, data: templateData } = api.template.getTemplateById.useQuery(
    { id: router.query.id?.toString() ?? '' },
    {
      onSuccess(data){
        console.log(data);
      },
      onError() {
        setMessage(`Error: can't get template`);
      },
      enabled: router.query.id !== undefined,
    }
  );
  return (
    <div>
      <CreateTemplate
        data={{
          id: templateData?.id ?? '',
          name: templateData?.name ?? '',
          entries: templateData?.templateEntries ?? [],
          description: templateData?.description ?? ''
        }}
      />
    </div>
  );
};

TemplateById.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default TemplateById;
