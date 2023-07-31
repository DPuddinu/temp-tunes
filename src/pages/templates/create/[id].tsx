import { useDebouncedState, useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import MainLayout from "~/components/MainLayout";
import TemplateLayout from "~/components/template/TemplatePageLayout";
import { LoadingSpinner } from "~/components/ui/LoadingSpinner";
import { langKey } from "~/hooks/use-language";
import { useToast } from "~/hooks/use-toast";
import { type Language, type PageWithLayout } from "~/types/page-types";
import { api } from "~/utils/api";

const DEBOUNCE_TIME = 200;

type SubmitDataType = {
  [k: string]: string;
};

const CreatePlaylistFromTemplate: PageWithLayout = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { setMessage } = useToast();
  const [page, setPage] = useState(0);
  const [value, setValue] = useDebouncedState<string>("", DEBOUNCE_TIME);

  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 1,
  });

  const [submitUris, setSubmitUris] = useState<SubmitDataType>({});

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

  const template = useMemo(
    () => templateData?.templateEntries[page],
    [templateData, page]
  );

  const { data: searchData, isLoading: searching } =
    api.spotify_user.search.useQuery(
      { query: value },
      {
        queryKey: ["spotify_user.search", { query: value }],
        enabled: !!value,
        staleTime: DEBOUNCE_TIME,
      }
    );

  const { data: _searchData, fetchNextPage: _fetchNextPage } = useInfiniteQuery(
    ["search-track"],
    ({ pageParam = 1 }) => {
      return searchData?.slice((pageParam - 1) * 4, pageParam * 4);
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: {
        pages: [searchData?.slice(0, 4) ?? []],
        pageParams: [1],
      },
      enabled: searchData !== undefined,
    }
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      _fetchNextPage();
    }
  }, [entry, _fetchNextPage]);

  const paginatedData = useMemo(
    () => _searchData?.pages.flatMap((page) => page),
    [_searchData]
  );

  return (
    <section className="flex flex-col items-center gap-2">
      <h1 className="p-2 text-2xl font-bold sm:text-4xl">
        {templateData?.name}
      </h1>
      <div className="">
        <ul className="steps steps-horizontal ">
          {template && (
            <li
              data-content={page + 1}
              key={template.entry}
              className="step-primary step"
            >
              {template.entry}
            </li>
          )}
        </ul>
        <div className="mt-2 flex flex-col gap-2 rounded-xl bg-base-300 p-2 shadow">
          <input
            type="text"
            placeholder="Type here"
            className="input-bordered input mb-2 w-full max-w-xs"
            onChange={(event) => setValue(event.currentTarget.value)}
          />
          <div className="flex flex-col items-center gap-2">
            {paginatedData?.map((data, i) => (
              <>
                {data && (
                  <div
                    ref={i === paginatedData.length - 1 ? ref : null}
                    key={i}
                    className="w-full rounded-lg bg-base-200 p-1 hover:cursor-pointer hover:bg-primary-focus"
                    onClick={() => {
                      setSubmitUris((uris) => {
                        const temp = { ...uris };
                        if (template) {
                          temp[template.id] = data.uri;
                        }
                        return temp;
                      });
                    }}
                  >
                    {`${data.name} - ${data.artists
                      .map((a) => a.name)
                      .join(" ,")}`}
                  </div>
                )}
              </>
            ))}
            {searching && !!value && <LoadingSpinner />}
          </div>
        </div>
        <div className="join join-horizontal mt-4 flex w-full justify-center">
          <button
            disabled={page === 0}
            className="btn-square join-item btn w-24 border-r-2 border-r-base-100"
            onClick={() => {
              setPage((page) => page - 1);
            }}
          >
            Previous
          </button>
          <button
            disabled={page + 1 === templateData?.templateEntries.length}
            className="btn-square join-item btn w-24"
            onClick={() => {
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
    <TemplateLayout>{page}</TemplateLayout>
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
