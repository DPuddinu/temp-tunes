import { type Template, type TemplateEntry } from "@prisma/client";
import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "~/components/MainLayout";
import TemplateLayout from "~/components/template/TemplatePageLayout";
import PaginationComponent from "~/components/ui/PaginationComponent";
import { ErrorSVG } from "~/components/ui/icons";
import { TemplatesSkeleton } from "~/components/ui/skeletons/TemplatesSkeleton";
import { langKey } from "~/hooks/use-language";
import { useToast } from "~/hooks/use-toast";
import { ssgInit } from "~/server/ssg-init";
import { type Language, type PageWithLayout } from "~/types/page-types";
import { api } from "~/utils/api";

const TemplateList = dynamic(
  () => import("~/components/template/TemplateList"),
  {
    loading: () => <TemplatesSkeleton />,
  }
);

export type firstPageProps = {
  firstPageData: {
    items: (Template & {
      templateEntries: TemplateEntry[];
    })[];
    nextCursor: number | null;
  };
};
const Templates: PageWithLayout = ({ firstPageData }: firstPageProps) => {
  const { setMessage } = useToast();
  const { t } = useTranslation("templates");
  const [page, setPage] = useState(0);

  const { data, isLoading, fetchNextPage } =
    api.template.getByCurrentUser.useInfiniteQuery(
      {
        limit: 6,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        onError() {
          setMessage(t("error"));
        },
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
        refetchOnWindowFocus: true,
        refetchOnMount: true,
      }
    );
  const handleFetchNextPage = () => {
    fetchNextPage();
    setPage((prev) => prev + 1);
  };

  const handleFetchPreviousPage = () => {
    setPage((prev) => prev - 1);
  };

  const _data = data?.pages[page]?.items;
  //prettier-ignore
  const nextCursor = data?.pages[page]?.nextCursor;

  return (
    <>
      {_data?.length === 0 && (
        <div className="flex justify-center">
          <div className="max-w-xs rounded-xl bg-base-200 p-4">
            <div className="flex w-full justify-center">
              <ErrorSVG />
            </div>
            <p className="mt-2 text-center">{t("empty")}</p>
          </div>
        </div>
      )}
      {_data && _data?.length > 0 && (
        <div className="flex flex-col gap-2">
          <TemplateList data={_data} />
          <PaginationComponent
            onNext={handleFetchNextPage}
            onPrev={handleFetchPreviousPage}
            nextDisabled={!nextCursor}
            prevDisabled={page === 0}
          />
        </div>
      )}

      {isLoading && !_data && <TemplatesSkeleton />}
    </>
  );
};

Templates.getLayout = (page) => (
  <MainLayout>
    <TemplateLayout title="my_templates">{page}</TemplateLayout>
  </MainLayout>
);
export default Templates;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const language = getCookie(langKey, { req, res }) as Language;

  const session = await getSession({ req });
  const ssg = await ssgInit(session);

  const templateData = await ssg.template.getByCurrentUser.fetch({ limit: 6 });
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
