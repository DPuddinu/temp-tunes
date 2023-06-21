import dynamic from "next/dynamic";
import { RoundSkeleton } from "./skeletons/RoundSkeleton";
import { MenuSVG } from "./icons";
import { signOut } from "next-auth/react";
import Image from "next/image";

interface UserNavbarProps {
  name: string;
  image: string;
}

//prettier-ignore
const ThemeSwitcher = dynamic(() => import("./ThemeSwitcher"), {
  loading: () => <RoundSkeleton />,
});

const UserNavbar = ({ name, image }: UserNavbarProps) => {
  return (
    <div className="navbar bg-base-300 shadow">
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
          <ThemeSwitcher />
          <div className="dropdown-end dropdown ">
            <div className=" flex items-center gap-2 rounded pl-6">
              <h1 className="text-sm font-medium text-primary-content">
                {name}
              </h1>
              <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
                <div className="w-10 rounded-full">
                  {!!image ? (
                    <Image
                      priority
                      quality={60}
                      src={image}
                      alt="blur"
                      height={40}
                      width={40}
                    />
                  ) : (
                    <RoundSkeleton />
                  )}
                </div>
              </label>
            </div>

            <ul
              tabIndex={0}
              className="menu-compact dropdown-content menu rounded-box mt-3 w-52 bg-base-200 p-2 shadow"
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
export default UserNavbar