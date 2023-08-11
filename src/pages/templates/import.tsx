import { zodResolver } from "@hookform/resolvers/zod";
import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import resources from "~/@types/resources";
import MainLayout from "~/components/MainLayout";
import TemplateLayout from "~/components/template/TemplatePageLayout";
import { langKey } from "~/hooks/use-language";
import { useToast } from "~/hooks/use-toast";
import { type Language, type PageWithLayout } from "~/types/page-types";
import { api } from "~/utils/api";
const FormSchema = z.object({
  id: z
    .string()
    .min(25, {
      message: resources.templates.char_len,
    })
    .max(25, {
      message: resources.templates.char_len,
    }),
});
type FormSchemaType = z.infer<typeof FormSchema>;

const ImportTemplate: PageWithLayout = () => {
  const { setMessage } = useToast();
  const { t } = useTranslation("templates");
  const { t: t_common } = useTranslation("common");

  const router = useRouter();
  const utils = api.useContext().template.getByCurrentUser;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchemaType>({ resolver: zodResolver(FormSchema) });

  const { mutate } = api.template.importById.useMutation({
    onError() {
      setMessage(t("error"));
    },
    async onSuccess(data) {
      setMessage(`${t("import_success")}`);
      utils.setInfiniteData({ limit: 6 }, (old) => {
        if (old) {
          const lastPage = old.pages[old.pages.length - 1];
          if (lastPage?.items && lastPage?.items.length < 5) {
            lastPage.items.push(data);
          } else {
            old.pages.push({
              items: [data],
              nextCursor: undefined,
            });
          }
          return old;
        }
      });
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
