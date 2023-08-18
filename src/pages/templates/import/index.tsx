import { zodResolver } from "@hookform/resolvers/zod";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import MainLayout from "~/components/MainLayout";
import TemplateLayout from "~/components/template/TemplatePageLayout";
import { useToast } from "~/hooks/use-toast";
import { type PageWithLayout } from "~/types/page-types";
import { api } from "~/utils/api";
import { getPageProps } from "~/utils/helpers";
const FormSchema = z.object({
  id: z.string(),
});
type FormSchemaType = z.infer<typeof FormSchema>;

interface props {
  id?: string;
}

export const ImportTemplateForm = ({ id }: props) => {
  const { setMessage } = useToast();
  const { t } = useTranslation("templates");
  const { t: t_common } = useTranslation("common");

  const router = useRouter();
  const utils = api.useContext().template.getByCurrentUser;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: id,
    },
  });

  const { mutate } = api.template.importById.useMutation({
    onError() {
      setMessage(t("error"));
    },
    async onSuccess() {
      setMessage(t("import_success"));
      utils.invalidate();
      router.push("/templates");
    },
  });

  const onSubmit: SubmitHandler<FormSchemaType> = ({ id }) => {
    mutate({
      id: Number(id),
    });
  };

  return (
    <div className="flex justify-center">
      <form className="w-full max-w-sm" onSubmit={handleSubmit(onSubmit)}>
        <div className="join w-full ">
          <div className="form-control w-full max-w-xs">
            <input
              className="input-bordered input join-item grow bg-white "
              placeholder={t("import_placeholder", {
                defaultValue: "Paste template id...",
              })}
              {...register("id")}
            />

            {errors?.id?.message && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {t("char_len")}
                </span>
              </label>
            )}
          </div>
          <div className="indicator">
            <button type="submit" className="join-item btn">
              {t_common("import")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
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
