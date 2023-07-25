import { zodResolver } from "@hookform/resolvers/zod";
import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import MainLayout from "~/components/MainLayout";
import TemplateLayout from "~/components/template/TemplatePageLayout";
import type { Language } from "~/core/settingsStore";
import { langKey } from "~/hooks/use-language";
import { useMounted } from "~/hooks/use-mounted";
import { useToast } from "~/hooks/use-toast";
import type { PageWithLayout } from "~/types/page-types";
import { api } from "~/utils/api";

const FormSchema = z.object({
  id: z.string().min(25).max(25),
});
type FormSchemaType = z.infer<typeof FormSchema>;

const ImportTemplate: PageWithLayout = () => {
  const { setMessage } = useToast();
  const { t } = useTranslation("templates");
  const mounted = useMounted();

  const _FormSchema = z.object({
    id: z
      .string()
      .min(25, {
        message: t("char_len") ?? "Length not valid, should be 25 characters",
      })
      .max(25, {
        message: t("char_len") ?? "Length not valid, should be 25 characters",
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<FormSchemaType>({ resolver: zodResolver(_FormSchema) });

  const { isLoading, mutate } = api.template.importTemplateById.useMutation({
    onError(err) {
      const error = t(err.message);
      setMessage(error);
    },
    onSuccess() {
      const msg = t("import_success");
      setMessage(msg);
    },
  });

  const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
    mutate({
      id: data.id,
    });
  };

  return (
    <>
      {mounted && (
        <div className="flex justify-center">
          <form className="w-full max-w-sm" onSubmit={handleSubmit(onSubmit)}>
            <div className="join w-full ">
              <div className="form-control w-full max-w-xs">
                <input
                  className="input-bordered input join-item grow bg-white "
                  placeholder={t("import_placeholder") ?? "Paste template id"}
                  {...register("id")}
                />
                {errors.id && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {t(errors.id?.message ?? "char_len")}
                    </span>
                  </label>
                )}
              </div>
              <div className="indicator">
                <button className="join-item btn">{t("import")}</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

ImportTemplate.getLayout = (page) => (
  <MainLayout>
    <TemplateLayout title="import_template">{page}</TemplateLayout>
  </MainLayout>
);

export default ImportTemplate;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const language = getCookie(langKey, { req, res }) as Language;

  return {
    props: {
      // prettier-ignore
      ...(await serverSideTranslations(language ?? "en", [
        "templates",
        "common",
      ])),
    },
  };
};
