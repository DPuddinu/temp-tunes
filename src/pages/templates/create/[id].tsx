import { useDebouncedState } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import MainLayout from "~/components/MainLayout";
import TemplateLayout from "~/components/template/TemplatePageLayout";
import { langKey } from "~/hooks/use-language";
import { useToast } from "~/hooks/use-toast";
import { type Language, type PageWithLayout } from "~/types/page-types";
import { api } from "~/utils/api";

const CreatePlaylistFromTemplate: PageWithLayout = () => {
  const searchParams = useSearchParams();
  const { setMessage } = useToast();
  const [page, setPage] = useState(0);
  const id = searchParams.get("id");
  const [value, setValue] = useDebouncedState<string>("", 1000);

  // prettier-ignore
  const { isLoading, data: templateData } = api.template.getTemplateById.useQuery(
      { id: id ?? "" },
      {
        queryKey: ["template.getTemplateById", { id: id ?? ""}],
        onError() {
          setMessage(`Error: can't get template`);
        },
        enabled: id !== undefined,
      }
    );

  const { data } = api.spotify_user.search.useQuery(
    { query: value },
    {
      queryKey: ["spotify_user.search", { query: value }],
      keepPreviousData: true,
      enabled: !!value,
      staleTime: 1000,
      onSuccess(data) {
        console.log(data);
      },
    }
  );

  const {
    data: _data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery(
    ["template-create"],
    ({ pageParam = 1 }) => {
      return [templateData?.templateEntries[pageParam - 1]];
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      getPreviousPageParam: (firstPage, pages) => {
        return pages.length;
      },
      initialData: {
        pages: [templateData?.templateEntries.slice(0, 1) ?? []],
        pageParams: [1],
      },
      enabled: templateData !== undefined,
    }
  );

  const paginatedData = useMemo(
    () => _data?.pages.flatMap((page) => page),
    [_data]
  );

  return (
    <section className="flex justify-center">
      <div className="sm:hidden"></div>
      <div className=" sm:block">
        <ul className="steps steps-vertical lg:steps-horizontal">
          {_data?.pages[page]?.map((t, i) => (
            <li key={t?.id} className="step-primary step">
              {t?.entry}
            </li>
          ))}
        </ul>
        <div className="flex gap-2 rounded-xl bg-base-300 p-2 shadow">
          <div>
            <input
              type="text"
              placeholder="Type here"
              className="input-bordered input mb-2 w-full max-w-xs"
              onChange={(event) => setValue(event.currentTarget.value)}
            />
            <div className="flex flex-col gap-2">
              <p className="w-full rounded-lg bg-base-200 p-1">Song</p>
              <p className="w-full rounded-lg bg-base-200 p-1">Song</p>
              <p className="w-full rounded-lg bg-base-200 p-1">Song</p>
              <p className="w-full rounded-lg bg-base-200 p-1">Song</p>
            </div>
          </div>
          <button className="btn-circle btn text-lg">+</button>
        </div>
        <div className="join join-horizontal mt-2">
          <button
            disabled={!hasPreviousPage}
            className="btn-square join-item btn"
            onClick={() => {
              fetchPreviousPage();
              setPage((page) => page - 1);
            }}
          >
            Prev
          </button>
          <button
            disabled={!hasNextPage}
            className="btn-square join-item btn"
            onClick={() => {
              fetchNextPage();
              setPage((page) => page + 1);
            }}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

CreatePlaylistFromTemplate.getLayout = (page) => (
  <MainLayout>
    <TemplateLayout title="create_playlist">{page}</TemplateLayout>
  </MainLayout>
);
export default CreatePlaylistFromTemplate;

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
