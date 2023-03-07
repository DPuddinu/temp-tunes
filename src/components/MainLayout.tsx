import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useRef } from "react";
import { UserNavbar } from "./UserNavbar";

interface Page {
  url: string;
  name: string;
}
const pages: Page[] = [
  { url: "/search", name: "Advanced Search" },
  { url: "/playlists", name: "Playlists" },
  { url: "/templates", name: "Templates" },
];
const MainLayout = ({ children }: { children: ReactNode }) => {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const openDrawer = useRef<HTMLInputElement>(null);

  if (sessionData?.tokenExpired || status === "unauthenticated") {
    router.push("/");
  }

  return (
    <div className="drawer">
      <input
        id="my-drawer-2"
        type="checkbox"
        className="drawer-toggle"
        ref={openDrawer}
      />
      <div className="drawer-content h-full w-full bg-base-100">
        <nav>
          <UserNavbar />
        </nav>
        <main className="p-6">{children}</main>
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

export default MainLayout;
