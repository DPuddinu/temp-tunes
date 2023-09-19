import {
  useClickOutside,
  useDebouncedValue,
  useIntersection,
} from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useRef, useState } from "react";
import { type Track } from "~/types/spotify-types";
import { api } from "~/utils/api";
import LoadingSpinner from "../ui/LoadingSpinner";
import AudioRow from "./AudioRow";
const DEBOUNCE_TIME = 200;

interface props {
  initialValue?: string;
  disabled: boolean;
  onSelected: (track: Track) => void;
}
const CreatePlaylistForm = ({
  initialValue: placeholder,
  disabled,
  onSelected,
}: props) => {
  const [value, setValue] = useState("");
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number>();
  const [debounced] = useDebouncedValue(value, 200);
  const [searchData, setSearchData] = useState<Track[]>([]);
  const [disabledSearch, setDisabledSearch] = useState(false);
  const [showData, setShowData] = useState(true);
  const dataRef = useClickOutside(() => setShowData(false));

  const { t } = useTranslation("templates");

  const containerRef = useRef<HTMLLIElement>(null);
  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 1,
  });

  const { isLoading: searching } = api.spotify_user.search.useQuery(
    { query: debounced },
    {
      queryKey: ["spotify_user.search", { query: debounced }],
      enabled: !!debounced && !disabledSearch,
      staleTime: DEBOUNCE_TIME,
      onSuccess(data) {
        setSearchData(data);
      },
    }
  );

  const { data: _searchData, fetchNextPage: _fetchNextPage } = useInfiniteQuery(
    [searchData],
    ({ pageParam = 1 }) => {
      if (searchData.length === 0) {
        return [];
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
  const paginatedData = useMemo(
    () => _searchData?.pages.flatMap((page) => page),
    [_searchData]
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      _fetchNextPage();
    }
  }, [entry, _fetchNextPage]);

  useEffect(() => {
    if (disabled) {
      setDisabledSearch(true);
      setValue("");
      setSearchData([]);
    }
  }, [disabled]);

  return (
    <div className="mt-2 flex flex-col items-center gap-2 rounded-xl p-2 ">
      <input
        onClick={() => {
          if (disabledSearch) setDisabledSearch(false);
          if (!showData) setShowData(true);
        }}
        onFocus={() => {
          if (disabledSearch) setDisabledSearch(false);
          if (!showData) setShowData(true);
        }}
        type="text"
        placeholder={t("search_track", {
          defaultValue: "Search Track",
        })}
        className=" input w-full"
        value={placeholder ? placeholder : value}
        onChange={(event) => setValue(event.currentTarget.value)}
      />
      {paginatedData && paginatedData.length > 0 && !!value && showData && (
        <div className="mt-2 flex w-full flex-col gap-2" ref={dataRef}>
          {searching && !!value && (
            <div className="mt-2 flex justify-center">
              <LoadingSpinner />
            </div>
          )}
          {paginatedData?.map((data, i) => (
            <ul key={i}>
              {data && (
                <li
                  ref={i === paginatedData.length - 1 ? ref : null}
                  key={i}
                  className="w-full rounded-lg bg-base-200 p-2 hover:cursor-pointer hover:bg-primary-focus"
                >
                  <div className="flex items-center justify-between">
                    <p
                      className="mr-2 w-full"
                      onClick={() => {
                        onSelected(data);
                        setDisabledSearch(true);
                        setValue(data.name);
                        setSearchData([]);
                      }}
                    >{`${data.name} - ${data.artists
                      .map((a) => a.name)
                      .join(", ")}`}</p>
                    {data.preview_url && (
                      <AudioRow
                        index={i}
                        playing={i === currentlyPlaying}
                        setPlaying={setCurrentlyPlaying}
                        src={data.preview_url}
                        key={i}
                      />
                    )}
                  </div>
                </li>
              )}
            </ul>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreatePlaylistForm;
