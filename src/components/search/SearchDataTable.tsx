import { useTranslation } from "next-i18next";
import React, { useMemo } from "react";
import {
  type TagSearchType,
  type TrackSearchType,
} from "~/server/api/routers/spotify_user_router";
import { type SearchType } from "~/types/zod-schemas";
import DataTable from "../ui/DataTable";
import { getTagColumns, getTrackColumns } from "./columns";

interface props {
  data: TagSearchType[] | TrackSearchType[];
  filterType: SearchType;
}
const SearchDataTable = ({ data, filterType }: props) => {
  const { t } = useTranslation("search");
  const columns = useMemo(
    () => (filterType === "tag" ? getTagColumns(t) : getTrackColumns(t)),
    [filterType]
  );
  return <DataTable data={data} columns={columns} />;
};

export default SearchDataTable;
