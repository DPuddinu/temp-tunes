import type { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { useState } from "react";
import { type SubmitHandler } from "react-hook-form";
import { type SearchFormSchemaType } from "~/components/search/SearchForm";
import MainLayout from "~/components/ui/layouts/MainLayout";
import { usePlaylistStore } from "~/core/userStore";
import type { PageWithLayout } from "~/types/page-types";
import { type Playlist } from "~/types/spotify-types";
import { api } from "~/utils/api";
import { getPageProps } from "~/utils/helpers";

const LoadingSpinner = dynamic(() => import("~/components/ui/LoadingSpinner"));

//prettier-ignore
const SearchDataTable = dynamic(
  () => import("~/components/search/SearchDataTable")
);

const SearchForm = dynamic(() => import("~/components/search/SearchForm"));

//prettier-ignore
const SearchTrack = dynamic(() => import("~/components/search/SearchTrack"));

const Search: PageWithLayout = () => {
  const { playlists } = usePlaylistStore();
  const [query, setQuery] = useState<SearchFormSchemaType>();

  // prettier-ignore
  const { data, mutate, isLoading } = api.spotify_user.searchTracks.useMutation();

  const onSubmit: SubmitHandler<SearchFormSchemaType> = (data) => {
    setQuery(data);
    const mutationObject = {
      query: data.name,
      type: data.filterType,
    };
    if (data.filterType === "track" && playlists) {
      mutate({
        playlists: playlists,
        ...mutationObject,
      });
    } else {
      mutate(mutationObject);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <SearchForm onSubmit={onSubmit} />
      {query?.filterType === "track" && !playlists && (
        <SearchTrack
          onFinish={(playlists: Playlist[]) => {
            mutate({
              playlists: playlists,
              query: query.name,
              type: query.filterType,
            });
          }}
        />
      )}
      {isLoading && <LoadingSpinner />}
      {data && query && !isLoading && (
        <SearchDataTable data={data} filterType={query.filterType} />
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getPageProps(["search", "common"], context);
};

Search.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default Search;
