import { signOut } from "next-auth/react";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { ImageWithFallback } from "./ImageWithFallback";
import { ErrorSVG, MenuSVG } from "./icons";
import { RoundSkeleton } from "./skeletons/RoundSkeleton";
import { SpotifyWebPlayer } from "../WebPlayback";

interface UserNavbarProps {
  name: string;
  image: string;
}

//prettier-ignore
const ThemeSwitcher = dynamic(() => import("./ThemeSwitcher"), {
  loading: () => <RoundSkeleton />,
});

const UserNavbar = ({ name, image }: UserNavbarProps) => {
  const { t } = useTranslation("common");

  return (
    <div className="navbar h-16 bg-base-300 shadow">
      <div className="flex w-full justify-end sm:justify-between">
        <div className="hidden border-none p-2  sm:block">
          <label
            htmlFor="my-drawer-2"
            className="btn-ghost drawer-button btn hover:bg-base-300"
          >
            <MenuSVG />
          </label>
        </div>

        <div className="dropdown-end flex">
          <div className="dropdown-end dropdown ">
            <div className=" flex items-center gap-2 rounded pl-6">
              <h1 className="text-sm font-medium text-primary-content">
                {name}
              </h1>
              <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
                <div className="w-10 rounded-full">
                  {!!image ? (
                    <ImageWithFallback
                      src={image}
                      height={40}
                      width={40}
                      quality={60}
                      fallback={<ErrorSVG />}
                      className="flex h-full w-full items-center justify-center bg-base-100"
                    />
                  ) : (
                    <RoundSkeleton />
                  )}
                </div>
              </label>
            </div>

            <ul
              tabIndex={0}
              className="menu-compact dropdown-content menu rounded-box mt-3 w-52 bg-base-300 p-2 shadow-lg border border-base-100"
            >
              <li>
                <SpotifyWebPlayer/>
              </li>
              <li className="flex flex-row items-center">
                <span>{t("change_theme")}</span>
                <ThemeSwitcher />
              </li>
              <li>
                <a onClick={() => signOut({ callbackUrl: "/" })}>
                  {t("logout")}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserNavbar;
