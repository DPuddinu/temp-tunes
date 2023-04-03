import MainLayout from "@components/MainLayout";
import type { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import type { PageWithLayout } from "~/types/page-types";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Search: PageWithLayout = () => {
  return (
    <div className="flex items-center justify-center">
      <SearchBar></SearchBar>
    </div>
  );
};

const SearchBar = () => {
  const { t } = useTranslation("search");
  return (
    <div className="form-control">
      <div className="input-group">
        <input
          type="text"
          placeholder={t("search") ?? "search"}
          className="input-bordered input bg-secondary-content"
        />
        <button className="btn-square btn">
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
