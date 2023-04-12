import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { getLibrary } from "~/core/spotifyCollection";
import { useStore } from "~/core/store";
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
  const [loadedLibrary, setLoadedLibrary] = useState(false);

  //prettier-ignore
  if (sessionData?.tokenExpired || status === "unauthenticated")router.push("/");

  //LOCAL STORE
  const { playlists: storeLibrary, setPlaylists: setStoreLibrary } = useStore();

  //REDIS
  //prettier-ignore
  const { isLoading: isCaching, data: cachedLibrary } = api.redis_router.get.useQuery(undefined, {refetchOnWindowFocus: false});
  const { mutate: saveLibrary } = api.redis_router.set.useMutation();

  //PLANETSCALE
  //prettier-ignore
  const { data: userTags } = api.prisma_router.getTagsByUser.useQuery({userId: sessionData?.user?.id ?? ""},{refetchOnWindowFocus: false});

  const {
    data: library,
    mutate: loadLibrary,
    isLoading: loadingLibrary,
    isError: errorLibrary,
  } = useMutation({
    mutationKey: ["library"],
    mutationFn: () =>
      getLibrary(
        sessionData?.accessToken ?? "",
        (progress: number, current: string) => {
          setCurrentPlaylist(current);
          setProgress(progress);
        },
        () => {
          setLoadedLibrary(true);
        }
      ),
  });

  //LOAD LIBRARY
  useEffect(() => {
    if (cachedLibrary && cachedLibrary.length > 0) {
      setStoreLibrary(cachedLibrary);
      setLoadedLibrary(true);
    } else {
      setLoadedLibrary(false);
      loadLibrary();
    }
  }, [cachedLibrary]);

  //SAVE LIBRARY
  useEffect(() => {
    if (library && library.length > 0) {
      saveLibrary({
        library: JSON.stringify(library),
      });
      setStoreLibrary(library);
    }
  }, [library]);

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
          {loadedLibrary ? (
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
