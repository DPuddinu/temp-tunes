import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";
import MainLayout from "~/components/MainLayout";
import TemplateCard from "~/components/template/TemplateCard";
import TemplateLayout from "~/components/template/TemplatePageLayout";
import type { Language } from "~/core/settingsStore";
import { langKey } from "~/hooks/use-language";
import type { PageWithLayout } from "~/types/page-types";
import { api } from "~/utils/api";

const Explore: PageWithLayout = () => {
  const { t } = useTranslation("templates");

  const { data, isLoading } = api.template.getExploreTemplates.useQuery(
    undefined,
    {
      onError(err) {
        console.log(err);
      },
    }
  );
  return (
    <section className="flex flex-col justify-center gap-4">
      {data &&
        data.map((temp) => (
          <TemplateCard
            key={temp.name}
            color={temp.color ?? ""}
            description={temp.description ?? ""}
            isNew
            title={temp.name}
            actions={[
              {
                disabled: false,
                label: t("create"),
                onClick: () => false,
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
