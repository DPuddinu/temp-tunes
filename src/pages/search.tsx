import MainLayout from "@components/MainLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import type { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import resources from "~/@types/resources";
import { getTagColumns, getTrackColumns } from "~/components/search/columns";
import { SearchSVG } from "~/components/ui/icons/index";
import { usePlaylistStore } from "~/core/userStore";
import type { PageWithLayout } from "~/types/page-types";
import { type Playlist } from "~/types/spotify-types";
import { SearchTypeConst, type SearchType } from "~/types/zod-schemas";
import { api } from "~/utils/api";
import { getPageProps } from "~/utils/helpers";

const LoadingSpinner = dynamic(() => import("~/components/ui/LoadingSpinner"));

//prettier-ignore
const DataTable = dynamic(() => import("~/components/ui/DataTable"));

//prettier-ignore
const SearchResult = dynamic(() => import("~/components/search/SearchResult"));

const SearchFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: resources.search.search_errors.short })
    .max(18, { message: resources.search.search_errors.long }),
});
type SearchFormSchemaType = z.infer<typeof SearchFormSchema>;

const Search: PageWithLayout = () => {
  const { playlists, setPlaylists } = usePlaylistStore();
  const [loadLibrary, setLoadLibrary] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<SearchType>("track");
  const [data, setData] = useState<typeof searchResult>(undefined);

  const { t } = useTranslation("search");
  // prettier-ignore
  const { data: searchResult, mutate, isLoading } = api.spotify_user.searchTracks.useMutation(
    {
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
  const onSubmit: SubmitHandler<SearchFormSchemaType> = (data) => {
    setLoadLibrary(true);

    if (playlists && !loadLibrary && selectedFilter === "track") {
    } else {
      mutate({
        playlists: playlists,
        query: data.name,
        type: selectedFilter,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className=" w-full pb-4 sm:max-w-sm md:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="join relative h-5 w-full">
            <div className="h-16">
              <input
                {...register("name")}
                type="text"
                placeholder={t("search", {
                  defaultValue: "Search...",
                })}
                className="input join-item w-full grow bg-secondary-content sm:max-w-sm "
              />
            </div>

            <select
              value={selectedFilter}
              className="select-bordered select w-full max-w-[8rem] rounded-none"
              onChange={(e) => setSelectedFilter(e.target.value as SearchType)}
            >
              {SearchTypeConst.map((type) => (
                <option
                  value={type}
                  key={type}
                  className="h-10 cursor-pointer select-none text-lg text-base-content hover:bg-base-100"
                >
                  {type}
                </option>
              ))}
            </select>

            <div className="indicator h-16">
              <button type="submit" className="join-item btn bg-base-300">
                <SearchSVG />
              </button>
            </div>
          </div>
        </form>

        {errors.name?.message && (
          <label className="label text-error">
            <span className="label-text-alt mt-2 font-bold text-error">
              {t(errors.name?.message, {
                defaultValue: "Name too long or too small",
              })}
            </span>
          </label>
        )}
      </div>
      {!playlists && loadLibrary && (
        <SearchResult
          enabled={!playlists}
          onFinish={(playlists: Playlist[]) => {
            setPlaylists(playlists);
            const input = getValues().name;
            if (!!input) {
              mutate({
                playlists: playlists,
                query: input,
                type: selectedFilter,
              });
            }
          }}
        />
      )}
      {isLoading && <LoadingSpinner />}
      {data && data.length > 0 && !isLoading && (
        <DataTable
          data={data}
          columns={
            selectedFilter === "tag" ? getTagColumns(t) : getTrackColumns(t)
          }
        />
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getPageProps(["search", "common"], context);
};

Search.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default Search;
