import { signOut, useSession } from "next-auth/react";
import type { Theme } from "~/types/page-types";
interface Props {
  onThemeChange: () => void;
  theme: Theme;
}
export const UserNavbar = ({ onThemeChange, theme }: Props) => {
  const { data: sessionData } = useSession();

  return (
    <div className="navbar bg-base-300 bg-gradient-to-r shadow">
      <div className="flex w-full justify-between">
        <div>
          <label htmlFor="my-drawer-2" className="drawer-button btn-ghost btn ">
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
          <button className="" onClick={onThemeChange}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              {theme === "dark" ? <LightThemeSvg /> : <DarkThemeSvg />}
            </svg>
          </button>
          <div className="dropdown-end dropdown ">
            <div className=" flex items-center gap-2 rounded pl-6">
              <h1 className="text-sm text-primary-content">
                {sessionData?.user?.name}
              </h1>
              <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
                <div className="w-10 rounded-full">
                  <img
                    src={sessionData?.user?.image || ""}
                    alt="profile-picture"
                  />
                </div>
              </label>
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
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

function LightThemeSvg() {
  return (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
    />
  );
}
function DarkThemeSvg() {
  return (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
    />
  );
}