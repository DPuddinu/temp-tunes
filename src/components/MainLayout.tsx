import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getLibrary } from "~/core/spotifyCollection";
import { useStore, useTagsStore } from "~/core/store";
import { type Playlist } from "~/types/spotify-types";
import { api } from "~/utils/api";
import { UserNavbar } from "./UserNavbar";

interface Page {
  url: string;
  name: string;
}
interface LoadingStateProps {
  progress: number;
  current: string;
  indeterminate: boolean;
}

const pages: Page[] = [
  { url: "/home", name: "Home" },
  { url: "/search", name: "Advanced Search" },
  { url: "/playlists", name: "Playlists" },
  { url: "/templates", name: "Templates" },
];

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const openDrawer = useRef<HTMLInputElement>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState("");
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  //prettier-ignore
  if (sessionData?.tokenExpired || status === "unauthenticated")router.push("/");

  //LOCAL STORE
  const { playlists: storeLibrary, setPlaylists: setStoreLibrary } = useStore();
  const { setTags: setStoreTags, tags: storeTags } = useTagsStore();

  //prettier-ignore
  const { data: userTags } = api.prisma_router.getTagsByUser.useQuery( undefined, { refetchOnWindowFocus: false, enabled: !storeTags });

  const {
    mutate,
    isLoading: loadingLibrary,
    isError: errorLibrary,
  } = useMutation({
    mutationKey: ["library"],
    mutationFn: () => {
      setLoading(true)
      return getLibrary(
        sessionData?.accessToken ?? "",
        (progress: number, current: string) => {
          setCurrentPlaylist(current);
          setProgress(progress);
        },
        (playlists: Playlist[]) => {
          console.log(playlists)
          setLoading(false);
          setStoreLibrary(playlists);
        }
      )
    }
  });

  const loadLibrary = useCallback(() => {
    if (storeLibrary?.length === 0 && sessionData?.accessToken && !loading)
      mutate();
  }, [storeLibrary, mutate, sessionData?.accessToken, loading]);

  //SAVE TAGS
  useEffect(() => {
    if (userTags) setStoreTags(userTags);
  }, [setStoreTags, userTags]);

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  return (
    <div className="drawer">
      <input
        id="my-drawer-2"
        type="checkbox"
        className="drawer-toggle"
        ref={openDrawer}
      />
      <div className="drawer-content flex h-full w-full flex-col bg-base-100">
        <nav>
          <UserNavbar />
        </nav>
        <main className="grow p-6">
          {storeLibrary && storeLibrary.length > 0 ? (
            children
          ) : (
            <LoadingScreen
              current={currentPlaylist}
              progress={progress}
              indeterminate={loadingLibrary}
            />
          )}
        </main>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay" />
        <ul className="menu w-80 bg-base-100 p-4 text-base-content">
          {pages.map((page) => (
            <li key={page.name}>
              <Link href={page.url} onClick={() => openDrawer.current?.click()}>
                {page.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const LoadingScreen = ({
  progress,
  current,
  indeterminate,
}: LoadingStateProps) => {
  return (
    <section className="flex flex-col items-center justify-center gap-3">
      <p>Loading your playlists...</p>
      <p className="text-sm">{current}</p>
      {indeterminate ? (
        <progress className="progress progress-primary w-56" />
      ) : (
        <progress
          className="progress progress-primary w-56"
          value={progress}
          max="100"
        />
      )}
    </section>
  );
};

export default MainLayout;
