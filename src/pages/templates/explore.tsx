import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "~/components/MainLayout";
import TemplateLayout from "~/components/template/TemplatePageLayout";
import PaginationComponent from "~/components/ui/PaginationComponent";
import { TemplateSkeleton } from "~/components/ui/skeletons/TemplatesSkeleton";
import { langKey } from "~/hooks/use-language";
import { useToast } from "~/hooks/use-toast";
import { type Language, type PageWithLayout } from "~/types/page-types";
import type { TemplateFilterType } from "~/types/zod-schemas";
import { api } from "~/utils/api";

const TemplateCard = dynamic(
  () => import("~/components/template/TemplateCard"),
  {
    loading: () => <TemplateSkeleton />,
  }
);

const TemplateFilter = dynamic(
  () => import("~/components/template/TemplateFilter"),
  {
    loading: () => <TemplateSkeleton />,
  }
);

const Explore: PageWithLayout = () => {
  const { t } = useTranslation("templates");
  const { setMessage } = useToast();
  const router = useRouter();
  const utils = api.useContext().template.getByCurrentUser;
  const [page, setPage] = useState(0);

  // prettier-ignore
  const [selectedFilter, setSelectedFilter] = useState<TemplateFilterType>("name");

  // prettier-ignore
  const { data, isLoading, fetchNextPage } = api.template.getLatest.useInfiniteQuery(
      {
        limit: 6,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        onError(err) {
          const msg = t(err.message);
          setMessage(msg);
        },
      }
    );
  const handleFetchNextPage = () => {
    fetchNextPage();
    setPage((prev) => prev + 1);
  };

  const handleFetchPreviousPage = () => {
    setPage((prev) => prev - 1);
  };

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

  const _data = data?.pages[page]?.items;

  return (
    <section className="flex flex-col gap-2">
      {/* {data && (
        <TemplateFilter
          selectedFilter={selectedFilter}
          setSelectedFilter={(t) => setSelectedFilter(t)}
          onSubmit={() => false}
        />
      )} */}
      <div className="flex w-full flex-col justify-center gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3">
        {_data?.map((temp, i) => (
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
      </div>
      <PaginationComponent
        onNext={handleFetchNextPage}
        onPrev={handleFetchPreviousPage}
        nextDisabled={!data?.pages[page]?.nextCursor}
        prevDisabled={page === 0}
      />
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
