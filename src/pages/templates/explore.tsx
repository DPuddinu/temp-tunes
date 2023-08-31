import type { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import MainLayout from "~/components/MainLayout";
import TemplateLayout from "~/components/template/TemplatePageLayout";
import PaginationComponent from "~/components/ui/Pagination";
import { TemplateSkeleton } from "~/components/ui/skeletons/TemplatesSkeleton";
import { useToast } from "~/hooks/use-toast";
import { type PageWithLayout } from "~/types/page-types";
import type { TemplateFilterSchemaType } from "~/types/zod-schemas";
import { api } from "~/utils/api";
import { getPageProps } from "~/utils/helpers";

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
  const { t: t_common } = useTranslation("common");

  const { setMessage } = useToast();
  const router = useRouter();
  const utils = api.useContext().template.getByCurrentUser;
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState<TemplateFilterSchemaType>();

  // prettier-ignore
  const { data, isLoading, fetchNextPage } = api.template.getLatest.useInfiniteQuery(
      {
        limit: 6,
        filter: filter
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        onError() {
          setMessage(t('error'));
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
    async onSuccess() {
      setMessage(t("import_success"));
      utils.invalidate();
      router.push("/templates");
    },
    onError() {
      setMessage(t("import_error"));
    },
  });
  const _data = data?.pages[page]?.items;
  //prettier-ignore
  const nextCursor = data?.pages[page]?.nextCursor;

  return (
    <section className="flex flex-col gap-2">
      {_data && (
        <TemplateFilter
          filter={filter}
          onSubmit={(filter) => {
            setFilter(filter);
            setPage(0);
          }}
        />
      )}
      <div className="flex w-full flex-col justify-center gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3">
        {_data?.map((temp, i) => (
          <TemplateCard
            key={i}
            color={temp.color}
            index={i}
            template={temp}
            showOptions={false}
            actions={[
              {
                label: t_common("import"),
                onClick: () =>
                  mutate({
                    id: temp.id,
                  }),
              },
            ]}
          />
        ))}
        {isLoading && !_data && (
          <>
            <TemplateSkeleton />
            <TemplateSkeleton />
            <TemplateSkeleton />
            <TemplateSkeleton />
            <TemplateSkeleton />
            <TemplateSkeleton />
          </>
        )}
      </div>
      <PaginationComponent
        onNext={handleFetchNextPage}
        onPrev={handleFetchPreviousPage}
        nextDisabled={!nextCursor}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getPageProps(["templates", "common"], context);
};
