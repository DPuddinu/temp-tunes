import { useDebouncedValue, useIntersection } from "@mantine/hooks";
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
import { type Track } from "~/types/spotify-types";
import { api } from "~/utils/api";

const DEBOUNCE_TIME = 200;

type SubmitDataType = {
  [k: string]: Track;
};

const CreatePlaylistFromTemplate: PageWithLayout = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { setMessage } = useToast();
  const [page, setPage] = useState(0);
  const [disabledSearch, setDisabledSearch] = useState(false);
  const [value, setValue] = useState('');
  const [debounced] = useDebouncedValue(value, 200);
  const [searchData, setSearchData] = useState<Track[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 1,
  });

  const [submitTracks, setSubmitTracks] = useState<SubmitDataType>({});

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

  const { isLoading: searching } =
    api.spotify_user.search.useQuery(
      { query: debounced },
      {
        queryKey: ["spotify_user.search", { query: debounced }],
        enabled: !!debounced && !disabledSearch,
        staleTime: DEBOUNCE_TIME,
        onSuccess(data) {
          setSearchData(data)
        },
      }
    );

  const { data: _searchData, fetchNextPage: _fetchNextPage } = useInfiniteQuery(
    [searchData],
    ({ pageParam = 1 }) => {
      if(searchData.length === 0){
        return []
      }
      return searchData.slice((pageParam - 1) * 4, pageParam * 4);
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: {
        pages: [searchData.slice(0, 4) ?? []],
        pageParams: [1],
      },
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
      <div className="max-w-sm">
        <ul className="steps steps-horizontal">
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
        <div className="mt-2 flex flex-col gap-2 rounded-xl bg-base-300 p-2 shadow items-center">
          <input
            onClick={() => {if(disabledSearch) setDisabledSearch(false)}}
            onFocus={() => {if(disabledSearch) setDisabledSearch(false)}}
            type="text"
            placeholder="Type here"
            className="input-bordered input w-full"
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
          />
          {paginatedData && paginatedData.length > 0 && !!value && 
          <div className="mt-2 flex flex-col gap-2">
            { paginatedData?.map((data, i) => 
              <div key={i}>
                {data && (
                  <div
                    ref={i === paginatedData.length - 1 ? ref : null}
                    key={i}
                    className="w-full rounded-lg bg-base-200 p-1 hover:cursor-pointer hover:bg-primary-focus"
                    onClick={() => {
                      setSubmitTracks((uris) => {
                        const temp = { ...uris };
                        if (template) {
                          temp[template.id] = data;
                        }
                        return temp;
                      });
                      setDisabledSearch(true);
                      setValue(data.name)
                      setSearchData([])
                    }}
                  >
                    {`${data.name} - ${data.artists
                      .map((a) => a.name)
                      .join(" ,")}`}
                  </div>
                )}
                
              </div>
            )
          }
          {searching && !!value && <div className="flex justify-center">
            <LoadingSpinner /></div>}
          </div>}
          
        </div>
        <div className="join join-horizontal mt-4 flex w-full justify-center">
          <button
            disabled={page === 0}
            className="btn-square join-item btn w-24 border-r-2 border-r-base-100 disabled:border-base-200"
            onClick={() => {
              setPage((page) => page - 1);
              setDisabledSearch(true);
              setValue('')
              setSearchData([])
            }}
          >
            Previous
          </button>
          <button
            disabled={page + 1 === templateData?.templateEntries.length}
            className="btn-square join-item btn w-24"
            onClick={() => {
              setPage((page) => page + 1);
              setDisabledSearch(true);
              setValue('')
              setSearchData([])
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
