import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useRef, useState, type ReactNode } from "react";
import { UserDataContext } from "~/context/user-data-context";
import { usePlaylistStore } from "~/core/store";
import ThemeSwitcher from "./ui/ThemeSwitcher";
import { HomeSVG } from "./ui/icons/HomeSVG";
import { PlaylistSVG } from "./ui/icons/PlaylistSVG";
import { SearchSVG } from "./ui/icons/SearchSVG";
import { TemplateSVG } from "./ui/icons/TemplateSVG";

type PageType = 'Home'| 'Search'| 'Playlists' | 'Templates'
interface Page {
  url: string;
  name: PageType;
  icon: ReactNode;
}
interface LoadingStateProps {
  progress: number | undefined;
  current: string | undefined;
}

const pages: Page[] = [
  { url: "/home", name: "Home", icon: <HomeSVG /> },
  { url: "/search", name: "Search", icon: <SearchSVG /> },
  { url: "/playlist", name: "Playlists", icon: <PlaylistSVG /> },
  { url: "/templates", name: "Templates", icon: <TemplateSVG /> },
];

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
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
          {children}
          <BottomNavigation></BottomNavigation>
        </main>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay" />
        <ul className="menu w-80 bg-base-200 p-4 text-base-content">
          {pages.map((page) => (
            <li
              key={page.name}
              className="font-semibold text-base-content md:text-lg "
            >
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
    <section className="flex items-center justify-center gap-3">
      <p className="text-sm">Loading your playlists</p>
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
interface UserNavbarProps {
  name: string;
  image: string;
}
const UserNavbar = ({
  name,
  image
}: UserNavbarProps) => {
  const { playlists: storeLibrary } = usePlaylistStore();
  const { progress, currentPlaylist } = useContext(UserDataContext);

  return (
    <div className="navbar bg-base-300 bg-gradient-to-r shadow">
      <div className="flex w-full justify-end sm:justify-between">
        <div className="p-2 hidden sm:block">
          <label htmlFor="my-drawer-2" className="btn-ghost drawer-button btn ">
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
          {progress && currentPlaylist && storeLibrary.length === 0 && (
            <LoadingScreen current={currentPlaylist} progress={progress} />
          )}
        </div>

        <div className="dropdown-end flex">
          <ThemeSwitcher />
          <div className="dropdown-end dropdown ">
            <div className=" flex items-center gap-2 rounded pl-6">
              <h1 className="text-sm font-medium text-primary-content">
                {name}
              </h1>
              <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
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

const BottomNavigation = () => {
  const [selectedPage, setSelectedPage] = useState<number>(0);
  
  return (
    <div className="btm-nav bg-base-300 sm:hidden">
      {pages.map((page, i) => (
        <Link key={i} href={page.url} className="btm-nav">
          <button
            key={i}
            onClick={() => setSelectedPage(i)}
            className={`${
              selectedPage === i ? "border-t-2 bg-base-100" : " bg-base-300"
            } flex h-full w-full items-center justify-center`}
          >
            {page.icon}
          </button>
        </Link>
      ))}
    </div>
  );
}

export default MainLayout;

