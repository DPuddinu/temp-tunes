import { Transition } from "@headlessui/react";
import type { VariantProps } from "cva";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Suspense, useRef, type ReactNode } from "react";
import { useStore } from "~/core/store";
import { cn } from "~/utils/utils";
import { ToastCva } from "./cva/ToastCva";
import ThemeSwitcher from "./ui/ThemeSwitcher";
import { HomeSVG } from "./ui/icons/HomeSVG";
import { PlaylistSVG } from "./ui/icons/PlaylistSVG";
import { SearchSVG } from "./ui/icons/SearchSVG";
import { TemplateSVG } from "./ui/icons/TemplateSVG";
import { RoundSkeleton } from "./ui/skeletons/RoundSkeleton";


type PageType = 'Home'| 'Search'| 'Playlists' | 'Templates'
interface Page {
  url: string;
  name: PageType;
  icon: ReactNode;
}

const pages: Page[] = [
  { url: "/home", name: "Home", icon: <HomeSVG /> },
  { url: "/search", name: "Search", icon: <SearchSVG /> },
  { url: "/playlist", name: "Playlists", icon: <PlaylistSVG /> },
  { url: "/templates", name: "Templates", icon: <TemplateSVG /> },
];

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const {message} = useStore();
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
        <main className="grow p-6 pb-20 sm:pb-6">
          {children}
          <BottomNavigation />
          {!!message && <Toast intent={"primary"} message={message} />}
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


interface UserNavbarProps {
  name: string;
  image: string;
}
const UserNavbar = ({
  name,
  image
}: UserNavbarProps) => {

  return (
    <div className="navbar bg-base-300 bg-gradient-to-r shadow">
      <div className="flex w-full justify-end sm:justify-between">
        <div className="hidden p-2 sm:block">
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
                  <Suspense fallback={<RoundSkeleton />}>
                    <Image src={image} alt="" height={64} width={64} />
                  </Suspense>
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
  const router = useRouter();
  return (
    <div className="btm-nav bg-base-300 sm:hidden">
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
    </div>
  );
}

type ToastProps = {
  className?: string;
  message: string | undefined;
} & VariantProps<typeof ToastCva>;
const Toast = ({ className, intent, message}: ToastProps) => {

  return (
    <>
      <Transition
        show={!!message}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-125"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className={cn("toast pb-20", className)}>
          <div className={ToastCva({ intent })}>{message}</div>
        </div>
      </Transition>
    </>
  );
};

export default MainLayout;

