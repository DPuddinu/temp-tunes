import MainLayout from "@components/MainLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import type { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { LoadingSpinner } from "~/components/ui/LoadingSpinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/TableComponent";
import { ArrowSVG, SearchSVG } from "~/components/ui/icons/index";
import { usePlaylistStore } from "~/core/store";
import { useLibrary } from "~/hooks/use-library";
import type { PageWithLayout } from "~/types/page-types";
import { type Playlist } from "~/types/spotify-types";
import { api } from "~/utils/api";

const SearchDataTable = dynamic(() => import("~/components/ui/SearchTable"), {
  loading: () => <div></div>,
});

const LoadingScreen = dynamic(
  () => import("~/components/ui/LoadingPlaylistComponent"),
  {
    loading: () => <div></div>,
  }
);

const SearchFormSchema = z.object({
  name: z.string().min(3),
});
type SearchFormSchemaType = z.infer<typeof SearchFormSchema>;

const Search: PageWithLayout = () => {
  const { playlists, setPlaylists } = usePlaylistStore();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<string>();
  const [progress, setProgress] = useState<number>();

  const { t } = useTranslation("search");
  // prettier-ignore
  const { data, mutate, isLoading } = api.spotify_user.searchTracks.useMutation();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid },
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
      const searchInput = getValues().name
      if (searchInput)
        mutate({
          playlists: library,
          query: searchInput,
        });
    },
  });

  const onSubmit: SubmitHandler<SearchFormSchemaType> = (data) => {
    if (!playlists) {
      loadLibrary();
      return;
    }
    mutate({
      playlists: playlists,
      query: data.name,
    });
      
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="form-control w-full pb-4 sm:max-w-sm md:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <input
              {...register("name")}
              type="text"
              placeholder={t("search") ?? "..."}
              className="input-bordered input grow bg-secondary-content sm:max-w-sm"
            />
            <button
              type="submit"
              disabled={!isValid}
              className="btn-square btn"
            >
              <SearchSVG />
            </button>
          </div>
        </form>

        {/* {!!error && (
          <label className="label text-red-700">
            <span className="label-text-alt font-bold text-error">
              {t(error)}
            </span>
          </label>
        )} */}
      </div>
      {loading && (
        <LoadingScreen current={currentPlaylist} progress={progress} />
      )}
      {isLoading && <LoadingSpinner />}

      {data && (
        <div className="flex w-full flex-col gap-2 p-1">
          <SearchDataTable data={data} />
        </div>
      )}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      //prettier- ignore
      ...(await serverSideTranslations(context.locale ?? "en", ["search"])),
    },
  };
};

Search.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default Search;
