import { useMediaQuery } from "@mantine/hooks";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, type ReactNode } from "react";
import { useStore } from "~/core/userStore";
import { useMounted } from "~/hooks/use-mounted";
import BottomNavigationSkeleton from "../ui/skeletons/BottomNavigationSkeleton";
import NavbarSkeleton from "../ui/skeletons/NavbarSkeleton";
import { RoundSkeleton } from "../ui/skeletons/RoundSkeleton";
import { pages } from "./pages";

const UserNavbar = dynamic(() => import("./UserNavbar"), {
  loading: () => <NavbarSkeleton />,
});
const Toast = dynamic(() => import("../ui/Toast"), {
  loading: () => <RoundSkeleton />,
});
const BottomNavigation = dynamic(() => import("./BottomNavigation"), {
  loading: () => <BottomNavigationSkeleton />,
});

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const { message } = useStore();
  const openDrawer = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const matches = useMediaQuery("(max-width: 425px)");
  const mounted = useMounted();

  return (
    <div className="drawer overflow-hidden">
      <Head>
        <title>TempTunes</title>
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
        <LazyMotion features={domAnimation}>
          <m.main
            key={router.asPath}
            className="grow p-4 pb-20 sm:pb-6"
            initial={mounted && { x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            {children}
            {!!message && <Toast message={message} />}
          </m.main>
        </LazyMotion>
        {matches && <BottomNavigation />}
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

export default MainLayout;
