import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "~/components/MainLayout";
import TemplateLayout from "~/components/template/TemplatePageLayout";
import PaginationComponent from "~/components/ui/PaginationComponent";
import { TemplateSkeleton } from "~/components/ui/skeletons/TemplatesSkeleton";
import { langKey } from "~/hooks/use-language";
import { useToast } from "~/hooks/use-toast";
import { ssgInit } from "~/server/ssg-init";
import { type Language, type PageWithLayout } from "~/types/page-types";
import type { TemplateFilterSchemaType } from "~/types/zod-schemas";
import { api } from "~/utils/api";
import type { firstPageProps } from ".";

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

const Explore: PageWithLayout = ({ firstPageData }: firstPageProps) => {
  const { t } = useTranslation("templates");
  const { t: t_common } = useTranslation("common");

  const { setMessage } = useToast();
  const router = useRouter();
  const utils = api.useContext().template.getByCurrentUser;
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState<TemplateFilterSchemaType>();

  // prettier-ignore
  const { data, isLoading, fetchNextPage } =
    api.template.getLatest.useInfiniteQuery(
      {
        limit: 6,
        skip: 6,
        filter: filter,
      },
      {
        initialData: {
          pageParams: [],
          pages: [
            {
              items: firstPageData.items,
              nextCursor: firstPageData.nextCursor
                ? firstPageData.nextCursor
                : undefined,
            },
          ],
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        onError() {
          setMessage(t("error"));
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

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const language = getCookie(langKey, { req, res }) as Language;
  const session = await getSession({ req });
  const ssg = await ssgInit(session);

  const templateData = await ssg.template.getLatest.fetch({ limit: 6 });
  const data = {
    items: templateData.items,
    nextCursor: templateData.nextCursor ? templateData.nextCursor : null,
  };
  return {
    props: {
      firstPageData: data,
      //prettier- ignore
      ...(await serverSideTranslations(language ?? "en", [
        "templates",
        "common",
      ])),
    },
  };
};
