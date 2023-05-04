import MainLayout from "@components/MainLayout";
import type { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRef, useState, type ChangeEvent } from "react";
import { z } from "zod";
import { LoadingSpinner } from "~/components/ui/LoadingSpinner";
import { usePlaylistStore } from "~/core/store";
import type { SearchResult } from "~/server/api/routers/spotify_user_router";
import type { PageWithLayout } from "~/types/page-types";
import { api } from "~/utils/api";

const Search: PageWithLayout = () => {
  const searchInput = useRef<HTMLInputElement>(null);
  const { playlists } = usePlaylistStore();
  const { t } = useTranslation("search");
  const [error, setError] = useState(" ");
  // prettier-ignore
  const { data, mutate, isLoading } = api.spotify_user.searchTracks.useMutation();
  const headers = [
    t("search_table_headers.title"),
    t("search_table_headers.playlist"),
    t("search_table_headers.creator"),
    t("search_table_headers.tags"),
  ];
  const onSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(validateSearchInput(event.target.value));
  };

  const search = () => {
    if (searchInput.current)
      mutate({
        playlists: playlists,
        query: searchInput.current.value,
      });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {/* <Filters /> */}
      <div className="form-control w-full sm:max-w-sm md:max-w-md">
        <div className="input-group">
          <input
            ref={searchInput}
            type="text"
            placeholder={t("search") ?? "..."}
            className="input-bordered input grow bg-secondary-content sm:max-w-sm"
            onChange={onSearchInputChange}
          />
          <button
            disabled={!!error}
            className="btn-square btn"
            onClick={search}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
        {!!error && (
          <label className="label text-red-700">
            <span className="label-text-alt font-bold text-error">
              {t(error)}
            </span>
          </label>
        )}
      </div>
      {isLoading && <LoadingSpinner/>}
      {data && data.length > 0 && (
        <CompactTable headers={headers} data={data} />
      )}
    </div>
  );
};

export default Search;
Search.getLayout = (page) => <MainLayout>{page}</MainLayout>;

function validateSearchInput(searchInput: string) {
  let error = "";

  if (!z.string().min(2).safeParse(searchInput).success || !searchInput) {
    error = "search_errors.short";
  }
  if (!z.string().max(18).safeParse(searchInput).success) {
    error = "search_errors.long";
  }
  return error;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      //prettier- ignore
      ...(await serverSideTranslations(context.locale ?? "en", [
        "search",
        "common",
        "modals",
      ])),
    },
  };
};

export interface TableConfig {
  headers: string[];
  data: SearchResult[];
}

const CompactTable = ({ data, headers }: TableConfig) => {
  return (
    <div className="overflow-x-auto pt-4  w-full">
      <table className="table-compact table w-full">
        <thead>
          <tr>
            <th></th>
            {headers.map((header, i) => (
              <th key={i}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((data, i) => (
            <tr key={i}>
              <th>{i + 1}</th>
              <td>{data.track.name}</td>
              <td>{data.playlist}</td>
              <td>{data.creator}</td>
              {data.tags && <td>{data.tags.map(tag => tag.name).join(", ")}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};