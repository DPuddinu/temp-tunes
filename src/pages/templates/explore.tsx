import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";
import MainLayout from "~/components/MainLayout";
import TemplateCard from "~/components/template/TemplateCard";
import TemplateLayout from "~/components/template/TemplatePageLayout";
import { type Language, type PageWithLayout } from "~/types/page-types";
import { langKey } from "~/hooks/use-language";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/utils/api";

const Explore: PageWithLayout = () => {
  const { t } = useTranslation("templates");
  const { setMessage } = useToast();
  const { data, isLoading } = api.template.getExploreTemplates.useQuery(
    undefined,
    {
      onError(err) {
        console.log(err);
      },
    }
  );

  const { mutate } = api.template.importTemplateById.useMutation({
    onSuccess() {
      const msg = t("import_success");
      setMessage(msg);
    },
    onError(err) {
      const msg = t("import_error");
      setMessage(msg);
    },
  });

  return (
    <section className="flex flex-col justify-center gap-4">
      {data &&
        data.map((temp, i) => (
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
