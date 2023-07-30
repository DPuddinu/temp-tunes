import MainLayout from "@components/MainLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { LoadingSpinner } from "~/components/ui/LoadingSpinner";
import { SearchSVG } from "~/components/ui/icons/index";
import { usePlaylistStore } from "~/core/userStore";
import { langKey } from "~/hooks/use-language";
import { useLibrary } from "~/hooks/use-library";
import type { Language, PageWithLayout } from "~/types/page-types";
import { type Playlist } from "~/types/spotify-types";
import { SearchTypeConst, type SearchType } from "~/types/zod-schemas";
import { api } from "~/utils/api";

//prettier-ignore
const SearchDataTable = dynamic(() => import("~/components/ui/SearchTable"), {loading: () => <div></div>});

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
  const [firstSearch, setFirstSearch] = useState(true);
  const { playlists, setPlaylists } = usePlaylistStore();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<string>();
  const [progress, setProgress] = useState<number>();
  const [selectedFilter, setSelectedFilter] = useState<SearchType>("track");

  const { t } = useTranslation("search");
  // prettier-ignore
  const { data, mutate, isLoading } = api.spotify_user.searchTracks.useMutation();

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
    token: session?.accessToken,
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
    if (firstSearch && selectedFilter === "track") {
      loadLibrary();
      setFirstSearch(false);
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
      <div className=" pb-4 sm:max-w-sm md:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="join">
            <div>
              <div>
                <input
                  {...register("name")}
                  type="text"
                  placeholder={t("search") ?? "..."}
                  className=" input join-item grow bg-secondary-content sm:max-w-sm"
                />
              </div>
            </div>
            <select
              className="select-bordered select join-item"
              onChange={(t) => setSelectedFilter(t.currentTarget.value as SearchType)}
            >
              <option
                disabled
                selected
                className="disabled uppercase hover:bg-white"
              >
                Filter
              </option>
              {SearchTypeConst.map((type) => (
                <option key={type} className="p-2 uppercase">
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
          <label className="label text-red-700">
            <span className="label-text-alt font-bold text-error">
              {t(errors.name?.message ?? "Not Valid")}
            </span>
          </label>
        )}
      </div>
      {loading && (
        <LoadingScreen current={currentPlaylist} progress={progress} />
      )}
      {isLoading && <LoadingSpinner />}
      {data && <SearchDataTable data={data} />}
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
