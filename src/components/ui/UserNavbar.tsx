import { signOut } from "next-auth/react";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import Image from "next/image";
import { SpotifyWebPlayer } from "../WebPlayback";
import { MenuSVG, UserSVG } from "./icons";
import { RoundSkeleton } from "./skeletons/RoundSkeleton";

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

        <div className="dropdown-end mr-4 flex">
          <div className="dropdown-end dropdown ">
            <div className=" flex items-center gap-2 rounded pl-6">
              <p className="text-sm font-medium text-base-content">{name}</p>
              <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
                <div className="h-10 w-10 bg-base-100 shadow rounded-full">
                  {!!image ? (
                    <Image
                      alt="user"
                      priority
                      src={image}
                      height={40}
                      width={40}
                      quality={60}
                      className="flex h-full w-full items-center justify-center bg-base-100"
                    />
                  ) : (
                    <UserSVG />
                  )}
                </div>
              </label>
            </div>

            <ul
              tabIndex={0}
              className="menu-compact dropdown-content menu rounded-box z-40 mt-3 w-52 border border-base-100 bg-base-300 p-2 shadow-lg"
            >
              <SpotifyWebPlayer />

              <li className="flex flex-row items-center">
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
