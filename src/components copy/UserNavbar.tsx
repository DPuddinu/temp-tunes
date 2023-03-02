import { signOut, useSession } from "next-auth/react";

export const UserNavbar = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="navbar bg-gradient-to-r bg-base-300 shadow">
      <div className="flex w-full justify-between">
        <div>
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

        <div className="dropdown-end dropdown ">
          <div className="flex items-center gap-2 rounded pl-6 ">
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
  );
};
