import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { type GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef } from "react";
import MainLayout from "~/components/MainLayout";
import TrackRow from "~/components/ui/TrackRow";
import type { Language } from "~/core/settingsStore";
import { useStore } from "~/core/store";
import { langKey } from "~/hooks/use-language";
import type { PageWithLayout } from "~/types/page-types";
import { type Track } from "~/types/spotify-types";
import { api } from "~/utils/api";

const PlaylistPage: PageWithLayout = () => {
  const { setMessage } = useStore();
  const router = useRouter();

  const { isLoading, data } = api.spotify_playlist.getById.useQuery(
    { id: router.query.id?.toString() },
    {
      onError() {
        setMessage(`Error: can't get playlist`);
      },
      enabled: router.query.id !== undefined,
    }
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 1,
  });

  // INFINITE SCROLLING
  const { data: _data, fetchNextPage } = useInfiniteQuery(
    ["query"],
    ({ pageParam = 1 }) => {
      return data?.tracks.slice((pageParam - 1) * 4, pageParam * 4);
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: {
        pages: [data?.tracks.slice(0, 4) ?? []],
        pageParams: [1],
      },
      enabled: data !== undefined,
    }
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const paginatedData = useMemo(
    () => _data?.pages.flatMap((page) => page),
    [_data]
  );

  useEffect(() => console.log(data), [data]);
  return (
    <>
      {data && (
        <div className="rounded-xl bg-base-200 p-2">
          <div className="p-4">
            <h1 className="my-1 text-4xl font-semibold tracking-wider">
              {data?.name}
            </h1>
            <p className="text-sm font-light leading-4">
              {data?.owner.display_name}
            </p>
          </div>

          {paginatedData &&
            paginatedData.map((track, i) => (
              <TrackRow
                key={track?.id ?? i}
                track={track as Track}
                ref={i === paginatedData.length - 1 ? ref : null}
              />
            ))}
        </div>
      )}
    </>
  );
};

export default PlaylistPage;
PlaylistPage.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const language = getCookie(langKey, { req, res }) as Language;
  return {
    props: {
      //prettier- ignore
      ...(await serverSideTranslations(language, [
        "playlists",
        "common",
      ])),
    },
  };
};
