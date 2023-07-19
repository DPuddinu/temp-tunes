import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, type ReactNode } from "react";
import { useStore } from "~/core/store";
import { HomeSVG, PlaylistSVG, SearchSVG, TemplateSVG } from "./ui/icons/index";
import NavbarSkeleton from "./ui/skeletons/NavbarSkeleton";
import { RoundSkeleton } from "./ui/skeletons/RoundSkeleton";
import Head from "next/head";

type PageType = "Home" | "Search" | "Playlists" | "Templates";
interface Page {
  url: string;
  name: PageType;
  icon: ReactNode;
}

export const pages: Page[] = [
  { url: "/home", name: "Home", icon: <HomeSVG /> },
  { url: "/search", name: "Search", icon: <SearchSVG /> },
  { url: "/playlist", name: "Playlists", icon: <PlaylistSVG /> },
  { url: "/templates", name: "Templates", icon: <TemplateSVG /> },
];

const UserNavbar = dynamic(() => import("./ui/UserNavbar"), {
  loading: () => <NavbarSkeleton />,
});
const Toast = dynamic(() => import("./ui/Toast"), {
  loading: () => <RoundSkeleton />,
});

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const { message } = useStore();
  const router = useRouter();
  const openDrawer = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (session?.tokenExpired || status === "unauthenticated") router.push("/");
  }, [router, session, status]);

  return (
    <div className="drawer overflow-hidden">
      
<Head>
        <title>Next Spotify Manager</title>
        <meta name="description" content="A very cool Spotify Manager" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <input
        id="my-drawer-2"
        type="checkbox"
        className="drawer-toggle"
        ref={openDrawer}
      />
      <div className="drawer-content flex h-full min-h-screen w-screen flex-col bg-base-100">
        <nav>
          {session ? (
            <UserNavbar
              name={session.user?.name ?? ""}
              image={session.user?.image ?? ""}
            />
          ) : (
            <NavbarSkeleton />
          )}
        </nav>
        <main className="grow p-4 pb-20 sm:pb-6">
          {children}
          {!!message && <Toast intent={"primary"} message={message} />}
        </main>
        <BottomNavigation />
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay " />
        <ul className="menu h-full w-80 bg-base-200 p-4 text-base-content">
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

const BottomNavigation = () => {
  const router = useRouter();
  return (
    <footer className="btm-nav min-h-16 bg-base-300 sm:hidden">
      {pages.map((page, i) => (
        <Link key={i} href={page.url} className="btm-nav">
          <button
            key={i}
            className={`${
              router.route.includes(page.url)
                ? "border-t-2 bg-base-100"
                : " bg-base-300"
            } flex h-full w-full items-center justify-center`}
          >
            {page.icon}
          </button>
        </Link>
      ))}
    </footer>
  );
};

export default MainLayout;
