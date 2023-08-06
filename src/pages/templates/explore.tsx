import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import MainLayout from "~/components/MainLayout";
import TemplateLayout from "~/components/template/TemplatePageLayout";
import { TemplateSkeleton } from "~/components/ui/skeletons/TemplatesSkeleton";
import { langKey } from "~/hooks/use-language";
import { useToast } from "~/hooks/use-toast";
import { type Language, type PageWithLayout } from "~/types/page-types";
import { api } from "~/utils/api";

const TemplateCard = dynamic(
  () => import("~/components/template/TemplateCard"),
  {
    loading: () => <TemplateSkeleton />,
  }
);

const Explore: PageWithLayout = () => {
  const { t } = useTranslation("templates");
  const { setMessage } = useToast();
  const router = useRouter();
  const utils = api.useContext().template.getByCurrentUser;

  const { data, isLoading } = api.template.getExplore.useQuery(undefined, {
    onError(err) {
      const msg = t(err.message);
      setMessage(msg);
    },
  });

  const { mutate } = api.template.importById.useMutation({
    async onSuccess(data) {
      setMessage(`${t("import_success")}`);
      utils.setData(undefined, (old) => {
        if (old) {
          return [data, ...old];
        }
      });
      router.push("/templates");
    },
    onError() {
      setMessage(`${t("import_error")}`);
    },
  });

  return (
    <section className="flex flex-col justify-center gap-4">
      {data?.map((temp, i) => (
        <TemplateCard
          key={temp.name}
          color={temp.color ?? ""}
          index={i}
          template={temp}
          isNew
          actions={[
            {
              label: t("import"),
              onClick: () =>
                mutate({
                  id: temp.id,
                }),
            },
          ]}
        />
      ))}
      {isLoading && <TemplateSkeleton />}
    </section>
  );
};

Explore.getLayout = (page) => (
  <MainLayout>
    <TemplateLayout title="explore">{page}</TemplateLayout>
  </MainLayout>
);

export default Explore;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const language = getCookie(langKey, { req, res }) as Language;

  return {
    props: {
      //prettier- ignore
      ...(await serverSideTranslations(language ?? "en", [
        "templates",
        "common",
      ])),
    },
  };
};
