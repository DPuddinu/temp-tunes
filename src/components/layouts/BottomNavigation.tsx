import Link from "next/link";
import { useRouter } from "next/router";
import { pages } from "./pages";

const BottomNavigation = () => {
  const router = useRouter();
  return (
    <footer className="btm-nav bg-base-300 sm:hidden">
      {pages.map((page, i) => (
        <Link key={i} href={page.url} className="btm-nav">
          <button
            key={i}
            className={`${
              router.route.includes(page.url)
                ? "border-t-2 bg-base-100"
                : " bg-base-300"
            } flex h-full w-full items-center justify-center transition-colors duration-300`}
          >
            {page.icon}
          </button>
        </Link>
      ))}
    </footer>
  );
};
export default BottomNavigation;
