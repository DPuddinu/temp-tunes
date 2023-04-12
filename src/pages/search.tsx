import MainLayout from "@components/MainLayout";
import type { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useCallback, useMemo, useState } from "react";
import { z } from "zod";
import { executeSearch } from "~/core/spotifySearch";
import { useStore } from "~/core/store";
import type { PageWithLayout } from "~/types/page-types";
import { api } from "~/utils/api";

const Search: PageWithLayout = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [error, setError] = useState("");
  const { mutate, isLoading, data } = api.redis_router.set.useMutation();

  const { playlists, tags } = useStore();
  const { playlists, tags } = useStore();
  const { t } = useTranslation("search");

  const onSearchInputChange = (searchInput: string) => {
    setSearchInput(() => {
      validateSearchInput(searchInput);
      return searchInput;
    });
  };

  //prettier-ignore
  const validateSearchInput = useCallback((searchInput: string) => {
      setError("");

      if (!z.string().min(2).safeParse(searchInput).success) {
        setError("search_errors.short");
      }
      if (!z.string().max(18).safeParse(searchInput).success) {
        setError("search_errors.long");
      }
    },
    [searchInput]
  );

  const search = useMemo(() => {
    return executeSearch(searchInput, playlists, tags);
  }, [searchInput]);

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {/* <Filters /> */}
      <div className="form-control w-full sm:max-w-sm md:max-w-md">
        <div className="input-group">
          <input
            type="text"
            placeholder={t("search") ?? "..."}
            className="input-bordered input grow bg-secondary-content sm:max-w-sm"
            value={searchInput}
            onChange={(t) => onSearchInputChange(t.target.value)}
          />
          <button
            disabled={!!error}
            className="btn-square btn"
            // onClick={}
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
    </div>
  );
};

export default Search;
Search.getLayout = (page) => <MainLayout>{page}</MainLayout>;

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