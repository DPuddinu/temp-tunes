import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useRef, type ReactNode } from "react";
import { UserDataContext } from "~/context/user-data-context";
import { usePlaylistStore } from "~/core/store";
import ThemeSwitcher from "./ui/ThemeSwitcher";

interface Page {
  url: string;
  name: string;
}
interface LoadingStateProps {
  progress: number | undefined;
  current: string | undefined;
}

const pages: Page[] = [
  { url: "/home", name: "Home" },
  { url: "/search", name: "Advanced Search" },
  { url: "/playlists", name: "Playlists" },
  { url: "/templates", name: "Templates" },
];

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const { playlists: storeLibrary } = usePlaylistStore();
  const { progress, currentPlaylist } = useContext(UserDataContext);
  const router = useRouter();
  const openDrawer = useRef<HTMLInputElement>(null);

  if (session?.tokenExpired || status === "unauthenticated") router.push("/");

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
          <UserNavbar
            name={session?.user?.name ?? ""}
            image={session?.user?.image ?? ""}
          />
        </nav>
        <main className="grow p-6">
          {storeLibrary && storeLibrary.length > 0 ? (
            children
          ) : (
            <LoadingScreen current={currentPlaylist} progress={progress} />
          )}
        </main>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay" />
        <ul className="menu w-80 bg-base-200 p-4 text-base-content">
          {pages.map((page) => (
            <li key={page.name} className="text-base-content md:text-xl ">
              <Link
                className="text-base-content"
                href={page.url}
                onClick={() => openDrawer.current?.click()}
              >
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
      {!progress ? (
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

const UserNavbar = ({ name, image }: { name: string; image: string }) => {
  return (
    <div className="navbar bg-base-300 bg-gradient-to-r shadow">
      <div className="flex w-full justify-between">
        <div>
          <label htmlFor="my-drawer-2" className="btn btn-ghost drawer-button ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="rgb(226 232 240)"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </label>
        </div>

        <div className="dropdown-end flex">
          <ThemeSwitcher />
          <div className="dropdown-end dropdown ">
            <div className=" flex items-center gap-2 rounded pl-6">
              <h1 className="text-sm font-medium text-primary-content">
                {name}
              </h1>
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src={image} alt="" />
                </div>
              </label>
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-200 p-2 shadow"
            >
              <li>
                <a onClick={() => signOut({ callbackUrl: "/" })}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
