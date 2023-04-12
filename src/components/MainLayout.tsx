import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useStore, type UserLibrary } from "~/core/store";
import { getLibrary } from "~/pages/api/spotifyApi/spotifyCollection";
import { api } from "~/utils/api";
import { UserNavbar } from "./UserNavbar";

interface Page {
  url: string;
  name: string;
}
interface LoadingStateProps {
  progress: number;
  current: string;
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

  if (sessionData?.tokenExpired || status === "unauthenticated") {
    router.push("/");
  }
  const { playlists: storeLibrary, setPlaylists: setStoreLibrary } = useStore();

  //prettier-ignore
  const { isLoading: isCaching, data: cachedLibrary } = api.redis_router.get.useQuery();

  //prettier-ignore
  const { data: userTags } = api.prisma_router.getTagsByUser.useQuery({userId: sessionData?.user?.id ?? ""},{refetchOnWindowFocus: false});

  const { mutate: saveLibrary } = api.redis_router.set.useMutation();
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
        () => setLoadedLibrary(true)
      ),
  });

  //LOAD LIBRARY
  useEffect(() => {
    if (cachedLibrary && cachedLibrary.length > 0) {
      setStoreLibrary(cachedLibrary);
      setLoadedLibrary(true);
    } else {
      loadLibrary();
    }
  }, [cachedLibrary]);

  //SAVE LIBRARY
  useEffect(() => {
    if (library && loadedLibrary) {
      saveLibrary({
        library: JSON.stringify(library),
      });
      setStoreLibrary(library);
    }
  }, [library, loadedLibrary]);

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
          {cachedLibrary && loadedLibrary ? (
            children
          ) : (
            <LoadingScreen current={currentPlaylist} progress={progress} />
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

const LoadingScreen = ({ progress, current }: LoadingStateProps) => {
  return (
    <section className="flex flex-col items-center justify-center gap-3">
      <p>Loading your playlists...</p>
      <p className="text-sm">{current}</p>
      <progress
        className="progress progress-primary w-56"
        value={progress}
        max="100"
      ></progress>
    </section>
  );
};

export default MainLayout;
