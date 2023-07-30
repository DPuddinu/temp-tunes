import MainLayout from "@components/MainLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ColumnDef } from "@tanstack/react-table";
import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { LoadingSpinner } from "~/components/ui/LoadingSpinner";
import { ArrowSVG, SearchSVG } from "~/components/ui/icons/index";
import { usePlaylistStore } from "~/core/userStore";
import { langKey } from "~/hooks/use-language";
import { useLibrary } from "~/hooks/use-library";
import type { Language, PageWithLayout } from "~/types/page-types";
import { type Playlist } from "~/types/spotify-types";
import { SearchTypeConst, type SearchType } from "~/types/zod-schemas";
import { api } from "~/utils/api";

//prettier-ignore
const DataTable = dynamic(() => import("~/components/ui/DataTable"), {loading: () => <div></div>});

//prettier-ignore
const LoadingScreen = dynamic(() => import("~/components/ui/LoadingPlaylistComponent"),{ loading: () => <div></div>});

const SearchFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "search_errors.short" })
    .max(18, { message: "search_errors.long" }),
});
type SearchFormSchemaType = z.infer<typeof SearchFormSchema>;

const Search: PageWithLayout = () => {
  const { playlists, setPlaylists } = usePlaylistStore();
  const [loading, setLoading] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<string>();
  const [progress, setProgress] = useState<number>();
  const [selectedFilter, setSelectedFilter] = useState<SearchType>("track");
  const [data, setData] = useState<typeof searchResult>(undefined);

  const { t } = useTranslation("search");
  // prettier-ignore
  const { data: searchResult, mutate, isLoading } = api.spotify_user.searchTracks.useMutation(
    {
      mutationKey: ["getLibrary"],
      onSuccess(data) {
        setData(data)
      },
    }
  );
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SearchFormSchemaType>({
    resolver: zodResolver(SearchFormSchema),
  });

  // LOADING LIBRARY
  const { loadLibrary } = useLibrary({
    onStart: () => setLoading(true),
    onProgress: (progress: number, name: string) => {
      setCurrentPlaylist(name);
      setProgress(progress);
    },
    onFinish: (library: Playlist[]) => {
      setLoading(false);
      setPlaylists(library);
      const searchInput = getValues().name;
      if (searchInput)
        mutate({
          playlists: library,
          query: searchInput,
          type: selectedFilter,
        });
    },
  });

  const onSubmit: SubmitHandler<SearchFormSchemaType> = (data) => {
    if (!playlists && selectedFilter === "track") {
      loadLibrary();
    } else {
      mutate({
        playlists: playlists,
        query: data.name,
        type: selectedFilter,
      });
    }
  };

  const tagColumns: ColumnDef<unknown, unknown>[] = useMemo(() => {
    return [
      {
        accessorKey: "title",
        header: ({ column }) => {
          return (
            <button
              className="flex w-full items-center gap-1"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {t("search_table_headers.title") ?? "Title"}
              <ArrowSVG isOpen={column.getIsSorted()} />
            </button>
          );
        },
      },
      {
        accessorKey: "artists",
        header: ({ column }) => {
          return (
            <button
              className="flex items-center justify-center gap-1"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {t("search_table_headers.author") ?? "Author"}
              <ArrowSVG isOpen={column.getIsSorted()}></ArrowSVG>
            </button>
          );
        },
      },
      {
        accessorKey: "tags",
        header: ({ column }) => {
          return (
            <button
              className="flex items-center justify-center gap-1"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {t("search_table_headers.tags") ?? "Tags"}
              <ArrowSVG isOpen={column.getIsSorted()}></ArrowSVG>
            </button>
          );
        },
      },
    ];
  }, [t]);

  const trackColumns: ColumnDef<unknown, unknown>[] = useMemo(() => {
    return [
      {
        accessorKey: "title",
        header: ({ column }) => {
          return (
            <button
              className="flex w-full items-center gap-1"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {t("search_table_headers.title") ?? "Title"}
              <ArrowSVG isOpen={column.getIsSorted()} />
            </button>
          );
        },
      },
      {
        accessorKey: "artists",
        header: ({ column }) => {
          return (
            <button
              className="flex items-center justify-center gap-1"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {t("search_table_headers.author") ?? "Author"}
              <ArrowSVG isOpen={column.getIsSorted()}></ArrowSVG>
            </button>
          );
        },
      },
      {
        accessorKey: "playlist",
        header: ({ column }) => {
          return (
            <button
              className="flex items-center justify-center gap-1"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {t("search_table_headers.playlist") ?? "playlist"}
              <ArrowSVG isOpen={column.getIsSorted()}></ArrowSVG>
            </button>
          );
        },
      },

      {
        accessorKey: "creator",
        header: ({ column }) => {
          return (
            <button
              className="flex items-center justify-center gap-1"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {t("search_table_headers.creator") ?? "Creator"}
              <ArrowSVG isOpen={column.getIsSorted()}></ArrowSVG>
            </button>
          );
        },
      },
    ];
  }, [t]);

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className=" w-full pb-4 sm:max-w-sm md:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="join relative h-5 w-full">
            <div>
              <input
                {...register("name")}
                type="text"
                placeholder={t("search") ?? "..."}
                className="input join-item w-full grow bg-secondary-content sm:max-w-sm"
              />
            </div>

            <select
              className="select-bordered select join-item border-base-300 bg-base-300"
              placeholder="Filter"
              onChange={(t) => {
                setSelectedFilter(t.currentTarget.value as SearchType);
                setData(undefined);
              }}
            >
              {SearchTypeConst.map((type) => (
                <option key={type} className=" ">
                  {type}
                </option>
              ))}
            </select>
            <div className="indicator">
              <button type="submit" className="join-item btn bg-base-300">
                <SearchSVG />
              </button>
            </div>
          </div>
        </form>

        {errors.name?.message && (
          <label className="label text-error">
            <span className="label-text-alt mt-2 font-bold text-error">
              {t(errors.name?.message ?? "Not Valid")}
            </span>
          </label>
        )}
      </div>
      {loading && (
        <LoadingScreen current={currentPlaylist} progress={progress} />
      )}
      {isLoading && <LoadingSpinner />}
      {data && (
        <DataTable
          data={data}
          columns={selectedFilter === "tag" ? tagColumns : trackColumns}
        />
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const language = getCookie(langKey, { req, res }) as Language;
  return {
    props: {
      //prettier- ignore
      ...(await serverSideTranslations(language, ["search", "common"])),
    },
  };
};

Search.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default Search;
